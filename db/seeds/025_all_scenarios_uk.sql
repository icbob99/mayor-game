-- UK editorial revision: 41 cards. Preserve IDs, choice order, effects and other locales.

-- bench_tender
UPDATE game_event_locales
SET title = 'Тендер на лавки',
    description = 'Місту потрібні лавки, дружині — пентхаус. Підрядник береться владнати обидві справи одним тендером. Оце людина державного мислення!'
WHERE event_id = 'bench_tender' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🧳 Взяти сповна й віддати підряд двоюрідному братові — родина теж частина громади'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '👜 Взяти помірно через фіктивну фірму — фірма несправжня, скромність щира'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '❌ Відмовитися й провести чесний тендер — хай хоч лавки будуть варті своїх грошей'
WHERE event_id = 'bench_tender' AND choice_index = 2 AND lang = 'uk';

-- tama_38
UPDATE game_event_locales
SET title = 'Три зайві поверхи',
    description = 'Забудовник просить не помітити три зайві поверхи в центрі міста. Будинок підросте тут, ваш рахунок — у Швейцарії.'
WHERE event_id = 'tama_38' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏗️ Підписати не дивлячись — очі заплющені, рахунок відкритий'
WHERE event_id = 'tama_38' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🌳 Вимагати парк в обмін на дозвіл — зелень має бути не лише на рахунку'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛑 Зупинити будівництво — нехай хоч хтось довідається, що я маю принципи'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'uk';

-- shelters_budget
UPDATE game_event_locales
SET title = 'Гроші на бомбосховища',
    description = 'Держава виділила величезні гроші на ремонт старих бомбосховищ. Брат дружини одразу відкрив фірму з установлення броньованих дверей. Ще вчора таланту не видно було, а тут бюджет надійшов.'
WHERE event_id = 'shelters_budget' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚪 Віддати йому весь підряд — своїх захищаємо насамперед'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛠️ Частину робіт йому, решту — через чесний конкурс: сумління теж просить своєї частки'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛡️ Провести чесний відкритий тендер — родичатися ми вміємо, а працювати ще треба довести'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'uk';

-- state_comptroller
UPDATE game_event_locales
SET title = 'Перевірка державного аудитора',
    description = 'До мерії завітали державні аудитори. Вимагають бухгалтерські документи за минулий рік. Перед громадою ви вже відзвітували. Виявляється, перед калькулятором теж треба.'
WHERE event_id = 'state_comptroller' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💰 Підкупити головного аудитора — хай хоч наші інтереси зійдуться'
WHERE event_id = 'state_comptroller' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🔥 Улаштувати «випадкову» пожежу в архіві — минулому місце в минулому'
WHERE event_id = 'state_comptroller' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🐐 Звалити все на дрібного чиновника — посада маленька, відповідальність велика'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'uk';

-- shabbat_blackmail
UPDATE game_event_locales
SET title = 'Суботня криза в коаліції',
    description = 'Релігійні партії вимагають у суботу закрити торгові центри, кінотеатри й спортивні клуби з басейнами, перекрити вулиці та в''їзди до міста для машин. Інакше розвалять коаліцію. Дружина зібралася по крамницях і в басейн. Обидві сторони певні: ви ще недостатньо налякані.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🕍 Пристати на всі вимоги — тишу в місті забезпечу, вдома не обіцяю'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 У центрі обмеження, на околицях усе працює і проїзд вільний — святість за поштовим індексом'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🖕 Відрізати: «У нас світське місто! Не подобається — моліться за інше»'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'uk';

-- lawyer_visit
UPDATE game_event_locales
SET title = 'Адвокат із потрібними знайомствами',
    description = 'Відомий адвокат обіцяє за солідний гонорар улаштувати так, щоб у поліції загубили кілька тек із матеріалами на вас. Не каже, що ви невинні. Каже, що це необов''язково.'
WHERE event_id = 'lawyer_visit' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💼 Заплатити й спати спокійно — невинуватість теж потребує вкладень'
WHERE event_id = 'lawyer_visit' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Попросити знижку — я ж не в усьому винен'
WHERE event_id = 'lawyer_visit' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '❌ Вигнати: «Я чесний мер!» Давно хотілося почути це вголос'
WHERE event_id = 'lawyer_visit' AND choice_index = 2 AND lang = 'uk';

-- garbage_extortion
UPDATE game_event_locales
SET title = 'Пропозиція вивозити сміття',
    description = 'До мерії прийшли браві хлопці з Калансуа. Хочуть вивозити сміття. Чемні хлопці: поки що пропонують.'
WHERE event_id = 'garbage_extortion' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '👮 Подати заяву до поліції — хай у погроз буде вхідний номер'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Віддати їм підряд на вивезення сміття — найпереконливіша заявка'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🗣️ Удати, що не розумію арабської — погрози без перекладу не приймаються'
WHERE event_id = 'garbage_extortion' AND choice_index = 2 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '⚔️ Покликати конкурентів із Тайбе — нехай ринок сам себе врегулює'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'uk';

-- burning_trucks
UPDATE game_event_locales
SET title = 'Горять сміттєвози',
    description = 'Уночі на міській стоянці згоріли три сміттєвози. Сміття вивозити нічим. Пропозиція співпраці нарешті стала зрозумілою.'
WHERE event_id = 'burning_trucks' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚛 Купити нові сміттєвози бюджетним коштом — відмова теж має ціну'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Розвести руками: «Грошей немає». Руки чисті, за місто не ручаюся'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'uk';

-- neighbor_mayor_amuta
UPDATE game_event_locales
SET title = 'Допомога колезі',
    description = 'Телефонує мер сусіднього міста, просить допомогти переобратися. За себе він уже все вирішив. Залишилося переконати решту.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💰 Щедро вкластися через підставний фонд — своїх на виборах не кидаємо'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🪙 Дати трохи — щоб пам''ятав допомогу, а не суму'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛑 М''яко відмовити: «Грошей немає, але ви тримайтеся»'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 2 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📰 Злити компромат у телеграм-канал «Міські плітки» — допомогти виборцям визначитися'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 3 AND lang = 'uk';

-- kompromat_retaliation
UPDATE game_event_locales
SET title = 'Удар у відповідь через пресу',
    description = 'Сусідній мер віддячив за витік. У телеграмі — ваша «неврахована» вілла в Кесарії та дружина в міланському бутику. Ви допомогли визначитися його виборцям. Він вирішив не лишатися в боргу.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💼 Заплатити блогерам — хай пояснять, як економія на обідах перетворюється на віллу'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤐 Мовчати — кожне зайве слово може виявитися ще однією нерухомістю'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'uk';

-- shitty_burger
UPDATE game_event_locales
SET title = 'Скандал у White Burger',
    description = 'У White Burger вашого головного спонсора інспектори знайшли підозріле м''ясо й вимагають закрити заклад. М''ясо вам незнайоме. Власник — аж занадто.'
WHERE event_id = 'shitty_burger' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🥩 Видати ліцензію заднім числом — на папері воно ще свіже'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📸 З''їсти бургер перед камерами — за спонсора відповідаю шлунком'
WHERE event_id = 'shitty_burger' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '❌ Закрити до біса — гроші грошима, але цього вже не перетравити'
WHERE event_id = 'shitty_burger' AND choice_index = 2 AND lang = 'uk';

-- shabbat_parking
UPDATE game_event_locales
SET title = 'Суботній паркувальний гармидер',
    description = 'У суботу у світських районах машини кидають так, що навіть швидка не проїде. Опозиція вимагає облави з евакуаторами. День спокою є. Знайти б хоч когось спокійного.'
WHERE event_id = 'shabbat_parking' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚜 Послати інспекторів та евакуатори вдосвіта — машинам теж треба відпочити за містом'
WHERE event_id = 'shabbat_parking' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Нічого не робити — здоровий глузд теж має вихідний'
WHERE event_id = 'shabbat_parking' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🅿️ Розмітити парковку під вікнами рабина — ближнього треба любити разом із його машиною'
WHERE event_id = 'shabbat_parking' AND choice_index = 2 AND lang = 'uk';

-- flooded_street
UPDATE game_event_locales
SET title = 'Потоп на вулиці Вайцман',
    description = 'Після першої сильної зливи вулиця Вайцман пішла під воду. Гроші на зливову каналізацію пішли раніше. Чому вода не йде за ними, тепер питають у вас.'
WHERE event_id = 'flooded_street' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🌞 Звинуватити аномальну зливу й глобальне потепління — я мер місцевий, а проблема світова'
WHERE event_id = 'flooded_street' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💸 Найняти фірму брата дружини без тендера — свої не дадуть потонути'
WHERE event_id = 'flooded_street' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🥾 Узути гумові чоботи й особисто чистити зливостік перед камерами — нарешті брудна робота, яку можна показати'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'uk';

-- arnona_scandal
UPDATE game_event_locales
SET title = 'Податкові знижки для своїх',
    description = 'Журналісти з''ясували: бізнес вашого спонсора отримав знижку 80% на муніципальний податок. Людина вже утримує мера. Не можна ж брати з неї ще й за місто.'
WHERE event_id = 'arnona_scandal' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤫 Зам''яти справу через юристів — це не порушення, а індивідуальний підхід'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📉 Зменшити знижку до 30% — хай обурюються поміркованіше'
WHERE event_id = 'arnona_scandal' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '⚖️ Скасувати пільгу й стягнути недоплачене — місту він теж дещо винен'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'uk';

-- beach_kiosk
UPDATE game_event_locales
SET title = 'Захоплення міського пляжу',
    description = 'Власник пляжного ресторану самовільно зайняв 200 метрів берега й поставив платні шезлонги. Чоловік не жадібний: море поки що залишив громаді.'
WHERE event_id = 'beach_kiosk' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🍹 Узяти гонорар і VIP-столик — особисто мені до моря пройти легко'
WHERE event_id = 'beach_kiosk' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚜 Знести незаконні споруди — пояснити межі власності бульдозером'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🌊 Цунамі змило ресторан — ні собі, ні людям'
WHERE event_id = 'beach_kiosk' AND choice_index = 2 AND lang = 'uk';

-- electric_scooters
UPDATE game_event_locales
SET title = 'Нашестя електросамокатів',
    description = 'На тротуарах самокати: одні лежать упоперек, інші збивають пенсіонерів. Пройти не можна. Проїхати чомусь можна.'
WHERE event_id = 'electric_scooters' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛴 Запровадити платні ліцензії для прокатників — порядок у паперах теж порядок'
WHERE event_id = 'electric_scooters' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Повністю заборонити прокат самокатів у центрі міста'
WHERE event_id = 'electric_scooters' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🅿️ Розмітити місця для паркування самокатів'
WHERE event_id = 'electric_scooters' AND choice_index = 2 AND lang = 'uk';

-- stadium_naming
UPDATE game_event_locales
SET title = 'Нове ім''я стадіону',
    description = 'Олігарх хоче назвати міський стадіон на честь своєї компанії. Уболівати можна за кого завгодно. Читати доведеться про нього.'
WHERE event_id = 'stadium_naming' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💰 Підписати договір на десять років і забрати комісію'
WHERE event_id = 'stadium_naming' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏛️ Залишити історичну назву — до неї хоч устигли звикнути'
WHERE event_id = 'stadium_naming' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏅 Назвати на честь попереднього мера — корисну традицію слід започаткувати завчасно'
WHERE event_id = 'stadium_naming' AND choice_index = 2 AND lang = 'uk';

-- sewage_overflow
UPDATE game_event_locales
SET title = 'Прорив каналізації',
    description = 'Головний колектор не витримав. Набережну заливає нечистотами. Тепер про проблему знають навіть ті, хто міських новин не читає.'
WHERE event_id = 'sewage_overflow' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛠️ Виділити термінове фінансування на капітальний ремонт'
WHERE event_id = 'sewage_overflow' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Назвати це «тимчасовими технічними роботами» — формулювання вже полагодили'
WHERE event_id = 'sewage_overflow' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📞 Звернутися до братової фірми — клопіт громадський, підряд родинний'
WHERE event_id = 'sewage_overflow' AND choice_index = 2 AND lang = 'uk';

-- friday_country_club
UPDATE game_event_locales
SET title = 'П''ятничний прийом біля басейну',
    description = 'П''ятниця, восьма ранку. Ви в шезлонгу біля басейну спортивного клубу. Перед вами черга з «маленькими проханнями». До мерії — за записом. Сюди — у плавках.'
WHERE event_id = 'friday_country_club' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '☕ Владнати справи бізнесменів за «спонсорські внески» — їм потрібен мер, мені потрібні люди'
WHERE event_id = 'friday_country_club' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Допомогти мешканцям із муніципальним податком та дитсадками бюджетним коштом'
WHERE event_id = 'friday_country_club' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Повісити табличку «Мер відпочиває» й піти до сауни'
WHERE event_id = 'friday_country_club' AND choice_index = 2 AND lang = 'uk';

-- country_cctv_raid
UPDATE game_event_locales
SET title = 'Записи з камер у клубі',
    description = 'Слідчі прийшли до спортивного клубу по записи камер за минулу п''ятницю. Ви приймали людей без протоколу. Камера вела свій.'
WHERE event_id = 'country_cctv_raid' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💾 Спалити серверну шафу — проводка не витримала відповідальності'
WHERE event_id = 'country_cctv_raid' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '😬 Віддати флешку — раптом камера теж нічого не пам''ятає'
WHERE event_id = 'country_cctv_raid' AND choice_index = 1 AND lang = 'uk';

-- kindergarten_favor
UPDATE game_event_locales
SET title = 'Місце в дитсадку для своїх',
    description = 'Давній приятель просить терміново перевести його дитину до елітного садочка в центрі. Місць давно немає. Приятель гадає, що так відповідають незнайомим.'
WHERE event_id = 'kindergarten_favor' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💥 Звільнити начальника відділу освіти, витіснити чужу дитину й улаштувати свою'
WHERE event_id = 'kindergarten_favor' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤫 Пообіцяти все владнати й нічого не зробити — навіщо псувати дружбу відмовою?'
WHERE event_id = 'kindergarten_favor' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Виставити приятеля за двері — закон один для всіх. Відтепер і для нього'
WHERE event_id = 'kindergarten_favor' AND choice_index = 2 AND lang = 'uk';

-- metro_depot
UPDATE game_event_locales
SET title = 'Будівництво депо метро',
    description = 'Міністерство транспорту пропонує звести величезне депо метро в місті. Мешканці бояться, що будівництво ніколи не скінчиться. Підрядники бояться, що скінчиться.'
WHERE event_id = 'metro_depot' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏗️ Погодити — проєкт державний, подяка особиста'
WHERE event_id = 'metro_depot' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚜 Перенести депо до вілл очільника опозиції — хай буде ближче до народу й транспорту'
WHERE event_id = 'metro_depot' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Зупинити проєкт через суд — хай хоч мешканці сплять спокійно'
WHERE event_id = 'metro_depot' AND choice_index = 2 AND lang = 'uk';

-- bagrut_success
UPDATE game_event_locales
SET title = 'Шкільний рекорд',
    description = 'Місто може встановити рекорд за часткою випускників, які складуть іспити. Школам потрібні репетитори й лабораторії. Просто намалювати рекорд у звіті чомусь ніхто не пропонує.'
WHERE event_id = 'bagrut_success' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📚 Виділити якнайбільше коштів — хай хоч діти знають, що роблять'
WHERE event_id = 'bagrut_success' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Залишити звичайну програму — ми ж якось вивчилися'
WHERE event_id = 'bagrut_success' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '✂️ Скоротити бюджет освіти й переказати заощаджене у свій фонд — про майбутнє теж треба думати'
WHERE event_id = 'bagrut_success' AND choice_index = 2 AND lang = 'uk';

-- park_sculptures
UPDATE game_event_locales
SET title = 'Сучасне мистецтво в парку',
    description = 'Приятель-скульптор пропонує міським коштом прикрасити центральний парк абстракціями з іржавого заліза. Від брухту їх відрізняє кошторис.'
WHERE event_id = 'park_sculptures' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎨 Затвердити кошторис — приятель поділиться гонораром. Я вже починаю розуміти мистецтво'
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Відхилити проєкт — хай поки іржавіє власним коштом'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏛️ Оголосити відкритий конкурс для молодих місцевих митців — а раптом талант є й у незнайомих'
WHERE event_id = 'park_sculptures' AND choice_index = 2 AND lang = 'uk';

-- yom_haatzmaut
UPDATE game_event_locales
SET title = 'Святкування Дня незалежності',
    description = 'Спонсори переказали мільйони на концерт, салют і частування. Поліція сьогодні свята не псує. Гроші є. Залишилося вирішити, кому свято.'
WHERE event_id = 'yom_haatzmaut' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎉 Докласти своїх і влаштувати розкішне частування — і таке буває'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🍿 Улаштувати свято за спонсорські гроші, невеликий залишок забрати собі — я ж теж тут не чужий'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤑 Забрати всі гроші, а людям залишити дешеві прапорці — хай махають'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 2 AND lang = 'uk';

-- wife_dog_park
UPDATE game_event_locales
SET title = 'Собака для дружини',
    description = 'Дружина хоче собаку, а в районі немає майданчика для вигулу. Собаки ще немає. Місто вже винне.'
WHERE event_id = 'wife_dog_park' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🐕 Віддати будівництво приятелю — породистий собака, ваучер на корм і дресирувальник у комплекті'
WHERE event_id = 'wife_dog_park' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏗️ Провести відкритий тендер на майданчик — хай хоч тут буде конкурс'
WHERE event_id = 'wife_dog_park' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙅 Відмовити: «Собака — велика відповідальність. У тебе вже є мер»'
WHERE event_id = 'wife_dog_park' AND choice_index = 2 AND lang = 'uk';

-- cat_exhibition
UPDATE game_event_locales
SET title = 'Виставка котів',
    description = 'Дружина познайомилася з клубом любителів котів і просить улаштувати міську виставку. У неї з''явилося захоплення. У міста — стаття видатків.'
WHERE event_id = 'cat_exhibition' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🐈 Віддати організацію приятелю-промоутеру за відкат — хай не самі коти муркочуть від задоволення'
WHERE event_id = 'cat_exhibition' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📋 Виділити бюджет і провести відкритий конкурс — родовід перевіряти лише в котів'
WHERE event_id = 'cat_exhibition' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤧 Відмовити через алергію на шерсть — для переконливості чхнути'
WHERE event_id = 'cat_exhibition' AND choice_index = 2 AND lang = 'uk';

-- lgbt_parade
UPDATE game_event_locales
SET title = 'Прайд на вулиці Вайцман',
    description = 'Організатори просять провести прайд на вулиці Вайцман. Парад іще треба погодити. Скандал уже йде без дозволу.'
WHERE event_id = 'lgbt_parade' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏳️‍🌈 Дозволити на Вайцман — підтримати свободу. За ваші гроші — будь-яка забаганка'
WHERE event_id = 'lgbt_parade' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎪 Виділити закритий майданчик у промзоні — ми всіх поважаємо, декого просто здалеку'
WHERE event_id = 'lgbt_parade' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Заборонити: «Я натурал! Усіх раком поставлю!»'
WHERE event_id = 'lgbt_parade' AND choice_index = 2 AND lang = 'uk';

-- lgbt_coalition_crisis
UPDATE game_event_locales
SET title = 'Коаліційна гордість',
    description = 'Релігійні партнери в коаліції теж «горді». Вимагають негайно закрити міський ЛГБТ-клуб. Кажуть, що в труні бачили таку коаліцію. Але виходити поки не збираються.'
WHERE event_id = 'lgbt_coalition_crisis' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🔒 Закрити клуб — переконання в мене тверді, коаліція крихка'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚚 Перенести клуб у промзону бюджетним коштом — далі від спокуси, ближче до складів'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏢 Відкрити другий клуб у центрі релігійного району — якщо вам одного мало'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 2 AND lang = 'uk';

-- mayors_strip_club
UPDATE game_event_locales
SET title = 'Скандал після з''їзду мерів',
    description = 'Після щорічного з''їзду мерів ви з колегами пішли до стрип-клубу. Преса довідалася. Про сам з''їзд стільки не писали.'
WHERE event_id = 'mayors_strip_club' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Усе заперечувати: «Це монтаж! Я зроду так не відпочивав!»'
WHERE event_id = 'mayors_strip_club' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '⚖️ Найняти дорогого адвоката — хай пояснить журналістам, чого вони не бачили'
WHERE event_id = 'mayors_strip_club' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📸 Злити пресі фото інших мерів — чого це тільки моєму місту соромитися?'
WHERE event_id = 'mayors_strip_club' AND choice_index = 2 AND lang = 'uk';

-- mayors_revenge
UPDATE game_event_locales
SET title = 'Мери завдають удару у відповідь',
    description = 'Мери сусідніх міст дізналися, хто злив фото зі стрип-клубу. Міжмуніципальна співпраця нарешті запрацювала. Проти вас.'
WHERE event_id = 'mayors_revenge' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💸 Сплатити компенсацію до їхнього спільного муніципального фонду — честь і гідність приймають безготівку'
WHERE event_id = 'mayors_revenge' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛡️ Ігнорувати погрози й заблокувати спільні проєкти — міста не зійшлися характерами'
WHERE event_id = 'mayors_revenge' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎉 Улаштувати закриту примирливу вечірку з розкішним фуршетом — є що згадати й що забути'
WHERE event_id = 'mayors_revenge' AND choice_index = 2 AND lang = 'uk';

-- son_wedding
UPDATE game_event_locales
SET title = 'Весілля сина',
    description = 'Син одружується. Нарешті можна зібрати потрібних людей і назвати це особистим життям.'
WHERE event_id = 'son_wedding' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏰 Улаштувати пишне весілля з потрібними людьми — щастя молодим, конверти татові'
WHERE event_id = 'son_wedding' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🕊️ Хай діти самі все організують — побачимо, чи є життя без мерії'
WHERE event_id = 'son_wedding' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🥂 Скромно, лише з близькою ріднею та власним коштом — аж розповідати ніяково'
WHERE event_id = 'son_wedding' AND choice_index = 2 AND lang = 'uk';

-- wedding_investigation
UPDATE game_event_locales
SET title = 'Весілля під прицілом преси',
    description = 'Журналісти зацікавилися конвертами з весілля сина. Ви кажете — подарунки. Вони питають — за які послуги. Жодної поваги до родинних цінностей.'
WHERE event_id = 'wedding_investigation' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Найняти посередника, що все владнає — у редакції теж мають бути якісь родинні цінності'
WHERE event_id = 'wedding_investigation' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🔥 Підпалити редакцію газети — хай пишуть по гарячих слідах'
WHERE event_id = 'wedding_investigation' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 Оголосити все наклепом і не відповідати — на весілля не покликали, от і образилися'
WHERE event_id = 'wedding_investigation' AND choice_index = 2 AND lang = 'uk';

-- father_funeral
UPDATE game_event_locales
SET title = 'Жалоба за батьком',
    description = 'Помер ваш батько. Ви приймаєте співчуття. Люди йдуть із важким серцем. Дехто ще й із діловою пропозицією.'
WHERE event_id = 'father_funeral' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🕯️ Приймати поважних людей і владнувати справи — поліції вистачить такту не заважати'
WHERE event_id = 'father_funeral' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '👥 Прийняти колег і рідню без ділових розмов — хоч сьогодні без порядку денного'
WHERE event_id = 'father_funeral' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🔒 Не розголошувати про жалобу, пустити тільки близьких — тих, хто знав батька, а не посаду сина'
WHERE event_id = 'father_funeral' AND choice_index = 2 AND lang = 'uk';

-- father_monument_offer
UPDATE game_event_locales
SET title = 'Пам''ятник від забудовників',
    description = 'Забудовники, які приходили зі співчуттями, пропонують оплатити розкішний пам''ятник. Пам''ятник буде батькові. Віддячувати доведеться вам.'
WHERE event_id = 'father_monument_offer' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🪦 Прийняти й поставити найбільший пам''ятник — хай усі бачать, чий син вибився в люди'
WHERE event_id = 'father_monument_offer' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📐 Прийняти допомогу, але поставити скромний пам''ятник — я ж нічого особливого не прошу'
WHERE event_id = 'father_monument_offer' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Відмовитися й заплатити самому — хай хоч тут нікому не буду винен'
WHERE event_id = 'father_monument_offer' AND choice_index = 2 AND lang = 'uk';

-- daughter_school
UPDATE game_event_locales
SET title = 'Донька йде до школи',
    description = 'У школах формують класи. Доньці потрібні хороші однокласники. Вам — їхні батьки.'
WHERE event_id = 'daughter_school' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏫 Улаштувати до дітей потрібних людей — батьківські збори теж ділова зустріч'
WHERE event_id = 'daughter_school' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎒 Віддати до звичайного класу — рівність у нас не лише для чужих дітей'
WHERE event_id = 'daughter_school' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🎓 Відправити до закритої приватної школи — я ж знаю, хто відповідає за міські'
WHERE event_id = 'daughter_school' AND choice_index = 2 AND lang = 'uk';

-- school_flood
UPDATE game_event_locales
SET title = 'Потоп у школі',
    description = 'У школі доньки прорвало старі труби. Класи затоплено. Вода, мабуть, не знає, чиї тут діти.'
WHERE event_id = 'school_flood' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🤝 Доручити ремонт потрібним батькам — швидко полагодять і про мера не забудуть'
WHERE event_id = 'school_flood' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏗️ Міський ремонт через тендер — школа закрита на місяць, порядок поспіху не терпить'
WHERE event_id = 'school_flood' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛠️ Негайно полагодити за свої гроші — вперше точно знатиму, скільки коштує ремонт'
WHERE event_id = 'school_flood' AND choice_index = 2 AND lang = 'uk';

-- apartment_renovation
UPDATE game_event_locales
SET title = 'Ремонт квартири',
    description = 'Дружина хоче ремонт. Квартира її більше не влаштовує. Поки що тільки квартира.'
WHERE event_id = 'apartment_renovation' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🛠️ Звернутися до знайомого підрядника — хай хоч тут зробить як для себе'
WHERE event_id = 'apartment_renovation' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💸 Дати грошей: «Ні в чому собі не відмовляй». Сам я вже відмовити не зміг'
WHERE event_id = 'apartment_renovation' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🚫 Розвести руками: «Грошей немає». Головне — не показувати, де'
WHERE event_id = 'apartment_renovation' AND choice_index = 2 AND lang = 'uk';

-- renovation_leak
UPDATE game_event_locales
SET title = 'Блогер показав ремонт',
    description = 'Блогер виклав фото розкішного ремонту, який міський підрядник зробив вам безкоштовно. Тепер усе місто знає: коли треба, він уміє.'
WHERE event_id = 'renovation_leak' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '💰 Заплатити за видалення допису — останній штрих в оздобленні'
WHERE event_id = 'renovation_leak' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🙈 «Це не моя квартира! Я свою ще до ремонту пам''ятаю»'
WHERE event_id = 'renovation_leak' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '⚖️ Подати до суду за наклеп — нічого правду без дозволу писати'
WHERE event_id = 'renovation_leak' AND choice_index = 2 AND lang = 'uk';

-- wife_real_estate
UPDATE game_event_locales
SET title = 'Хатинка за кордоном',
    description = 'Дружина надивилася інстаграму й хоче «хатинку в Італії». Уся скромність прохання вмістилася у слові «хатинка».'
WHERE event_id = 'wife_real_estate' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏡 Купити дуже дорогий будинок на озері Комо — скромніше там уже непристойно'
WHERE event_id = 'wife_real_estate' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏢 Купити двокімнатну квартиру на Сонячному Березі в Болгарії — теж за кордоном, мріяти треба точніше'
WHERE event_id = 'wife_real_estate' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🏚️ Купити квартиру у Тверії — озеро є. Італійців можна не кликати'
WHERE event_id = 'wife_real_estate' AND choice_index = 2 AND lang = 'uk';

-- tiberias_mockery
UPDATE game_event_locales
SET title = 'Мер пошився в дурні',
    description = 'Блогер висміяв вашу стару квартиру у Тверії. Сусідні мери регочуть. Поліція теж. На такій посаді — і таке житло.'
WHERE event_id = 'tiberias_mockery' AND lang = 'uk';

UPDATE game_choice_locales
SET text = '🥊 Через знайомого найняти шпану й побити блогера — на хороших людей гроші ще є'
WHERE event_id = 'tiberias_mockery' AND choice_index = 0 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '😤 Зціпити зуби й стерпіти — зате квартира своя, а думки чужі'
WHERE event_id = 'tiberias_mockery' AND choice_index = 1 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📢 Почати відкриту інформаційну війну — у кожного знайдеться щось гірше за мою квартиру'
WHERE event_id = 'tiberias_mockery' AND choice_index = 2 AND lang = 'uk';

UPDATE game_choice_locales
SET text = '📰 Замовити хвалебну статтю — скромність прикрашає, якщо як слід заплатити'
WHERE event_id = 'tiberias_mockery' AND choice_index = 3 AND lang = 'uk';
