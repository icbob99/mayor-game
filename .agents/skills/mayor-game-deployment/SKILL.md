---
name: mayor-game-deployment
description: Use when developing or reviewing Mayor Game changes that affect deployed database state, SQL seeds or migrations, Worker/frontend compatibility, environment configuration, or release and recovery procedures.
---

# Mayor Game Deployment

## Use with the general skill

Load `deployment-aware-development` from the installed skill catalog first. This file supplies Mayor Game specifics, not a replacement for its general rules. The personal installation is normally at `~/.codex/skills/deployment-aware-development/SKILL.md`. If unavailable, report the missing dependency rather than silently assuming its instructions were applied.

Read [AGENTS.md](../../../AGENTS.md) and the current-state/open-issues sections of [docs/agent-notes.md](../../../docs/agent-notes.md). Keep deployment evidence and work status there; do not create another roadmap or duplicate the general skill here.

## Product and data map

Three separately released components matter: browser files (`index.html`, `app/`), Worker (`cloudflare/worker.js`, `cloudflare/database.js`, `cloudflare/auth.js`), and the Turso database. The Docker stack uses libSQL and local Worker tooling. Its current schema does not establish the production schema.

| Data group | Current tables / location | Meaning for changes |
| --- | --- | --- |
| Product content, not written by gameplay | `game_events`, `game_choices`, `game_event_locales`, `game_choice_locales`, `game_locale_ui` | Update content without changing event IDs, choice indexes or links unintentionally. The rename to `game_ui_locales` was cancelled in source; consult the agent notes before touching an already running environment. |
| Player and operational state | `accounts`, `auth_sessions`, `active_game_sessions`, `game_statuses`, `game_history`, `game_persistence_operations` | Preserve account/save/history relationships and session/deduplication state during ordinary releases. Their existence in local schema files does not establish deployment. |
| Deployment/game configuration | No game-configuration tables currently defined | Platform-specific setups and 13+/18+ content variants are proposed use cases, not implemented features. Existing runtime environment settings are in `compose.yaml` and `sandbox/wrangler.jsonc`; inspect actual usage before editing. |

Shop prices currently live in `shopPerkPrices` in `app/game/game-state.js`. Locale data contains translated shop names and descriptions; when upgrading an older release, inspect its price source before removing historical locale fields.

## Establish the baseline for this release

Use confirmed release/application versions and applied SQL evidence recorded in the agent notes, supported by actual release artifacts or authorized inspection when needed. Record the source of the evidence. Branch HEAD, local Docker data and filenames alone do not establish what is in production.

`db_deploy.py:SQL_FILES` is the single append-only order for Docker and production updates. `server.py` calls this runner; do not copy the list into tests. Numeric filename prefixes overlap: the journal sequence is the list position, not the filename prefix. The earlier deployment implementation was cancelled; this replacement was explicitly approved on 2026-11-18.

Schema 003 is already deployed and must not be edited in place. The runner provides status/check-baseline/baseline/apply. Before adopting an untracked database, compare its schema and product content; baseline records adoption time without replaying historical SQL or replacing player data. A matching baseline does not prove historical execution dates. `db_deployments` records sequence, path, checksum, recorded_at and baseline/applied kind. Consult the agent notes for whether the journal itself has actually been deployed.

## Prepare the concrete change

- For stored text changes, inspect later seed overrides. Produce an existing-data update using `event_id` + `lang`, or `event_id` + `choice_index` + `lang`, and the actual deployed table name. Editing the original seed alone does not deliver the text change.
- For a UI table rename, prepare compatible Worker SQL and an executable database transition. Define behavior while the versions differ and how the old Worker can run again. A command in the notes is not a completed migration.
- Before replacing product content, inspect foreign keys and event-chain references. Keep any proposed reload restricted to the content group; it must not reset player tables.
- For UI JSON changes, inspect the browser consumer. In particular, older clients may still read locale shop prices: frontend rollout alone does not prove all open tabs have switched. Preserve compatibility or define the handling of old clients before removing fields or claiming rollback works.

Choose exact forward/recovery artifacts and execution commands only after the baseline is known. Store approved commands and their verification evidence in the existing agent notes. Do not invent a production deployment command from the local sandbox configuration.

## Rehearse without destroying the manual stand

`python server.py` destroys and recreates the manual Docker stack including its volume. `python server.py --test` does the same for the separate test stack. Neither command currently preserves an old installation and applies an upgrade to it.

For an approved upgrade rehearsal, use the disposable test project identified in AGENTS.md. `tests/test_db_deploy.py` exercises the runner against real libSQL on port 8082: adoption with an existing player, fresh setup, idempotence, checksum rejection and transactional rollback. It imports the shared SQL list. Future feature migrations still need their own relevant existing-state and recovery checks; the browser suite verifies fresh startup. Current evidence and open release gaps belong in the agent notes.

Keep the working manual account intact. Run only checks relevant to the change using the existing tools; do not add a migration framework, admin service or JS/Python database-test wrapper as incidental work. Record what was actually rehearsed and what still blocks release in the agent notes.
