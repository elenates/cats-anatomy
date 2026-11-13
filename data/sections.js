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
  { id: "vnejsi",      cs: "Vnější stavba těla",  icon: "🐈", status: "soon" },
  { id: "organy",      cs: "Vnitřní orgány",      icon: "🫀", status: "soon" },
  { id: "soustavy",    cs: "Tělesné soustavy",    icon: "🔄", status: "soon" },
  { id: "svaly",       cs: "Svaly",               icon: "💪", status: "soon" },
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

  // Atlas screen (stage 5) – to be proofread
  layerLabel: "Zobrazit",
  layerKosti: "Kosti",
  layerKlouby: "Klouby",
  togglesLabel: "Zobrazení",
  togglePopisky: "Popisky",
  toggleLatinsky: "Latinsky",
  toggleZvidave: "Pro zvídavé",
  figureLabel: "Obrázek kostry kočky",
  figureCredit: "Obrázek: J. Reighard a H. S. Jennings, Anatomy of the Cat (1901), kresba Louise Burridge Jennings. Volné dílo.",
  cardEmptyKosti: "Klepni na kost na obrázku.",
  cardEmptyKlouby: "Klepni na kloub na obrázku.",
  kdeJe: "Kde je?",
  coDela: "Co dělá?",
  zajimavost: "Zajímavost",
  moreInPart: "Další v části",
  close: "Zavřít"
};
