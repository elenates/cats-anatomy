/*
 * Section list for the main menu.
 * Plain script (no ES modules) so the app works when opened via file://.
 *
 * status: "active" -> section can be opened
 *         "soon"   -> shown in the menu as "Připravujeme", not clickable
 *
 * Czech labels are child-facing text and must be proofread.
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.sections = [
  { id: "kostra",      cs: "Kostra",              icon: "🦴", status: "active" },
  { id: "vnejsi",      cs: "Vnější stavba těla",  icon: "🐈", status: "active" },
  { id: "organy",      cs: "Vnitřní orgány",      icon: "🫀", status: "active" },
  { id: "soustavy",    cs: "Tělesné soustavy",    icon: "🔄", status: "active" },
  { id: "svaly",       cs: "Svaly",               icon: "💪", status: "active" },
  { id: "smysly",      cs: "Smysly",              icon: "👁️", status: "soon" },
  { id: "procvicovani", cs: "Procvičování",       icon: "✏️", status: "soon" }
];

/* UI strings (Czech). Kept in one place to make proofreading easier. */
window.ATLAS_DATA.ui = {
  appTitle: "Kočičí tělo pod lupou",
  menuHeading: "Co chceš prozkoumat?",
  soon: "Připravujeme",
  back: "Zpět na menu",
  kostraPlaceholder: "Tady brzy bude obrázek kostry, na který půjde klepat.",

  // Atlas screen (stage 5) – proofread (v0.2)
  layerLabel: "Zobrazit",
  layerKosti: "Kosti",
  layerKlouby: "Klouby",
  togglesLabel: "Zobrazení",
  togglePopisky: "Popisky",
  toggleLatinsky: "Latinsky",
  toggleZvidave: "Pro zvídavé",
  figureLabel: "Obrázek kostry kočky",
  figurePrefix: "Obrázek",
  figureCredit: "J. Reighard a H. S. Jennings, Anatomy of the Cat (1901), kresba Louise Burridge Jennings. Volné dílo.",
  cardEmptyKosti: "Klepni na kost na obrázku.",
  cardEmptyTelo: "Klepni na část těla na fotce.",
  layerTelo: "Části těla",
  figureLabelVnejsi: "Fotka kočky",
  seeBones: "Podívej se na kosti →",
  seeOrgans: "Podívej se dovnitř →",
  seeCloseup: "Podívej se zblízka →",
  closeupBack: "Zpět na vnitřní orgány",
  closeupsHeading: "Orgány zblízka",
  moreInCloseup: "Na dalším obrázku najdeš ještě:",
  // Tělesné soustavy (v0.4, stage 6) – to be proofread
  systemsLabel: "Soustavy",
  systemOrgans: "Patří sem:",
  systemMoreZvidave: "V režimu „Pro zvídavé“ uvidíš i další orgány.",
  systemNotOnFigure: "Tyto orgány na obrázku nejsou.",
  // Organ quiz (v0.4, stage 8) – to be proofread
  quizOpenOrgany: "Najdi orgán",
  quizTitleOrgany: "Kvíz: Najdi orgán",
  quizFigureLabelOrgany: "Obrázek vnitřních orgánů kočky – klepni na orgán, který hledáš",
  quizGreatOrgany: "Jsi expert na kočičí orgány!",
  quizBackOrgany: "Zpět na vnitřní orgány",
  layerOrgany: "Orgány",
  cardEmptyOrgany: "Klepni na orgán na obrázku.",
  figureLabelOrgany: "Obrázek vnitřních orgánů kočky",
  cardEmptyKlouby: "Klepni na kloub na obrázku.",

  // Svaly (M5 stage 4) – to proofread
  layerSvaly: "Svaly",
  cardEmptySvaly: "Klepni na sval na obrázku.",
  figureLabelSvaly: "Obrázek svalů kočky",
  svalyTabsLabel: "Obrázky svalů",
  seeMuscles: "Podívej se na svaly →",

  // Quiz Najdi sval (M5 stage 6) – to proofread
  quizOpenSvaly: "Najdi sval",
  quizTitleSvaly: "Kvíz: Najdi sval",
  quizFigureLabelSvaly: "Obrázek svalů kočky – klepni na sval, který hledáš",
  quizGreatSvaly: "Jsi expert na kočičí svaly!",
  quizBackSvaly: "Zpět na svaly",
  kdeJe: "Kde je?",
  coDela: "Co dělá?",
  zajimavost: "Zajímavost",
  moreInPart: "Další v části",
  close: "Zavřít",

  // Kostra part screens (M2 stage 4) – proofread (v0.2)
  partsHeading: "Části kostry",
  partBack: "Zpět na celou kostru",
  partFiguresLabel: "Obrázky",
  cardOnlyZvidave: "Na tomhle obrázku najdeš jen zajímavosti pro zvídavé. Zapni si režim „Pro zvídavé“.",

  // Quiz (stage 6) – proofread (v0.2)
  quizTitle: "Kvíz: Najdi kost nebo orgán",
  quizOpen: "Hrát kvíz",
  quizBack: "Zpět na kostru",
  quizFigureLabel: "Obrázek kostry – klepni na hledanou část",
  quizSpot: "Místo {n}",
  quizProgress: "Otázka {n} z {total}",
  quizFind: "Najdi:",
  quizHint: "Klepni na obrázek.",
  quizMissTap: "Tady nic není. Zkus to znovu.",
  quizPraise: ["Správně!", "Výborně!", "Přesně tak!", "Skvělé!"],
  quizAlsoRight: "{tapped} patří k části {target}.",
  quizWrong: "Tvoje odpověď: {tapped}.",
  quizShowRight: "Správné místo je zvýrazněné zeleně.",
  quizNext: "Další otázka",
  quizResult: "Výsledek",
  quizDone: "Hotovo!",
  quizScore: "Správně: {score} z {total}",
  quizGreat: "Jsi expert na kočičí kostru!",
  quizGood: "Moc dobře!",
  quizTryAgain: "Zkus to ještě jednou, půjde to líp!",
  quizReview: "Na tyhle se ještě podívej:",
  quizAgain: "Hrát znovu",
  quizNoData: "Kvíz zatím nemá otázky."
};

/*
 * Kostra part screens: which figures each part shows, in tab order.
 * figure = hotspot figure id (data/hotspots-kostra.js), cs = tab label,
 * layers = layers offered on that tab (default: all of the figure).
 * Only structures of the part are shown on its screen.
 */
window.ATLAS_DATA.kostraViews = {
  "pater-hrudnik": [
    { figure: "skeleton", cs: "Celá kostra", layers: ["kosti"] }
  ],
  "lebka-celisti": [
    { figure: "skull", cs: "Lebka z boku", layers: ["kosti"] },
    { figure: "skeleton", cs: "Celá kostra", layers: ["kosti"] }
  ],
  "predni-koncetiny": [
    { figure: "humerus", cs: "Kost pažní" },
    { figure: "radius-ulna", cs: "Předloktí" },
    { figure: "forepaw", cs: "Přední tlapka" },
    { figure: "skeleton", cs: "Celá kostra", layers: ["kosti"] }
  ],
  "panev-zadni": [
    { figure: "pelvis", cs: "Pánev", layers: ["kosti"] },
    { figure: "femur", cs: "Kost stehenní" },
    { figure: "tibia-fibula", cs: "Bérec" },
    { figure: "hindpaw", cs: "Zadní tlapka" },
    { figure: "skeleton", cs: "Celá kostra", layers: ["kosti"] }
  ],
  "klouby-pohyb": [
    { figure: "skeleton", cs: "Celá kostra", layers: ["klouby"] },
    { figure: "skull", cs: "Lebka", layers: ["klouby"] },
    { figure: "pelvis", cs: "Pánev", layers: ["klouby"] }
  ]
};
