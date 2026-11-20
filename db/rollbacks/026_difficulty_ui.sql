-- Remove only the UI fields introduced by 026_difficulty_ui.sql.

UPDATE game_locale_ui SET ui = json_set(json_remove(ui, '$.difficulty', '$.titles.bankruptcy', '$.titles.too_popular', '$.titles.wife_abroad'), '$.btn_shop', 'Магазин'),
    alerts = json_remove(alerts, '$.bankruptcy', '$.too_popular', '$.wife_abroad') WHERE lang = 'ru';

UPDATE game_locale_ui SET ui = json_set(json_remove(ui, '$.difficulty', '$.titles.bankruptcy', '$.titles.too_popular', '$.titles.wife_abroad'), '$.btn_shop', 'Black Market'),
    alerts = json_remove(alerts, '$.bankruptcy', '$.too_popular', '$.wife_abroad') WHERE lang = 'en';

UPDATE game_locale_ui SET ui = json_set(json_remove(ui, '$.difficulty', '$.titles.bankruptcy', '$.titles.too_popular', '$.titles.wife_abroad'), '$.btn_shop', 'חנות'),
    alerts = json_remove(alerts, '$.bankruptcy', '$.too_popular', '$.wife_abroad') WHERE lang = 'he';

UPDATE game_locale_ui SET ui = json_set(json_remove(ui, '$.difficulty', '$.titles.bankruptcy', '$.titles.too_popular', '$.titles.wife_abroad'), '$.btn_shop', 'Магазін'),
    alerts = json_remove(alerts, '$.bankruptcy', '$.too_popular', '$.wife_abroad') WHERE lang = 'uk';
