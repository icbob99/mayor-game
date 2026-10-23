const assert = require('node:assert/strict');
const { test } = require('node:test');
const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('normalized database contains all game data', () => {
    const output = execFileSync('python', ['-c', `
import json, pathlib, sqlite3
db = sqlite3.connect(":memory:")
for name in (
    "db/migrations/001_initial_schema.sql",
    "db/seeds/001_game_data.sql",
    "db/seeds/002_new_scenarios.sql",
    "db/migrations/002_normalized_schema.sql",
    "db/seeds/003_normalized_data.sql",
    "db/seeds/004_balance_update.sql",
    "db/seeds/005_clean_choice_texts.sql",
    "db/seeds/006_new_scenarios.sql",
    "db/seeds/007_guest_stats_ui.sql",
    "db/seeds/008_ukrainian_locale.sql",
):
    db.executescript(pathlib.Path(name).read_text(encoding="utf-8"))
result = {
    "events": db.execute("SELECT COUNT(*) FROM game_events").fetchone()[0],
    "choices": db.execute("SELECT COUNT(*) FROM game_choices").fetchone()[0],
    "event_locales": db.execute("SELECT COUNT(*) FROM game_event_locales").fetchone()[0],
    "choice_locales": db.execute("SELECT COUNT(*) FROM game_choice_locales").fetchone()[0],
    "languages": db.execute("SELECT COUNT(*) FROM game_locale_ui").fetchone()[0],
    "choice_money_hints": db.execute("SELECT COUNT(*) FROM game_choice_locales WHERE text LIKE '%₪%'").fetchone()[0],
}
print(json.dumps(result))
`], { cwd: root, encoding: 'utf8' });

    assert.deepEqual(JSON.parse(output), {
        events: 41,
        choices: 123,
        event_locales: 164,
        choice_locales: 492,
        languages: 4,
        choice_money_hints: 0
    });
});

test('runtime reads normalized tables', () => {
    const dbSource = readFileSync(path.join(root, 'app/db.js'), 'utf8');
    assert.match(dbSource, /FROM game_events/);
    assert.match(dbSource, /FROM game_choices/);
    assert.match(dbSource, /FROM game_event_locales/);
    assert.match(dbSource, /FROM game_choice_locales/);
    assert.doesNotMatch(dbSource, /FROM events ORDER BY/);
});

test('guest statistics translations are present in every language', () => {
    const output = execFileSync('python', ['-c', `
import json, pathlib, sqlite3
db = sqlite3.connect(":memory:")
for name in (
    "db/migrations/001_initial_schema.sql",
    "db/seeds/001_game_data.sql",
    "db/seeds/002_new_scenarios.sql",
    "db/migrations/002_normalized_schema.sql",
    "db/seeds/003_normalized_data.sql",
    "db/seeds/004_balance_update.sql",
    "db/seeds/005_clean_choice_texts.sql",
    "db/seeds/006_new_scenarios.sql",
    "db/seeds/007_guest_stats_ui.sql",
    "db/seeds/008_ukrainian_locale.sql",
):
    db.executescript(pathlib.Path(name).read_text(encoding="utf-8"))
keys = ["guest_stats_title", "guest_stats_games", "guest_stats_max_money", "guest_stats_achievements", "guest_stats_empty", "guest_stats_close"]
rows = db.execute("SELECT lang, ui FROM game_locale_ui ORDER BY lang").fetchall()
assert {lang for lang, _ in rows} == {"en", "he", "ru", "uk"}
assert all(all(key in json.loads(ui) for key in keys) for _, ui in rows)
print("ok")
`], { cwd: root, encoding: 'utf8' });
    assert.equal(output.trim(), 'ok');
});
