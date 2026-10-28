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
   `db/seeds/003_normalized_data.sql`, `db/seeds/004_balance_update.sql`,
   `db/seeds/005_clean_choice_texts.sql`, `db/seeds/006_new_scenarios.sql`,
   `db/seeds/007_guest_stats_ui.sql`, and `db/seeds/008_ukrainian_locale.sql`.
   The normalized tables contain all 41 events and the complete Russian,
   English, Ukrainian, Hebrew and Russian locales. The balance seed applies the approved effects
   and repeat policies; the final scenario seed adds four events and their
   localized choices.
2. Configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` as production
   secrets in the Cloudflare Worker. The GitHub Pages frontend calls the
   Worker and never receives the Turso token.
3. Serve `index.html` over HTTP. Startup loads the normalized event, choice
   and localization tables in one request;
   language changes and game restarts use the loaded data. A failed load
   displays an error and does not start the game; reload the page to retry.
   Guest game progress and statistics are stored locally in the browser and do
   not require a database account.

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

`app/db.js` restores the object shapes expected by the game. Runtime data comes
from the normalized database tables; the old JavaScript and JSON source files
are no longer part of the application.

Run `node --test tests/database.test.cjs` with Node.js 22+ and Python 3 available.
The checks execute the SQL in in-memory SQLite, compare every migrated field
with the source files, and exercise startup, loading failures, languages,
chains, shop cooldowns, game-over messages and restart with a simulated HTTP response.

API reference: [Turso SQL over HTTP](https://docs.turso.tech/sdk/http/reference).
Token setup: [Turso read-only database tokens](https://docs.turso.tech/cli/db/tokens/create).

## Local sandbox

Requirements: Python 3 and Docker Desktop running Linux containers. From the
repository directory, run:

```powershell
python server.py
```

Open **http://localhost:8787** after the script prints `Ready`.
No separate Go Live, Node.js or database command is needed. Wrangler runs inside
the server container; the game itself remains vanilla JavaScript in the browser.

**Every run starts from scratch.** The script removes only the
`mayor-game-dev` containers and database volume, rebuilds the game image, creates
a fresh libSQL database and applies the existing migrations and seeds. Local
accounts/saves added in later phases will also be erased. The database management
port is bound to localhost:8081; production services are never contacted.

Each rebuild has a new environment ID. On opening the game, its browser saves
are cleared if that ID changed. Already-open tabs check every three seconds and
on focus, then reset and reload. Unrelated browser storage is preserved. A normal
page reload in the same environment keeps guest progress. These reset controls
are injected by the Docker-only server, not the production page.

The first build downloads the Node/libSQL images and Wrangler. Internet is
required to build; the existing Tailwind CDN dependency also remains unchanged.
If startup fails, the script reports the error instead of printing `Ready`.

Stop the environment (without rebuilding):

```powershell
docker compose --project-name mayor-game-dev down
```

Inspect server/database logs:

```powershell
docker compose --project-name mayor-game-dev logs --tail 50
```

Run the unit/database checks with Node.js 22+ and Python 3:

```powershell
node --test tests/*.test.cjs
```

The Docker/browser integration test is opt-in. It builds the separate
`mayor-game-test` environment twice (ports 8788/8082), checks the real game in
headless Chrome, and removes only that test environment afterwards. It leaves
the manual environment untouched. On Windows with Chrome installed:

```powershell
$env:MAYOR_DOCKER_TEST = '1'
node --test tests/local-environment.test.cjs
Remove-Item Env:MAYOR_DOCKER_TEST
```

Set `CHROME_PATH` if Chrome/Chromium is installed elsewhere. Browser profiles
used by this check are temporary and separate from your own browser profile.
