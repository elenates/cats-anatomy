/*
 * Games of Kočka a člověk (#72 stage 5). Plain script (no ES modules) so the app works from file://.
 * Czech text: proofread by Lenka (2026-11-21).
 *
 * kdoMa: "Má to kočka, člověk, nebo oba?" (scripts/kdo-ma.js). Each question has the right answer
 *   (kocka / clovek / oba), a short explanation and, where there is one, the Kočka a člověk card it comes from
 *   (card: an item id of data/clovek.js). Every fact is one already checked for data/clovek.js (its srovnani or
 *   fakta texts, with their sources) or the cat cards; "src" names it. Funny answers are set aside, never a mistake.
 * spojClovek: "Spoj, co patří k sobě" (scripts/spoj.js): a part and "Kde ji najdeš u člověka?" (its kdeJe).
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.kdoMa = {
  questions: 10,   // questions per game
  answers: { kocka: "Kočka", clovek: "Člověk", oba: "Oba" },
  items: [
    { id: "ocas", q: "Kdo má ocas?", a: "kocka", card: "kostrc", src: "fakta ocas",
      text: "Kočka má ocas s 20 až 23 obratli. Člověk má na konci páteře jen kostrč." },
    { id: "kostrc", q: "Kdo má na konci páteře malou kostrč?", a: "clovek", card: "kostrc", src: "kostrc",
      text: "Kostrč má člověk. Kočka má místo ní dlouhý ocas." },
    { id: "krk", q: "Kdo má v krku 7 obratlů?", a: "oba", card: "krcni-obratle", src: "krcni-obratle",
      text: "Kočka i člověk mají 7 krčních obratlů." },
    { id: "zebra13", q: "Kdo má 13 párů žeber?", a: "kocka", card: "zebra", src: "zebra",
      text: "Kočka má 13 párů žeber, člověk 12 párů." },
    { id: "zebra12", q: "Kdo má 12 párů žeber?", a: "clovek", card: "zebra", src: "zebra",
      text: "Člověk má 12 párů žeber, kočka 13 párů." },
    { id: "bedra", q: "Kdo má 7 bederních obratlů?", a: "kocka", card: "bederni-obratle", src: "bederni-obratle",
      text: "Kočka má 7 bederních obratlů, člověk 5." },
    { id: "klicni", q: "Kdo má klíční kost, která spojuje lopatku s hrudní kostí?", a: "clovek", card: "klicni-kost", src: "klicni-kost",
      text: "Takovou klíční kost má člověk. Kočka má jen malou klíční kost uloženou ve svalech." },
    { id: "ceska", q: "Kdo má na koleni čéšku?", a: "oba", card: "ceska", src: "ceska",
      text: "Čéšku na koleni má kočka i člověk." },
    { id: "prsty5", q: "Kdo má 5 prstů na noze nebo na zadní tlapce?", a: "clovek", card: "prsty-nohy", src: "prsty-nohy",
      text: "Člověk má na noze 5 prstů. Kočka má na zadní tlapce jen 4." },
    { id: "po-prstech", q: "Kdo chodí jen po prstech a patu má vysoko nad zemí?", a: "kocka", card: "kost-patni", src: "fakta po-prstech",
      text: "Po prstech chodí kočka. Člověk při chůzi došlapuje na celé chodidlo, včetně paty." },
    { id: "srdce", q: "Kdo má srdce se čtyřmi dutinami?", a: "oba", card: "srdce", src: "srdce",
      text: "Srdce kočky i člověka má dvě síně a dvě komory." },
    { id: "plice", q: "Kdo dýchá plícemi?", a: "oba", card: "plice", src: "plice",
      text: "Kočka i člověk dýchají plícemi." },
    { id: "jatra", q: "U koho jsou játra největším vnitřním orgánem?", a: "oba", card: "jatra", src: "jatra",
      text: "Játra jsou největším vnitřním orgánem u kočky i u člověka." },
    { id: "deloha", q: "Kdo má dělohu se dvěma dlouhými rohy?", a: "kocka", card: "deloha", src: "deloha",
      text: "Kočičí děloha má dva dlouhé rohy, ve kterých může růst několik koťat najednou." },
    { id: "drapy", q: "Kdo umí schovat drápy?", a: "kocka", card: null, src: "fakta drapy-nehty",
      text: "Kočka má ostré zahnuté drápy a umí je schovat. Člověk má na prstech ploché nehty." },
    { id: "vousy", q: "Kdo má na čenichu dlouhé hmatové vousy?", a: "kocka", card: null, src: "fakta vousy",
      text: "Hmatové vousy má kočka. Pomáhají jí vnímat předměty a překážky v blízkém okolí." },
    { id: "vicko", q: "Kdo má třetí víčko, které chrání a čistí oko?", a: "kocka", card: null, src: "fakta treti-vicko",
      text: "Třetí víčko má kočka. Člověku z něj zbyl jen malý růžový záhyb v koutku oka." },
    { id: "oci", q: "Komu se ve tmě lesknou oči?", a: "kocka", card: null, src: "fakta svitici-oci",
      text: "Kočičí oči se ve tmě lesknou, protože mají vrstvu, která odráží dopadající světlo. Lidské oko ji nemá." },
    { id: "sladke", q: "Kdo pozná sladkou chuť?", a: "clovek", card: null, src: "fakta sladka-chut",
      text: "Sladkou chuť pozná člověk. Kočce chybí funkční chuťový receptor pro sladkou chuť." },
    { id: "usi", q: "Kdo má v každém uchu asi 32 svalů?", a: "kocka", card: null, src: "fakta usi",
      text: "Kočka má v uchu asi 32 svalů a otáčí každým uchem zvlášť. Člověk ušima skoro nehýbe." },
    { id: "mlecne", q: "Kdo má jako mládě mléčné zuby?", a: "oba", card: null, src: "fakta zuby",
      text: "Kotě i dítě mají mléčné zuby: kotě 26, dítě 20." },
    { id: "savci", q: "Kdo je savec?", a: "oba", card: null, src: "fakta savci",
      text: "Kočka i člověk jsou savci: mláďata pijí mléko od maminky." }
  ],
  funny: [
    "Jen dinosaurus",
    "Jen robot",
    "Jen plyšový medvídek",
    "Jen sněhulák",
    "Jen drak z pohádky",
    "Jen mimozemšťan"
  ],
  ui: {
    title: "Má to kočka, člověk, nebo oba?",
    open: "Má to kočka, člověk, nebo oba?",
    back: "Zpět na kočku a člověka",
    backHref: "#/clovek",
    progress: "Otázka {n} z {total}",
    answersLabel: "Odpovědi",
    right: "Správně!",
    wrong: "Tohle není ono.",
    rightIs: "Správná odpověď: {answer}.",
    next: "Další otázka",
    finish: "Výsledek",
    score: "Správně: {score} z {total}",
    great: "Jsi expert na kočky i na lidi!",
    review: "Na tyhle se ještě podívej:",
    again: "Hrát znovu",
    funnyReplies: [
      "Ha, to by byla legrace! Zkus jinou odpověď.",
      "Kdepak, to je jen vtip. Vyber znovu.",
      "To by se kočka divila! Zkus to znovu."
    ]
  }
};

window.ATLAS_DATA.spojClovek = {
  rounds: 3,
  pairs: 4,
  funnyPerRound: 2,
  answerField: "kdeJe",
  only: ["lebka", "krcni-obratle", "kostrc", "zebra", "hrudni-kost", "klicni-kost", "lopatka", "kost-pazni", "kost-loketni",
         "prsty-ruky", "panev", "kost-stehenni", "ceska", "kost-holenni", "kost-patni", "prsty-nohy",
         "mozek", "plice", "srdce", "jatra", "zaludek", "tenke-strevo", "mocovy-mechyr"],
  conflicts: [
    ["lebka", "mozek"],                                   // the head
    ["zebra", "hrudni-kost", "plice", "srdce"],           // the chest
    ["klicni-kost", "krcni-obratle", "hrudni-kost"],      // the neck and the front of the chest
    ["lopatka", "klicni-kost", "kost-pazni"],             // the shoulder
    ["jatra", "zaludek"],                                 // upper belly
    ["tenke-strevo", "mocovy-mechyr"],                    // lower belly
    ["kostrc", "panev"],                                  // the bottom of the spine
    ["kost-stehenni", "ceska", "kost-holenni"],           // the knee
    ["kost-patni", "prsty-nohy"]                          // the foot
  ],
  funny: [
    "V kapse u kalhot.",
    "Pod polštářem, když spíš.",
    "Na zádech u želvy.",
    "V lednici vedle jogurtu.",
    "Na špičce nosu u sněhuláka.",
    "Na střeše domu."
  ],
  ui: {
    title: "Spoj, co patří k sobě",
    open: "Spoj, co patří k sobě",
    back: "Zpět na kočku a člověka",
    backHref: "#/clovek",
    great: "Víš, kde je co v lidském těle!",
    howTo: "Klepni na část těla a pak vyber, kde ji najdeš u člověka. Pozor, některé odpovědi jsou jen pro legraci!",
    round: "Kolo {n} z {total}",
    namesLabel: "Části těla",
    answersLabel: "Kde ji najdeš u člověka?",
    pickName: "Vyber nejdřív část těla vlevo.",
    pickAnswer: "Teď vyber, kde najdeš: {name}",
    right: "{name} – správně!",
    wrong: "Tohle k sobě nepatří. Zkus to znovu.",
    funnyReplies: [
      "Ha, tam ji nenajdeš!",
      "Kdepak, to je jen vtip. Zkus jinou odpověď.",
      "To by se člověk divil! Vyber znovu."
    ],
    nextRound: "Další kolo",
    finish: "Výsledek",
    score: "Napoprvé správně: {score} z {total}",
    again: "Hrát znovu"
  }
};
