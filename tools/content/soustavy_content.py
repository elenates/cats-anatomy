# Tělesné soustavy – content for review (M4 stage 6).
# One short text per body system (Základ) plus one extra sentence for Pro zvídavé.
# Organs per system come from the `soustava` field in organy_content.py.

SYSTEMS = [
  dict(id="nervova",
       text="Mozek a mícha řídí celé tělo. Nervy jim přinášejí zprávy od očí, uší, nosu i kůže a odnášejí pokyny svalům.",
       zvidave="Zprávy běží po nervech velmi rychle, proto kočka dokáže bleskově zareagovat.",
       sources="LAWSON-NS (spinal nerves connect the spinal cord to sense organs, muscles and glands; optic nerves carry impulses from the eye to the brain); LAWSON-NSY (information from the sense organs is processed; the response makes muscles contract; neurons transmit high-speed nerve impulses)"),
  dict(id="dychaci",
       text="Kočka vdechne vzduch nosem. Průdušnicí jde do plic a tam se z něj kyslík dostane do krve. Bránice pomáhá plícím nadechovat.",
       zvidave="Při výdechu jde z plic ven oxid uhličitý. Je to odpad, kterého se tělo musí zbavit.",
       sources="LAWSON-AIR (air passages: nasal cavity, trachea); LAWSON-RO (oxygen passes from the alveoli into the blood by diffusion; carbon dioxide is a waste product eliminated where oxygen enters); LAWSON-BR (breathing by the diaphragm and ribs)"),
  dict(id="obehova",
       text="Srdce pumpuje krev do celého těla. Krev roznáší kyslík z plic a živiny ze střev.",
       zvidave="Patří sem i slezina. Odstraňuje z krve staré červené krvinky.",
       sources="MERCK-HEART (heart pumps blood; blood takes up oxygen in the lungs); LAWSON-SI (digested food is absorbed into the blood); LAWSON-RO (cells need oxygen and glucose); BRIT-SPL (spleen removes old red blood cells; general anatomy)"),
  dict(id="travici",
       text="Potrava jde z tlamy jícnem do žaludku a pak do střev. Cestou se rozloží a živiny se vstřebají do krve. Co tělo nepotřebuje, odchází ven jako trus.",
       zvidave="Játra a slinivka vyrábějí šťávy, které pomáhají trávit. Potrava jimi ale neprochází.",
       sources="LAWSON-OES (oesophagus carries food to the stomach); LAWSON-ST (stomach stores and mixes food); LAWSON-SI (digestion and absorption into the blood); LAWSON-LI (colon absorbs water, solid faeces; rectum); LAWSON-LIV (liver makes bile); LAWSON-PJ (pancreatic juice flows into the duodenum)"),
  dict(id="mocova",
       text="Ledviny čistí krev a vyrábějí moč. Moč teče močovody do močového měchýře. Když je měchýř plný, kočka se vyčůrá.",
       note="Někdy se jí říká také vylučovací soustava, protože pomáhá odvádět odpadní látky z těla. Když veterinář mluví o nemocech nebo vyšetření moči, používá název močová soustava.",
       zvidave="Z močového měchýře vede moč ven ještě jedna trubička, močová trubice. Odpadní látky ale odcházejí z těla i jinudy: oxid uhličitý kočka vydechuje plícemi a zbytky potravy odcházejí střevem.",
       sources="MUNI-VYL (vylučovací soustava = kidneys and urinary tract; waste is also removed by the lungs, large intestine and sweat glands); LAWSON-RO (carbon dioxide is a waste product removed through the lungs); LAWSON-LI (faeces); LAWSON-KID (kidneys; urine flows down the ureter to the bladder, out through the urethra); MERCK-DESC (kidneys filter waste; ureters, bladder, urethra)"),
  dict(id="rozmnozovaci",
       text="Díky rozmnožovací soustavě se rodí koťata. Kočka má vaječníky a dělohu, kocour má varlata. Koťata rostou v děloze asi dva měsíce a po narození pijí mateřské mléko.",
       zvidave="Kočka mívá v jednom vrhu nejčastěji asi čtyři koťata. Narodí se se zavřenýma očima i ušima a mámu najdou po čichu.",
       sources="LAWSON-FR (ovaries produce egg cells; growth of the foetus takes place in the uterus); LAWSON-MR (a pair of testes produce sperm); MERCK-REPRO (pregnancy lasts 60 to 65 days); RUTGERS-KIT (pregnancy averages 63 days; litters from 1 to 10, average four; newborn kittens have eyes and ears sealed shut and find the mammary glands by smell; nursing within 30–40 minutes)",
       flags="Stage 7 (brief and factual). Organs are not on the drawing (varle was left out in stage 1), so the drawing is shown fully faded."),
]

SOURCES = [
  ("LAWSON-NSY", "Lawson R. Anatomy and Physiology of Animals, 14.2 The Nervous System (LibreTexts, CC BY-SA 3.0)", "https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/14%3A_Nervous_System/14.02%3A_The_Nervous_System"),
  ("LAWSON-RO", "Lawson R. Anatomy and Physiology of Animals, 9.1 Overview (Respiratory System; LibreTexts, CC BY-SA 3.0)", "https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/09%3A_Respiratory_System/9.01%3A_Overview"),
  ("MUNI-VYL", "Masarykova univerzita, Pedagogická fakulta, VZkB21: Praktické cvičení č. 6 – Vylučovací soustava (2018, PDF)", "https://is.muni.cz/el/ped/jaro2018/VZkB21/um/PL_5_Vylucovaci_soustava.pdf"),
  ("LAWSON-FR", "Lawson R. Anatomy and Physiology of Animals, 13.4 The Female Reproductive Organs (LibreTexts, CC BY-SA 3.0)", "https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/13%3A_Reproductive_System/13.04%3A_The_Female_Reproductive_Organs"),
  ("LAWSON-MR", "Lawson R. Anatomy and Physiology of Animals, 13.3 The Male Reproductive Organs (LibreTexts, CC BY-SA 3.0)", "https://med.libretexts.org/Bookshelves/Veterinary_Medicine/Anatomy_and_Physiology_of_Animals_(Lawson)/13%3A_Reproductive_System/13.03%3A_The_Male_Reproductive_Organs"),
  ("MERCK-REPRO", "Merck Veterinary Manual (pet owner). Management of Reproduction of Cats (Davidson AP; full review Aug 2018, upd. Aug 2025)", "https://www.merckvetmanual.com/cat-owners/reproductive-disorders-of-cats/management-of-reproduction-of-cats"),
  ("RUTGERS-KIT", "Sharma D (Rutgers Univ.). Basics of Pregnancy and Birth in the Cat. Companion Animals, extension.org", "https://companion-animals.extension.org/?p=31"),
]
