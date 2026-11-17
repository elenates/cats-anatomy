/*
 * Závěrečný kvíz (M7 stage 3): Základ questions from all sections, three kinds:
 *   najdi – find the structure on its picture (one tap),
 *   coDela – "Co dělá …?": its "Co dělá?" text and two others of the same section (one answer),
 *   kam – "Do které části patří …?": the right section, one other section and one funny answer
 *         (a funny answer gets a funny reply and is set aside; it is not a mistake).
 * sections: where the structures come from; figures = pictures for "najdi"; spoj = the Spoj config whose
 *   conflicts keep look-alike texts out of one "coDela" question; kam: false = no "kam" questions
 *   (Vnější: eye, ear, tail… belong to more than one section).
 * The game ends with a Diplom to print; the name is typed in and not saved anywhere.
 * Czech text: to proofread.
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.zaverecny = {
  counts: { najdi: 6, coDela: 5, kam: 4 },
  sections: [
    { id: "kostra", figures: [{ figure: "skeleton", layer: "kosti" }], spoj: "spoj", kam: true },
    { id: "vnejsi", figures: [{ figure: "cat-side", layer: "telo" }], spoj: "spojVnejsi", kam: false },
    { id: "organy", figures: [{ figure: "organs-side", layer: "organy" }], spoj: null, kam: true },
    { id: "svaly", figures: [{ figure: "muscles-superficial", layer: "svaly" }, { figure: "muscles-hindleg", layer: "svaly" }], spoj: "spojSvaly", kam: true },
    { id: "smysly", figures: [{ figure: "eye", layer: "smysly" }, { figure: "inner-ear", layer: "smysly" }, { figure: "tongue", layer: "smysly" }], spoj: "spojSmysly", kam: true }
  ],

  funny: [
    "Kočičí šatna",
    "Pelíšek pod dekou",
    "Krabice od bot",
    "Šuplík s ponožkami",
    "Mňoukací koutek",
    "Myší spíž",
    "Hračky pod gaučem",
    "Kočičí cukrárna"
  ],

  ui: {
    title: "Závěrečný kvíz",
    open: "Závěrečný kvíz",
    intro: "Otázky ze všech částí atlasu. Na konci dostaneš diplom.",
    progress: "Otázka {n} z {total}",
    najdi: "Najdi: {name}",
    coDela: "Co dělá: {name}?",
    kam: "Do které části patří: {name}?",
    hint: "Klepni na obrázek.",
    missTap: "Tady nic není. Zkus to znovu.",
    right: "Správně!",
    wrong: "Tohle není ono.",
    rightIsFigure: "Správné místo je zvýrazněné zeleně.",
    rightIs: "Správná odpověď: {answer}",
    funnyReplies: [
      "Ha, tam by se kočka divila! Zkus jinou odpověď.",
      "To je jen vtip. Vyber znovu.",
      "Kdepak, tohle v atlasu není!",
      "Tam patří leda ponožky. Zkus to znovu."
    ],
    next: "Další otázka",
    finish: "Výsledek",
    score: "Správně: {score} z {total}",
    great: "Jsi expert na kočičí tělo!",
    review: "Na tyhle se ještě podívej:",
    again: "Hrát znovu",
    back: "Zpět na procvičování",
    diplomHeading: "Tvůj diplom",
    nameLabel: "Napiš své jméno:",
    nameNote: "Jméno se nikam neukládá.",
    makeDiplom: "Vytvořit diplom",
    print: "Vytisknout diplom",
    diplomTitle: "Diplom",
    diplomFor: "pro",
    diplomText: "za prozkoumání kočičího těla v atlasu Kočičí tělo pod lupou",
    diplomScore: "Závěrečný kvíz – správně: {score} z {total}",
    diplomDate: "Datum: {date}"
  }
};
