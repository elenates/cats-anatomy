/*
 * Mini card "Zařazení kočky v přírodě" (main menu).
 * Plain script (no ES modules) so the app works from file://.
 *
 * From the largest group to the cat itself. level "zvidave" rows are shown
 * only with "Pro zvídavé" on; la only with "Latinsky" on (same toggles as the
 * atlas). link: optional atlas screen that shows what the row talks about.
 * refs: sources/references.md. Child-facing Czech text: to be proofread.
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.zarazeni = {
  title: "Kam patří kočka v přírodě?",
  intro: "Vědci řadí zvířata do skupin, od největší po nejmenší. Kočka domácí patří do všech těchto skupin najednou:",
  rows: [
    { rank: "Říše", cs: "živočichové", la: "Animalia", level: "zvidave",
      text: "Všechna zvířata.", refs: ["GBIF-FC", "CSW-KD"] },
    { rank: "Kmen", cs: "strunatci", la: "Chordata", level: "zvidave",
      text: "Zvířata s hřbetní strunou – pružnou oporou podél zad (aspoň v zárodku).", refs: ["GBIF-FC", "CSW-OBR"] },
    { rank: "Podkmen", cs: "obratlovci", la: "Vertebrata", level: "zaklad",
      text: "Zvířata s lebkou a páteří z obratlů. Patří sem ryby, obojživelníci, plazi, ptáci i savci.",
      link: { href: "#/kostra/pater-hrudnik", cs: "Prohlédni si kočičí páteř" }, refs: ["CSW-OBR", "CSW-SAV"] },
    { rank: "Třída", cs: "savci", la: "Mammalia", level: "zaklad",
      text: "Mláďata pijí mateřské mléko a tělo mají pokryté srstí.", refs: ["GBIF-FC", "CSW-SAV"] },
    { rank: "Řád", cs: "šelmy", la: "Carnivora", level: "zaklad",
      text: "Většinou lovci, kteří se živí masem. Kořist chytají ostrými špičáky.",
      link: { href: "#/kostra/lebka-celisti", cs: "Prohlédni si kočičí zuby" }, refs: ["GBIF-FC", "CSW-SEL"] },
    { rank: "Čeleď", cs: "kočkovití", la: "Felidae", level: "zaklad",
      text: "Patří sem lev, tygr i kočka domácí.", refs: ["GBIF-FC", "CSW-POR", "CSW-KOC"] },
    { rank: "Rod", cs: "kočka", la: "Felis", level: "zvidave",
      text: "Patří sem kočka divoká, kočka plavá i kočka domácí.", refs: ["GBIF-FC", "CSW-KOC"] },
    { rank: "Druh", cs: "kočka domácí", la: "Felis catus", level: "zaklad",
      text: "Ochočená (domestikovaná) kočka plavá. S lidmi žije už tisíce let.", refs: ["MDD-FC", "CSW-KD"] }
  ]
};
