/*
 * Quiz "Do které soustavy patří…?" (scripts/soustavy-kviz.js).
 * Plain script (no ES modules) so the app works from file://.
 *
 * Questions: Základ organs from data/organy.js that are on the organ drawing.
 * Each question offers the right body system, two other real ones and one
 * made-up "funny" system. A funny answer gets a funny reply and is set aside;
 * it never counts as a mistake. Czech text: new, must be proofread.
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.soustavyKviz = {
  questions: 8,       // questions per game
  realOptions: 3,     // real systems per question (the right one + 2 others)
  funnyOptions: 1,    // made-up systems per question

  funny: [
    "Mňoukací soustava",
    "Spací soustava",
    "Granulová soustava",
    "Pelíšková soustava",
    "Myšilovná soustava",
    "Mazlicí soustava",
    "Škrábací soustava na gauč"
  ],

  ui: {
    title: "Kvíz: Tělesné soustavy",
    open: "Do které soustavy patří?",
    back: "Zpět na vnitřní orgány",
    backSoustavy: "Zpět na tělesné soustavy",
    question: "Do které soustavy patří {organ}?",
    progress: "Otázka {n} z {total}",
    figureLabel: "Obrázek vnitřních orgánů kočky se zvýrazněným orgánem",
    answersLabel: "Soustavy",
    right: "Správně!",
    wrong: "Tohle není ono.",
    rightIs: "Správná odpověď: {system}.",
    next: "Další otázka",
    finish: "Výsledek",
    score: "Správně: {score} z {total}",
    great: "Jsi expert na tělesné soustavy!",
    review: "Na tyhle se ještě podívej:",
    again: "Hrát znovu",
    funnyReplies: [
      "Ha, taková soustava neexistuje! Zkus jinou.",
      "To by se kočka divila! Vyber znovu.",
      "To je jen vtip. Zkus jinou odpověď.",
      "Tu má jen kočka z pohádky."
    ]
  }
};
