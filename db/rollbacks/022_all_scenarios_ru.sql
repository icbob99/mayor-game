-- Recovery only: append as a new deployment entry if approved; never erase history.

-- bench_tender
UPDATE game_event_locales
SET description = 'Подрядчик обещает откат за победу в тендере на парковые скамейки. Судя по смете, сидеть горожане будут на золоте. Жена как раз намекает на новый пентхаус — удивительное совпадение.'
WHERE event_id = 'bench_tender' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🧳 Взять по полной! Отдать подряд кузену'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👜 Взять умеренный откат через фиктивную контору'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '❌ Отказаться и провести честный тендер'
WHERE event_id = 'bench_tender' AND choice_index = 2 AND lang = 'ru';

-- tama_38
UPDATE game_event_locales
SET title = 'Махинации с ТАМА 38',
    description = 'Застройщик просит закрыть глаза на три «лишних» этажа в проекте ТАМА 38 в центре города. Взамен обещает солидную сумму на ваш счёт в Швейцарии. Этажи лишние, деньги — нет.'
WHERE event_id = 'tama_38' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏗️ Подписать разрешение не глядя'
WHERE event_id = 'tama_38' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🌳 Обязать застройщика разбить парк в обмен на разрешение достроить этажи'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛑 Заблокировать стройку — пусть застройщик бесится'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'ru';

-- shelters_budget
UPDATE game_event_locales
SET description = 'Государство выделило огромную сумму на ремонт старых бомбоубежищ. Брат жены тут же открыл фирму по установке бронированных дверей. Безопасность города — дело семейное.'
WHERE event_id = 'shelters_budget' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚪 Отдать весь подряд брату жены'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛠️ Часть работ отдать ему, остальное распределить по честному конкурсу'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛡️ Провести честный открытый тендер'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'ru';

-- state_comptroller
UPDATE game_event_locales
SET description = 'В муниципалитет нагрянули аудиторы госконтролёра. Требуют бухгалтерские документы за прошлый год. Видимо, красивого отчёта о ваших успехах им недостаточно.'
WHERE event_id = 'state_comptroller' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💰 Подкупить главного аудитора'
WHERE event_id = 'state_comptroller' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🔥 Устроить «случайный» пожар в архиве'
WHERE event_id = 'state_comptroller' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🐐 Свалить всё на мелкого чиновника — вот и виноватый'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'ru';

-- shabbat_blackmail
UPDATE game_event_locales
SET description = 'Религиозные партии требуют закрыть на шаббат торговые центры, кинотеатры и кантри-клубы, а заодно перекрыть улицы и въезды в город для машин. Иначе грозят развалить коалицию. Жена уже запланировала бассейн и покупки. Выходные обещают быть тихими только на дорогах.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🕍 Уступить всем требованиям — народ не поймёт, а дома ждут тяжёлые выходные'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Договориться: ограничения в центре, на окраинах всё работает и проезд свободен'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🖕 Послать их: «У нас светский город!»'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'ru';

-- lawyer_visit
UPDATE game_event_locales
SET description = 'Известный адвокат предлагает за солидный гонорар устроить так, чтобы в Лахав 433 «потеряли» пару папок с материалами на вас. Обычно адвокаты изучают документы. Этот работает над тем, чтобы изучать было нечего.'
WHERE event_id = 'lawyer_visit' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💼 Заплатить и спать спокойно'
WHERE event_id = 'lawyer_visit' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Попросить скидку'
WHERE event_id = 'lawyer_visit' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '❌ Выгнать его: «Я честный мэр!»'
WHERE event_id = 'lawyer_visit' AND choice_index = 2 AND lang = 'ru';

-- garbage_extortion
UPDATE game_event_locales
SET description = 'В мэрию пришли бравые парни из Калансуа. Намекнули: хотим мусор вывозить. Такое вот предложение — с гарантией неприятностей при отказе.'
WHERE event_id = 'garbage_extortion' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👮 Подать официальное заявление в полицию'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Согласиться и отдать им подряд на вывоз мусора'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🗣️ Сделать вид, что не понимаешь по-арабски'
WHERE event_id = 'garbage_extortion' AND choice_index = 2 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚔️ Позвать конкурентов из Тайбе'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'ru';

-- burning_trucks
UPDATE game_event_locales
SET description = 'Ночью на муниципальной стоянке сгорели три мусоровоза. Мусор некому вывозить, жители жалуются.'
WHERE event_id = 'burning_trucks' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚛 Выделить деньги из бюджета на новые мусоровозы'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Развести руками: денег нет'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'ru';

-- neighbor_mayor_amuta
UPDATE game_event_locales
SET description = 'Звонит мэр соседнего города и просит помочь ему переизбраться.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💰 Вложиться по полной через подставной фонд'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🪙 Дать немного, чисто для галочки'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📰 Слить компромат на него в телеграм-канал «Городские сплетни»'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 3 AND lang = 'ru';

-- kompromat_retaliation
UPDATE game_event_locales
SET description = 'Мэр соседнего города не простил слива. В крупном телеграм-канале вышло расследование про вашу «неучтённую» виллу в Кесарии и снимки жены в миланском бутике.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💼 Заплатить блогерам — пусть объяснят, что вы просто хорошо экономили'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤐 Отмалчиваться'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'ru';

-- shitty_burger
UPDATE game_event_locales
SET description = 'В бургерной вашего главного спонсора White Burger инспекторы нашли мясо, происхождением которого лучше не интересоваться. Требуют закрыть лавочку.'
WHERE event_id = 'shitty_burger' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥩 Выдать лицензию задним числом'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📸 Устроить пиар-акцию: сожрать бургер перед камерами'
WHERE event_id = 'shitty_burger' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '❌ Закрыть точку к чертям, пусть спонсор плачет'
WHERE event_id = 'shitty_burger' AND choice_index = 2 AND lang = 'ru';

-- shabbat_parking
UPDATE game_event_locales
SET description = 'Жители светских районов взвыли: по субботам машины бросают так, что даже скорая не проедет. Оппозиция требует устроить облаву с эвакуаторами в субботу.'
WHERE event_id = 'shabbat_parking' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚜 Отправить инспекторов и эвакуаторы с утра пораньше'
WHERE event_id = 'shabbat_parking' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Ничего не делать — не портить людям шаббат'
WHERE event_id = 'shabbat_parking' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🅿️ Нарисовать сине-белые полосы прямо под окнами раввина'
WHERE event_id = 'shabbat_parking' AND choice_index = 2 AND lang = 'ru';

-- flooded_street
UPDATE game_event_locales
SET description = 'Прошёл первый серьёзный ливень, и центральная улица Вайцман уплыла. Деньги на прочистку ливнёвок испарились ещё до дождя, а местные паблики уже полощут ваше имя.'
WHERE event_id = 'flooded_street' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🌞 Свалить всё на аномальные осадки и глобальное потепление'
WHERE event_id = 'flooded_street' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥾 Надеть резиновые сапоги и лично прочищать ливнёвку перед камерами'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'ru';

-- arnona_scandal
UPDATE game_event_locales
SET description = 'Журналисты выяснили: бизнес вашего крупного спонсора получил скидку 80% на муниципальный налог. Видимо, за скромность.'
WHERE event_id = 'arnona_scandal' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤫 Замять дело — юристы найдут нужную формулировку'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📉 Снизить скидку до 30% для вида'
WHERE event_id = 'arnona_scandal' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚖️ Отменить льготу и взыскать недоплаченное'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'ru';

-- beach_kiosk
UPDATE game_event_locales
SET description = 'Владелец пляжного ресторана без разрешения захватил 200 метров береговой линии и поставил платные шезлонги.'
WHERE event_id = 'beach_kiosk' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🍹 Взять «гонорар за закрытые глаза» и получить VIP-столик'
WHERE event_id = 'beach_kiosk' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚜 Отправить бульдозеры мэрии и снести незаконные постройки'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'ru';

-- electric_scooters
UPDATE game_event_locales
SET description = 'Жители разгневаны: самокаты бросают на тротуарах, а гонщики сбивают пенсионеров.'
WHERE event_id = 'electric_scooters' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛴 Ввести платные лицензии для операторов'
WHERE event_id = 'electric_scooters' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Полностью запретить шеринг самокатов в центре города'
WHERE event_id = 'electric_scooters' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🅿️ Разметить специальные парковочные зоны'
WHERE event_id = 'electric_scooters' AND choice_index = 2 AND lang = 'ru';

-- stadium_naming
UPDATE game_event_locales
SET description = 'Олигарх хочет переименовать городской стадион в честь своей коммерческой компании.'
WHERE event_id = 'stadium_naming' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏛️ Оставить историческое название стадиона'
WHERE event_id = 'stadium_naming' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏅 Назвать в честь предыдущего мэра'
WHERE event_id = 'stadium_naming' AND choice_index = 2 AND lang = 'ru';

-- sewage_overflow
UPDATE game_event_locales
SET description = 'Главный коллектор не выдержал нагрузок. Набережная затапливается нечистотами.'
WHERE event_id = 'sewage_overflow' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Заявить, что это «временные технологические работы»'
WHERE event_id = 'sewage_overflow' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📞 Обратиться в фирму брата'
WHERE event_id = 'sewage_overflow' AND choice_index = 2 AND lang = 'ru';

-- friday_country_club
UPDATE game_event_locales
SET description = 'Каждую пятницу в 8:00 утра вы сидите в шезлонге у бассейна Кантри. К вам выстраивается очередь из знакомых и незнакомцев с «маленькими просьбами».'
WHERE event_id = 'friday_country_club' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '☕ Порешать вопросы бизнесменов за «спонсорские взносы»'
WHERE event_id = 'friday_country_club' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Помочь обычным жителям с арноной и садиками за счет бюджета'
WHERE event_id = 'friday_country_club' AND choice_index = 1 AND lang = 'ru';

-- country_cctv_raid
UPDATE game_event_locales
SET description = 'Следователи Лахав 433 явились в администрацию Кантри-клуба и требуют серверы с камерами видеонаблюдения за прошлую пятницу.'
WHERE event_id = 'country_cctv_raid' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💾 Сжечь серверный шкаф и списать на «короткое замыкание»'
WHERE event_id = 'country_cctv_raid' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '😬 Выдать флешку и надеяться на удачу (+25% угрозы)'
WHERE event_id = 'country_cctv_raid' AND choice_index = 1 AND lang = 'ru';

-- kindergarten_favor
UPDATE game_event_locales
SET description = 'Старый друг пришел к вам в кабинет с просьбой срочно перевести его ребенка в элитный садик в центре города, хотя мест давно нет.'
WHERE event_id = 'kindergarten_favor' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💥 Уволить начальника гороно, выжить чужого ребенка и устроить своего'
WHERE event_id = 'kindergarten_favor' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤫 Пообещать «я лично всё устрою» и ничего не сделать (друг потом поймет)'
WHERE event_id = 'kindergarten_favor' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Заявить «закон один для всех» и выставить друга за дверь (минус дружба)'
WHERE event_id = 'kindergarten_favor' AND choice_index = 2 AND lang = 'ru';

-- metro_depot
UPDATE game_event_locales
SET description = 'Министерство транспорта предлагает построить гигантское депо метро в черте города. Подрядчики в восторге, но жители в гневе из-за шума и стройки.'
WHERE event_id = 'metro_depot' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏗️ Согласиться на проект! Госпроект прикроет от органов, а подрядчики отблагодарят'
WHERE event_id = 'metro_depot' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚜 Согласиться, но перенести депо на окраину — к виллам лидера оппозиции'
WHERE event_id = 'metro_depot' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Заблокировать проект через суд ради тишины и покоя жильцов'
WHERE event_id = 'metro_depot' AND choice_index = 2 AND lang = 'ru';

-- bagrut_success
UPDATE game_event_locales
SET description = 'Городу подвернулся шанс поднять процент сдавших Багрут на рекордный уровень, но гордепартамент образования просит солидный бюджет на репетиторов и лаборатории.'
WHERE event_id = 'bagrut_success' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📚 Выделить максимум средств из бюджета! Успех школьников поднимет дух и рейтинг'
WHERE event_id = 'bagrut_success' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Оставить всё как есть, пусть учатся по стандартной программе'
WHERE event_id = 'bagrut_success' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '✂️ Сократить бюджет образования и сэкономленное перевести в свой фонд'
WHERE event_id = 'bagrut_success' AND choice_index = 2 AND lang = 'ru';

-- park_sculptures
UPDATE game_event_locales
SET description = 'Ваш близкий друг-скульптор предлагает украсить центральный парк своими абстрактными скульптурами из ржавого железа. За счёт города, конечно: дружба бесценна, а скульптуры — нет.'
WHERE event_id = 'park_sculptures' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎨 Утвердить смету — друг щедро поделится «авторским гонораром»'
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Отклонить проект — жители не оценят металлолом на газонах'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏛️ Объявить открытый конкурс для молодых местных художников'
WHERE event_id = 'park_sculptures' AND choice_index = 2 AND lang = 'ru';

-- yom_haatzmaut
UPDATE game_event_locales
SET description = 'Главное событие года! Спонсоры перевели миллионы на праздничный концерт, салюты и угощения. Полиция в этот день праздники не портит.'
WHERE event_id = 'yom_haatzmaut' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎉 Добавить своих денег и устроить грандиозный пир! Народ и жена в полном восторге'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🍿 Потратить ровно то, что дали спонсоры, а небольшой остаток забрать себе'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤑 Пожадничать: забрать все деньги спонсоров, а людям оставить дешевые флажки'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 2 AND lang = 'ru';

-- wife_dog_park
UPDATE game_event_locales
SET description = 'Жена хочет собаку, но в районе нет площадки для выгула.'
WHERE event_id = 'wife_dog_park' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🐕 Сделать через друга: отдать постройку вольеров своему человеку и получить породистую собаку, ваучер на корм и дрессировщика'
WHERE event_id = 'wife_dog_park' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏗️ Провести нормальный публичный тендер на площадку для выгула'
WHERE event_id = 'wife_dog_park' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙅 Отказать: собака — слишком большая ответственность и вообще «не её тема»'
WHERE event_id = 'wife_dog_park' AND choice_index = 2 AND lang = 'ru';

-- cat_exhibition
UPDATE game_event_locales
SET description = 'Жена познакомилась с местным клубом любителей кошек и просит организовать городскую выставку.'
WHERE event_id = 'cat_exhibition' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🐈 Отдать организацию другу-промоутеру за откат'
WHERE event_id = 'cat_exhibition' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📋 Выделить бюджет и провести открытый конкурс'
WHERE event_id = 'cat_exhibition' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤧 Заявить, что у мэра аллергия на шерсть, и свернуть тему'
WHERE event_id = 'cat_exhibition' AND choice_index = 2 AND lang = 'ru';

-- lgbt_parade
UPDATE game_event_locales
SET description = 'Организаторы просят разрешение провести Парад Гордости на центральной улице города. Тема вызвала бурные споры.'
WHERE event_id = 'lgbt_parade' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏳️‍🌈 Разрешить на Вайцман! Спонсоры отблагодарят, а прогрессивные жители в восторге'
WHERE event_id = 'lgbt_parade' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎪 Выделить закрытую площадку в промзоне, чтобы не смущать религиозных'
WHERE event_id = 'lgbt_parade' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Заявить «Я стрейт, никаких парадов не будет!»'
WHERE event_id = 'lgbt_parade' AND choice_index = 2 AND lang = 'ru';

-- lgbt_coalition_crisis
UPDATE game_event_locales
SET description = 'Религиозные партнеры по коалиции в бешенстве от прошедшего парада и требуют немедленно закрыть городской ЛГБТ-клуб.'
WHERE event_id = 'lgbt_coalition_crisis' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🔒 Закрыть клуб и уступить требованиям коалиции'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚚 Перенести клуб в Эйзор Таасия (промзону) за счет бюджета'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏢 Открыть второй клуб прямо в центре религиозного района (организаторы занесут денег)'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 2 AND lang = 'ru';

-- mayors_strip_club
UPDATE game_event_locales
SET description = 'После ежегодного съезда мэров вы пошли отмечать в стрип-клуб. Пресса узнала об этом и устроила вам головомойку.'
WHERE event_id = 'mayors_strip_club' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Уйти в несознанку: «Меня там не было, это монтаж!»'
WHERE event_id = 'mayors_strip_club' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚖️ Нанять топ-адвоката, чтобы заставить журналистов всё замять'
WHERE event_id = 'mayors_strip_club' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📸 Слить прессе компрометирующие фото других мэров с той вечеринки'
WHERE event_id = 'mayors_strip_club' AND choice_index = 2 AND lang = 'ru';

-- mayors_revenge
UPDATE game_event_locales
SET description = 'Мэры соседних городов узнали, кто слил их фотографии в стрип-клубе прессе, и решили объединиться против вас.'
WHERE event_id = 'mayors_revenge' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💸 Выплатить компенсацию в их межмуниципальный фонд'
WHERE event_id = 'mayors_revenge' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛡️ Игнорировать их угрозы и заблокировать совместные городские проекты'
WHERE event_id = 'mayors_revenge' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎉 Устроить грандиозную закрытую «примирительную» вечеринку с шикарным фуршетом'
WHERE event_id = 'mayors_revenge' AND choice_index = 2 AND lang = 'ru';

-- son_wedding
UPDATE game_event_locales
SET description = 'Ваш сын женится. Это отличное событие и поворотный момент для всей семьи.'
WHERE event_id = 'son_wedding' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏰 Организовать пышную свадьбу: прикрытие для встреч с нужными людьми и сбор конвертов'
WHERE event_id = 'son_wedding' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🕊️ Пусть дети организуют всё сами, город не вмешивается'
WHERE event_id = 'son_wedding' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥂 Сделать скромный праздник только для близких родственников за свой счет'
WHERE event_id = 'son_wedding' AND choice_index = 2 AND lang = 'ru';

-- wedding_investigation
UPDATE game_event_locales
SET description = 'Журналисты пронюхали, что на пышной свадьбе сына вам передавали взятки под видом подарков.'
WHERE event_id = 'wedding_investigation' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Нанять «решалу» для работы с редакцией'
WHERE event_id = 'wedding_investigation' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🔥 Поджечь типографию/редакцию газеты'
WHERE event_id = 'wedding_investigation' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Игнорировать расследование и заявить, что это наветы'
WHERE event_id = 'wedding_investigation' AND choice_index = 2 AND lang = 'ru';

-- father_funeral
UPDATE game_event_locales
SET description = 'В семье stem-трагедия: скончался ваш отец. Время проведения шивы и приема соболезнований.'
WHERE event_id = 'father_funeral' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🕯️ Принимать на шиве важных людей: у вас горе, полиция не лезет, а вопросы решаются'
WHERE event_id = 'father_funeral' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👥 Принять коллег и родственников без коммерческих разговоров'
WHERE event_id = 'father_funeral' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🔒 Скрыть шиву, пустить только самых близких'
WHERE event_id = 'father_funeral' AND choice_index = 2 AND lang = 'ru';

-- father_monument_offer
UPDATE game_event_locales
SET description = 'Влиятельные застройщики, приходившие на шиву, предлагают полностью оплатить элитный памятник вашему отцу.'
WHERE event_id = 'father_monument_offer' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🪦 Принять предложение: у отца должен быть самый большой памятник на кладбище'
WHERE event_id = 'father_monument_offer' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📐 Принять помощь, но сделать скромный и умеренный памятник'
WHERE event_id = 'father_monument_offer' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Отказать и возвести памятник полностью за свой счет'
WHERE event_id = 'father_monument_offer' AND choice_index = 2 AND lang = 'ru';

-- daughter_school
UPDATE game_event_locales
SET description = 'Формирование классов на новый учебный год. Пора решить, с кем будет учиться ваша дочь.'
WHERE event_id = 'daughter_school' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏫 Посадить в класс с детьми нужных людей и бизнесменов'
WHERE event_id = 'daughter_school' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎒 Обычный класс: у нас все дети и родители равны'
WHERE event_id = 'daughter_school' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎓 Отправить в закрытую частную школу'
WHERE event_id = 'daughter_school' AND choice_index = 2 AND lang = 'ru';

-- school_flood
UPDATE game_event_locales
SET description = 'В школе дочери прорвало старые трубы, классы полностью затоплены.'
WHERE event_id = 'school_flood' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Нужные родители из класса всё быстро починят сами и занесут на ремонт'
WHERE event_id = 'school_flood' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏗️ Муниципальный ремонт через тендер (школа закрыта на месяц)'
WHERE event_id = 'school_flood' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛠️ Починить всё немедленно за свои деньги'
WHERE event_id = 'school_flood' AND choice_index = 2 AND lang = 'ru';

-- apartment_renovation
UPDATE game_event_locales
SET description = 'Жена захотела сделать ремонт в квартире. Игрок выбирает между коррупцией, транжирством или жесткой экономией.'
WHERE event_id = 'apartment_renovation' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛠️ Обратиться к знакомому подрядчику'
WHERE event_id = 'apartment_renovation' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💸 «Вот тебе, ни в чем не отказывай»'
WHERE event_id = 'apartment_renovation' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Принцип «Денег нет»'
WHERE event_id = 'apartment_renovation' AND choice_index = 2 AND lang = 'ru';

-- renovation_leak
UPDATE game_event_locales
SET description = 'Блогер прознал про бесплатный элитный ремонт от городского подрядчика и слил фото в интернет.'
WHERE event_id = 'renovation_leak' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💰 Заплатить блогеру за удаление поста'
WHERE event_id = 'renovation_leak' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Уйти в несознанку: «Это не моя квартира»'
WHERE event_id = 'renovation_leak' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚖️ Подать в суд за клевету'
WHERE event_id = 'renovation_leak' AND choice_index = 2 AND lang = 'ru';

-- wife_real_estate
UPDATE game_event_locales
SET description = 'Жена насмотрелась инстаграма и хочет купить домик в Италии.'
WHERE event_id = 'wife_real_estate' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏡 Купить очень дорогой дом на озере Комо'
WHERE event_id = 'wife_real_estate' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏢 Купить двушку в Болгарии на Солнечном берегу'
WHERE event_id = 'wife_real_estate' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🏚️ «Где родился, там и пригодился» — квартира в Тверии'
WHERE event_id = 'wife_real_estate' AND choice_index = 2 AND lang = 'ru';

-- tiberias_mockery
UPDATE game_event_locales
SET description = 'Блогер узнал про покупку старой квартиры в Тверии. Вышла разгромная статья: соседние мэры и полиция смеются над тобой.'
WHERE event_id = 'tiberias_mockery' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥊 Нанять шпану через знакомого — побить блогера'
WHERE event_id = 'tiberias_mockery' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '😤 Сжать зубы и стерпеть насмешки'
WHERE event_id = 'tiberias_mockery' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📢 Начать открытую информационную войну с недоброжелателями'
WHERE event_id = 'tiberias_mockery' AND choice_index = 2 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '📰 Заказать платную хвалебную статью о себе'
WHERE event_id = 'tiberias_mockery' AND choice_index = 3 AND lang = 'ru';
