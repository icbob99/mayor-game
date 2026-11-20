-- Recovery only: append as a new deployment entry if approved; preserve history.

-- bench_tender
UPDATE game_event_locales
SET title = 'Park Benches Tender',
    description = 'A contractor offers a kickback to win a tender for ''luxury'' park benches. Meanwhile, your wife is hinting about a new penthouse.'
WHERE event_id = 'bench_tender' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🧳 Take it all! Give the job to your cousin'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '👜 Take a moderate cut through a shell company'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '❌ Refuse and hold a fair and honest tender'
WHERE event_id = 'bench_tender' AND choice_index = 2 AND lang = 'en';

-- tama_38
UPDATE game_event_locales
SET title = 'TAMA 38 Shenanigans',
    description = 'A developer asks you to turn a blind eye to three ''extra'' floors in a downtown TAMA 38 project. He promises a solid deposit to a Swiss bank.'
WHERE event_id = 'tama_38' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏗️ Sign the permit blindly'
WHERE event_id = 'tama_38' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🌳 Force him to build a park in exchange for the floors'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛑 Block the construction (developer is furious)'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'en';

-- shelters_budget
UPDATE game_event_locales
SET title = 'Bomb Shelters Budget',
    description = 'The state allocated a huge budget to renovate old bomb shelters. Your brother-in-law suddenly opened an armored doors company.'
WHERE event_id = 'shelters_budget' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚪 Give the entire tender to your brother-in-law'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛠️ Give him a partial cut, do the rest honestly'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛡️ Conduct a strict independent audit'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'en';

-- state_comptroller
UPDATE game_event_locales
SET title = 'State Comptroller Audit',
    description = 'A surprise audit from the State Comptroller hits the municipality. The auditors demand access to last year''s accounting books.'
WHERE event_id = 'state_comptroller' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💰 Bribe the chief auditor'
WHERE event_id = 'state_comptroller' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🔥 Arrange an ''accidental'' fire in the archives'
WHERE event_id = 'state_comptroller' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🐐 Throw a low-level clerk under the bus'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'en';

-- shabbat_blackmail
UPDATE game_event_locales
SET title = 'Coalition Crisis (Shabbat)',
    description = 'Religious parties threaten to dismantle the coalition unless you close all parks and businesses on Shabbat. Your wife loves Saturday strolls.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🕍 Give in and close everything (wife is furious)'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Compromise: close downtown, open in the suburbs'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🖕 Tell them to get lost: we are a secular city!'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'en';

-- lawyer_visit
UPDATE game_event_locales
SET title = 'Visit from a Fixer Lawyer',
    description = 'A well-known fixer lawyer offers to ''lose'' a couple of unpleasant files on you in Lahav 433 for a hefty fee.'
WHERE event_id = 'lawyer_visit' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💼 Pay and sleep peacefully'
WHERE event_id = 'lawyer_visit' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Ask for a discount'
WHERE event_id = 'lawyer_visit' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '❌ Kick him out: ''I am an honest mayor!'''
WHERE event_id = 'lawyer_visit' AND choice_index = 2 AND lang = 'en';

-- garbage_extortion
UPDATE game_event_locales
SET title = 'Garbage Extortion',
    description = 'Tough guys from Qalansawe showed up at the waste management tender, hinting that without their ''protection'', garbage trucks might get flat tires.'
WHERE event_id = 'garbage_extortion' AND lang = 'en';

UPDATE game_choice_locales
SET text = '👮 Go to the police (official report)'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Agree and hand over the cleanup contract'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🗣️ Pretend you don''t speak Arabic'
WHERE event_id = 'garbage_extortion' AND choice_index = 2 AND lang = 'en';

UPDATE game_choice_locales
SET text = '⚔️ Play them: invite rivals from Tayibe instead'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'en';

-- burning_trucks
UPDATE game_event_locales
SET title = 'Burning Garbage Trucks',
    description = 'A few days of calm are over: three garbage trucks burned overnight at the municipal depot. The words "Greetings from Qalansuwa" are spray-painted on the asphalt. Half the city is drowning in waste.'
WHERE event_id = 'burning_trucks' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚛 Urgently allocate from the budget to buy new vehicles'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Throw up your hands: there''s no money, let it stink (the public is shocked)'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'en';

-- neighbor_mayor_amuta
UPDATE game_event_locales
SET title = 'Brotherly Help to a Colleague',
    description = 'The mayor of Hadera panics: ahead of the elections, he urgently needs an ''amuta'' (nonprofit) for donations and asks for campaign backing.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💰 Go all in through a dummy foundation'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🪙 Give a small token amount just to keep up appearances'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛑 Politely refuse (no budget available)'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 2 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📰 Leak kompromat on him to a local Telegram channel'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 3 AND lang = 'en';

-- kompromat_retaliation
UPDATE game_event_locales
SET title = 'Media Counterattack',
    description = 'The mayor of Hadera hasn''t forgiven you for the leak. A major Telegram channel has published an investigation about your "undeclared" villa in Caesarea and photos of your wife at a Milan boutique.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💼 Spend on "friendly bloggers" to clean up the media landscape'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤐 Keep quiet (your approval rating crashes, and Lahav 433 takes an interest)'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'en';

-- shitty_burger
UPDATE game_event_locales
SET description = 'Inspectors found highly questionable meat at *White Burger*, owned by your main campaign donor. They are demanding an immediate shutdown.'
WHERE event_id = 'shitty_burger' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🥩 Issue a retroactive license on the house'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📸 PR stunt: devour a burger in front of the cameras'
WHERE event_id = 'shitty_burger' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '❌ Shut the joint down and ditch the donor'
WHERE event_id = 'shitty_burger' AND choice_index = 2 AND lang = 'en';

-- shabbat_parking
UPDATE game_event_locales
SET title = 'Shabbat Parking Hell',
    description = 'Secular neighborhood residents are furious: streets are blocked so badly an ambulance can''t pass. The opposition demands a towing crackdown.'
WHERE event_id = 'shabbat_parking' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚜 Dispatch inspectors and tow trucks early morning'
WHERE event_id = 'shabbat_parking' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Do nothing — don''t ruin people''s Shabbat'
WHERE event_id = 'shabbat_parking' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🅿️ Paint blue-and-white curbs right under the Rabbi''s windows'
WHERE event_id = 'shabbat_parking' AND choice_index = 2 AND lang = 'en';

-- flooded_street
UPDATE game_event_locales
SET title = 'Weizmann Street Flood',
    description = 'The first serious rain hit, and central Weizmann Street is completely underwater. The drainage maintenance budget vanished, and local news is roasting you.'
WHERE event_id = 'flooded_street' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🌞 Blame freak weather and global climate change'
WHERE event_id = 'flooded_street' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '💸 Urgently hire your brother-in-law''s firm without a tender at inflated rates'
WHERE event_id = 'flooded_street' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🥾 Put on rain boots for the cameras and dig the drain yourself'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'en';

-- arnona_scandal
UPDATE game_event_locales
SET title = 'Arnona Tax Scandal',
    description = 'Reporters found that your campaign donor gets an 80% property tax (Arnona) discount.'
WHERE event_id = 'arnona_scandal' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤫 Hush it up through city lawyers'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📉 Reduce discount to 30% for show'
WHERE event_id = 'arnona_scandal' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '⚖️ Cancel discount and demand full payment'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'en';

-- beach_kiosk
UPDATE game_event_locales
SET title = 'Public Beach Land Grab',
    description = 'A beach restaurant owner illegally seized 200m of public coastline for paid sunbeds.'
WHERE event_id = 'beach_kiosk' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🍹 Take a bribe and a permanent VIP table'
WHERE event_id = 'beach_kiosk' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚜 Send city bulldozers to demolish illegal structures'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🌊 Tsunami! Everything flooded, the restaurant was swept away, and the mayor distinguished himself rescuing swimmers.'
WHERE event_id = 'beach_kiosk' AND choice_index = 2 AND lang = 'en';

-- electric_scooters
UPDATE game_event_locales
SET title = 'Electric Scooter Chaos',
    description = 'Residents are furious about e-scooters cluttering sidewalks and knocking over pedestrians.'
WHERE event_id = 'electric_scooters' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛴 Charge operators heavy annual licensing fees'
WHERE event_id = 'electric_scooters' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Ban rental e-scooters in the city center completely'
WHERE event_id = 'electric_scooters' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🅿️ Paint designated parking zones'
WHERE event_id = 'electric_scooters' AND choice_index = 2 AND lang = 'en';

-- stadium_naming
UPDATE game_event_locales
SET title = 'Stadium Naming Rights',
    description = 'An oligarch wants to rename the municipal stadium after his holding company.'
WHERE event_id = 'stadium_naming' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💰 Sign a 10-year deal and pocket the fee'
WHERE event_id = 'stadium_naming' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏛️ Keep the historic municipal name'
WHERE event_id = 'stadium_naming' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏅 Name it after the previous mayor.'
WHERE event_id = 'stadium_naming' AND choice_index = 2 AND lang = 'en';

-- sewage_overflow
UPDATE game_event_locales
SET title = 'Main Sewage Pipe Burst',
    description = 'The main sewer line burst, flooding the seafront promenade with wastewater.'
WHERE event_id = 'sewage_overflow' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛠️ Allocate emergency budget for full repair'
WHERE event_id = 'sewage_overflow' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Claim it''s just ''routine maintenance'''
WHERE event_id = 'sewage_overflow' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📞 Call the brother''s company.'
WHERE event_id = 'sewage_overflow' AND choice_index = 2 AND lang = 'en';

-- friday_country_club
UPDATE game_event_locales
SET title = 'Friday Country Club Morning',
    description = 'Every Friday at 8:00 AM you sit by the Country Club pool. A queue of locals forms with ''small personal requests''.'
WHERE event_id = 'friday_country_club' AND lang = 'en';

UPDATE game_choice_locales
SET text = '☕ Settle local businessmen''s issues for ''campaign donations'''
WHERE event_id = 'friday_country_club' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Help regular citizens with tax/school issues using city funds'
WHERE event_id = 'friday_country_club' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Put up a ''Mayor is Off-Duty'' sign and head to the sauna'
WHERE event_id = 'friday_country_club' AND choice_index = 2 AND lang = 'en';

-- country_cctv_raid
UPDATE game_event_locales
SET title = 'Country Club CCTV Raid',
    description = 'Lahav 433 investigators arrive at the Country Club and demand the surveillance servers from last Friday.'
WHERE event_id = 'country_cctv_raid' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💾 Burn the server rack and blame a ''short circuit'''
WHERE event_id = 'country_cctv_raid' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '😬 Hand over the flash drive and hope for the best (+25% Threat)'
WHERE event_id = 'country_cctv_raid' AND choice_index = 1 AND lang = 'en';

-- kindergarten_favor
UPDATE game_event_locales
SET title = 'Kindergarten Favoritism',
    description = 'An old friend comes to your office asking to urgently transfer his kid into an elite downtown kindergarten, even though enrollment is closed.'
WHERE event_id = 'kindergarten_favor' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💥 Fire the head of education, kick out another kid and make room'
WHERE event_id = 'kindergarten_favor' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤫 Promise ''I’ll handle it personally'' and do nothing (he’ll figure it out later)'
WHERE event_id = 'kindergarten_favor' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Say ''the law is the law'' and kick your friend out of the office (friendship over)'
WHERE event_id = 'kindergarten_favor' AND choice_index = 2 AND lang = 'en';

-- metro_depot
UPDATE game_event_locales
SET title = 'Metro Depot Proposal',
    description = 'The Ministry of Transport wants to build a massive metro depot in your city. Contractors are thrilled, but residents are furious about the noise and construction.'
WHERE event_id = 'metro_depot' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏗️ Accept the project! National priority shields from police, and contractors repay handsomely'
WHERE event_id = 'metro_depot' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚜 Accept, but move the depot to the suburbs — right next to the opposition leader''s villas'
WHERE event_id = 'metro_depot' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Block the project in court for the peace and quiet of the residents'
WHERE event_id = 'metro_depot' AND choice_index = 2 AND lang = 'en';

-- bagrut_success
UPDATE game_event_locales
SET title = 'High School Exam Reform',
    description = 'There is a chance to boost Bagrut exam pass rates to a record high, but the education department requests a big budget for tutors and labs.'
WHERE event_id = 'bagrut_success' AND lang = 'en';

UPDATE game_choice_locales
SET text = '📚 Allocate maximum budget! Student success boosts city morale and approval'
WHERE event_id = 'bagrut_success' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Leave things as they are, let them study standard curriculum'
WHERE event_id = 'bagrut_success' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '✂️ Cut education budget and transfer savings to personal offshore'
WHERE event_id = 'bagrut_success' AND choice_index = 2 AND lang = 'en';

-- park_sculptures
UPDATE game_event_locales
SET title = 'Modern Art in the City Park',
    description = 'Your sculptor friend offers to place abstract rusty iron statues in the main park at municipal expense.'
WHERE event_id = 'park_sculptures' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎨 Sign the invoice! Your friend will generously share ''artist royalties'''
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Reject — residents won''t appreciate rusty metal on green lawns'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏛️ Announce an open contest for local young artists'
WHERE event_id = 'park_sculptures' AND choice_index = 2 AND lang = 'en';

-- yom_haatzmaut
UPDATE game_event_locales
SET title = 'Independence Day Celebration',
    description = 'The biggest event of the year! Sponsors transferred millions for concerts and fireworks. Police don''t bother anyone on holidays.'
WHERE event_id = 'yom_haatzmaut' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎉 Add extra city cash and throw a massive fest! People and wife are ecstatic'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🍿 Spend exactly what sponsors gave, keep a small change for yourself'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤑 Be greedy: pocket all sponsor cash and leave citizens with cheap paper flags'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 2 AND lang = 'en';

-- wife_dog_park
UPDATE game_event_locales
SET title = 'A Dog for the Wife',
    description = 'Your wife wants a dog, but there is no dog park in the neighborhood.'
WHERE event_id = 'wife_dog_park' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🐕 Do it through a friend: give the kennel construction to your man and get a pedigree dog, food voucher and trainer'
WHERE event_id = 'wife_dog_park' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏗️ Hold a proper public tender for the dog park'
WHERE event_id = 'wife_dog_park' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙅 Refuse: a dog is too much responsibility and simply «not her thing»'
WHERE event_id = 'wife_dog_park' AND choice_index = 2 AND lang = 'en';

-- cat_exhibition
UPDATE game_event_locales
SET title = 'Cat Exhibition',
    description = 'Your wife met a local cat-lovers club and asks you to organize a city exhibition.'
WHERE event_id = 'cat_exhibition' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🐈 Give the organization to a promoter friend for a kickback'
WHERE event_id = 'cat_exhibition' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📋 Allocate a budget and hold an open competition'
WHERE event_id = 'cat_exhibition' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤧 Claim the mayor is allergic to fur and shut the idea down'
WHERE event_id = 'cat_exhibition' AND choice_index = 2 AND lang = 'en';

-- lgbt_parade
UPDATE game_event_locales
SET title = 'Pride Parade on Weizmann Street',
    description = 'Organizers ask permission to hold a Pride Parade on the city''s central street. The issue has caused fierce debate.'
WHERE event_id = 'lgbt_parade' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏳️‍🌈 Allow it on Weizmann! Sponsors will thank you and progressives will be thrilled'
WHERE event_id = 'lgbt_parade' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎪 Allocate a closed venue in the industrial zone to avoid upsetting the religious'
WHERE event_id = 'lgbt_parade' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Declare: «I am straight, there will be no parade!»'
WHERE event_id = 'lgbt_parade' AND choice_index = 2 AND lang = 'en';

-- lgbt_coalition_crisis
UPDATE game_event_locales
SET title = 'Coalition Crisis',
    description = 'Your religious coalition partners are furious about the parade and demand the city''s LGBT club close immediately.'
WHERE event_id = 'lgbt_coalition_crisis' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🔒 Close the club and give in to the coalition'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚚 Move the club to the industrial zone at the city''s expense'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏢 Open a second club in the heart of a religious neighborhood (the organizers will pay well)'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 2 AND lang = 'en';

-- mayors_strip_club
UPDATE game_event_locales
SET title = 'Scandal after the Mayors'' Meeting',
    description = 'After the annual mayors'' convention, you went to celebrate at a strip club. The press found out and gave you a public beating.'
WHERE event_id = 'mayors_strip_club' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Deny everything: «I was never there, it is a montage!»'
WHERE event_id = 'mayors_strip_club' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '⚖️ Hire a top lawyer to force the journalists to bury the story'
WHERE event_id = 'mayors_strip_club' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📸 Leak compromising photos of the other mayors from that party'
WHERE event_id = 'mayors_strip_club' AND choice_index = 2 AND lang = 'en';

-- mayors_revenge
UPDATE game_event_locales
SET title = 'The Mayors'' Alliance Strikes Back',
    description = 'Mayors from neighboring cities discovered who leaked their strip-club photos to the press and decided to unite against you.'
WHERE event_id = 'mayors_revenge' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💸 Pay compensation into their inter-municipal fund'
WHERE event_id = 'mayors_revenge' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛡️ Ignore their threats and block joint city projects'
WHERE event_id = 'mayors_revenge' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎉 Throw a grand private reconciliation party with an extravagant buffet'
WHERE event_id = 'mayors_revenge' AND choice_index = 2 AND lang = 'en';

-- son_wedding
UPDATE game_event_locales
SET title = 'Son''s Wedding',
    description = 'Your son is getting married. It is an excellent event and a turning point for the whole family.'
WHERE event_id = 'son_wedding' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏰 Organize a lavish wedding: a cover for meetings with the right people and collecting envelopes'
WHERE event_id = 'son_wedding' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🕊️ Let the children organize everything themselves; the city stays out of it'
WHERE event_id = 'son_wedding' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🥂 Hold a modest celebration for close relatives at your own expense'
WHERE event_id = 'son_wedding' AND choice_index = 2 AND lang = 'en';

-- wedding_investigation
UPDATE game_event_locales
SET title = 'Wedding Investigation',
    description = 'Journalists discovered that bribes were handed to you as gifts at your son''s lavish wedding.'
WHERE event_id = 'wedding_investigation' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 Hire a fixer to deal with the editorial office'
WHERE event_id = 'wedding_investigation' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🔥 Set fire to the newspaper''s print shop/editorial office'
WHERE event_id = 'wedding_investigation' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Ignore the investigation and claim it is slander'
WHERE event_id = 'wedding_investigation' AND choice_index = 2 AND lang = 'en';

-- father_funeral
UPDATE game_event_locales
SET title = 'Mourning and Father''s Funeral',
    description = 'A family tragedy: your father has died. It is time for shiva and receiving condolences.'
WHERE event_id = 'father_funeral' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🕯️ Receive important people at shiva: you are grieving, police stay away, and business gets done'
WHERE event_id = 'father_funeral' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '👥 Receive colleagues and relatives without business talk'
WHERE event_id = 'father_funeral' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🔒 Keep shiva private and allow only the closest family'
WHERE event_id = 'father_funeral' AND choice_index = 2 AND lang = 'en';

-- father_monument_offer
UPDATE game_event_locales
SET title = 'Monument from Developers',
    description = 'Influential developers who visited the shiva offer to pay for an elite monument for your father.'
WHERE event_id = 'father_monument_offer' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🪦 Accept: your father deserves the biggest monument in the cemetery'
WHERE event_id = 'father_monument_offer' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📐 Accept the help, but build a modest and moderate monument'
WHERE event_id = 'father_monument_offer' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Refuse and build the monument entirely at your own expense'
WHERE event_id = 'father_monument_offer' AND choice_index = 2 AND lang = 'en';

-- daughter_school
UPDATE game_event_locales
SET title = 'Daughter Starts School',
    description = 'Classes are being formed for the new school year. It is time to decide who your daughter will study with.'
WHERE event_id = 'daughter_school' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏫 Put her in a class with the children of important people and businessmen'
WHERE event_id = 'daughter_school' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎒 A regular class: all children and parents are equal here'
WHERE event_id = 'daughter_school' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🎓 Send her to an exclusive private school'
WHERE event_id = 'daughter_school' AND choice_index = 2 AND lang = 'en';

-- school_flood
UPDATE game_event_locales
SET title = 'School Flood',
    description = 'Old pipes burst at your daughter''s school, completely flooding the classrooms.'
WHERE event_id = 'school_flood' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🤝 The important parents from the class will fix everything quickly and donate to the repairs'
WHERE event_id = 'school_flood' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏗️ Use a municipal tender for repairs (the school closes for a month)'
WHERE event_id = 'school_flood' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛠️ Fix everything immediately with your own money'
WHERE event_id = 'school_flood' AND choice_index = 2 AND lang = 'en';

-- apartment_renovation
UPDATE game_event_locales
SET title = 'Apartment Renovation',
    description = 'Your wife wants to renovate the apartment. You must choose between corruption, wasteful spending, and harsh austerity.'
WHERE event_id = 'apartment_renovation' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🛠️ Call a contractor you know'
WHERE event_id = 'apartment_renovation' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '💸 “Here is the money. Spare no expense.”'
WHERE event_id = 'apartment_renovation' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🚫 Stick to the “There is no money” principle'
WHERE event_id = 'apartment_renovation' AND choice_index = 2 AND lang = 'en';

-- renovation_leak
UPDATE game_event_locales
SET title = 'Renovation Leak',
    description = 'A blogger discovered the free luxury renovation from a city contractor and leaked photos online.'
WHERE event_id = 'renovation_leak' AND lang = 'en';

UPDATE game_choice_locales
SET text = '💰 Pay the blogger to delete the post'
WHERE event_id = 'renovation_leak' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🙈 Deny everything: “That is not my apartment”'
WHERE event_id = 'renovation_leak' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '⚖️ Sue for defamation'
WHERE event_id = 'renovation_leak' AND choice_index = 2 AND lang = 'en';

-- wife_real_estate
UPDATE game_event_locales
SET title = 'Overseas Real Estate',
    description = 'Your wife has been watching Instagram and wants to buy a little house in Italy.'
WHERE event_id = 'wife_real_estate' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏡 Buy a very expensive house on Lake Como'
WHERE event_id = 'wife_real_estate' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏢 Buy a two-room apartment on Bulgaria’s Sunny Beach'
WHERE event_id = 'wife_real_estate' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '🏚️ “Home is where you were born” — a run-down apartment in Tiberias'
WHERE event_id = 'wife_real_estate' AND choice_index = 2 AND lang = 'en';

-- tiberias_mockery
UPDATE game_event_locales
SET title = 'Mockery: “The Mayor Is a Loser”',
    description = 'A blogger learned about the old apartment in Tiberias. A humiliating article appears, and neighboring mayors and the police laugh at you.'
WHERE event_id = 'tiberias_mockery' AND lang = 'en';

UPDATE game_choice_locales
SET text = '🥊 Hire thugs through a contact to beat up the blogger'
WHERE event_id = 'tiberias_mockery' AND choice_index = 0 AND lang = 'en';

UPDATE game_choice_locales
SET text = '😤 Grit your teeth and endure the mockery'
WHERE event_id = 'tiberias_mockery' AND choice_index = 1 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📢 Start an open information war against your enemies'
WHERE event_id = 'tiberias_mockery' AND choice_index = 2 AND lang = 'en';

UPDATE game_choice_locales
SET text = '📰 Commission a flattering paid article about yourself'
WHERE event_id = 'tiberias_mockery' AND choice_index = 3 AND lang = 'en';
