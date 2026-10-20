# Mayor: Chronicles of Embezzlement

A satirical web-based browser game inspired by classic Tamagotchi mechanics and real-world corruption scandals. Balance your offshore accounts, keep your demanding young wife happy, manage your health, and try not to get arrested by law enforcement.

## Features
* **Tamagotchi-style balancing:** Manage money, family pressure, threat level, and your mayor's health.
* **Daily Dilemmas:** Make tough choices on bribes, media attacks, and luxury purchases.
* **Leaderboard / Async Multiplayer:** Compare your corrupt career span and stolen millions with other players.

## Tech Stack
* HTML5 / Tailwind CSS
* Vanilla JavaScript

## Local Development
1. Clone the repository:
   ```bash
   git clone [https://github.com/icbob99/mayor-game.git](https://github.com/icbob99/mayor-game.git)
   ```

## Turso data

1. Execute `db/migrations/001_initial_schema.sql`, then
   `db/seeds/001_game_data.sql` in an empty Turso database. The seed
   contains all 25 events and the complete Russian, English and Hebrew locales.
   It uses plain INSERTs and is intended to run once.
2. Set `TURSO_CONFIG.url` and `TURSO_CONFIG.authToken` in `app/db.js`.
   The URL may start with `https://`, `libsql://` or `turso://`.
   Use a database token created with
   `turso db tokens create <database-name> --read-only`.
   This static site exposes its token to visitors: use a database containing
   only public game content, never a write-capable token.
3. Serve `index.html` over HTTP. Startup loads both tables in one request;
   language changes and game restarts use the loaded data. A failed load
   displays an error and does not start the game; reload the page to retry.

JSON storage preserves fields that have no separate column in the requested schema:

| Column | Stored JSON |
| --- | --- |
| `events.choices` | Original choices array, including `nextEvent` |
| `events.chains` | Object containing original `chains` and/or `isFollowUp`, or `{}` |
| `locales.ui` | Object containing original `ui` and `alerts` |
| `locales.events` | Original translated events object |

`app/db.js` restores the original object shapes. `app/gameData.js` and
`locales/*.json` remain as migration references; the browser no longer loads them.

Run `node --test tests/database.test.cjs` with Node.js 22+ and Python 3 available.
The checks execute the SQL in in-memory SQLite, compare every migrated field
with the source files, and exercise startup, loading failures, languages,
chains, shop cooldowns, game-over messages and restart with a simulated HTTP response.

API reference: [Turso SQL over HTTP](https://docs.turso.tech/sdk/http/reference).
Token setup: [Turso read-only database tokens](https://docs.turso.tech/cli/db/tokens/create).

## Local sandbox

Run the local Turso-compatible emulator in a separate terminal:

```powershell
python sandbox/db/emulator/server.py
```

It creates `sandbox/db/emulator/game.db` from the migration and seed on first
run. Then start `Go Live`; the browser uses `http://localhost:8080` by default.
