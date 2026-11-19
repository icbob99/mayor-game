-- Copy-only update: preserve event IDs, choices and gameplay effects.
UPDATE game_event_locales
SET description = 'Известный адвокат предлагает за солидный гонорар устроить так, чтобы в Лахав 433 «потеряли» пару папок с материалами на вас. Обычно адвокаты изучают документы. Этот работает над тем, чтобы изучать было нечего.'
WHERE event_id = 'lawyer_visit' AND lang = 'ru';
