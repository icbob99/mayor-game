-- Approved Russian revision of all 41 cards. Preserve keys, effects and other languages.

-- bench_tender
UPDATE game_event_locales
SET description = 'Городу нужны скамейки, жене — пентхаус. Подрядчик предлагает решить оба вопроса одним тендером.'
WHERE event_id = 'bench_tender' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🧳 Взять по полной и отдать подряд кузену — семья тоже часть населения'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👜 Взять умеренно через фиктивную контору — фирма липовая, скромность настоящая'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '❌ Отказаться и провести честный тендер — пусть хоть скамейки стоят своих денег'
WHERE event_id = 'bench_tender' AND choice_index = 2 AND lang = 'ru';

-- tama_38
UPDATE game_event_locales
SET title = 'Три лишних этажа',
    description = 'Застройщик просит не заметить три лишних этажа в центре города. Дом подрастёт здесь, ваш счёт — в Швейцарии.'
WHERE event_id = 'tama_38' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏗️ Подписать не глядя — глаза закрыты, счёт открыт'
WHERE event_id = 'tama_38' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🌳 Потребовать парк в обмен на разрешение — зелень должна быть не только на счёте'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛑 Заблокировать стройку — пусть хоть кто-то узнает, что у меня есть принципы'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'ru';

-- shelters_budget
UPDATE game_event_locales
SET description = 'Государство выделило огромную сумму на ремонт старых бомбоубежищ. Брат жены тут же открыл фирму по установке бронированных дверей. Удивительно, как бюджет раскрывает в людях таланты.'
WHERE event_id = 'shelters_budget' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚪 Отдать весь подряд брату жены — своих надо защищать в первую очередь'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛠️ Часть работ ему, остальное по честному конкурсу — совесть тоже просит свою долю'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛡️ Провести честный открытый тендер — родство у нас пока не квалификация'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'ru';

-- state_comptroller
UPDATE game_event_locales
SET description = 'В мэрию пришли аудиторы госконтролёра. Требуют бухгалтерию за прошлый год. Перед народом вы уже отчитались. Оказывается, перед калькулятором тоже надо.'
WHERE event_id = 'state_comptroller' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💰 Подкупить главного аудитора — пусть сойдутся хотя бы наши интересы'
WHERE event_id = 'state_comptroller' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🔥 Устроить «случайный» пожар в архиве — пусть прошлое останется в прошлом'
WHERE event_id = 'state_comptroller' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🐐 Свалить всё на мелкого чиновника — должность маленькая, ответственность большая'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'ru';

-- shabbat_blackmail
UPDATE game_event_locales
SET description = 'Религиозные партии требуют на субботу закрыть торговые центры, кино и спортклубы с бассейнами, перекрыть улицы и въезды в город. Иначе развалят коалицию. Жена собралась за покупками и в бассейн. Обе стороны считают, что вы боитесь недостаточно.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🕍 Уступить всем требованиям — тишину в городе обеспечим, дома не обещаю'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 В центре ограничения, на окраинах всё работает и проезд свободен — святость определяется почтовым индексом'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🖕 Послать их: «У нас светский город! Не нравится — молитесь за другой»'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'ru';

-- lawyer_visit
UPDATE game_event_locales
SET description = 'За солидный гонорар известный адвокат обещает, что в полиции потеряют пару папок на вас. Он не говорит, что вы невиновны. Он говорит, что это необязательно.'
WHERE event_id = 'lawyer_visit' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💼 Заплатить и спать спокойно — невиновность тоже требует вложений'
WHERE event_id = 'lawyer_visit' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Попросить скидку — я же не во всём виноват'
WHERE event_id = 'lawyer_visit' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '❌ Выгнать: «Я честный мэр!» — давно хотел услышать это вслух'
WHERE event_id = 'lawyer_visit' AND choice_index = 2 AND lang = 'ru';

-- garbage_extortion
UPDATE game_event_locales
SET description = 'В мэрию пришли бравые парни из Калансуа. Хотят вывозить мусор. Вежливые: пока предлагают.'
WHERE event_id = 'garbage_extortion' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👮 Подать заявление в полицию — добавить к угрозам входящий номер'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Отдать им подряд на вывоз мусора — самая убедительная заявка'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🗣️ Сделать вид, что не понимаю по-арабски — без перевода угрозы не принимаются'
WHERE event_id = 'garbage_extortion' AND choice_index = 2 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚔️ Позвать конкурентов из Тайбе — пусть рынок сам себя отрегулирует'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'ru';

-- burning_trucks
UPDATE game_event_locales
SET description = 'Ночью на муниципальной стоянке сгорели три мусоровоза. Мусор вывозить нечем. Предложение о сотрудничестве наконец дошло.'
WHERE event_id = 'burning_trucks' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚛 Купить новые мусоровозы за счёт бюджета — отказ тоже стоит денег'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Развести руками: «Денег нет» — руки чистые, город не обещаю'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'ru';

-- neighbor_mayor_amuta
UPDATE game_event_locales
SET description = 'Звонит мэр соседнего города и просит помочь ему переизбраться. Сам он за себя уже решил. Осталось убедить остальных.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💰 Вложиться по полной через подставной фонд — своих на выборах не бросаем'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🪙 Дать немного — чтобы помнил помощь, а не сумму'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📰 Слить компромат в «Городские сплетни» — помочь избирателям определиться'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 3 AND lang = 'ru';

-- kompromat_retaliation
UPDATE game_event_locales
SET description = 'Соседний мэр ответил на слив. В телеграме — ваша «неучтённая» вилла в Кесарии и жена в миланском бутике. Вы помогли его избирателям определиться. Он решил не оставаться в долгу.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💼 Заплатить блогерам — пусть объяснят, как экономия на обедах приводит к вилле'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤐 Отмалчиваться — всё, что я скажу, может оказаться ещё одной недвижимостью'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'ru';

-- shitty_burger
UPDATE game_event_locales
SET description = 'В White Burger вашего главного спонсора инспекторы нашли подозрительное мясо и требуют закрыть заведение. Мясо вам незнакомо. Хозяин — слишком хорошо.'
WHERE event_id = 'shitty_burger' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥩 Выдать лицензию задним числом — на бумаге оно ещё свежее'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📸 Сожрать бургер перед камерами — за спонсора отвечаю животом'
WHERE event_id = 'shitty_burger' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '❌ Закрыть к чертям — деньги деньгами, но это уже не переварить'
WHERE event_id = 'shitty_burger' AND choice_index = 2 AND lang = 'ru';

-- shabbat_parking
UPDATE game_event_locales
SET description = 'По субботам в светских районах машины бросают так, что даже скорая не проедет. Оппозиция требует облаву с эвакуаторами. День покоя есть. Осталось найти хоть одного спокойного.'
WHERE event_id = 'shabbat_parking' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚜 Отправить инспекторов и эвакуаторы с утра — машины тоже имеют право на отдых за городом'
WHERE event_id = 'shabbat_parking' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Ничего не делать — у здравого смысла тоже выходной'
WHERE event_id = 'shabbat_parking' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🅿️ Разметить парковку под окнами раввина — ближнего надо любить вместе с его машиной'
WHERE event_id = 'shabbat_parking' AND choice_index = 2 AND lang = 'ru';

-- flooded_street
UPDATE game_event_locales
SET description = 'После первого серьёзного ливня улица Вайцман ушла под воду. Деньги на ливнёвки ушли раньше. Почему вода не уходит, теперь спрашивают у вас.'
WHERE event_id = 'flooded_street' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🌞 Свалить всё на аномальные осадки и глобальное потепление — я мэр местный, проблема мировая'
WHERE event_id = 'flooded_street' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥾 Надеть сапоги и лично чистить ливнёвку перед камерами — наконец-то грязная работа, которую можно показать'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'ru';

-- arnona_scandal
UPDATE game_event_locales
SET description = 'Журналисты выяснили: бизнес вашего спонсора получил скидку 80% на муниципальный налог. Человек уже поддерживает мэра. Нельзя же брать с него ещё и за город.'
WHERE event_id = 'arnona_scandal' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤫 Замять дело через юристов — это не нарушение, а индивидуальный подход'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📉 Снизить скидку до 30% — пусть возмущаются умереннее'
WHERE event_id = 'arnona_scandal' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚖️ Отменить льготу и взыскать недоплаченное — городу он тоже кое-что должен'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'ru';

-- beach_kiosk
UPDATE game_event_locales
SET description = 'Владелец пляжного ресторана самовольно занял 200 метров берега и поставил платные шезлонги. Человек не жадный: море пока оставил народу.'
WHERE event_id = 'beach_kiosk' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🍹 Взять гонорар и VIP-столик — лично у меня доступ к морю свободный'
WHERE event_id = 'beach_kiosk' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚜 Снести незаконные постройки — объяснить границы собственности бульдозером'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'ru';

-- electric_scooters
UPDATE game_event_locales
SET description = 'На тротуарах самокаты: одни лежат поперёк, другие сбивают пенсионеров. Пройти нельзя. Проехать почему-то можно.'
WHERE event_id = 'electric_scooters' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛴 Ввести платные лицензии для прокатчиков — порядок в бумагах тоже порядок'
WHERE event_id = 'electric_scooters' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Полностью запретить прокат самокатов в центре города'
WHERE event_id = 'electric_scooters' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🅿️ Разметить парковочные места для самокатов'
WHERE event_id = 'electric_scooters' AND choice_index = 2 AND lang = 'ru';

-- stadium_naming
UPDATE game_event_locales
SET description = 'Олигарх хочет назвать городской стадион в честь своей компании. Болеть можно за кого угодно. Читать придётся про него.'
WHERE event_id = 'stadium_naming' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏛️ Оставить историческое название — к нему хотя бы привыкли'
WHERE event_id = 'stadium_naming' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏅 Назвать в честь предыдущего мэра — хорошую традицию надо начинать заранее'
WHERE event_id = 'stadium_naming' AND choice_index = 2 AND lang = 'ru';

-- sewage_overflow
UPDATE game_event_locales
SET description = 'Главный коллектор не выдержал. Набережную заливает нечистотами. О проблеме теперь знают даже те, кто не читает городские новости.'
WHERE event_id = 'sewage_overflow' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Назвать это «временными технологическими работами» — формулировку уже исправили'
WHERE event_id = 'sewage_overflow' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📞 Обратиться в фирму брата — неприятности общие, подряд семейный'
WHERE event_id = 'sewage_overflow' AND choice_index = 2 AND lang = 'ru';

-- friday_country_club
UPDATE game_event_locales
SET description = 'Пятница, восемь утра. Вы в шезлонге у бассейна, перед вами очередь с «маленькими просьбами». В мэрии приём по записи. Здесь — по плавкам.'
WHERE event_id = 'friday_country_club' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '☕ Порешать вопросы бизнесменов за «спонсорские взносы» — людям нужен мэр, мэру нужны люди'
WHERE event_id = 'friday_country_club' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Помочь жителям с муниципальным налогом и садиками за счёт бюджета'
WHERE event_id = 'friday_country_club' AND choice_index = 1 AND lang = 'ru';

-- country_cctv_raid
UPDATE game_event_locales
SET description = 'В Кантри-клуб пришли следователи за записями камер с прошлой пятницы. Вы принимали людей без протокола. Камера вела свой.'
WHERE event_id = 'country_cctv_raid' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💾 Сжечь серверный шкаф — проводка не выдержала ответственности'
WHERE event_id = 'country_cctv_raid' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '😬 Выдать флешку — вдруг камера тоже ничего не помнит'
WHERE event_id = 'country_cctv_raid' AND choice_index = 1 AND lang = 'ru';

-- kindergarten_favor
UPDATE game_event_locales
SET description = 'Старый друг просит срочно перевести ребёнка в элитный садик в центре. Мест давно нет. Друг считает, что это ответ для незнакомых.'
WHERE event_id = 'kindergarten_favor' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💥 Уволить начальника отдела образования, выжить чужого ребёнка и устроить своего'
WHERE event_id = 'kindergarten_favor' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤫 Пообещать всё устроить и ничего не делать — зачем портить дружбу отказом?'
WHERE event_id = 'kindergarten_favor' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Выставить друга за дверь — закон один для всех. Теперь и для него.'
WHERE event_id = 'kindergarten_favor' AND choice_index = 2 AND lang = 'ru';

-- metro_depot
UPDATE game_event_locales
SET description = 'Министерство транспорта предлагает построить огромное депо метро в городе. Жители боятся, что стройка никогда не закончится. Подрядчики боятся, что закончится.'
WHERE event_id = 'metro_depot' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏗️ Одобрить — проект государственный, благодарность частная'
WHERE event_id = 'metro_depot' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚜 Перенести депо к виллам лидера оппозиции — пусть будет ближе к народу и транспорту'
WHERE event_id = 'metro_depot' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Заблокировать проект через суд — пусть хоть жители спят спокойно'
WHERE event_id = 'metro_depot' AND choice_index = 2 AND lang = 'ru';

-- bagrut_success
UPDATE game_event_locales
SET description = 'Город может поставить рекорд по сдаче выпускных экзаменов. Для этого школам нужны репетиторы и лаборатории. Просто поставить рекорд в отчёте почему-то не предлагают.'
WHERE event_id = 'bagrut_success' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📚 Выделить максимум средств — пусть хоть дети знают, что делают'
WHERE event_id = 'bagrut_success' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Оставить стандартную программу — мы же как-то выучились'
WHERE event_id = 'bagrut_success' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '✂️ Сократить бюджет и перевести сэкономленное в свой фонд — о будущем тоже надо думать'
WHERE event_id = 'bagrut_success' AND choice_index = 2 AND lang = 'ru';

-- park_sculptures
UPDATE game_event_locales
SET description = 'Друг-скульптор предлагает за счёт города украсить центральный парк абстракциями из ржавого железа. От металлолома их отличает смета.'
WHERE event_id = 'park_sculptures' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎨 Утвердить смету — друг поделится гонораром. Я уже начинаю понимать искусство'
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Отклонить проект — пусть пока ржавеет за свой счёт'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏛️ Объявить открытый конкурс для молодых местных художников — вдруг талант есть и у незнакомых'
WHERE event_id = 'park_sculptures' AND choice_index = 2 AND lang = 'ru';

-- yom_haatzmaut
UPDATE game_event_locales
SET description = 'Спонсоры перевели миллионы на концерт, салют и угощения. Полиция сегодня праздник не портит. Деньги есть. Осталось решить, у кого праздник.'
WHERE event_id = 'yom_haatzmaut' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎉 Добавить своих денег и устроить грандиозный пир — бывает и такое'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🍿 Устроить праздник на спонсорские деньги, небольшой остаток забрать себе — не чужой же я в этом городе'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤑 Забрать все деньги, а людям оставить дешёвые флажки — пусть машут'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 2 AND lang = 'ru';

-- wife_dog_park
UPDATE game_event_locales
SET description = 'Жена хочет собаку, но в районе нет площадки для выгула. Собаки ещё нет, а город уже должен.'
WHERE event_id = 'wife_dog_park' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🐕 Отдать строительство другу — породистая собака, ваучер на корм и дрессировщик идут в комплекте'
WHERE event_id = 'wife_dog_park' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏗️ Провести открытый тендер на площадку — пусть хоть здесь будет конкурс'
WHERE event_id = 'wife_dog_park' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙅 Отказать: «Собака — большая ответственность. У тебя уже есть мэр»'
WHERE event_id = 'wife_dog_park' AND choice_index = 2 AND lang = 'ru';

-- cat_exhibition
UPDATE game_event_locales
SET description = 'Жена познакомилась с клубом любителей кошек и просит устроить городскую выставку. У неё появилось увлечение. У города — статья расходов.'
WHERE event_id = 'cat_exhibition' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🐈 Отдать организацию другу-промоутеру за откат — пусть не одни коты уйдут довольными'
WHERE event_id = 'cat_exhibition' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📋 Выделить бюджет и провести открытый конкурс — родословную учитывать только у кошек'
WHERE event_id = 'cat_exhibition' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤧 Отказать из-за аллергии на шерсть — для убедительности чихнуть'
WHERE event_id = 'cat_exhibition' AND choice_index = 2 AND lang = 'ru';

-- lgbt_parade
UPDATE game_event_locales
SET description = 'Организаторы просят провести Парад Гордости на улице Вайцман. Парад ещё надо согласовать. Скандал уже идёт без разрешения.'
WHERE event_id = 'lgbt_parade' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏳️‍🌈 Разрешить на Вайцман — поддержать свободу. За ваши деньги — любой каприз.'
WHERE event_id = 'lgbt_parade' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎪 Выделить закрытую площадку в промзоне — мы всех уважаем, просто некоторых подальше'
WHERE event_id = 'lgbt_parade' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Запретить: «Я стрейт! Всех раком поставлю!»'
WHERE event_id = 'lgbt_parade' AND choice_index = 2 AND lang = 'ru';

-- lgbt_coalition_crisis
UPDATE game_event_locales
SET description = 'Религиозные партнёры по коалиции тоже «гордые». Требуют немедленно закрыть городской ЛГБТ-клуб. Сказали, что в гробу видели такую коалицию. Но выходить пока не собираются.'
WHERE event_id = 'lgbt_coalition_crisis' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🔒 Закрыть клуб — убеждения у меня твёрдые, коалиция хрупкая'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚚 Перенести клуб в промзону за счёт бюджета — подальше от греха, поближе к складам'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏢 Открыть второй клуб в центре религиозного района — раз одного вам мало'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 2 AND lang = 'ru';

-- mayors_strip_club
UPDATE game_event_locales
SET description = 'После ежегодного съезда мэров вы с коллегами пошли в стрип-клуб. Пресса узнала. О самом съезде столько не писали.'
WHERE event_id = 'mayors_strip_club' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Уйти в несознанку: «Это монтаж! Я в жизни так не отдыхал!»'
WHERE event_id = 'mayors_strip_club' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚖️ Нанять дорогого адвоката — пусть объяснит журналистам, чего они не видели'
WHERE event_id = 'mayors_strip_club' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📸 Слить прессе фото других мэров — почему мой город должен стыдиться один?'
WHERE event_id = 'mayors_strip_club' AND choice_index = 2 AND lang = 'ru';

-- mayors_revenge
UPDATE game_event_locales
SET description = 'Мэры соседних городов узнали, кто слил фотографии из стрип-клуба. Межмуниципальное сотрудничество наконец заработало. Против вас.'
WHERE event_id = 'mayors_revenge' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💸 Выплатить компенсацию в их межмуниципальный фонд — честь и достоинство принимают безналом'
WHERE event_id = 'mayors_revenge' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛡️ Игнорировать угрозы и заблокировать общие проекты — города не сошлись характерами'
WHERE event_id = 'mayors_revenge' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎉 Устроить закрытую вечеринку с шикарным фуршетом — нам есть что вспомнить и что забыть'
WHERE event_id = 'mayors_revenge' AND choice_index = 2 AND lang = 'ru';

-- son_wedding
UPDATE game_event_locales
SET description = 'Сын женится. Наконец-то можно собрать нужных людей и назвать это личной жизнью.'
WHERE event_id = 'son_wedding' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏰 Устроить пышную свадьбу с нужными людьми — счастья молодым, конверты папе'
WHERE event_id = 'son_wedding' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🕊️ Пусть дети организуют всё сами — посмотрим, есть ли жизнь без мэрии'
WHERE event_id = 'son_wedding' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥂 Скромно, только с близкими родственниками и за свой счёт — даже рассказывать неудобно'
WHERE event_id = 'son_wedding' AND choice_index = 2 AND lang = 'ru';

-- wedding_investigation
UPDATE game_event_locales
SET description = 'Журналисты заинтересовались конвертами со свадьбы сына. Вы говорите — подарки. Они спрашивают — за какие услуги. Никакого уважения к семейным ценностям.'
WHERE event_id = 'wedding_investigation' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Нанять решалу — у редакции тоже должны быть какие-нибудь семейные ценности'
WHERE event_id = 'wedding_investigation' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🔥 Поджечь редакцию газеты — пусть пишут по горячим следам'
WHERE event_id = 'wedding_investigation' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Объявить всё наветами и не отвечать — на свадьбу не позвали, вот и обиделись'
WHERE event_id = 'wedding_investigation' AND choice_index = 2 AND lang = 'ru';

-- father_funeral
UPDATE game_event_locales
SET description = 'Умер ваш отец. Вы принимаете соболезнования. Люди идут с тяжёлым сердцем. Некоторые — ещё и с деловым предложением.'
WHERE event_id = 'father_funeral' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🕯️ Принимать важных людей и решать вопросы — у полиции хватит такта не мешать'
WHERE event_id = 'father_funeral' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👥 Принять коллег и родных без деловых разговоров — хотя бы сегодня без повестки дня'
WHERE event_id = 'father_funeral' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🔒 Не афишировать траур, пустить только близких — тех, кто знал отца, а не должность сына'
WHERE event_id = 'father_funeral' AND choice_index = 2 AND lang = 'ru';

-- father_monument_offer
UPDATE game_event_locales
SET description = 'Застройщики, приходившие с соболезнованиями, предлагают оплатить роскошный памятник. Памятник будет отцу. Благодарить предстоит вам.'
WHERE event_id = 'father_monument_offer' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🪦 Принять и поставить самый большой памятник — пусть все видят, чей сын добился успеха'
WHERE event_id = 'father_monument_offer' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📐 Принять помощь, но поставить скромный памятник — я же не прошу ничего особенного'
WHERE event_id = 'father_monument_offer' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Отказаться и заплатить самому — пусть хоть здесь я никому не буду должен'
WHERE event_id = 'father_monument_offer' AND choice_index = 2 AND lang = 'ru';

-- daughter_school
UPDATE game_event_locales
SET description = 'В школах формируют классы. Дочке нужны хорошие одноклассники. Вам — их родители.'
WHERE event_id = 'daughter_school' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏫 Устроить к детям нужных людей — родительское собрание тоже деловая встреча'
WHERE event_id = 'daughter_school' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎒 Отдать в обычный класс — равенство у нас не только для чужих детей'
WHERE event_id = 'daughter_school' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎓 Отправить в закрытую частную школу — я-то знаю, кто отвечает за городские'
WHERE event_id = 'daughter_school' AND choice_index = 2 AND lang = 'ru';

-- school_flood
UPDATE game_event_locales
SET description = 'В школе дочери прорвало старые трубы. Классы затоплены. Вода, видимо, не в курсе, чьи здесь дети.'
WHERE event_id = 'school_flood' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Поручить ремонт нужным родителям — быстро починят и про мэра не забудут'
WHERE event_id = 'school_flood' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏗️ Провести муниципальный ремонт через тендер — школа закрыта на месяц, порядок спешки не терпит'
WHERE event_id = 'school_flood' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛠️ Немедленно починить за свои деньги — впервые точно знаю, сколько стоит ремонт'
WHERE event_id = 'school_flood' AND choice_index = 2 AND lang = 'ru';

-- apartment_renovation
UPDATE game_event_locales
SET description = 'Жена хочет ремонт. Квартира её больше не устраивает. Пока только квартира.'
WHERE event_id = 'apartment_renovation' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛠️ Обратиться к знакомому подрядчику — пусть хоть здесь сделает как для себя'
WHERE event_id = 'apartment_renovation' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💸 Дать денег: «Ни в чём себе не отказывай». Сам я уже отказать не смог'
WHERE event_id = 'apartment_renovation' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Развести руками: «Денег нет». Главное — не показывать, где'
WHERE event_id = 'apartment_renovation' AND choice_index = 2 AND lang = 'ru';

-- renovation_leak
UPDATE game_event_locales
SET description = 'Блогер выложил фото элитного ремонта, который городской подрядчик сделал вам бесплатно. Теперь весь город знает: если надо, он умеет.'
WHERE event_id = 'renovation_leak' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💰 Заплатить за удаление поста — последняя отделочная работа'
WHERE event_id = 'renovation_leak' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 «Это не моя квартира! Я свою до ремонта помню»'
WHERE event_id = 'renovation_leak' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚖️ Подать в суд за клевету — нечего правду без разрешения писать'
WHERE event_id = 'renovation_leak' AND choice_index = 2 AND lang = 'ru';

-- wife_real_estate
UPDATE game_event_locales
SET description = 'Жена насмотрелась инстаграма и хочет «домик в Италии». Вся скромность просьбы уместилась в слове «домик».'
WHERE event_id = 'wife_real_estate' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏡 Купить роскошный дом на Комо — скромнее там уже неприлично'
WHERE event_id = 'wife_real_estate' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏢 Купить двушку на Солнечном берегу в Болгарии — тоже заграница, просто мечтать надо точнее'
WHERE event_id = 'wife_real_estate' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏚️ Купить квартиру в Тверии — озеро есть. Итальянцев можно не приглашать'
WHERE event_id = 'wife_real_estate' AND choice_index = 2 AND lang = 'ru';

-- tiberias_mockery
UPDATE game_event_locales
SET description = 'Блогер высмеял вашу старую квартиру в Тверии. Соседние мэры и полиция хохочут. На такой должности — и такая жилплощадь.'
WHERE event_id = 'tiberias_mockery' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥊 Нанять через знакомого шпану и побить блогера — на хороших людей деньги ещё есть'
WHERE event_id = 'tiberias_mockery' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '😤 Сжать зубы и стерпеть — зато квартира своя, а мнение чужое'
WHERE event_id = 'tiberias_mockery' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📢 Начать информационную войну — у каждого найдётся что-нибудь похуже моей квартиры'
WHERE event_id = 'tiberias_mockery' AND choice_index = 2 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📰 Заказать хвалебную статью — скромность украшает, если правильно оплатить'
WHERE event_id = 'tiberias_mockery' AND choice_index = 3 AND lang = 'ru';
