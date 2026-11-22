"""Deployment integration checks. Use only the disposable libSQL on port 8082.

Run: python -m unittest discover -s tests -p test_db_deploy.py -v
Requires MAYOR_DB_TEST=1 and the mayor-game-test database container.
"""
import os
import io
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from db_deploy import BASELINE_LAST, Database, ROOT, SQL_FILES, apply, baseline, check_baseline, history, scripts, statements


class ScriptTests(unittest.TestCase):
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
        apply(self.db, self.files[:end])
        before = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        apply(self.db, self.files)
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
        apply(self.db, self.files)
        self.assertEqual(self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang'), after)
        apply(self.db, self.files + scripts(ROOT, ('db/rollbacks/027_modes_ui.sql',)))
        restored = self.db.execute('SELECT lang,ui,alerts FROM game_locale_ui ORDER BY lang')
        self.assertEqual([(lang,json.loads(ui),json.loads(alerts)) for lang,ui,alerts in restored],
                         [(lang,json.loads(ui),json.loads(alerts)) for lang,ui,alerts in before])

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
