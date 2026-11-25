-- Restore the previous frontend and Worker before removing configuration.
-- Export game_config first if operator edits need to be retained.
DROP TABLE game_config;
