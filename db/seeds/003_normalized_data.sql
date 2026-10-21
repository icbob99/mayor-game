-- Migrates the current legacy JSON rows into the normalized schema.
-- Run after 001_game_data.sql, 002_new_scenarios.sql and 002_normalized_schema.sql.
BEGIN TRANSACTION;

INSERT OR REPLACE INTO game_events (id, avatar, is_follow_up, repeat_policy, max_occurrences)
SELECT id, avatar,
       COALESCE(json_extract(chains, '$.isFollowUp'), 0),
       'unlimited', NULL
FROM events;

INSERT OR REPLACE INTO game_choices
    (event_id, choice_index, money, wife, health, threat, rating, next_event_id, delay_days)
SELECT e.id, CAST(j.key AS INTEGER),
       COALESCE(json_extract(j.value, '$.money'), 0),
       COALESCE(json_extract(j.value, '$.wife'), 0),
       COALESCE(json_extract(j.value, '$.health'), 0),
       COALESCE(json_extract(j.value, '$.threat'), 0),
       COALESCE(json_extract(j.value, '$.rating'), 0),
       COALESCE(json_extract(j.value, '$.nextEvent.id'),
                json_extract(e.chains, '$.chains.' || j.key || '.nextEventId')),
       COALESCE(json_extract(j.value, '$.nextEvent.delay'),
                json_extract(e.chains, '$.chains.' || j.key || '.delayDays'))
FROM events e, json_each(e.choices) j;

INSERT OR REPLACE INTO game_locale_ui (lang, ui, alerts)
SELECT lang, json_extract(ui, '$.ui'), json_extract(ui, '$.alerts')
FROM locales;

INSERT OR REPLACE INTO game_event_locales (event_id, lang, title, description)
SELECT event_json.key, l.lang,
       json_extract(event_json.value, '$.title'),
       json_extract(event_json.value, '$.desc')
FROM locales l, json_each(l.events) event_json;

INSERT OR REPLACE INTO game_choice_locales (event_id, choice_index, lang, text)
SELECT event_json.key, CAST(choice_json.key AS INTEGER), l.lang, choice_json.value
FROM locales l,
     json_each(l.events) event_json,
     json_each(json_extract(event_json.value, '$.choices')) choice_json;

COMMIT;
