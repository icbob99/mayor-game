-- Run manually after production has migrated to the normalized game_* tables.
BEGIN TRANSACTION;

DROP TABLE IF EXISTS locales;
DROP TABLE IF EXISTS events;

COMMIT;
