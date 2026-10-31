"""Recreate this project's local Docker environment, including its database."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from urllib.error import URLError
from urllib.request import Request, urlopen
from uuid import uuid4

ROOT = Path(__file__).resolve().parent
SQL_FILES = (
    'db/migrations/002_normalized_schema.sql',
    'db/seeds/003_normalized_data.sql',
    'db/seeds/004_balance_update.sql',
    'db/seeds/005_clean_choice_texts.sql',
    'db/seeds/006_new_scenarios.sql',
    'db/seeds/007_guest_stats_ui.sql',
    'db/seeds/008_ukrainian_locale.sql',
    'db/seeds/009_event_error_locale.sql',
    'db/seeds/010_auth_ui.sql',
    'db/seeds/011_save_sync_ui.sql',
    'db/migrations/003_account_schema.sql',
)


def request_json(url, payload=None, headers=None):
    body = None if payload is None else json.dumps(payload).encode('utf-8')
    request = Request(url, data=body, headers={'Content-Type': 'application/json', **(headers or {})})
    with urlopen(request, timeout=5) as response:
        return json.load(response)


def pipeline(url, requests):
    data = request_json(url + '/v2/pipeline', {'requests': [*requests, {'type': 'close'}]})
    results = data.get('results', [])
    if len(results) != len(requests) + 1 or any(item.get('type') != 'ok' for item in results):
        raise RuntimeError(f'Database request failed: {data}')
    return results


def wait_ready(check, label):
    deadline = time.monotonic() + 90
    while True:
        try:
            check()
            return
        except (URLError, TimeoutError, OSError, ValueError, RuntimeError) as error:
            if time.monotonic() >= deadline:
                raise RuntimeError(f'{label} did not become ready: {error}') from error
            time.sleep(1)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--test', action='store_true', help='Use a separate disposable test project and ports.')
    args = parser.parse_args()
    project = 'mayor-game-test' if args.test else 'mayor-game-dev'
    port, db_port = (8788, 8082) if args.test else (8787, 8081)
    instance_id = str(uuid4())
    env = {**os.environ, 'DEV_INSTANCE_ID': instance_id, 'DEV_PORT': str(port), 'DEV_DB_PORT': str(db_port)}
    command = ['docker', 'compose', '--project-name', project, '--file', str(ROOT / 'compose.yaml')]

    def compose(*arguments):
        subprocess.run([*command, *arguments], cwd=ROOT, env=env, check=True)

    subprocess.run(['docker', 'info', '--format', '{{.ServerVersion}}'], check=True)
    compose('version')
    print(f'Recreating {project}: all its local database data will be removed.', flush=True)
    compose('down', '--volumes', '--remove-orphans')
    try:
        compose('build', '--no-cache', 'game')
        compose('up', '--detach', 'db')
        db_url = f'http://127.0.0.1:{db_port}'
        wait_ready(lambda: pipeline(db_url, [{'type': 'execute', 'stmt': {'sql': 'SELECT 1'}}]), 'Database')
        for filename in SQL_FILES:
            print(f'Applying {filename}', flush=True)
            pipeline(db_url, [{'type': 'sequence', 'sql': (ROOT / filename).read_text(encoding='utf-8')}])
        compose('up', '--detach', 'game')
        game_url = f'http://localhost:{port}'

        def check_game():
            info = request_json(game_url + '/api/dev-info')
            if info.get('instance_id') != instance_id:
                raise RuntimeError('Unexpected local server instance')
            data = request_json(game_url + '/api/game-data', headers={'X-Dev-Instance': instance_id})
            results = data.get('results', [])
            if len(results) != 6 or any(item.get('type') != 'ok' for item in results):
                raise RuntimeError('Game data failed to load')

        wait_ready(check_game, 'Game server')
    except (Exception, KeyboardInterrupt):
        compose('logs', '--tail', '30')
        compose('down')
        raise
    print(f'\nReady: {game_url}\nInstance: {instance_id}', flush=True)
    print(f'Stop: docker compose --project-name {project} down', flush=True)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\nStartup cancelled.', file=sys.stderr)
        sys.exit(130)
    except (OSError, subprocess.CalledProcessError, RuntimeError, ValueError) as error:
        print(f'\nStartup failed: {error}', file=sys.stderr)
        sys.exit(1)
