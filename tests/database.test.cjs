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
        events: 37,
        choices: 110,
        event_locales: 111,
        choice_locales: 330,
        languages: 3,
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
