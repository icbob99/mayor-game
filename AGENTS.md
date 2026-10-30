# Mayor Game — agent entry point

## Read first

- Read `docs/agent-notes.md`, starting with **Текущее состояние и границы работы**. It is the single project context: approved decisions, current work, evidence and next steps.
- Read the relevant D/P section before changing behavior. Historical entries describe their date, not current completion status.
- Check the working tree before editing. Uncommitted work may belong to an interrupted implementation; do not discard it or apply old stashes automatically.
- Global Boris instructions govern approvals, Git operations and communication. This file does not grant additional permission.

## Architecture that must stay intact

- Browser game: plain JavaScript loaded by `index.html`; no frontend build framework.
- `app/infrastructure/data-proxy.js`: environment selection, URLs, HTTP and timeout.
- `app/data/dal.js`: raw Worker tables to game objects. No SQL, Turso credentials, URLs or environment selection here.
- `app/game/`: game rules and session management. `app/ui/`: rendering, language and audio.
- Runtime shop prices come from `shopPerkPrices` in `app/game/game-state.js`. Historical locale price fields have been restored with the database rollback and are ignored by the current frontend; do not remove them again without approval.
- `cloudflare/worker.js`: API entry point; game-data response stays raw. `cloudflare/database.js` handles database transport; `cloudflare/auth.js` handles authentication. Consult the journal for implementation status.
- `server.py`: local stack lifecycle and the sole ordered SQL list (`SQL_FILES`). Never copy this list into tests. The proposed deployment journal/CLI was cancelled and removed; there is no `--db-url` mode or `deployment` table creation. The UI translation table is `game_locale_ui` again.
- `db/migrations/003_account_schema.sql` has not been applied to production. Edit it for agreed schema changes instead of creating incremental migrations for this unreleased schema. Recheck deployment status first.
- Code comments are English. Player-facing text follows the game language; runtime messages come from locale data, startup messages have a local fallback.

## Selected skills

Use the installed skill catalog to locate general skills by name; do not copy their implementations into this repo. The Mayor Game extension below is maintained in this repository. These are task-specific choices, not a requirement to run every workflow for every edit.

| Skill | Use in this project |
| --- | --- |
| `engineering-suite-ponytail:ponytail` | Implementation: reuse existing code/native features; avoid duplicate paths, speculative abstractions and dependencies. Follow its entry skill when invoked. |
| `superpowers:systematic-debugging` | Bugs: reproduce the reported sequence, locate the cause, then propose the fix. |
| `engineering-suite-ponytail:code-simplification` | Approved refactoring: simplify the touched code and remove replaced paths while preserving behavior. |
| `superpowers:verification-before-completion` | Completion: check the actual changed behavior and report the evidence and limits. |
| `game-text-editor` | Language review of cards and UI in RU/EN/UK/HE. Personal skill: `C:/Users/BorisShulman/.codex/skills/game-text-editor/SKILL.md`. Preserve meaning and placeholders; propose small batches before applying text changes. |
| `deployment-aware-development` | During development/review, account for deployed state and the upgrade/recovery path. Personal skill: `C:/Users/BorisShulman/.codex/skills/deployment-aware-development/SKILL.md`. Project deployment evidence and open gaps are in `docs/agent-notes.md`. |
| `mayor-game-deployment` | Project extension at `.agents/skills/mayor-game-deployment/SKILL.md`; loads `deployment-aware-development` and maps its rules to Mayor Game tables, SQL sources, components and local environments. Use for changes affecting release compatibility or persisted state. |

Other applicable skills remain available. Existing approved D/P decisions should be reused instead of reopening design. A skill does not authorize code changes, dependencies, extra documents, delegation or Git operations beyond Boris's approval.

## Checks and environments

- DAL tests: raw data in, expected game objects out; no Python wrapper, in-memory database or copied migrations.
- Auth checks must cover recovery, including wrong password followed by the correct password in the same form. Passing API checks alone do not establish browser behavior.
- Existing checks use Node's test runner; the browser integration uses real Chrome, Worker and libSQL. Do not introduce another test framework as incidental cleanup.
- Host PowerShell, repository root: `node --test tests/*.test.cjs`. The Docker browser test is opt-in with `MAYOR_DOCKER_TEST=1`.
- Manual stack: `mayor-game-dev`, game `http://localhost:8787`, DB HTTP `http://localhost:8081`.
- Disposable automated stack: `mayor-game-test`, game port 8788, DB port 8082.
- `python server.py` recreates the manual stack and deletes its data. `python server.py --test` does the same only for the automated stack. Do not restart the manual stack while investigating Boris's saved account.
- `db:8080` is a Compose-network address, not a Windows hostname. Boris uses VS Code Database Client (`cweijan.vscode-database-client2`), saved connection **Mayor Local**: Turso, `http://localhost:8081`, **No Auth**. Table browsing and SQL execution were manually verified. Use HTTP, not HTTPS.

## Keep context useful

- Update the current-state section in place: actual work, open defects, latest verification, next action and authorization limits. Record a result once, link to it elsewhere.
- Distinguish approved design, implemented code, verified behavior and Boris's acceptance. A successful login check does not establish that cloud saves or device transfer work.
- Keep durable decisions in the existing D/P sections and relevant history in the journal. Do not create a second roadmap or per-task memory files.
- README contains only the game description, production link and local-stack startup. Keep development reports out of README and the user roadmap.
- Never store passwords, auth tokens, password hashes or credential-bearing remote URLs in project context.
