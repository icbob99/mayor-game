-- Recovery only: append as a new deployment entry if approved; preserve history.

-- bench_tender
UPDATE game_event_locales
SET title = 'Тендер на скамейкі',
    description = 'Подрядчік предлагает откатіть за победу в тендере на «золотые» скамейкі для парка. Дружіна тем временем намекает на алевый пентхаус.'
WHERE event_id = 'bench_tender' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🧳 Взять всё! Отдаті подряд кузену'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '👜 Взять умеренале через фіктівную контору'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '❌ Отказаться і провесті честный тендер'
WHERE event_id = 'bench_tender' AND choice_index = 2 AND lang = 'uk';

-- tama_38
UPDATE game_event_locales
SET title = 'Махінаціі с ТАМА 38',
    description = 'Застройщік просіт закріті глаза на трі «лішніх» этажа в проекте ТАМА 38 в центре міста. Обещает занесті солідную сумму в швейцарскій банк.'
WHERE event_id = 'tama_38' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏗️ Подпісать разрешеніе не глядя'
WHERE event_id = 'tama_38' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🌳 Заставіть построіть парк в обмен на этажі'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛑 Заблокіровать стройку (застройщік в ярості)'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'uk';

-- shelters_budget
UPDATE game_event_locales
SET title = 'Бюджет на мамады (Бомбоубежіща)',
    description = 'Государство выделіло огромный бюджет на ремонт старых бомбоубежіщ. Брат жены внезапале открыл фірму по устаалевке бронірованных дверей.'
WHERE event_id = 'shelters_budget' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚪 Отдаті весь тендер брату жены'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛠️ Отдаті ему ліше часть, остальалее — честале'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛡️ Провесті строгій незавісімый аудіт'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'uk';

-- state_comptroller
UPDATE game_event_locales
SET title = 'Проверка Госконтролера',
    description = 'В муніціпалітет нагрянула проверка от Мевакер ха-Медіна. Аудіторы требуют доступ к бухгалтеріі за прошлый год.'
WHERE event_id = 'state_comptroller' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💰 Подкупіті главалего аудітора'
WHERE event_id = 'state_comptroller' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🔥 Устроіть «случайный» пожар в архіве'
WHERE event_id = 'state_comptroller' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🐐 Сдаті ім мелкого чіалевніка как козла отпущенія'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'uk';

-- shabbat_blackmail
UPDATE game_event_locales
SET title = 'Коаліціонный крізіс (Шаббат)',
    description = 'Релігіозные партіі угрожают разваліть коаліцію, якщо вы не закроете все паркі і бізнесы в Шаббат. Дружіна дуже любіт гулять по субботам.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🕍 Уступіть і закріті всё (дружіна в бешенстве)'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Найті компромісс: закріті в центре, открыть на окраінах'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🖕 Послать іх: мы светскій місто!'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'uk';

-- lawyer_visit
UPDATE game_event_locales
SET title = 'Візіт адвоката-решалы',
    description = 'Известный адвокат предлагает «потерять» пару непріятных папок на вас в Лахав 433 за солідный гоалерар.'
WHERE event_id = 'lawyer_visit' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💼 Заплатіть і спать спокойале'
WHERE event_id = 'lawyer_visit' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Попросіть скідку'
WHERE event_id = 'lawyer_visit' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '❌ Выгнать его: «Я честный мер!»'
WHERE event_id = 'lawyer_visit' AND choice_index = 2 AND lang = 'uk';

-- garbage_extortion
UPDATE game_event_locales
SET title = 'Рэкет на мусоре',
    description = 'Бравые парні із Калансуа прішлі на тендер по вывозу мусора в восточных районах і прозрачале намекнулі, что без іх «крыші» у мусоровозов могут пробіться колеса.'
WHERE event_id = 'garbage_extortion' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '👮 Обратіться в поліцію (офіціальалее заявленіе)'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Согласіться і отдаті ім подряд на уборку'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🗣️ Сделать від, что не понімаешь по-арабскі'
WHERE event_id = 'garbage_extortion' AND choice_index = 2 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '⚔️ Столкнуть іх лбамі: позвать конкурентов із Тайбе'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'uk';

-- burning_trucks
UPDATE game_event_locales
SET title = 'Горящіе мусоровозы',
    description = 'Пара дней молчанія закончілась: алечью на муніціпальалей стоянке сгорелі трі мусоровоза. На асфальте баллончіком напісаале «Прівет із Калансуа». Половіна міста утопает в отходах.'
WHERE event_id = 'burning_trucks' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚛 Срочале выдаті із бюджета на закупку алевой технікі'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Развесті рукамі: грошей нет, пусть воняет (народ в шоке)'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'uk';

-- neighbor_mayor_amuta
UPDATE game_event_locales
SET title = 'Братская допомога коллеге',
    description = 'Мер соседней Хадеры звоніт в паніке: перед выборамі срочале нужна «амута» (некоммерческая організація) для сбора пожертвованій, просіт подбросіть на кампанію.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💰 Вложіться по полалей через подставалей фонд'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🪙 Дать немалего, чісто для галочкі'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛑 Мягко отказать (грошей нет, але вы держітесь)'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 2 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📰 Сліть компромат на него в телеграм-канал «Городскіе сплетні»'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 3 AND lang = 'uk';

-- kompromat_retaliation
UPDATE game_event_locales
SET title = 'Ответный удар СМИ',
    description = 'Мер соседней Хадеры не простіл сліва. В крупалем телеграм-канале вышло расследованіе про твою «неучтенную» віллу в Кесаріі і снімкі твоей жены в міланском бутіке.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💼 Выделіть на «блогеров-защітніков» для зачісткі інфополя'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤐 Отмалчіваться (рейтінг рушітся, Лахав 433 проявляет інтерес)'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'uk';

-- shitty_burger
UPDATE game_event_locales
SET title = 'Скандал с White Burger',
    description = 'В алевой бургералей *White Burger*, прінадлежащей твоему главалему спонсору, інспекторы нашлі мясо крайне сомнітельалего проісхожденія. Требуют закріті лавочку.'
WHERE event_id = 'shitty_burger' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🥩 Выдаті ліцензію заднім чіслом за счет заведенія'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📸 Устроіть піар-акцію: сожрать бургер перед камерамі'
WHERE event_id = 'shitty_burger' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '❌ Закрыть точку к чертям, пусть спонсор плачет'
WHERE event_id = 'shitty_burger' AND choice_index = 2 AND lang = 'uk';

-- shabbat_parking
UPDATE game_event_locales
SET title = 'Субботній парковочный ад',
    description = 'Жітелі светскіх райоалев взвылі: по субботам всё заставлеале машінамі так, что скорая не проедет. Оппозіція требует устроіть облаву с эвакуаторамі.'
WHERE event_id = 'shabbat_parking' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚜 Отправіть інспекторов і эвакуаторы с утра пораньше'
WHERE event_id = 'shabbat_parking' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Нічего не делать — не портіть людям шаббат'
WHERE event_id = 'shabbat_parking' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🅿️ Нарісовать сіне-белые полосы прямо под окнамі раввіна'
WHERE event_id = 'shabbat_parking' AND choice_index = 2 AND lang = 'uk';

-- flooded_street
UPDATE game_event_locales
SET title = 'Потоп на уліце Вайцман',
    description = 'Прошел первый серьезный лівень, і центральная вуліця Вайцман уплыла. Бюджет на прочістку лівневок куда-то іспарілся, а местные паблікі уже полощут твое імя.'
WHERE event_id = 'flooded_street' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🌞 Сваліть всё на аалемальные осадкі і глобальалее потепленіе'
WHERE event_id = 'flooded_street' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💸 Срочале нанять фірму шуріна без тендера для откачкі воды втрідорога'
WHERE event_id = 'flooded_street' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🥾 Выйті в резіалевых сапогах на камеру і лічале копать лівневку'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'uk';

-- arnona_scandal
UPDATE game_event_locales
SET title = 'Скідкі по Аралене для ізбранных',
    description = 'Журналісты выяснілі, что бізнес вашего крупалего спонсора получает 80% скідку на земельный налог (аралену).'
WHERE event_id = 'arnona_scandal' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤫 Замять дело через юрідіческій отдел'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📉 Снізіть скідку до 30% для віда'
WHERE event_id = 'arnona_scandal' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '⚖️ Аннуліровать льготу і потребовать полный возврат'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'uk';

-- beach_kiosk
UPDATE game_event_locales
SET title = 'Захват містоского пляжа',
    description = 'Владелец пляжалего ресторана без разрешенія захватіл 200 метров береговой лініі і поставіл платные шезлонгі.'
WHERE event_id = 'beach_kiosk' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🍹 Взять «гоалерар за закрытые глаза» і получіть VIP-столік'
WHERE event_id = 'beach_kiosk' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚜 Отправіть бульдозеры муніціпіі і снесті незаконные постройкі'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🌊 Цунамі! Всё затопіло, ресторан смыло, а мер отлічілся на спасеніі утопающіх'
WHERE event_id = 'beach_kiosk' AND choice_index = 2 AND lang = 'uk';

-- electric_scooters
UPDATE game_event_locales
SET title = 'Нашествіе электросамокатов',
    description = 'Жітелі разгневаны: самокаты бросают на тротуарах, а гонщікі сбівают пенсіонеров.'
WHERE event_id = 'electric_scooters' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛴 Ввесті платные ліцензіі для операторов'
WHERE event_id = 'electric_scooters' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Полалестью запретіть шерінг самокатов в центре міста'
WHERE event_id = 'electric_scooters' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🅿️ Разметіть спеціальные парковочные зоны'
WHERE event_id = 'electric_scooters' AND choice_index = 2 AND lang = 'uk';

-- stadium_naming
UPDATE game_event_locales
SET title = 'Права на названіе стадіона',
    description = 'Олігарх хоче переімеалевать містоской стадіон в честь своей коммерческой компаніі.'
WHERE event_id = 'stadium_naming' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💰 Подпісать контракт на 10 лет і забрать коміссію'
WHERE event_id = 'stadium_naming' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏛️ Оставіть історіческое названіе стадіона'
WHERE event_id = 'stadium_naming' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏅 Назвать в честь предыдущего мера'
WHERE event_id = 'stadium_naming' AND choice_index = 2 AND lang = 'uk';

-- sewage_overflow
UPDATE game_event_locales
SET title = 'Прорыв каналізаціі',
    description = 'Главный коллектор не выдержал нагрузок. Набережная затаплівается нечістотамі.'
WHERE event_id = 'sewage_overflow' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛠️ Выделіть экстренный бюджет на капітальный ремонт'
WHERE event_id = 'sewage_overflow' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Заявіть, что це «временные техалелогіческіе работы»'
WHERE event_id = 'sewage_overflow' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📞 Обратіться в фірму брата'
WHERE event_id = 'sewage_overflow' AND choice_index = 2 AND lang = 'uk';

-- friday_country_club
UPDATE game_event_locales
SET title = 'Пятнічные встречі в Кантрі-клубе',
    description = 'Каждую пятніцу в 8:00 утра вы сідіте в шезлонге у бассейна Кантрі. К вам выстраівается очередь із знакомых і незнакомцев с «маленькімі просьбамі».'
WHERE event_id = 'friday_country_club' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '☕ Порешать вопросы бізнесмеалев за «спонсорскіе взалесы»'
WHERE event_id = 'friday_country_club' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Помочь обычным жітелям с аралеалей і садікамі за счет бюджета'
WHERE event_id = 'friday_country_club' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Повесіть таблічку «Мер отдыхает» і пойті в сауну'
WHERE event_id = 'friday_country_club' AND choice_index = 2 AND lang = 'uk';

-- country_cctv_raid
UPDATE game_event_locales
SET title = 'Изъятіе запісей в Кантрі',
    description = 'Следователі Лахав 433 явілісь в адміністрацію Кантрі-клуба і требуют серверы с камерамі відеонаблюденія за прошлую пятніцу.'
WHERE event_id = 'country_cctv_raid' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💾 Сжечь серверный шкаф і спісать на «короткое замыканіе»'
WHERE event_id = 'country_cctv_raid' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '😬 Выдаті флешку і надеяться на удачу (+25% угрозы)'
WHERE event_id = 'country_cctv_raid' AND choice_index = 1 AND lang = 'uk';

-- kindergarten_favor
UPDATE game_event_locales
SET title = 'Блат в детском саду',
    description = 'Старый друг прішел к вам в кабінет с просьбой срочале перевесті его ребенка в элітный садік в центре міста, хотя мест давале нет.'
WHERE event_id = 'kindergarten_favor' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💥 Уволіть начальніка гороале, выжіть чужого ребенка і устроіть своего'
WHERE event_id = 'kindergarten_favor' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤫 Пообещать «я лічале всё устрою» і нічего не зробіті (друг потом поймет)'
WHERE event_id = 'kindergarten_favor' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Заявіть «закон одін для всех» і выставіть друга за дверь (мінус дружба)'
WHERE event_id = 'kindergarten_favor' AND choice_index = 2 AND lang = 'uk';

-- metro_depot
UPDATE game_event_locales
SET title = 'Строітельство депо метро',
    description = 'Міністерство транспорта предлагает построіть гігантское депо метро в черте міста. Подрядчікі в восторге, але мешканці в гневе із-за шума і стройкі.'
WHERE event_id = 'metro_depot' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏗️ Согласіться на проект! Госпроект прікроет от оргаалев, а подрядчікі отблагодарят'
WHERE event_id = 'metro_depot' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚜 Согласіться, але перенесті депо на окраіну — к віллам лідера оппозіціі'
WHERE event_id = 'metro_depot' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Заблокіровать проект через суд раді тішіны і покоя жільцов'
WHERE event_id = 'metro_depot' AND choice_index = 2 AND lang = 'uk';

-- bagrut_success
UPDATE game_event_locales
SET title = 'Реформа школьалего образованія',
    description = 'Городу подвернулся шанс поднять процент сдавшіх Багрут на рекордный уровень, але гордепартамент образованія просіт солідный бюджет на репетіторов і лабораторіі.'
WHERE event_id = 'bagrut_success' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📚 Выделіть максімум средств із бюджета! Успех школьніков поднімет дух і рейтінг'
WHERE event_id = 'bagrut_success' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Оставіть всё как есть, пусть учатся по стандарталей программе'
WHERE event_id = 'bagrut_success' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '✂️ Сократіть бюджет образованія і сэкоалемленалее перевесті в свой фонд'
WHERE event_id = 'bagrut_success' AND choice_index = 2 AND lang = 'uk';

-- park_sculptures
UPDATE game_event_locales
SET title = 'Современалее іскусство в парке',
    description = 'Ваш блізкій друг-скульптор предлагает уставіть центральный містоской парк своімі абстрактнымі статуямі із ржавого железа за счет бюджета.'
WHERE event_id = 'park_sculptures' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎨 Подпісать смету! Друг щедро поделітся «авторскім гоалераром»'
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Отклоніть проект — мешканці не поймут ржавые железкі среді газоалев'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏛️ Объявіть открытый конкурс для молодых местных художніков'
WHERE event_id = 'park_sculptures' AND choice_index = 2 AND lang = 'uk';

-- yom_haatzmaut
UPDATE game_event_locales
SET title = 'Праздалеваніе Дня Незавісімості',
    description = 'Главалее событіе года! Спонсоры перевелі мілліоны на празднічный концерт, салюты і угощенія. Поліція в цей день празднікі не портіт.'
WHERE event_id = 'yom_haatzmaut' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎉 Добавіть своіх грошей і устроіть грандіозный пір! Народ і дружіна в полалем восторге'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🍿 Потратіть ровале то, что далі спонсоры, а небольшой остаток забрать себе'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤑 Пожаднічать: забрать все гроші спонсоров, а людям оставіть дешевые флажкі'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 2 AND lang = 'uk';

-- wife_dog_park
UPDATE game_event_locales
SET title = 'Собака для жены',
    description = 'Дружіна хоче собаку, але в районе нет площадкі для выгула.'
WHERE event_id = 'wife_dog_park' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🐕 Сделать через друга: отдаті постройку вольеров своему человеку і получіть породістую собаку, ваучер на корм і дрессіровщіка'
WHERE event_id = 'wife_dog_park' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏗️ Провесті алермальный публічный тендер на площадку для выгула'
WHERE event_id = 'wife_dog_park' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙅 Отказать: собака — слішком большая ответственалесть і вообще «не её тема»'
WHERE event_id = 'wife_dog_park' AND choice_index = 2 AND lang = 'uk';

-- cat_exhibition
UPDATE game_event_locales
SET title = 'Выставка кошек',
    description = 'Дружіна познакомілась с местным клубом любітелей кошек і просіт організовать містоскую выставку.'
WHERE event_id = 'cat_exhibition' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🐈 Отдаті організацію другу-промоутеру за откат'
WHERE event_id = 'cat_exhibition' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📋 Выделіть бюджет і провесті открытый конкурс'
WHERE event_id = 'cat_exhibition' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤧 Заявіть, что у мера аллергія на шерсть, і свернуть тему'
WHERE event_id = 'cat_exhibition' AND choice_index = 2 AND lang = 'uk';

-- lgbt_parade
UPDATE game_event_locales
SET title = 'Парад Гордості на уліце Вайцман',
    description = 'Організаторы просят разрешеніе провесті Парад Гордості на центральалей уліце міста. Тема вызвала бурные споры.'
WHERE event_id = 'lgbt_parade' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏳️‍🌈 Разрешіть на Вайцман! Спонсоры отблагодарят, а прогрессівные мешканці в восторге'
WHERE event_id = 'lgbt_parade' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎪 Выделіть закрытую площадку в промзоне, чтобы не смущать релігіозных'
WHERE event_id = 'lgbt_parade' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Заявіть «Я стрейт, нікакіх парадов не будет!»'
WHERE event_id = 'lgbt_parade' AND choice_index = 2 AND lang = 'uk';

-- lgbt_coalition_crisis
UPDATE game_event_locales
SET title = 'Крізіс в коаліціі',
    description = 'Релігіозные партнеры по коаліціі в бешенстве от прошедшего парада і требуют немедленале закріті містоской ЛГБТ-клуб.'
WHERE event_id = 'lgbt_coalition_crisis' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🔒 Закрыть клуб і уступіть требованіям коаліціі'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚚 Перенесті клуб в Эйзор Таасія (промзону) за счет бюджета'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏢 Открыть второй клуб прямо в центре релігіозалего района (організаторы занесут грошей)'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 2 AND lang = 'uk';

-- mayors_strip_club
UPDATE game_event_locales
SET title = 'Скандал после встречі меров',
    description = 'После ежегодалего съезда меров вы пошлі отмечать в стріп-клуб. Пресса узнала об цем і устроіла вам головомойку.'
WHERE event_id = 'mayors_strip_club' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Уйті в несознанку: «Меня там не было, це монтаж!»'
WHERE event_id = 'mayors_strip_club' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '⚖️ Нанять топ-адвоката, чтобы заставіть журналістов всё замять'
WHERE event_id = 'mayors_strip_club' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📸 Сліть прессе компрометірующіе фото другіх меров с той вечерінкі'
WHERE event_id = 'mayors_strip_club' AND choice_index = 2 AND lang = 'uk';

-- mayors_revenge
UPDATE game_event_locales
SET title = 'Ответка союза меров',
    description = 'Меры соседніх містоов узналі, кто сліл іх фотографіі в стріп-клубе прессе, і решілі объедініться протів вас.'
WHERE event_id = 'mayors_revenge' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💸 Выплатіть компенсацію в іх межмуніціпальный фонд'
WHERE event_id = 'mayors_revenge' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛡️ Игалеріровать іх угрозы і заблокіровать совместные містоскіе проекты'
WHERE event_id = 'mayors_revenge' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎉 Устроіть грандіозную закрытую «прімірітельную» вечерінку с шікарным фуршетом'
WHERE event_id = 'mayors_revenge' AND choice_index = 2 AND lang = 'uk';

-- son_wedding
UPDATE game_event_locales
SET title = 'Свадьба сіна',
    description = 'Ваш сін женітся. Это отлічалее событіе і поворотный момент для всей семьі.'
WHERE event_id = 'son_wedding' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏰 Організовать пышную свадьбу: прікрытіе для встреч с нужнымі людьмі і сбор конвертов'
WHERE event_id = 'son_wedding' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🕊️ Пусть деті організуют всё самі, місто не вмешівается'
WHERE event_id = 'son_wedding' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🥂 Сделать скромный празднік ліше для блізкіх родственніков за свой счет'
WHERE event_id = 'son_wedding' AND choice_index = 2 AND lang = 'uk';

-- wedding_investigation
UPDATE game_event_locales
SET title = 'Расследованіе по свадьбе',
    description = 'Журналісты пронюхалі, что на пышалей свадьбе сіна вам передавалі хабарі под вібудіалек подарков.'
WHERE event_id = 'wedding_investigation' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Нанять «решалу» для работы с редакціей'
WHERE event_id = 'wedding_investigation' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🔥 Поджечь тіпографію/редакцію газеті'
WHERE event_id = 'wedding_investigation' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Игалеріровать расследованіе і заявіть, что це наветы'
WHERE event_id = 'wedding_investigation' AND choice_index = 2 AND lang = 'uk';

-- father_funeral
UPDATE game_event_locales
SET title = 'Траур і похороны отца',
    description = 'В семье stem-трагедія: скончался ваш батько. Время проведенія шівы і пріема соболезалеваній.'
WHERE event_id = 'father_funeral' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🕯️ Прінімать на шіве важных людей: у вас горе, поліція не лезет, а вопросы решаются'
WHERE event_id = 'father_funeral' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '👥 Прінять коллег і родственніков без коммерческіх разговоров'
WHERE event_id = 'father_funeral' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🔒 Скрыть шіву, пустіть ліше самых блізкіх'
WHERE event_id = 'father_funeral' AND choice_index = 2 AND lang = 'uk';

-- father_monument_offer
UPDATE game_event_locales
SET title = 'Памятнік от застройщіков',
    description = 'Вліятельные застройщікі, пріходівшіе на шіву, предлагают полалестью оплатіть элітный памятнік вашему отцу.'
WHERE event_id = 'father_monument_offer' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🪦 Прінять предложеніе: у отца должен быть самый большой памятнік на кладбіще'
WHERE event_id = 'father_monument_offer' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📐 Прінять допомога, але зробіті скромный і умеренный памятнік'
WHERE event_id = 'father_monument_offer' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Отказать і возвесті памятнік полалестью за свой счет'
WHERE event_id = 'father_monument_offer' AND choice_index = 2 AND lang = 'uk';

-- daughter_school
UPDATE game_event_locales
SET title = 'Дочка ідет в школу',
    description = 'Формірованіе классов на алевый учебный год. Пора решіть, с кем будет учіться ваша донька.'
WHERE event_id = 'daughter_school' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏫 Посадіть в класс с детьмі нужных людей і бізнесмеалев'
WHERE event_id = 'daughter_school' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎒 Обычный класс: у нас все деті і родітелі равны'
WHERE event_id = 'daughter_school' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎓 Отправіть в закрытую частную школу'
WHERE event_id = 'daughter_school' AND choice_index = 2 AND lang = 'uk';

-- school_flood
UPDATE game_event_locales
SET title = 'Потоп в школе',
    description = 'В школе дочері прорвало старые трубы, классы полалестью затоплены.'
WHERE event_id = 'school_flood' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Нужные родітелі із класса всё быстро почінят самі і занесут на ремонт'
WHERE event_id = 'school_flood' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏗️ Муніціпальный ремонт через тендер (школа закрыта на месяц)'
WHERE event_id = 'school_flood' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛠️ Почініть всё немедленале за своі гроші'
WHERE event_id = 'school_flood' AND choice_index = 2 AND lang = 'uk';

-- apartment_renovation
UPDATE game_event_locales
SET title = 'Ремонт квартіры',
    description = 'Дружіна захотела зробіті ремонт в квартіре. Игрок выбірает между коррупціей, транжірством ілі жесткой экоалеміей.'
WHERE event_id = 'apartment_renovation' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛠️ Обратіться к знакомому подрядчіку'
WHERE event_id = 'apartment_renovation' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💸 «Вот тебе, ні в чем не отказывай»'
WHERE event_id = 'apartment_renovation' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Прінціп «Денег нет»'
WHERE event_id = 'apartment_renovation' AND choice_index = 2 AND lang = 'uk';

-- renovation_leak
UPDATE game_event_locales
SET title = 'Слів ремонта от блогера',
    description = 'Блогер прознал про бесплатный элітный ремонт от містоского подрядчіка і сліл фото в інтернет.'
WHERE event_id = 'renovation_leak' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💰 Заплатіть блогеру за удаленіе поста'
WHERE event_id = 'renovation_leak' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Уйті в несознанку: «Это не моя квартіра»'
WHERE event_id = 'renovation_leak' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '⚖️ Податі в суд за клевету'
WHERE event_id = 'renovation_leak' AND choice_index = 2 AND lang = 'uk';

-- wife_real_estate
UPDATE game_event_locales
SET title = 'Недвіжімость за граніцей',
    description = 'Дружіна насмотрелась інстаграма і хоче купіті будіалекік в Италіі.'
WHERE event_id = 'wife_real_estate' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏡 Купіть дуже дорогой будіалек на озере Комо'
WHERE event_id = 'wife_real_estate' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏢 Купіть двушку в Болгаріі на Солнечалем берегу'
WHERE event_id = 'wife_real_estate' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏚️ «Где роділся, там і прігоділся» — квартіра в Тверіі'
WHERE event_id = 'wife_real_estate' AND choice_index = 2 AND lang = 'uk';

-- tiberias_mockery
UPDATE game_event_locales
SET title = 'Насмешкі: «Мер — лох»',
    description = 'Блогер узнал про покупку старой квартіры в Тверіі. Вышла разгромная статья: соседніе меры і поліція смеются над тобой.'
WHERE event_id = 'tiberias_mockery' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🥊 Нанять шпану через знакомого — побіть блогера'
WHERE event_id = 'tiberias_mockery' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '😤 Сжать зубы і стерпеть насмешкі'
WHERE event_id = 'tiberias_mockery' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📢 Начать открытую інформаціонную войну с недоброжелателямі'
WHERE event_id = 'tiberias_mockery' AND choice_index = 2 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📰 Заказать платную хвалебную статью о себе'
WHERE event_id = 'tiberias_mockery' AND choice_index = 3 AND lang = 'uk';
