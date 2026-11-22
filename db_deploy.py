"""Track and apply Mayor Game SQL to libSQL/Turso, using only Python's standard library."""
import argparse
from contextlib import contextmanager
import hashlib
import json
from pathlib import Path
import re
import sqlite3
import sys
import time
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
# Append only. The position is the deployment sequence, not the filename prefix.
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
    'db/migrations/004_deployment_history.sql',
    'db/seeds/012_park_sculptures_ru.sql',
    'db/seeds/013_bench_tender_ru.sql',
    'db/seeds/014_tama_38_ru.sql',
    'db/seeds/015_shelters_budget_ru.sql',
    'db/seeds/016_state_comptroller_ru.sql',
    'db/seeds/017_shabbat_blackmail_ru.sql',
    'db/seeds/018_lawyer_visit_ru.sql',
    'db/seeds/019_three_scenarios_ru.sql',
    'db/seeds/020_three_scenarios_ru.sql',
    'db/seeds/021_three_scenarios_ru.sql',
    'db/seeds/022_all_scenarios_ru.sql',
    'db/seeds/023_all_scenarios_en.sql',
    'db/seeds/024_all_scenarios_he.sql',
    'db/seeds/025_all_scenarios_uk.sql',
    'db/seeds/026_difficulty_ui.sql',
    'db/migrations/005_mode_statistics.sql',
    'db/seeds/027_modes_ui.sql',
    'db/seeds/028_header_ui.sql',
)
BASELINE_LAST = 'db/migrations/003_account_schema.sql'
HISTORY_SCHEMA = 'db/migrations/004_deployment_history.sql'
CONTENT_TABLES = ('game_events', 'game_choices', 'game_locale_ui', 'game_event_locales', 'game_choice_locales')
CATALOG = """SELECT type, name, tbl_name, sql FROM sqlite_master
    WHERE name NOT LIKE 'sqlite_%' AND tbl_name <> 'db_deployments' AND sql IS NOT NULL
    ORDER BY type, name"""
# Tokenize comments separately from quoted strings: trigger bodies and string
# literals containing semicolons or comment markers must remain intact.
TOKENS = re.compile(r"--[^\n]*|/\*[\s\S]*?\*/|'(?:''|[^'])*'|\"(?:\"\"|[^\"])*\"|`[^`]*`|\[[^\]]*\]|\w+|[^\s]")


def tokens(sql):
    return [token if token[0] in "'\"`[" else token.upper()
            for token in TOKENS.findall(sql) if not token.startswith(('--', '/*'))]


def statements(sql):
    result, pending = [], ''
    for part in sql.split(';'):
        pending += part + ';'
        if sqlite3.complete_statement(pending):
            if tokens(pending) != [';'] and tokens(pending):
                result.append(pending)
            pending = ''
    if tokens(pending):
        raise ValueError('Incomplete SQL statement')
    # The runner owns the transaction; allow only the historical outer wrapper.
    if result and tokens(result[0]) == ['PRAGMA', 'FOREIGN_KEYS', '=', 'ON', ';']:
        result.pop(0)
    if result and tokens(result[0]) in (['BEGIN', ';'], ['BEGIN', 'TRANSACTION', ';']):
        if tokens(result[-1]) not in (['COMMIT', ';'], ['END', ';']):
            raise ValueError('Unclosed SQL transaction wrapper')
        result = result[1:-1]
    for sql in result:
        if tokens(sql)[0] in ('BEGIN', 'END', 'COMMIT', 'ROLLBACK', 'SAVEPOINT', 'RELEASE', 'PRAGMA', 'ATTACH', 'DETACH', 'VACUUM'):
            raise ValueError('SQL must leave transaction/connection control to the runner')
    return result


def scripts(root=ROOT, names=SQL_FILES):
    result = []
    for name in names:
        # Git's Windows CRLF conversion must not change a script's identity.
        text = (root / name).read_text(encoding='utf-8-sig').replace('\r\n', '\n')
        result.append(dict(name=name, checksum=hashlib.sha256(text.encode('utf-8')).hexdigest(),
                           statements=statements(text)))
    return result


class Database:
    def __init__(self, url, token=''):
        self.url = url.replace('libsql://', 'https://', 1).rstrip('/')
        parsed = urlparse(self.url)
        if (parsed.scheme != 'https' and not (parsed.scheme == 'http' and parsed.hostname in ('localhost', '127.0.0.1'))) or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path:
            raise ValueError('Use an HTTPS database URL, or HTTP localhost for Docker')
        self.origin = parsed
        self.token, self.baton = token, None

    def request(self, request):
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = 'Bearer ' + self.token
        payload = {'requests': [request], 'baton': self.baton}
        req = Request(self.url + '/v2/pipeline', json.dumps(payload).encode('utf-8'), headers)
        with urlopen(req, timeout=30) as response:
            data = json.load(response)
        self.baton = data.get('baton')
        if data.get('base_url'):
            destination = urlparse(data['base_url'])
            same_host = (destination.hostname, destination.port) == (self.origin.hostname, self.origin.port)
            turso_node = (self.origin.hostname.endswith('.turso.io') and
                          (destination.hostname or '').endswith('.turso.io') and destination.port in (None, 443))
            if (destination.scheme != self.origin.scheme or destination.username or destination.password or
                    destination.query or destination.fragment or not (same_host or turso_node)):
                raise ValueError('Unexpected database stream URL')
            self.url = data['base_url'].rstrip('/')
        result = data['results'][0]
        if result['type'] != 'ok':
            raise RuntimeError(result.get('error', {}).get('message', 'Database request failed'))
        return result['response']

    def batch(self, statements):
        steps = []
        for item in statements:
            sql, args = (item, ()) if isinstance(item, str) else item
            stmt = {'sql': sql, 'want_rows': True, 'args': [
                {'type': 'null'} if value is None else
                {'type': 'integer' if isinstance(value, int) else 'text', 'value': str(value)} for value in args]}
            steps.append({'stmt': stmt, **({'condition': {'type': 'ok', 'step': len(steps) - 1}} if steps else {})})
        result = self.request({'type': 'batch', 'batch': {'steps': steps}})['result']
        for error in result['step_errors']:
            if error:
                raise RuntimeError(error['message'])
        def value(cell):
            if cell['type'] == 'null':
                return None
            if cell['type'] == 'integer':
                return int(cell['value'])
            return float(cell['value']) if cell['type'] == 'float' else cell['value']
        return [[[value(cell) for cell in row] for row in item['rows']] for item in result['step_results']]

    def execute(self, sql, args=()):
        return self.batch([(sql, args)])[0]

    @contextmanager
    def transaction(self):
        self.execute('PRAGMA foreign_keys = ON')
        self.execute('BEGIN IMMEDIATE')
        try:
            yield
            self.execute('COMMIT')
        except BaseException:
            try:
                self.execute('ROLLBACK')
            except Exception:
                pass
            raise

    def close(self):
        if self.baton:
            try:
                self.request({'type': 'close'})
            finally:
                self.baton = None


def history(db):
    if not db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='db_deployments'"):
        return []
    return db.execute('SELECT sequence, script_name, checksum, recorded_at, kind FROM db_deployments ORDER BY sequence')


def validate_history(rows, files):
    for index, row in enumerate(rows):
        if index >= len(files) or row[:3] != [index + 1, files[index]['name'], files[index]['checksum']]:
            raise RuntimeError('Applied SQL history changed or differs from this checkout; stop and investigate')


def record(index, item, kind):
    return ('INSERT INTO db_deployments (sequence, script_name, checksum, recorded_at, kind) VALUES (?, ?, ?, ?, ?)',
            (index + 1, item['name'], item['checksum'], int(time.time() * 1000), kind))


def apply(db, files=None):
    files = scripts() if files is None else files
    # Each file is atomic. A later failed file leaves earlier committed files recorded.
    with db.transaction():
        rows = history(db)
        validate_history(rows, files)
        if not rows and db.execute(CATALOG):
            raise RuntimeError('Existing untracked database: check-baseline, then baseline before apply')
        db.batch(statements((ROOT / HISTORY_SCHEMA).read_text(encoding='utf-8')))
    for index in range(len(rows), len(files)):
        with db.transaction():
            # Recheck under the write lock: concurrent deployers cannot replay a file.
            current = history(db)
            validate_history(current, files)
            if len(current) > index:
                continue
            db.batch(files[index]['statements'] + [record(index, files[index], 'applied')])
        print(f"Applied {index + 1}: {files[index]['name']}")


def check_baseline(db):
    files = scripts()
    end = SQL_FILES.index(BASELINE_LAST) + 1
    with sqlite3.connect(':memory:') as reference:
        for item in files[:end]:
            for sql in item['statements']:
                reference.execute(sql)
        def schema(rows):
            return [(kind, name, table, tokens(sql)) for kind, name, table, sql in rows]
        if schema(reference.execute(CATALOG)) != schema(db.execute(CATALOG)):
            raise RuntimeError('Baseline schema differs; no adoption performed')
        for table in CONTENT_TABLES:
            columns = [row[1] for row in reference.execute(f'PRAGMA table_info({table})')]
            query = f"SELECT * FROM {table} ORDER BY " + ','.join(str(n + 1) for n in range(len(columns)))
            def content(rows):
                return [[json.loads(value) if column in ('ui', 'alerts') else value
                         for column, value in zip(columns, row)] for row in rows]
            if content(reference.execute(query)) != content(db.execute(query)):
                raise RuntimeError(f'Baseline content differs in {table}; no adoption performed')
    print(f'Baseline schema and content match through {BASELINE_LAST}; player rows are not compared or replaced')


def baseline(db):
    files = scripts()
    end = SQL_FILES.index(BASELINE_LAST) + 1
    with db.transaction():
        rows = history(db)
        validate_history(rows, files)
        if rows:
            print('Database already tracked; baseline unchanged')
            return
        check_baseline(db)
        db.batch(statements((ROOT / HISTORY_SCHEMA).read_text(encoding='utf-8')) +
                 [record(i, item, 'baseline') for i, item in enumerate(files[:end])] +
                 [record(end, files[end], 'applied')])
    print('Baseline recorded; historical SQL was not executed against the target')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=('status', 'check-baseline', 'baseline', 'apply'))
    target = parser.add_mutually_exclusive_group(required=True)
    target.add_argument('--env-file', type=Path, help='Local file with TURSO_DATABASE_URL and TURSO_AUTH_TOKEN')
    target.add_argument('--url', help='Local Docker HTTP URL; use --env-file for cloud credentials')
    args = parser.parse_args()
    config = {}
    if args.env_file:
        for line in args.env_file.read_text(encoding='utf-8-sig').splitlines():
            if line.strip() and not line.lstrip().startswith('#'):
                key, value = line.split('=', 1)
                config[key.strip()] = value.strip().strip('\"\'')
        if not config.get('TURSO_AUTH_TOKEN'):
            raise ValueError('TURSO_AUTH_TOKEN is required in the env file')
    db = Database(args.url or config['TURSO_DATABASE_URL'], config.get('TURSO_AUTH_TOKEN', ''))
    try:
        if args.command == 'status':
            files, rows = scripts(), history(db)
            validate_history(rows, files)
            for row in rows:
                print(f'{row[0]} {row[1]} {row[4]} recorded_at={row[3]}')
            print(f'{len(rows)} recorded; {len(files) - len(rows)} unrecorded')
            if not rows:
                print('No recorded baseline: an existing database needs check-baseline and baseline, not a replay')
        else:
            {'check-baseline': check_baseline, 'baseline': baseline, 'apply': apply}[args.command](db)
    finally:
        db.close()


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, RuntimeError, sqlite3.Error) as error:
        print(f'Database deployment stopped: {error}', file=sys.stderr)
        sys.exit(1)
