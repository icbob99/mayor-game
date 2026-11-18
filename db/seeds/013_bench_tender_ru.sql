-- Copy-only update: preserve event IDs, choice indexes and gameplay effects.
UPDATE game_event_locales
SET description = 'Подрядчик обещает откат за победу в тендере на парковые скамейки. Судя по смете, сидеть горожане будут на золоте. Жена как раз намекает на новый пентхаус — удивительное совпадение.'
WHERE event_id = 'bench_tender' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🧳 Взять по полной! Отдать подряд кузену'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👜 Взять умеренный откат через фиктивную контору'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'ru';
