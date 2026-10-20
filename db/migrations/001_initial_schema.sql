CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    avatar TEXT,
    choices TEXT,
    chains TEXT
);

CREATE TABLE IF NOT EXISTS locales (
    lang TEXT PRIMARY KEY,
    ui TEXT,
    events TEXT
);
