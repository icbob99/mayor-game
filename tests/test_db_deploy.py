"""Deployment integration checks. Use only the disposable libSQL on port 8082.

Run: python -m unittest discover -s tests -p test_db_deploy.py -v
Requires MAYOR_DB_TEST=1 and the mayor-game-test database container.
"""
import os
import io
import json
import sqlite3
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from db_deploy import BASELINE_LAST, Database, ROOT, SQL_FILES, apply, baseline, check_baseline, history, scripts, statements


class ScriptTests(unittest.TestCase):
    def test_newspaper_locale_upgrade_preserves_data_and_is_repeatable(self):
        with sqlite3.connect(':memory:') as db:
            files = scripts()
            target = 'db/seeds/040_result_newspaper.sql'
            for item in files:
                if item['name'] == target:
                    break
                for statement in item['statements']:
                    db.execute(statement)
            tables = [row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")]
            other_tables = {name: db.execute(f'SELECT * FROM "{name}"').fetchall() for name in tables if name != 'game_locale_ui'}
            before = {lang: json.loads(ui) for lang, ui in db.execute('SELECT lang, ui FROM game_locale_ui')}
            for statement in item['statements']:
                db.execute(statement)
            after = {lang: json.loads(ui) for lang, ui in db.execute('SELECT lang, ui FROM game_locale_ui')}
            for lang, ui in after.items():
                self.assertEqual(len(ui['newspaper_headlines']), 10)
                self.assertEqual(set(ui['newspaper_stamps']), {'victory', 'fled', 'defeat'})
                self.assertTrue(all(ui['newspaper_headlines'].values()))
                old = {key: value for key, value in ui.items() if not key.startswith('newspaper_')}
                expected = before[lang].copy()
                if lang == 'uk':
                    for key in ('legend', 'master', 'rookie', 'prisoner', 'henpecked'):
                        old['titles'].pop(key)
                        expected['titles'].pop(key)
                self.assertEqual(old, expected)
            snapshot = db.execute('SELECT * FROM game_locale_ui').fetchall()
            for statement in item['statements']:
                db.execute(statement)
            self.assertEqual(snapshot, db.execute('SELECT * FROM game_locale_ui').fetchall())
            for name, rows in other_tables.items():
                self.assertEqual(rows, db.execute(f'SELECT * FROM "{name}"').fetchall(), name)

    def test_stream_uses_returned_base_url_and_baton(self):
        payload = {'baton': 'next-baton', 'base_url': 'https://node.turso.io/',
                   'results': [{'type': 'ok', 'response': {'type': 'close'}}]}
        with patch('db_deploy.urlopen', side_effect=lambda *args, **kwargs: io.BytesIO(json.dumps(payload).encode())) as send:
            db = Database('https://database.turso.io', 'test-token')
            db.request({'type': 'close'})
            payload['base_url'] = None
            db.request({'type': 'close'})
            request = send.call_args.args[0]
            self.assertEqual(request.full_url, 'https://node.turso.io/v2/pipeline')
            self.assertEqual(json.loads(request.data)['baton'], 'next-baton')

    def test_stream_rejects_insecure_or_foreign_redirect(self):
        for url in ('http://node.turso.io/', 'https://attacker.example/'):
            with self.subTest(url=url):
                payload = {'baton': 'next-baton', 'base_url': url, 'results': []}
                with patch('db_deploy.urlopen', return_value=io.BytesIO(json.dumps(payload).encode())):
                    with self.assertRaises(ValueError):
                        Database('https://database.turso.io', 'test-token').request({'type': 'close'})

    def test_trigger_and_quoted_semicolons_remain_whole(self):
        sql = "BEGIN; CREATE TRIGGER t AFTER INSERT ON a BEGIN INSERT INTO b VALUES ('x;y--z'); END; COMMIT;"
        parsed = statements(sql)
        self.assertEqual(len(parsed), 1)
        self.assertIn("VALUES ('x;y--z')", parsed[0])

    def test_internal_commit_cannot_escape_transaction(self):
        with self.assertRaises(ValueError):
            statements('CREATE TABLE a (id); COMMIT; INSERT INTO a VALUES (1);')

    def test_line_endings_do_not_change_checksum(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / 'test.sql'
            path.write_bytes(b'CREATE TABLE a (id);\r\n')
            windows = scripts(root, ('test.sql',))[0]['checksum']
            path.write_bytes(b'CREATE TABLE a (id);\n')
            self.assertEqual(scripts(root, ('test.sql',))[0]['checksum'], windows)


@unittest.skipUnless(os.environ.get('MAYOR_DB_TEST') == '1', 'Opt-in disposable database test')
class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.db = Database('http://127.0.0.1:8082')
        self.addCleanup(self.db.close)
        self.db.execute('PRAGMA foreign_keys = OFF')
        for (name,) in self.db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"):
            self.db.execute('DROP TABLE "' + name.replace('"', '""') + '"')
        self.db.execute('PRAGMA foreign_keys = ON')
        self.files = scripts()
        self.baseline_count = SQL_FILES.index(BASELINE_LAST) + 1

    def legacy_database(self):
        for item in self.files[:self.baseline_count]:
            with self.db.transaction():
                self.db.batch(item['statements'])
        self.db.execute("INSERT INTO accounts VALUES ('existing-player','Existing','existing','synthetic-test-hash',1)")

    def test_fresh_apply_repeat_and_checksum_guard(self):
        apply(self.db)
        self.assertEqual(len(history(self.db)), len(SQL_FILES))
        before = history(self.db)
        apply(self.db)
        self.assertEqual(history(self.db), before)
        self.db.execute("UPDATE db_deployments SET checksum = 'changed' WHERE sequence = 1")
        with self.assertRaisesRegex(RuntimeError, 'changed'):
            apply(self.db)

    def test_baseline_preserves_player_and_can_be_repeated(self):
        self.legacy_database()
        check_baseline(self.db)
        self.assertEqual(history(self.db), [])
        baseline(self.db)
        self.assertEqual(self.db.execute('SELECT nickname FROM accounts'), [['Existing']])
        recorded = history(self.db)
        self.assertEqual([row[4] for row in recorded[:-1]], ['baseline'] * self.baseline_count)
        self.assertEqual(recorded[-1][4], 'applied')
        baseline(self.db)
        self.assertEqual(history(self.db), recorded)
        apply(self.db)
        self.assertEqual(history(self.db)[:len(recorded)], recorded)
        self.assertEqual(len(history(self.db)), len(self.files))

    def test_existing_database_requires_baseline(self):
        self.legacy_database()
        with self.assertRaisesRegex(RuntimeError, 'baseline'):
            apply(self.db)
        self.assertEqual(history(self.db), [])

    def test_baseline_rejects_changed_content_without_creating_journal(self):
        self.legacy_database()
        self.db.execute("UPDATE game_events SET avatar='changed' WHERE id=(SELECT id FROM game_events LIMIT 1)")
        with self.assertRaisesRegex(RuntimeError, 'game_events'):
            baseline(self.db)
        self.assertEqual(history(self.db), [])
        self.assertEqual(self.db.execute('SELECT nickname FROM accounts'), [['Existing']])

    def test_baseline_rejects_missing_trigger(self):
        self.legacy_database()
        self.db.execute('DROP TRIGGER game_statuses_reject_stale_update')
        with self.assertRaisesRegex(RuntimeError, 'schema'):
            baseline(self.db)
        self.assertEqual(history(self.db), [])

    def test_failed_upgrade_rolls_back_data_and_journal_then_recovers(self):
        apply(self.db)
        before = history(self.db)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / 'upgrade.sql'
            path.write_text("CREATE TABLE upgrade_probe (id INTEGER); INSERT INTO missing_table VALUES (1);", encoding='utf-8')
            upgrade = scripts(root, ('upgrade.sql',))[0]
            with self.assertRaises(RuntimeError):
                apply(self.db, self.files + [upgrade])
            self.assertEqual(history(self.db), before)
            self.assertEqual(self.db.execute("SELECT name FROM sqlite_master WHERE name='upgrade_probe'"), [])
            path.write_text('CREATE TABLE upgrade_probe (id INTEGER); INSERT INTO upgrade_probe VALUES (42);', encoding='utf-8')
            upgrade = scripts(root, ('upgrade.sql',))[0]
            apply(self.db, self.files + [upgrade])
            apply(self.db, self.files + [upgrade])
            self.assertEqual(self.db.execute('SELECT * FROM upgrade_probe'), [[42]])
            self.assertEqual(len(history(self.db)), len(self.files) + 1)

    def test_journal_failure_also_rolls_back_script(self):
        apply(self.db)
        self.db.execute("CREATE TRIGGER deny_journal BEFORE INSERT ON db_deployments BEGIN SELECT RAISE(ABORT,'journal denied'); END;")
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'upgrade.sql').write_text('CREATE TABLE upgrade_probe (id INTEGER);', encoding='utf-8')
            with self.assertRaisesRegex(RuntimeError, 'journal denied'):
                apply(self.db, self.files + scripts(root, ('upgrade.sql',)))
        self.assertEqual(self.db.execute("SELECT name FROM sqlite_master WHERE name='upgrade_probe'"), [])

    def test_concurrent_deployers_do_not_execute_upgrade_twice(self):
        apply(self.db)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'upgrade.sql').write_text(
                'CREATE TABLE IF NOT EXISTS upgrade_probe (id INTEGER); INSERT INTO upgrade_probe VALUES (42);',
                encoding='utf-8')
            files = self.files + scripts(root, ('upgrade.sql',))
            def deploy(_):
                database = Database('http://127.0.0.1:8082')
                try:
                    apply(database, files)
                finally:
                    database.close()
            with ThreadPoolExecutor(max_workers=2) as pool:
                list(pool.map(deploy, range(2)))
            self.assertEqual(self.db.execute('SELECT * FROM upgrade_probe'), [[42]])
            self.assertEqual(len(history(self.db)), len(files))

    def test_mode_stats_upgrade_and_compensation_preserve_player_totals(self):
        end = SQL_FILES.index('db/migrations/005_mode_statistics.sql')
        apply(self.db, self.files[:end])
        self.db.execute("INSERT INTO accounts VALUES ('modes-player','Modes','modes','synthetic',1)")
        stats = '{"gamesPlayed":7,"maxMoney":8000000,"achievements":{"survivor":3,"happy_wife":2,"offshore_king":4,"untouchable":1}}'
        self.db.execute("INSERT INTO game_statuses VALUES ('modes-player','old','{}',?,1,1)", [stats])
        self.db.execute("INSERT INTO game_history VALUES ('modes-player','old-game',1,1,12,3000000,'arrest','{}')")
        apply(self.db, self.files[:end + 1])
        self.assertEqual(self.db.execute('SELECT mode,games_played,max_money,resignations,survivor,happy_wife,offshore_king,untouchable FROM game_stats'),
                         [['arcade',7,8000000,0,3,2,4,1]])
        self.assertNotIn('stats_json', [row[1] for row in self.db.execute('PRAGMA table_info(game_statuses)')])
        self.assertEqual(self.db.execute('SELECT mode,difficulty FROM game_history'), [['arcade',None]])
        apply(self.db, self.files[:end + 1])
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM game_stats'), [[1]])
        rollback = scripts(ROOT, ('db/rollbacks/005_mode_statistics.sql',))
        self.db.execute("INSERT INTO game_stats(account_id,mode,max_money) VALUES ('modes-player','daily',1000000)")
        with self.assertRaisesRegex(RuntimeError, 'CHECK constraint failed'):
            apply(self.db, self.files[:end + 1] + rollback)
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM game_stats'), [[2]])
        self.assertEqual(self.db.execute("SELECT name FROM sqlite_master WHERE name='mode_rollback_guard'"), [])
        self.db.execute("DELETE FROM game_stats WHERE mode='daily'")
        apply(self.db, self.files[:end + 1] + rollback)
        restored = self.db.execute('SELECT stats_json FROM game_statuses')[0][0]
        import json
        restored = json.loads(restored)
        self.assertEqual(restored['gamesPlayed'], 7)
        self.assertEqual(restored['maxMoney'], 8000000)
        self.assertEqual(restored['achievements'], json.loads(stats)['achievements'])
        self.assertEqual(self.db.execute('SELECT game_id,end_reason FROM game_history'), [['old-game','arrest']])

    def test_mode_translations_upgrade_repeat_and_compensation(self):
        end = SQL_FILES.index('db/seeds/027_modes_ui.sql')
        files = self.files[:end + 1]
        apply(self.db, self.files[:end])
        before = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        apply(self.db, files)
        after = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        import json
        for lang, ui, alerts in after:
            texts = json.loads(ui)['modes']
            self.assertIn('{remaining}', texts['turns'])
            self.assertIn('{remaining}', texts['reminder'])
            for mode in ('arcade', 'daily', 'blitz'):
                self.assertTrue(texts[mode]['name'])
                self.assertFalse(any(ch.isdigit() or ch == '%' for ch in texts[mode]['description']))
            self.assertTrue(json.loads(alerts)['resignation'])
            self.assertTrue(json.loads(alerts)['indecision'])
        apply(self.db, files)
        self.assertEqual(self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang'), after)
        apply(self.db, files + scripts(ROOT, ('db/rollbacks/027_modes_ui.sql',)))
        restored = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        self.assertEqual([(lang,json.loads(ui),json.loads(alerts)) for lang,ui,alerts in restored],
                         [(lang,json.loads(ui),json.loads(alerts)) for lang,ui,alerts in before])

    def test_header_labels_upgrade_repeat_and_compensation(self):
        end = SQL_FILES.index('db/seeds/028_header_ui.sql')
        apply(self.db, self.files[:end])
        self.db.execute("INSERT INTO accounts VALUES ('header-player','Header','header','synthetic',1)")
        before = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        apply(self.db, self.files[:end + 1])
        after = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        expected = {'ru': 'Профиль', 'en': 'Profile', 'uk': 'Профіль', 'he': 'פרופיל'}
        for lang, ui, _ in after:
            self.assertEqual(json.loads(ui)['auth']['profile'], expected[lang])
            self.assertTrue(json.loads(ui)['sound'])
        apply(self.db, self.files[:end + 1])
        self.assertEqual(self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang'), after)
        apply(self.db, self.files[:end + 1] + scripts(ROOT, ('db/rollbacks/028_header_ui.sql',)))
        restored = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        self.assertEqual([(lang, json.loads(ui), json.loads(alerts)) for lang, ui, alerts in restored],
                         [(lang, json.loads(ui), json.loads(alerts)) for lang, ui, alerts in before])
        self.assertEqual(self.db.execute("SELECT nickname FROM accounts WHERE id='header-player'"), [['Header']])

    def test_game_config_upgrade_repeat_and_compensation(self):
        end = SQL_FILES.index('db/migrations/008_game_config.sql')
        apply(self.db, self.files[:end])
        self.db.execute("INSERT INTO accounts VALUES ('config-player','Config','config','synthetic',1)")
        before = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        apply(self.db, self.files)
        values = dict(self.db.execute('SELECT key,value FROM game_config'))
        self.assertEqual(json.loads(values['initialStats']), {'money':1000000,'wife':50,'threat':15,'health':90,'rating':50})
        self.assertEqual(json.loads(values['difficulties'])['hard']['loss'], 1.3)
        self.db.execute("UPDATE game_config SET value=json_set(value,'$.health',83) WHERE key='initialStats'")
        apply(self.db, self.files)
        self.db.batch(statements((ROOT / 'db/seeds/035_game_config.sql').read_text(encoding='utf-8')))
        self.assertEqual(self.db.execute("SELECT json_extract(value,'$.health') FROM game_config WHERE key='initialStats'"), [[83]])
        apply(self.db, self.files + scripts(ROOT, ('db/rollbacks/008_game_config.sql',)))
        self.assertEqual(self.db.execute("SELECT name FROM sqlite_master WHERE name='game_config'"), [])
        self.assertEqual(self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang'), before)
        self.assertEqual(self.db.execute("SELECT nickname FROM accounts WHERE id='config-player'"), [['Config']])

    def test_opening_progression_upgrade_repeat_and_recovery_preserve_existing_data(self):
        end = SQL_FILES.index('db/seeds/036_opening_progression.sql')
        files = self.files[:end + 1]
        apply(self.db, self.files[:end])
        self.db.execute("INSERT INTO accounts VALUES ('opening-player','Opening','opening','synthetic',1)")
        self.db.execute("INSERT INTO game_statuses VALUES ('opening-player','old-save',?,1,1)",
                        [json.dumps({'day': 12, 'shopPrices': {'wife_spa': 1800000}})])
        self.db.execute("UPDATE game_config SET value=json_set(value,'$.health',83) WHERE key='initialStats'")
        self.db.execute("UPDATE game_config SET value=json_set(value,'$.cooldownDays',9) WHERE key='shop'")
        self.db.execute("UPDATE game_config SET value=json_set(value,'$.escalationEvery',5,'$.escalationDivisor',4) WHERE key='arcade'")
        def snapshot():
            tables = self.db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT IN ('game_config','db_deployments')")
            return {name: sorted(self.db.execute('SELECT * FROM "' + name + '"'), key=repr) for (name,) in tables}
        before_data = snapshot()
        read_config = lambda: {key: json.loads(value) for key, value in self.db.execute('SELECT key,value FROM game_config')}
        before_config = read_config()
        apply(self.db, files)
        after = read_config()
        self.assertEqual(after['openingProtection'], {'statFloor':5,'threatCeiling':95,'upperStatCeiling':95,'penaltyCap':1})
        self.assertEqual(after['arcade'], {'escalationEvery':5,'escalationDivisor':4,'driftIncrement':1})
        self.assertEqual(after['shop']['cooldownIncrementDays'], 3)
        original_keys = {key: value for key, value in after.items() if key != 'openingProtection'}
        original_keys['arcade'] = {key: value for key, value in original_keys['arcade'].items() if key != 'driftIncrement'}
        original_keys['shop'] = {key: value for key, value in original_keys['shop'].items() if key != 'cooldownIncrementDays'}
        self.assertEqual(original_keys, before_config)
        self.assertEqual(snapshot(), before_data)
        self.db.execute("UPDATE game_config SET value=json_set(value,'$.statFloor',7) WHERE key='openingProtection'")
        self.db.execute("UPDATE game_config SET value=json_set(value,'$.cooldownIncrementDays',4) WHERE key='shop'")
        tuned = read_config()
        apply(self.db, files)
        self.db.batch(statements((ROOT / 'db/seeds/036_opening_progression.sql').read_text(encoding='utf-8')))
        self.assertEqual(read_config(), tuned)
        self.assertEqual(snapshot(), before_data)
        # The old Worker tolerates optional fields in saves written by the new client.
        new_save = json.dumps({'day': 14, 'purchaseCount': {'wife_spa': 2}, 'shopPrices': {'wife_spa': 1600000}})
        self.db.execute("UPDATE game_statuses SET state_json=?,write_timestamp=2 WHERE account_id='opening-player'", [new_save])
        after_data = snapshot()
        apply(self.db, files + scripts(ROOT, ('db/rollbacks/036_opening_progression.sql',)))
        self.assertEqual(read_config(), before_config)
        self.assertEqual(snapshot(), after_data)

    def test_manual_balance_upgrade_repeat_and_compensation(self):
        end = SQL_FILES.index('db/seeds/037_manual_lock_balance.sql')
        files = self.files[:end + 1]
        apply(self.db, self.files[:end])
        self.db.execute("INSERT INTO accounts VALUES ('manual-player','Manual','manual','synthetic',1)")
        self.db.execute("INSERT INTO game_statuses VALUES ('manual-player','saved','{\"day\":12,\"health\":63}',1,1)")
        tables = [r[0] for r in self.db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name <> 'db_deployments'")]
        snapshot = lambda: {t: self.db.execute('SELECT * FROM "' + t + '" ORDER BY rowid') for t in tables}
        before = snapshot()
        apply(self.db, files)
        after = snapshot()
        changed_rows = changed_values = 0
        for old, new in zip(before['game_choices'], after['game_choices']):
            self.assertEqual(old[:2], new[:2], 'choice identity is unchanged')
            self.assertEqual(old[7:], new[7:], 'follow-up links and delays are unchanged')
            changed_rows += old != new
            changed_values += sum(a != b for a, b in zip(old[2:7], new[2:7]))
        self.assertEqual(len(after['game_choices']), 123)
        self.assertEqual((changed_rows, changed_values), (119, 331))
        effects = lambda event, choice: self.db.execute('SELECT money,wife,health,threat,rating FROM game_choices WHERE event_id=? AND choice_index=?', [event, choice])[0]
        self.assertEqual(effects('bench_tender', 2), [0, -15, 0, -5, 15])
        self.assertEqual(effects('lawyer_visit', 2), [0, 15, -10, 15, 15])
        self.assertEqual(effects('shabbat_blackmail', 2), [0, 15, 5, 0, 5])
        self.assertEqual(effects('shitty_burger', 1), [0, 0, 0, 0, 0])
        for table in tables:
            if table != 'game_choices':
                self.assertEqual(after[table], before[table], table)
        apply(self.db, files)
        self.db.batch(statements((ROOT / 'db/seeds/037_manual_lock_balance.sql').read_text(encoding='utf-8')))
        self.assertEqual(snapshot(), after)
        apply(self.db, files + scripts(ROOT, ('db/rollbacks/037_manual_lock_balance.sql',)))
        self.assertEqual(snapshot(), before)

    def test_header_titles_upgrade_repeat_and_compensation(self):
        end = SQL_FILES.index('db/seeds/034_header_titles.sql')
        apply(self.db, self.files[:end])
        self.db.execute("INSERT INTO accounts VALUES ('title-player','Title','title','synthetic',1)")
        before = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        files = self.files[:end + 1]
        apply(self.db, files)
        after = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        expected = {
            'en': ('Mayor: Chronicles of Embezzlement', 'Mayor'),
            'he': ('ראש העיר: יומני השחיתות', 'ראש העיר'),
            'ru': ('Мэр: Хроники распила', 'Мэр'),
            'uk': ('Мер: Хроніки розпилу', 'Мер'),
        }
        for (lang, ui, alerts), (_, old_ui, old_alerts) in zip(after, before):
            fields = json.loads(ui)
            self.assertEqual((fields.pop('game_title'), fields.pop('game_title_short')), expected[lang])
            self.assertEqual(fields, json.loads(old_ui))
            self.assertEqual(alerts, old_alerts)
        apply(self.db, files)
        self.assertEqual(self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang'), after)
        apply(self.db, files + scripts(ROOT, ('db/rollbacks/034_header_titles.sql',)))
        restored = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        self.assertEqual([(lang, json.loads(ui), alerts) for lang, ui, alerts in restored],
                         [(lang, json.loads(ui), alerts) for lang, ui, alerts in before])
        self.assertEqual(self.db.execute("SELECT nickname FROM accounts WHERE id='title-player'"), [['Title']])

    def test_calibrated_balance_upgrade_repeat_and_compensation(self):
        end = SQL_FILES.index('db/seeds/030_calibrated_balance.sql')
        apply(self.db, self.files[:end])
        self.db.execute("INSERT INTO accounts VALUES ('balance-player','Balance','balance','synthetic',1)")
        tables = [r[0] for r in self.db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name <> 'db_deployments'")]
        snapshot = lambda: {t: self.db.execute('SELECT * FROM "' + t + '" ORDER BY rowid') for t in tables}
        before = snapshot()
        links = self.db.execute('SELECT event_id,choice_index,next_event_id,delay_days FROM game_choices ORDER BY event_id,choice_index')
        apply(self.db, self.files[:end + 1])
        after = snapshot()
        self.assertNotEqual(after['game_choices'], before['game_choices'])
        self.assertEqual(len(after['game_choices']), 123)
        self.assertEqual(links, self.db.execute('SELECT event_id,choice_index,next_event_id,delay_days FROM game_choices ORDER BY event_id,choice_index'))
        for table in tables:
            if table != 'game_choices':
                self.assertEqual(after[table], before[table], table)
        apply(self.db, self.files[:end + 1])
        self.assertEqual(snapshot(), after)
        apply(self.db, self.files[:end + 1] + scripts(ROOT, ('db/rollbacks/030_calibrated_balance.sql',)))
        self.assertEqual(snapshot(), before)

    def test_author_balance_restores_every_effect_preserves_players_and_compensates(self):
        author_end = SQL_FILES.index('db/seeds/029_scenario_balance.sql') + 1
        apply(self.db, self.files[:author_end])
        author = self.db.execute('SELECT event_id,choice_index,money,wife,health,threat,rating FROM game_choices ORDER BY event_id,choice_index')
        end = SQL_FILES.index('db/seeds/033_restore_author_balance.sql')
        apply(self.db, self.files[:end])
        self.db.execute("INSERT INTO accounts VALUES ('human-player','Human','human','synthetic',1)")
        self.db.execute("INSERT INTO game_statuses VALUES ('human-player','existing','{\"day\":12,\"health\":63}',1,1)")
        tables = [r[0] for r in self.db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name <> 'db_deployments'")]
        snapshot = lambda: {t: self.db.execute('SELECT * FROM "' + t + '" ORDER BY rowid') for t in tables}
        before = snapshot()
        links = self.db.execute('SELECT event_id,choice_index,next_event_id,delay_days FROM game_choices ORDER BY event_id,choice_index')
        apply(self.db, self.files[:end + 1])
        after = snapshot()
        updated = self.db.execute('SELECT event_id,choice_index,money,wife,health,threat,rating FROM game_choices ORDER BY event_id,choice_index')
        self.assertEqual(len(updated), 123)
        self.assertEqual(updated, author, 'All 615 effects must match the author reference exactly')
        self.assertEqual(links, self.db.execute('SELECT event_id,choice_index,next_event_id,delay_days FROM game_choices ORDER BY event_id,choice_index'))
        for table in tables:
            if table != 'game_choices':
                self.assertEqual(after[table], before[table], table)
        apply(self.db, self.files[:end + 1])
        self.assertEqual(snapshot(), after)
        apply(self.db, self.files[:end + 1] + scripts(ROOT, ('db/rollbacks/033_restore_author_balance.sql',)))
        self.assertEqual(snapshot(), before)

    def test_retirement_upgrade_preserves_players_and_blocks_unsafe_compensation(self):
        end = SQL_FILES.index('db/migrations/007_retirement_achievements.sql')
        before_files = self.files[:end]
        apply(self.db, before_files)
        self.db.execute("INSERT INTO accounts VALUES ('retirement-player','Mayor','mayor','synthetic',1)")
        self.db.execute("INSERT INTO game_stats(account_id,mode,games_played,max_money,survivor) VALUES ('retirement-player','arcade',3,8000000,2)")
        before_stats = self.db.execute('SELECT * FROM game_stats')
        before_ui = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        after_files = self.files[:end + 2]
        apply(self.db, after_files)
        apply(self.db, after_files)
        self.assertEqual(self.db.execute('SELECT * FROM game_stats'), [before_stats[0] + [0]])
        for old, new in zip(before_ui, self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')):
            ui, alerts = json.loads(new[1]), json.loads(new[2])
            self.assertTrue(ui.pop('end_victory'))
            self.assertTrue(ui.pop('end_score'))
            self.assertTrue(ui.pop('end_score_bonus'))
            self.assertTrue(ui['titles'].pop('honorable_retirement').startswith('👑'))
            for key in ('unsinkable',):
                self.assertEqual(set(ui['achievements'].pop(key)), {'name', 'desc'})
            self.assertTrue(alerts.pop('honorable_retirement'))
            self.assertEqual(ui, json.loads(old[1]))
            self.assertEqual(alerts, json.loads(old[2]))
        rollback = scripts(ROOT, ('db/rollbacks/007_retirement_achievements.sql', 'db/rollbacks/032_retirement_ui.sql'))
        self.db.execute("INSERT INTO game_statuses VALUES ('retirement-player','new',?,1,1)", ['{"achievements":{"unsinkable":0}}'])
        with self.assertRaisesRegex(RuntimeError, 'CHECK constraint failed'):
            apply(self.db, after_files + rollback)
        self.assertIn('unsinkable', [r[1] for r in self.db.execute('PRAGMA table_info(game_stats)')])
        self.db.execute("DELETE FROM game_statuses WHERE account_id='retirement-player'")
        apply(self.db, after_files + rollback)
        self.assertEqual(self.db.execute('SELECT * FROM game_stats'), before_stats)
        restored = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        parse = lambda rows: [(lang, json.loads(ui), json.loads(alerts)) for lang, ui, alerts in rows]
        self.assertEqual(parse(restored), parse(before_ui))
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM accounts'), [[1]])

    def test_audio_preferences_upgrade_and_compensation_preserve_existing_players(self):
        end = SQL_FILES.index('db/migrations/006_account_preferences.sql')
        apply(self.db, self.files[:end])
        self.db.execute("INSERT INTO accounts VALUES ('audio-player','Audio','audio','synthetic',1)")
        before = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        apply(self.db, self.files[:end + 2])
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM account_preferences'), [[0]])
        self.db.execute('INSERT INTO account_preferences VALUES (?, ?)', ['audio-player', json.dumps({'musicEnabled': True, 'musicVolume': 25, 'sfxEnabled': True, 'sfxVolume': 70})])
        after = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        for old, new in zip(before, after):
            value = json.loads(new[1])
            self.assertEqual(set(value.pop('audio')), {'title', 'music', 'sfx', 'enabled', 'disabled', 'volume', 'close'})
            self.assertEqual(value, json.loads(old[1]))
            self.assertEqual(old[2], new[2])
        apply(self.db, self.files[:end + 2])
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM account_preferences'), [[1]])
        apply(self.db, self.files[:end + 2] + scripts(ROOT, ('db/rollbacks/031_audio_settings.sql', 'db/rollbacks/006_account_preferences.sql')))
        restored = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        self.assertEqual([(lang, json.loads(ui), alerts) for lang, ui, alerts in restored],
                         [(lang, json.loads(ui), alerts) for lang, ui, alerts in before])
        self.assertEqual(self.db.execute("SELECT nickname FROM accounts WHERE id='audio-player'"), [['Audio']])
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM sqlite_master WHERE name='account_preferences'"), [[0]])

    def test_park_copy_upgrade_and_compensation_preserve_other_data(self):
        self.legacy_database()
        baseline(self.db)
        def snapshot():
            tables = self.db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name <> 'db_deployments'")
            return {name: sorted(self.db.execute('SELECT * FROM "' + name + '"'), key=repr) for (name,) in tables}
        before = snapshot()
        end = SQL_FILES.index('db/seeds/012_park_sculptures_ru.sql') + 1
        files = self.files[:end]
        apply(self.db, files)
        after = snapshot()
        differences = []
        for table in before:
            self.assertEqual(len(after[table]), len(before[table]), table)
            for old, new in zip(before[table], after[table]):
                if old != new:
                    # These are the only permitted changes, including within each row.
                    changed = [i for i in range(len(old)) if old[i] != new[i]]
                    key = old[:3] if table == 'game_choice_locales' else old[:2]
                    differences.append((table, tuple(key), changed))
        self.assertCountEqual(differences, [
            ('game_event_locales', ('park_sculptures', 'ru'), [3]),
            ('game_choice_locales', ('park_sculptures', 0, 'ru'), [3]),
            ('game_choice_locales', ('park_sculptures', 1, 'ru'), [3]),
        ])
        apply(self.db, files)
        self.assertEqual(snapshot(), after)
        apply(self.db, files + scripts(ROOT, ('db/rollbacks/012_park_sculptures_ru.sql',)))
        self.assertEqual(snapshot(), before)
        self.assertEqual(len(history(self.db)), end + 1)


if __name__ == '__main__':
    unittest.main()
