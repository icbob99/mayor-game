# Mayor: Chronicles of Embezzlement

A satirical web-based browser game inspired by classic Tamagotchi mechanics and real-world corruption scandals. Balance your offshore accounts, keep your demanding young wife happy, manage your health, and try not to get arrested by law enforcement.

## Service accounts

This project uses the personal `icbob99` account for:

- GitHub repository and GitHub Pages hosting;
- Turso database access;
- Cloudflare Worker/API hosting.

Tokens and other secrets must be stored in the corresponding service's secret
storage and must not be committed to this repository.

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

1. In an empty Turso database execute these files in order:
   `db/migrations/001_initial_schema.sql`, `db/seeds/001_game_data.sql`,
   `db/seeds/002_new_scenarios.sql`, `db/migrations/002_normalized_schema.sql`,
   and `db/seeds/003_normalized_data.sql`. The normalized tables contain all
   37 events and the complete Russian, English and Hebrew locales.
2. Configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` as production
   secrets in the Cloudflare Worker. The GitHub Pages frontend calls the
   Worker and never receives the Turso token.
3. Serve `index.html` over HTTP. Startup loads the normalized event, choice
   and localization tables in one request;
   language changes and game restarts use the loaded data. A failed load
   displays an error and does not start the game; reload the page to retry.

The legacy JSON tables remain as the migration source. Runtime data is read
from the normalized tables:

| Table | Purpose |
| --- | --- |
| `events.choices` | Original choices array, including `nextEvent` |
| `events.chains` | Object containing original `chains` and/or `isFollowUp`, or `{}` |
| `locales.ui` | Object containing original `ui` and `alerts` |
| `game_events` | Event identity, avatar and follow-up metadata |
| `game_choices` | Effects and delayed next-event links |
| `game_event_locales` | Event titles and descriptions per language |
| `game_choice_locales` | Choice text per language |

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
