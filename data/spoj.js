/*
 * Quiz "Spoj, co patří k sobě" (scripts/spoj.js).
 * Plain script (no ES modules) so the app works from file://.
 *
 * Pairs come from data/kostra.js: the Czech name of a Základ structure and its
 * "Co dělá?" text. Structures in one "conflicts" group have similar texts and
 * never appear in the same round. "funny" are made-up answers mixed in among the
 * real ones; they belong to nothing. Czech text: proofread (v0.2); new text must be proofread.
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.spoj = {
  rounds: 3,          // rounds per game
  pairs: 4,           // real pairs per round
  funnyPerRound: 2,   // made-up answers per round

  conflicts: [
    ["kost-vretenni", "kost-stehenni", "kost-holenni"],          // "nese váhu těla"
    ["kost-pazni", "kost-vretenni", "kost-loketni"],             // the elbow
    ["kost-stehenni", "kost-patni", "hlezenni-kloub"],           // "odraz"
    ["loketni-kloub", "kolenni-kloub", "zapestni-kloub"],        // "ohýbá"
    ["ramenni-kloub", "kycelni-kloub"],                          // "umožňuje noze pohyb"
    ["ramenni-kloub", "loketni-kloub"],                          // front leg moves
    ["kycelni-kloub", "kolenni-kloub"],                          // hind leg moves
    ["lopatka", "panev"],                                        // leg to trunk / spine
    ["zebra", "hrudni-kost"],                                    // ribs
    ["pater", "krcni-obratle", "ocasni-obratle"],                // vertebrae
    ["zuby", "dolni-celist"]                                     // the mouth
  ],

  funny: [
    "Svítí ve tmě, aby kočka v noci našla misku.",
    "Kočka si do ní schovává ztracené ponožky.",
    "Pípne, když je čas na večeři.",
    "Chytá pohádky z rádia jako anténa.",
    "Počítá, kolik hodin kočka prospala.",
    "Předpovídá, jaké bude zítra počasí.",
    "Kočka na ni hraje jako na flétnu, když se nudí.",
    "Je v ní schovaná zásoba granulí na zimu.",
    "Pomáhá kočce létat jako ptáček.",
    "Zazvoní jako zvonek, když kočka kýchne."
  ],

  ui: {
    title: "Spoj, co patří k sobě",
    open: "Spoj, co patří k sobě",
    back: "Zpět na kostru",
    howTo: "Klepni na kost nebo kloub a pak na to, co dělá. Pozor, některé odpovědi jsou jen pro legraci!",
    round: "Kolo {n} z {total}",
    namesLabel: "Kosti a klouby",
    answersLabel: "Co dělá?",
    pickName: "Vyber nejdřív kost nebo kloub vlevo.",
    pickAnswer: "Teď vyber odpověď pro: {name}",
    right: "{name} – správně!",
    wrong: "Tohle k sobě nepatří. Zkus to znovu.",
    funnyReplies: [
      "Ha, to by byla legrace! Ale to žádná kost neumí.",
      "Kdepak, to by se kočka divila!",
      "To je jen vtip. Zkus jinou odpověď.",
      "Takovou kost má jen kočka z pohádky."
    ],
    nextRound: "Další kolo",
    finish: "Výsledek",
    score: "Napoprvé správně: {score} z {total}",
    again: "Hrát znovu"
  }
};

/*
 * The same game for Svaly (M5 stage 6): names and "Co dělá?" texts of the Základ muscles
 * (data/svaly.js). 12 muscles, so 3 rounds of 3. Czech text: to proofread.
 */
window.ATLAS_DATA.spojSvaly = {
  rounds: 3,
  pairs: 3,
  funnyPerRound: 2,

  conflicts: [
    ["deltovy-sval", "siroky-sval-zadovy", "prsni-svaly"],          // move the front leg at the shoulder
    ["svaly-stehna", "ctyrhlavy-sval-stehenni"],                      // knee, "odrazit se"
    ["trojhlavy-sval-lytkovy", "achillova-slacha"]                    // the heel
  ],

  funny: [
    "Hraje na buben, když kočka přede.",
    "Nafukuje kočku jako balonek.",
    "Drží kočce brýle na nose.",
    "Šlape do pedálů, když kočka jede na kole.",
    "Zvedá činky v kočičí posilovně.",
    "Tleská, když kočka chytí myš.",
    "Pomáhá kočce zpívat v kočičím sboru.",
    "Uklízí kočce pelíšek, když spí."
  ],

  ui: {
    title: "Spoj, co patří k sobě",
    open: "Spoj, co patří k sobě",
    back: "Zpět na svaly",
    backHref: "#/svaly",
    great: "Jsi expert na kočičí svaly!",
    howTo: "Klepni na sval a pak na to, co dělá. Pozor, některé odpovědi jsou jen pro legraci!",
    round: "Kolo {n} z {total}",
    namesLabel: "Svaly",
    answersLabel: "Co dělá?",
    pickName: "Vyber nejdřív sval vlevo.",
    pickAnswer: "Teď vyber odpověď pro: {name}",
    right: "{name} – správně!",
    wrong: "Tohle k sobě nepatří. Zkus to znovu.",
    funnyReplies: [
      "Ha, to by byla legrace! Ale to žádný sval neumí.",
      "Kdepak, to by se kočka divila!",
      "To je jen vtip. Zkus jinou odpověď.",
      "Takový sval má jen kočka z pohádky."
    ],
    nextRound: "Další kolo",
    finish: "Výsledek",
    score: "Napoprvé správně: {score} z {total}",
    again: "Hrát znovu"
  }
};

/*
 * Spoj, co patří k sobě for Smysly (M6 stage 5): the Základ structures of data/smysly.js.
 * Conflicts: texts about light coming into the eye; texts about messages for the brain
 * (and the lens text, which names the retina); the two papillae with taste buds.
 * Czech text: to proofread.
 */
window.ATLAS_DATA.spojSmysly = {
  rounds: 3,
  pairs: 3,
  funnyPerRound: 2,

  conflicts: [
    ["rohovka", "duhovka", "cocka"],                       // light into the eye, focusing
    ["zrakovy-nerv", "hlemyzd", "sitnice", "cocka"],       // messages for the brain; "sítnice" in the lens and nerve texts
    ["houbovite-papily", "hrazene-papily"]                 // taste buds
  ],

  funny: [
    "Pouští kočce v hlavě pohádky.",
    "Šeptá kočce do ucha vtipy.",
    "Ochutnává za kočku zmrzlinu.",
    "Počítá, kolik myší kočka chytila.",
    "Hlídá, aby kočka nezaspala čas na snídani.",
    "Píská, když se blíží pes.",
    "Vybírá kočce nejměkčí polštář.",
    "Zpívá kočce ukolébavku."
  ],

  ui: {
    title: "Spoj, co patří k sobě",
    open: "Spoj, co patří k sobě",
    back: "Zpět na smysly",
    backHref: "#/smysly",
    great: "Jsi expert na kočičí smysly!",
    howTo: "Klepni na část oka, ucha nebo jazyka a potom na to, co dělá. Pozor, některé odpovědi jsou jen pro legraci!",
    round: "Kolo {n} z {total}",
    namesLabel: "Části",
    answersLabel: "Co dělá?",
    pickName: "Vyber nejdřív část vlevo.",
    pickAnswer: "Teď vyber odpověď pro: {name}",
    right: "{name} – správně!",
    wrong: "Tohle k sobě nepatří. Zkus to znovu.",
    funnyReplies: [
      "Ha, to by byla legrace! Ale žádná část kočičího těla to neumí.",
      "Kdepak, to by se kočka divila!",
      "To je jen vtip. Zkus jinou odpověď.",
      "Tohle umí jen kočka z pohádky."
    ],
    nextRound: "Další kolo",
    finish: "Výsledek",
    score: "Napoprvé správně: {score} z {total}",
    again: "Hrát znovu"
  }
};

/*
 * Spoj, co patří k sobě for Vnější stavba těla (M7): the Základ body parts of data/vnejsi.js.
 * Conflicts: the head text names the eyes, ears and nose, and the neck "carries the head";
 * chest, belly and back say what is inside; legs, paw and claws are about moving and hunting.
 * Czech text: to proofread.
 */
window.ATLAS_DATA.spojVnejsi = {
  rounds: 3,
  pairs: 4,
  funnyPerRound: 2,

  conflicts: [
    ["hlava", "oko", "ucho", "nos", "krk"],            // the head text names eyes, ears and nose; the neck carries the head
    ["hrudnik", "bricho", "hrbet"],                    // what is inside
    ["predni-noha", "zadni-noha", "tlapka", "drapy"]   // walking, jumping, hunting
  ],

  funny: [
    "Pomáhá kočce psát domácí úkoly.",
    "Mává na pozdrav pošťákovi.",
    "Nosí kočce klobouk.",
    "Hraje na klavír, když nikdo není doma.",
    "Řídí kočičí autíčko.",
    "Zalévá kočce květiny na okně.",
    "Drží kočce deštník, když prší.",
    "Zavazuje kočce tkaničky."
  ],

  ui: {
    title: "Spoj, co patří k sobě",
    open: "Spoj, co patří k sobě",
    back: "Zpět na vnější stavbu těla",
    backHref: "#/vnejsi",
    great: "Jsi expert na kočičí tělo!",
    howTo: "Klepni na část těla a potom na to, co dělá. Pozor, některé odpovědi jsou jen pro legraci!",
    round: "Kolo {n} z {total}",
    namesLabel: "Části těla",
    answersLabel: "Co dělá?",
    pickName: "Vyber nejdřív část těla vlevo.",
    pickAnswer: "Teď vyber odpověď pro: {name}",
    right: "{name} – správně!",
    wrong: "Tohle k sobě nepatří. Zkus to znovu.",
    funnyReplies: [
      "Ha, to by byla legrace! Ale žádná část kočičího těla to neumí.",
      "Kdepak, to by se kočka divila!",
      "To je jen vtip. Zkus jinou odpověď.",
      "Tohle umí jen kočka z pohádky."
    ],
    nextRound: "Další kolo",
    finish: "Výsledek",
    score: "Napoprvé správně: {score} z {total}",
    again: "Hrát znovu"
  }
};
