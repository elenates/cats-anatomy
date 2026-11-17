/*
 * Doplň popisky (M7 stage 2): the child puts Czech labels on the empty spots of a picture.
 * figures: the pictures to choose from (hotspot figure id, layer, button text).
 * perRound / rounds: labels per round and rounds per game (fewer when a picture has fewer Základ structures).
 * Czech text: to proofread.
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.popisky = {
  perRound: 5,
  rounds: 2,
  figures: [
    { figure: "skeleton", layer: "kosti", cs: "Kostra" },
    { figure: "cat-side", layer: "telo", cs: "Vnější stavba těla" },
    { figure: "organs-side", layer: "organy", cs: "Vnitřní orgány" },
    { figure: "muscles-superficial", layer: "svaly", cs: "Svaly pod kůží" },
    { figure: "eye", layer: "smysly", cs: "Oko" }
  ],
  ui: {
    title: "Doplň popisky",
    intro: "Vyber si obrázek a doplň na něj popisky.",
    howTo: "Přetáhni popisek na správné kolečko. Nebo klepni na popisek a potom na kolečko.",
    round: "Kolo {n} z {total}",
    labelsHeading: "Popisky",
    spot: "Prázdné kolečko {n}",
    spotDone: "{n}. {name}",
    pickLabel: "Vyber nejdřív popisek.",
    pickSpot: "Teď klepni na kolečko, kam patří: {name}",
    right: "{name} – správně!",
    wrong: "Sem to nepatří. Zkus jiné kolečko.",
    nextRound: "Další kolo",
    finish: "Výsledek",
    score: "Napoprvé správně: {score} z {total}",
    great: "Jsi expert na popisky!",
    again: "Hrát znovu",
    otherFigure: "Jiný obrázek",
    back: "Zpět na procvičování"
  }
};
