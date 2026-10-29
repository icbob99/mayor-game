-- Normalized schema for extensible events, choices and translations.
-- Create directly in an empty database; no legacy tables are required.
CREATE TABLE IF NOT EXISTS game_events (
    id TEXT PRIMARY KEY,
    avatar TEXT NOT NULL,
    is_follow_up INTEGER NOT NULL DEFAULT 0,
    repeat_policy TEXT NOT NULL DEFAULT 'unlimited',
    max_occurrences INTEGER
);

CREATE TABLE IF NOT EXISTS game_choices (
    event_id TEXT NOT NULL,
    choice_index INTEGER NOT NULL,
    money INTEGER NOT NULL DEFAULT 0,
    wife INTEGER NOT NULL DEFAULT 0,
    health INTEGER NOT NULL DEFAULT 0,
    threat INTEGER NOT NULL DEFAULT 0,
    rating INTEGER NOT NULL DEFAULT 0,
    next_event_id TEXT,
    delay_days INTEGER,
    PRIMARY KEY (event_id, choice_index),
    FOREIGN KEY (event_id) REFERENCES game_events(id)
);

CREATE TABLE IF NOT EXISTS game_locale_ui (
    lang TEXT PRIMARY KEY,
    ui TEXT NOT NULL,
    alerts TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS game_event_locales (
    event_id TEXT NOT NULL,
    lang TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (event_id, lang),
    FOREIGN KEY (event_id) REFERENCES game_events(id)
);

CREATE TABLE IF NOT EXISTS game_choice_locales (
    event_id TEXT NOT NULL,
    choice_index INTEGER NOT NULL,
    lang TEXT NOT NULL,
    text TEXT NOT NULL,
    PRIMARY KEY (event_id, choice_index, lang),
    FOREIGN KEY (event_id, choice_index) REFERENCES game_choices(event_id, choice_index)
);
