-- EN editorial revision: 41 cards. Preserve IDs, choice order, effects and other locales.

-- bench_tender
UPDATE game_event_locales
SET title = 'The Park Bench Tender',
    description = 'The city needs benches. Your wife needs a penthouse. A contractor believes one tender can accommodate both public interests.'
WHERE event_id = 'bench_tender' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🧳 Take the full cut and give the contract to my cousin — family are members of the public too'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '👜 Take a modest cut through a shell company — the company is fictitious, the modesty is real'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '❌ Refuse the kickback and run an honest tender — let the benches be worth what we pay for them'
WHERE event_id = 'bench_tender' AND choice_index = 2 AND lang = 'en';

-- tama_38
UPDATE game_event_locales
SET title = 'Three Extra Floors',
    description = 'A developer asks you to overlook three extra floors downtown. The building will grow here. Your bank balance will grow in Switzerland.'
WHERE event_id = 'tama_38' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏗️ Sign without looking — eyes shut, account open'
WHERE event_id = 'tama_38' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🌳 Demand a park in exchange for the extra floors — some green ought to stay in town'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛑 Block construction — someone ought to discover I have principles'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'en';

-- shelters_budget
UPDATE game_event_locales
SET title = 'The Bomb Shelter Budget',
    description = 'The government has allocated a fortune to repair old bomb shelters. Your wife''s brother immediately opens a company installing reinforced doors. Public funding brings out the most remarkable talents.'
WHERE event_id = 'shelters_budget' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚪 Give him the whole contract — protecting our own must come first'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛠️ Give him some work and award the rest through a fair tender — conscience wants its share too'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛡️ Hold a fair, open tender — being related is not yet a professional qualification'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'en';

-- state_comptroller
UPDATE game_event_locales
SET title = 'The State Auditor Arrives',
    description = 'State auditors arrive at city hall demanding last year''s accounts. You have already answered to the public. Apparently, you must now answer to a calculator.'
WHERE event_id = 'state_comptroller' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💰 Bribe the chief auditor — at least our interests will balance'
WHERE event_id = 'state_comptroller' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🔥 Arrange an ''accidental'' archive fire — let the past stay in the past'
WHERE event_id = 'state_comptroller' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🐐 Blame a junior official — small office, enormous responsibility'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'en';

-- shabbat_blackmail
UPDATE game_event_locales
SET title = 'The Shabbat Coalition Crisis',
    description = 'Religious parties demand that malls, cinemas and sports clubs with pools close on Saturday, with streets and roads into town blocked to cars. Otherwise, the coalition goes. Your wife has planned shopping and a swim. Both sides suspect you aren''t frightened enough.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🕍 Accept every demand — I can promise a quiet town, not a quiet home'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Restrict the center; keep businesses and roads open on the outskirts — holiness by postal code'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🖕 Tell them: ''This is a secular city! If you don''t like it, pray for another one'''
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'en';

-- lawyer_visit
UPDATE game_event_locales
SET title = 'The Lawyer Who Knows People',
    description = 'For a substantial fee, a prominent lawyer promises the police will misplace a couple of files on you. He isn''t saying you''re innocent. He''s saying it needn''t matter.'
WHERE event_id = 'lawyer_visit' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💼 Pay and sleep soundly — innocence requires investment'
WHERE event_id = 'lawyer_visit' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Ask for a discount — I can''t be guilty of everything'
WHERE event_id = 'lawyer_visit' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '❌ Throw him out: ''I''m an honest mayor!'' I''ve been wanting to hear that said'
WHERE event_id = 'lawyer_visit' AND choice_index = 2 AND lang = 'en';

-- garbage_extortion
UPDATE game_event_locales
SET title = 'An Offer to Collect the Trash',
    description = 'Some sturdy fellows from Qalansuwa visit city hall. They want the trash collection contract. Polite fellows. So far, it''s an offer.'
WHERE event_id = 'garbage_extortion' AND lang = 'en';

UPDATE game_choice_locales
SET text = '👮 File a police report — give the threats a reference number'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Award them the trash contract — easily the most persuasive bid'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🗣️ Pretend I don''t understand Arabic — threats must be submitted in translation'
WHERE event_id = 'garbage_extortion' AND choice_index = 2 AND lang = 'en';

UPDATE game_choice_locales
SET text = '⚔️ Call their rivals from Tayibe — let the market regulate itself'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'en';

-- burning_trucks
UPDATE game_event_locales
SET title = 'Garbage Trucks on Fire',
    description = 'Three garbage trucks burn overnight in the municipal depot. There is nothing left to collect the trash with. The offer of cooperation has finally been understood.'
WHERE event_id = 'burning_trucks' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚛 Buy new trucks with city funds — saying no has a price too'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Spread my hands: ''No money.'' My hands are clean; I make no promises about the streets'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'en';

-- neighbor_mayor_amuta
UPDATE game_event_locales
SET title = 'A Little Help for a Fellow Mayor',
    description = 'The neighboring mayor calls for help with his reelection. He has already decided he should win. Only the voters remain to be consulted.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💰 Contribute generously through a front foundation — we don''t abandon our own at election time'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🪙 Give a token amount — let him remember the gesture, not the sum'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛑 Decline gently: ''No money, I''m afraid. Stay strong'''
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 2 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📰 Leak dirt on him to the ''Town Gossip'' Telegram channel — help the voters make up their minds'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 3 AND lang = 'en';

-- kompromat_retaliation
UPDATE game_event_locales
SET title = 'The Media Counterattack',
    description = 'The neighboring mayor returns the favor. Telegram now features your ''overlooked'' villa in Caesarea and your wife in a Milan boutique. You helped inform his voters. He felt obliged to inform yours.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💼 Pay bloggers to explain how skipping lunch eventually buys a villa'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤐 Say nothing — my next statement might turn out to be another property'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'en';

-- shitty_burger
UPDATE game_event_locales
SET description = 'Inspectors find suspicious meat at White Burger, owned by your chief sponsor, and demand its closure. You cannot vouch for the meat. You know the owner rather too well.'
WHERE event_id = 'shitty_burger' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🥩 Issue a backdated license — on paper, the meat is still fresh'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📸 Eat a burger on camera — put my stomach where my funding is'
WHERE event_id = 'shitty_burger' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '❌ Shut the place down — even I can''t stomach this'
WHERE event_id = 'shitty_burger' AND choice_index = 2 AND lang = 'en';

-- shabbat_parking
UPDATE game_event_locales
SET title = 'Saturday Parking Hell',
    description = 'On Saturdays, cars block the secular neighborhoods so thoroughly that even an ambulance cannot get through. The opposition demands a tow-truck sweep. It is a day of rest. Everyone seems furious about it.'
WHERE event_id = 'shabbat_parking' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚜 Send inspectors and tow trucks at dawn — the cars deserve a quiet retreat too'
WHERE event_id = 'shabbat_parking' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Do nothing — common sense has the day off'
WHERE event_id = 'shabbat_parking' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🅿️ Mark parking spaces beneath the rabbi''s windows — love thy neighbor, vehicle included'
WHERE event_id = 'shabbat_parking' AND choice_index = 2 AND lang = 'en';

-- flooded_street
UPDATE game_event_locales
SET title = 'Weizmann Street Goes Under',
    description = 'The first serious downpour puts Weizmann Street underwater. The money for clearing the drains disappeared earlier. Now people want to know why the water won''t follow it.'
WHERE event_id = 'flooded_street' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🌞 Blame freak rainfall and global warming — I''m a local mayor; this is a global problem'
WHERE event_id = 'flooded_street' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '💸 Hire my brother-in-law''s firm without a tender — family won''t leave me high and dry'
WHERE event_id = 'flooded_street' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🥾 Put on rubber boots and clear the drain on camera — finally, dirty work I can show the public'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'en';

-- arnona_scandal
UPDATE game_event_locales
SET title = 'Tax Relief for the Well Connected',
    description = 'Reporters discover that your sponsor''s business received an 80% municipal tax discount. The man already supports the mayor. Surely charging him for the city as well would be excessive.'
WHERE event_id = 'arnona_scandal' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤫 Have the lawyers bury it — not misconduct, personalized service'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📉 Reduce the discount to 30% — perhaps the outrage can be reduced accordingly'
WHERE event_id = 'arnona_scandal' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '⚖️ Cancel the relief and collect the unpaid tax — he owes the city something too'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'en';

-- beach_kiosk
UPDATE game_event_locales
SET title = 'The Beach Grab',
    description = 'A beachfront restaurant owner illegally occupies 200 meters of shore and installs paid loungers. He isn''t greedy. He has left the sea to the public for now.'
WHERE event_id = 'beach_kiosk' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🍹 Take a fee and a VIP table — personally, I have no trouble accessing the beach'
WHERE event_id = 'beach_kiosk' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚜 Bulldoze the illegal structures — explain property boundaries with heavy equipment'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🌊 A tsunami washes away the restaurant — nobody gets to keep it'
WHERE event_id = 'beach_kiosk' AND choice_index = 2 AND lang = 'en';

-- electric_scooters
UPDATE game_event_locales
SET title = 'The Scooter Invasion',
    description = 'Scooters cover the sidewalks. Some lie across them; others knock down pensioners. Walking is impossible. Riding somehow isn''t.'
WHERE event_id = 'electric_scooters' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛴 Require paid licenses for rental operators — orderly paperwork is a kind of order'
WHERE event_id = 'electric_scooters' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Ban scooter rentals completely in the city center'
WHERE event_id = 'electric_scooters' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🅿️ Mark designated scooter parking spaces'
WHERE event_id = 'electric_scooters' AND choice_index = 2 AND lang = 'en';

-- stadium_naming
UPDATE game_event_locales
SET title = 'The Stadium''s New Name',
    description = 'An oligarch wants the city stadium named after his company. Spectators may support whichever team they like. The advertising will be compulsory.'
WHERE event_id = 'stadium_naming' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💰 Sign a ten-year contract and pocket the commission'
WHERE event_id = 'stadium_naming' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏛️ Keep the historic name — at least people have learned it'
WHERE event_id = 'stadium_naming' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏅 Name it after the previous mayor — a useful tradition needs a head start'
WHERE event_id = 'stadium_naming' AND choice_index = 2 AND lang = 'en';

-- sewage_overflow
UPDATE game_event_locales
SET title = 'The Sewer Gives Up',
    description = 'The main sewer has failed. Sewage is flooding the waterfront. Even residents who don''t follow local news are now fully informed.'
WHERE event_id = 'sewage_overflow' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛠️ Allocate emergency funds for a full repair'
WHERE event_id = 'sewage_overflow' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Call it ''temporary infrastructure work'' — the wording has already been fixed'
WHERE event_id = 'sewage_overflow' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📞 Call my brother''s firm — a public inconvenience, a private opportunity'
WHERE event_id = 'sewage_overflow' AND choice_index = 2 AND lang = 'en';

-- friday_country_club
UPDATE game_event_locales
SET title = 'Friday at the Country Club',
    description = 'Friday, eight in the morning. You''re on a poolside lounger; a queue of people has ''one small favor'' to ask. At city hall, appointments are required. Here, swimwear will do.'
WHERE event_id = 'friday_country_club' AND lang = 'en';

UPDATE game_choice_locales
SET text = '☕ Sort out business requests for ''sponsorship contributions'' — they need a mayor, I need people'
WHERE event_id = 'friday_country_club' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Use city funds to help ordinary residents with municipal tax and kindergarten places'
WHERE event_id = 'friday_country_club' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Put up a ''Mayor Off Duty'' sign and head for the sauna'
WHERE event_id = 'friday_country_club' AND choice_index = 2 AND lang = 'en';

-- country_cctv_raid
UPDATE game_event_locales
SET title = 'The Country Club Recordings',
    description = 'Investigators arrive at the country club for last Friday''s security footage. You took no minutes of your meetings. The camera was more conscientious.'
WHERE event_id = 'country_cctv_raid' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💾 Burn the server cabinet — the wiring couldn''t bear the responsibility'
WHERE event_id = 'country_cctv_raid' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '😬 Hand over the flash drive — perhaps the camera remembers nothing either'
WHERE event_id = 'country_cctv_raid' AND choice_index = 1 AND lang = 'en';

-- kindergarten_favor
UPDATE game_event_locales
SET title = 'A Kindergarten Connection',
    description = 'An old friend wants his child transferred urgently to an elite kindergarten downtown. There have been no vacancies for ages. He assumes that''s the answer you give strangers.'
WHERE event_id = 'kindergarten_favor' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💥 Fire the education chief, push another child out and put our own in'
WHERE event_id = 'kindergarten_favor' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤫 Promise to arrange everything, then do nothing — why spoil a friendship by refusing?'
WHERE event_id = 'kindergarten_favor' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Show him the door — the law applies to everyone. He has just joined everyone'
WHERE event_id = 'kindergarten_favor' AND choice_index = 2 AND lang = 'en';

-- metro_depot
UPDATE game_event_locales
SET title = 'The Metro Depot',
    description = 'The transport ministry proposes a huge metro depot in town. Residents fear construction will never end. Contractors fear it will.'
WHERE event_id = 'metro_depot' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏗️ Approve it — public project, private gratitude'
WHERE event_id = 'metro_depot' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚜 Move the depot beside the opposition leader''s villas — bring him closer to the people and their transport'
WHERE event_id = 'metro_depot' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Block the project in court — let the residents sleep soundly, at least'
WHERE event_id = 'metro_depot' AND choice_index = 2 AND lang = 'en';

-- bagrut_success
UPDATE game_event_locales
SET title = 'Better School Results',
    description = 'The city could set a record for passing school-leaving exams. Schools need tutors and laboratories to do it. Nobody has suggested simply improving the report.'
WHERE event_id = 'bagrut_success' AND lang = 'en';

UPDATE game_choice_locales
SET text = '📚 Provide the maximum funding — let the children know what they''re doing, at least'
WHERE event_id = 'bagrut_success' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Keep the standard curriculum — we got through it somehow'
WHERE event_id = 'bagrut_success' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '✂️ Cut the education budget and move the savings into my fund — one must think of the future'
WHERE event_id = 'bagrut_success' AND choice_index = 2 AND lang = 'en';

-- park_sculptures
UPDATE game_event_locales
SET title = 'Modern Art in the Park',
    description = 'Your sculptor friend proposes decorating the central park with rusty metal abstractions, at city expense. The estimate is what distinguishes them from scrap.'
WHERE event_id = 'park_sculptures' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎨 Approve the estimate — he''ll share the fee. I''m beginning to appreciate art'
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Reject it — let it rust at his expense for now'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏛️ Hold an open competition for young local artists — strangers may have talent too'
WHERE event_id = 'park_sculptures' AND choice_index = 2 AND lang = 'en';

-- yom_haatzmaut
UPDATE game_event_locales
SET title = 'Independence Day Celebrations',
    description = 'Sponsors have supplied millions for a concert, fireworks and food. The police won''t spoil the holiday. The money is here. All that remains is to decide who gets to celebrate.'
WHERE event_id = 'yom_haatzmaut' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎉 Add my own money and throw a magnificent feast — stranger things have happened'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🍿 Spend the sponsorship on the festivities and keep a small remainder — I''m a resident too'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤑 Keep all the money and give the people cheap flags — let them wave'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 2 AND lang = 'en';

-- wife_dog_park
UPDATE game_event_locales
SET title = 'A Dog for Your Wife',
    description = 'Your wife wants a dog, but the neighborhood has no dog park. There is no dog yet. Somehow, the city already has an obligation.'
WHERE event_id = 'wife_dog_park' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🐕 Give construction to a friend — pedigree dog, food voucher and trainer included'
WHERE event_id = 'wife_dog_park' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏗️ Hold an open tender for the dog park — let something here be competitive'
WHERE event_id = 'wife_dog_park' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙅 Refuse: ''A dog is a lot of responsibility. You already have a mayor'''
WHERE event_id = 'wife_dog_park' AND choice_index = 2 AND lang = 'en';

-- cat_exhibition
UPDATE game_event_locales
SET title = 'The Cat Show',
    description = 'Your wife has met the local cat club and wants a city cat show. She has acquired a hobby. The city has acquired an expense.'
WHERE event_id = 'cat_exhibition' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🐈 Give a promoter friend the job for a kickback — the cats shouldn''t be the only ones purring'
WHERE event_id = 'cat_exhibition' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📋 Provide funding and hold an open competition — pedigrees are for the cats only'
WHERE event_id = 'cat_exhibition' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤧 Refuse on grounds of a fur allergy — sneeze for emphasis'
WHERE event_id = 'cat_exhibition' AND choice_index = 2 AND lang = 'en';

-- lgbt_parade
UPDATE game_event_locales
SET title = 'Pride on Weizmann Street',
    description = 'Organizers request a Pride parade on Weizmann Street. The parade still needs permission. The scandal has proceeded without it.'
WHERE event_id = 'lgbt_parade' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏳️‍🌈 Approve it on Weizmann — support freedom. Your money, your wish'
WHERE event_id = 'lgbt_parade' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎪 Offer an enclosed site in the industrial zone — we respect everyone, some at a distance'
WHERE event_id = 'lgbt_parade' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Ban it: ''I''m straight! I''ll have this whole town on its knees!'''
WHERE event_id = 'lgbt_parade' AND choice_index = 2 AND lang = 'en';

-- lgbt_coalition_crisis
UPDATE game_event_locales
SET title = 'A Coalition with Pride',
    description = 'Your religious coalition partners have their pride too. They demand the immediate closure of the city''s LGBT club. They wouldn''t be caught dead in this coalition. Leaving it, however, is out of the question.'
WHERE event_id = 'lgbt_coalition_crisis' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🔒 Close the club — my convictions are firm, the coalition isn''t'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚚 Move the club to the industrial zone at city expense — farther from temptation, closer to storage'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏢 Open a second club in the heart of the religious neighborhood — apparently one wasn''t enough'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 2 AND lang = 'en';

-- mayors_strip_club
UPDATE game_event_locales
SET title = 'The Mayors'' After-Party',
    description = 'After the annual mayors'' convention, you and your colleagues visit a strip club. The press finds out. The convention itself never got this coverage.'
WHERE event_id = 'mayors_strip_club' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Deny everything: ''It''s edited! I''ve never enjoyed myself that much!'''
WHERE event_id = 'mayors_strip_club' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '⚖️ Hire an expensive lawyer to explain to reporters what they didn''t see'
WHERE event_id = 'mayors_strip_club' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📸 Leak the other mayors'' photos — why should my town be embarrassed alone?'
WHERE event_id = 'mayors_strip_club' AND choice_index = 2 AND lang = 'en';

-- mayors_revenge
UPDATE game_event_locales
SET title = 'The Mayors Strike Back',
    description = 'The neighboring mayors discover who leaked the strip-club photos. Intermunicipal cooperation is finally working. Against you.'
WHERE event_id = 'mayors_revenge' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💸 Pay compensation into their joint municipal fund — honor and dignity accept bank transfers'
WHERE event_id = 'mayors_revenge' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛡️ Ignore their threats and block joint projects — our towns have irreconcilable differences'
WHERE event_id = 'mayors_revenge' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎉 Throw a private reconciliation party with a lavish buffet — we have much to remember, and more to forget'
WHERE event_id = 'mayors_revenge' AND choice_index = 2 AND lang = 'en';

-- son_wedding
UPDATE game_event_locales
SET title = 'Your Son''s Wedding',
    description = 'Your son is getting married. At last, a chance to gather all the right people and call it a private life.'
WHERE event_id = 'son_wedding' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏰 Throw a lavish wedding for the right people — happiness for the couple, envelopes for Dad'
WHERE event_id = 'son_wedding' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🕊️ Let the children organize it themselves — let''s see whether life exists without city hall'
WHERE event_id = 'son_wedding' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🥂 A modest celebration, close relatives only, paid for myself — almost embarrassing to admit'
WHERE event_id = 'son_wedding' AND choice_index = 2 AND lang = 'en';

-- wedding_investigation
UPDATE game_event_locales
SET title = 'Wedding Gifts Under Investigation',
    description = 'Reporters take an interest in the wedding envelopes. You say gifts. They ask what services were provided. No respect for family values.'
WHERE event_id = 'wedding_investigation' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Hire a fixer — the editorial staff must have family values of some kind'
WHERE event_id = 'wedding_investigation' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🔥 Set fire to the newspaper office — give them a genuinely hot story'
WHERE event_id = 'wedding_investigation' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Dismiss it as slander and refuse to answer — they''re upset they weren''t invited'
WHERE event_id = 'wedding_investigation' AND choice_index = 2 AND lang = 'en';

-- father_funeral
UPDATE game_event_locales
SET title = 'Your Father''s Funeral',
    description = 'Your father has died. You are receiving condolences. People arrive with heavy hearts. Some also bring a business proposition.'
WHERE event_id = 'father_funeral' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🕯️ Receive important people and settle business — the police will have the decency not to intrude'
WHERE event_id = 'father_funeral' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '👥 Welcome colleagues and relatives, but no business talk — one day without an agenda'
WHERE event_id = 'father_funeral' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🔒 Keep the mourning private; admit only those closest to us — people who knew my father, not my job title'
WHERE event_id = 'father_funeral' AND choice_index = 2 AND lang = 'en';

-- father_monument_offer
UPDATE game_event_locales
SET title = 'A Monument from the Developers',
    description = 'Developers who came to offer condolences propose paying for a magnificent memorial. The monument is for your father. The debt of gratitude is yours.'
WHERE event_id = 'father_monument_offer' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🪦 Accept the biggest monument — let everyone see whose son made a success of himself'
WHERE event_id = 'father_monument_offer' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📐 Accept their help, but choose a modest memorial — I''m not asking for anything extravagant'
WHERE event_id = 'father_monument_offer' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Decline and pay myself — let there be one place where I owe nobody a favor'
WHERE event_id = 'father_monument_offer' AND choice_index = 2 AND lang = 'en';

-- daughter_school
UPDATE game_event_locales
SET title = 'Your Daughter Starts School',
    description = 'Schools are assigning classes. Your daughter needs good classmates. You need their parents.'
WHERE event_id = 'daughter_school' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏫 Place her with the children of useful people — a parents'' meeting is still a business meeting'
WHERE event_id = 'daughter_school' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎒 Choose an ordinary class — equality shouldn''t be reserved for other people''s children'
WHERE event_id = 'daughter_school' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎓 Send her to an exclusive private school — I know who''s responsible for the public ones'
WHERE event_id = 'daughter_school' AND choice_index = 2 AND lang = 'en';

-- school_flood
UPDATE game_event_locales
SET title = 'A Flood at School',
    description = 'Old pipes burst at your daughter''s school. The classrooms are flooded. The water evidently doesn''t know whose children these are.'
WHERE event_id = 'school_flood' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Have the well-connected parents fix it — they''ll work quickly and remember the mayor'
WHERE event_id = 'school_flood' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏗️ Arrange municipal repairs through a tender — school closes for a month; procedure must not be rushed'
WHERE event_id = 'school_flood' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛠️ Pay for immediate repairs myself — for once, I''ll know what repairs actually cost'
WHERE event_id = 'school_flood' AND choice_index = 2 AND lang = 'en';

-- apartment_renovation
UPDATE game_event_locales
SET title = 'The Apartment Renovation',
    description = 'Your wife wants a renovation. She is no longer satisfied with the apartment. So far, only the apartment.'
WHERE event_id = 'apartment_renovation' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛠️ Call a contractor I know — let him do this job as if it were his own home'
WHERE event_id = 'apartment_renovation' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '💸 Give her money: ''Don''t deny yourself anything.'' I seem unable to deny you anything either'
WHERE event_id = 'apartment_renovation' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Spread my hands: ''There''s no money.'' The trick is not to point at it'
WHERE event_id = 'apartment_renovation' AND choice_index = 2 AND lang = 'en';

-- renovation_leak
UPDATE game_event_locales
SET title = 'The Renovation Goes Public',
    description = 'A blogger posts photos of the luxurious renovation a municipal contractor did for you free of charge. Now the whole town knows he can do a good job when required.'
WHERE event_id = 'renovation_leak' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💰 Pay to have the post removed — one last finishing touch'
WHERE event_id = 'renovation_leak' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 ''That''s not my apartment! I remember mine before the renovation'''
WHERE event_id = 'renovation_leak' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '⚖️ Sue for libel — the truth should not be published without permission'
WHERE event_id = 'renovation_leak' AND choice_index = 2 AND lang = 'en';

-- wife_real_estate
UPDATE game_event_locales
SET title = 'A Little Place Abroad',
    description = 'Your wife has been browsing Instagram and wants ''a little place in Italy.'' The modesty of the request resides entirely in the word ''little.'''
WHERE event_id = 'wife_real_estate' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏡 Buy a very expensive house on Lake Como — anything modest would be in poor taste'
WHERE event_id = 'wife_real_estate' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏢 Buy a two-room apartment in Sunny Beach, Bulgaria — still abroad; she should have dreamed more precisely'
WHERE event_id = 'wife_real_estate' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏚️ Buy an apartment in Tiberias — it has a lake. We needn''t invite the Italians'
WHERE event_id = 'wife_real_estate' AND choice_index = 2 AND lang = 'en';

-- tiberias_mockery
UPDATE game_event_locales
SET title = 'The Mayor''s Bargain Home',
    description = 'A blogger mocks your old apartment in Tiberias. Neighboring mayors laugh. So do the police. A man in your position, living in a place like that.'
WHERE event_id = 'tiberias_mockery' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🥊 Hire thugs through a contact to beat the blogger — I still have money for good people'
WHERE event_id = 'tiberias_mockery' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '😤 Grit my teeth and take it — the apartment is mine, the opinions aren''t'
WHERE event_id = 'tiberias_mockery' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📢 Start a public media war — everyone has something worse than my apartment'
WHERE event_id = 'tiberias_mockery' AND choice_index = 2 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📰 Commission a flattering article — modesty is a virtue, given a decent publicity budget'
WHERE event_id = 'tiberias_mockery' AND choice_index = 3 AND lang = 'en';
