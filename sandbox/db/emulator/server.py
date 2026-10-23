"""Small local Turso HTTP API emulator for manual Go Live development."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import sqlite3


ROOT = Path(__file__).resolve().parents[3]
DB_PATH = Path(__file__).with_name("game.db")
SCHEMA_PATH = ROOT / "db" / "migrations" / "001_initial_schema.sql"
SEED_PATHS = [
    ROOT / "db" / "seeds" / "001_game_data.sql",
    ROOT / "db" / "seeds" / "002_new_scenarios.sql",
]
NORMALIZED_SCHEMA_PATH = ROOT / "db" / "migrations" / "002_normalized_schema.sql"
NORMALIZED_SEED_PATH = ROOT / "db" / "seeds" / "003_normalized_data.sql"
BALANCE_SEED_PATH = ROOT / "db" / "seeds" / "004_balance_update.sql"
CLEAN_TEXT_SEED_PATH = ROOT / "db" / "seeds" / "005_clean_choice_texts.sql"
NEW_SCENARIOS_SEED_PATH = ROOT / "db" / "seeds" / "006_new_scenarios.sql"
GUEST_STATS_UI_SEED_PATH = ROOT / "db" / "seeds" / "007_guest_stats_ui.sql"
UKRAINIAN_LOCALE_SEED_PATH = ROOT / "db" / "seeds" / "008_ukrainian_locale.sql"
DATABASE_READY = False
DATABASE_REQUESTS = 0


def open_database():
    global DATABASE_READY, DATABASE_REQUESTS
    DATABASE_REQUESTS += 1
    print(f"[db] request #{DATABASE_REQUESTS}, ready={DATABASE_READY}", flush=True)
    first_run = not DB_PATH.exists()
    connection = sqlite3.connect(DB_PATH)
    if DATABASE_READY:
        print("[db] already initialized; no seeds or writes", flush=True)
        return connection
    print(f"[db] initializing database, first_run={first_run}", flush=True)
    if first_run:
        connection.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        for seed_path in SEED_PATHS:
            connection.executescript(seed_path.read_text(encoding="utf-8"))
        connection.executescript(NORMALIZED_SCHEMA_PATH.read_text(encoding="utf-8"))
        connection.executescript(NORMALIZED_SEED_PATH.read_text(encoding="utf-8"))
        connection.executescript(BALANCE_SEED_PATH.read_text(encoding="utf-8"))
        connection.executescript(CLEAN_TEXT_SEED_PATH.read_text(encoding="utf-8"))
        connection.executescript(NEW_SCENARIOS_SEED_PATH.read_text(encoding="utf-8"))
        has_guest_stats_ui = connection.execute(
            "SELECT 1 FROM game_locale_ui "
            "WHERE json_extract(ui, '$.guest_stats_title') IS NOT NULL LIMIT 1"
        ).fetchone()
        if not has_guest_stats_ui:
            connection.executescript(GUEST_STATS_UI_SEED_PATH.read_text(encoding="utf-8"))
        has_ukrainian_locale = connection.execute(
            "SELECT 1 FROM game_locale_ui WHERE lang = 'uk' LIMIT 1"
        ).fetchone()
        if not has_ukrainian_locale:
            connection.executescript(UKRAINIAN_LOCALE_SEED_PATH.read_text(encoding="utf-8"))
        connection.commit()
        DATABASE_READY = True
    else:
        has_new_scenarios = connection.execute(
            "SELECT 1 FROM events WHERE id = 'wife_dog_park' LIMIT 1"
        ).fetchone()
        if not has_new_scenarios:
            connection.executescript(SEED_PATHS[-1].read_text(encoding="utf-8"))
            connection.commit()
        has_normalized_events = connection.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'game_events'"
        ).fetchone()
        if not has_normalized_events:
            connection.executescript(NORMALIZED_SCHEMA_PATH.read_text(encoding="utf-8"))
            connection.executescript(NORMALIZED_SEED_PATH.read_text(encoding="utf-8"))
        connection.executescript(BALANCE_SEED_PATH.read_text(encoding="utf-8"))
        connection.executescript(CLEAN_TEXT_SEED_PATH.read_text(encoding="utf-8"))
        connection.executescript(NEW_SCENARIOS_SEED_PATH.read_text(encoding="utf-8"))
        has_guest_stats_ui = connection.execute(
            "SELECT 1 FROM game_locale_ui "
            "WHERE json_extract(ui, '$.guest_stats_title') IS NOT NULL LIMIT 1"
        ).fetchone()
        if not has_guest_stats_ui:
            connection.executescript(GUEST_STATS_UI_SEED_PATH.read_text(encoding="utf-8"))
        has_ukrainian_locale = connection.execute(
            "SELECT 1 FROM game_locale_ui WHERE lang = 'uk' LIMIT 1"
        ).fetchone()
        if not has_ukrainian_locale:
            connection.executescript(UKRAINIAN_LOCALE_SEED_PATH.read_text(encoding="utf-8"))
        connection.commit()
        DATABASE_READY = True
    print("[db] initialization complete; future requests are read-only", flush=True)
    return connection


def value_type(value):
    if value is None:
        return {"type": "null"}
    if isinstance(value, bool):
        return {"type": "integer", "value": "1" if value else "0"}
    if isinstance(value, int):
        return {"type": "integer", "value": str(value)}
    if isinstance(value, float):
        return {"type": "float", "value": str(value)}
    return {"type": "text", "value": str(value)}


def execute(connection, statement):
    sql = statement.get("sql", "")
    args = statement.get("args", [])
    positional = [arg.get("value") for arg in args]
    named = {
        arg["name"].lstrip(":@$" if arg.get("name") else ""): arg["value"].get("value")
        for arg in statement.get("named_args", [])
    }
    cursor = connection.execute(sql, named if named else positional)
    rows = cursor.fetchall() if cursor.description else []
    cols = [
        {"name": description[0], "decltype": "TEXT"}
        for description in (cursor.description or [])
    ]
    return {
        "cols": cols,
        "rows": [[value_type(value) for value in row] for row in rows],
        "affected_row_count": cursor.rowcount if cursor.rowcount >= 0 else 0,
        "last_insert_rowid": connection.execute("SELECT last_insert_rowid()").fetchone()[0],
    }


class Handler(BaseHTTPRequestHandler):
    def _send(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()

    def do_POST(self):
        if self.path != "/v2/pipeline":
            self._send(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length))
            connection = open_database()
            results = []
            for request in payload.get("requests", []):
                if request.get("type") == "close":
                    results.append({"type": "ok", "response": {"type": "close"}})
                    continue
                try:
                    result = execute(connection, request["stmt"])
                    connection.commit()
                    results.append({"type": "ok", "response": {"type": "execute", "result": result}})
                except Exception as error:
                    results.append({"type": "error", "error": {"message": str(error)}})
            connection.close()
            self._send(200, {"baton": None, "base_url": None, "results": results})
        except Exception as error:
            self._send(400, {"error": str(error)})

    def log_message(self, format, *args):
        print(format % args)


if __name__ == "__main__":
    open_database().close()
    print("Turso emulator: http://localhost:8080/v2/pipeline")
    ThreadingHTTPServer(("localhost", 8080), Handler).serve_forever()
