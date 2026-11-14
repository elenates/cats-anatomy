/*
 * Quiz "Spoj, co patří k sobě" (scripts/spoj.js).
 * Plain script (no ES modules) so the app works from file://.
 *
 * Pairs come from data/kostra.js: the Czech name of a Základ structure and its
 * "Co dělá?" text. Structures in one "conflicts" group have similar texts and
 * never appear in the same round. "funny" are made-up answers mixed in among the
 * real ones; they belong to nothing. All Czech text here: to be proofread.
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
