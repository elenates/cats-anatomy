/*
 * Vnitřní orgány (internal organs) content, v0.4.
 *
 * Generated from the review sheet "Vnitřní orgány – content review (v0.4)".
 * Edit the sheet first, then regenerate this file.
 * Plain script (no ES modules) so the app works from file://.
 *
 * Fields per item (same meaning as in data/kostra.js):
 *   id, cs, la (NAV 2017), level, kdeJe, coDela, zajimavost (may be null), refs
 *   soustava  body system the organ belongs to (see soustavy)
 *   kostra    Kostra part screen with the bones around this organ, or null
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.organy = {
  soustavy: [
    { id: "nervova", cs: "Nervová soustava" },
    { id: "dychaci", cs: "Dýchací soustava" },
    { id: "obehova", cs: "Oběhová soustava" },
    { id: "travici", cs: "Trávicí soustava" },
    { id: "mocova", cs: "Močová soustava" }
  ],
  items: [
    {
      id: "mozek",
      cs: "Mozek",
      la: "Encephalon",
      level: "zaklad",
      soustava: "nervova",
      kdeJe: "V hlavě, ukrytý v lebce.",
      coDela: "Řídí celé tělo. Zpracovává, co kočka vidí, slyší a cítí, a pamatuje si, co se naučila.",
      zajimavost: "Zadní část mozku, mozeček, pomáhá kočce udržet rovnováhu.",
      kostra: "lebka-celisti",
      refs: ["NAV", "LAWSON-NS"]
    },
    {
      id: "micha",
      cs: "Mícha",
      la: "Medulla spinalis",
      level: "zaklad",
      soustava: "nervova",
      kdeJe: "Uvnitř páteře, od mozku až ke kosti křížové.",
      coDela: "Vede zprávy mezi mozkem a celým tělem.",
      zajimavost: "Mícha nesahá až do ocasu. Končí u kosti křížové a dál pokračují už jen nervy.",
      kostra: "pater-hrudnik",
      refs: ["NAV", "LAWSON-NS", "RICHTER24", "RJ1901"]
    },
    {
      id: "nosni-dutina",
      cs: "Nosní dutina",
      la: "Cavum nasi",
      level: "zvidave",
      soustava: "dychaci",
      kdeJe: "Uvnitř nosu, nad tlamou.",
      coDela: "Vede vzduch dovnitř. Vzduch se v ní ohřeje a zvlhčí.",
      zajimavost: null,
      kostra: "lebka-celisti",
      refs: ["NAV", "LAWSON-AIR"]
    },
    {
      id: "ustni-dutina",
      cs: "Ústní dutina",
      la: "Cavum oris",
      level: "zvidave",
      soustava: "travici",
      kdeJe: "Uvnitř tlamy.",
      coDela: "Kočka v ní zuby kouše potravu a sliny ji zvlhčí. Jazykem pije a olizuje se.",
      zajimavost: "Jazyk je drsný. Pokrývají ho drobné výrůstky, kterým se říká papily. Kočka jím umí olízat maso z kosti.",
      kostra: "lebka-celisti",
      refs: ["NAV", "MERCK-DESC"]
    },
    {
      id: "prudusnice",
      cs: "Průdušnice",
      la: "Trachea",
      level: "zaklad",
      soustava: "dychaci",
      kdeJe: "V krku, pod jícnem. Vede až do hrudníku.",
      coDela: "Vede vzduch z nosu a tlamy do plic.",
      zajimavost: "Otevřenou ji drží chrupavčité kroužky. Při polykání zakryje vchod do hrtanu příklopka hrtanová, aby jídlo nezapadlo do průdušnice.",
      kostra: null,
      refs: ["NAV", "LAWSON-AIR", "RJ1901"]
    },
    {
      id: "jicen",
      cs: "Jícen",
      la: "Esophagus",
      level: "zaklad",
      soustava: "travici",
      kdeJe: "V krku a hrudníku, nad průdušnicí. Vede z tlamy až do žaludku.",
      coDela: "Posouvá spolknuté jídlo do žaludku.",
      zajimavost: "Svaly ve stěně jícnu tlačí sousto dál, podobně jako když mačkáš zubní pastu z tuby.",
      kostra: null,
      refs: ["NAV", "LAWSON-OES", "RJ1901"]
    },
    {
      id: "plice",
      cs: "Plíce",
      la: "Pulmo",
      level: "zaklad",
      soustava: "dychaci",
      kdeJe: "V hrudníku. Vyplňují skoro celý jeho prostor.",
      coDela: "Kočka jimi dýchá. V plících se do krve dostává kyslík ze vzduchu.",
      zajimavost: "V klidu se kočka nadechne asi 16 až 40krát za minutu.",
      kostra: "pater-hrudnik",
      refs: ["NAV", "LAWSON-LUNG", "RJ1901", "MERCK-HEART", "MERCK-RESP"]
    },
    {
      id: "srdce",
      cs: "Srdce",
      la: "Cor",
      level: "zaklad",
      soustava: "obehova",
      kdeJe: "V hrudníku mezi plícemi, trochu víc vlevo.",
      coDela: "Je to dutý sval, který pumpuje krev do celého těla.",
      zajimavost: "V klidu může bít víc než 120krát za minutu. Zkus si spočítat, kolikrát za minutu bije tvoje srdce.",
      kostra: "pater-hrudnik",
      refs: ["NAV", "RJ1901", "MERCK-HEART"]
    },
    {
      id: "branice",
      cs: "Bránice",
      la: "Diaphragma",
      level: "zaklad",
      soustava: "dychaci",
      kdeJe: "Přepážka mezi hrudníkem a břichem.",
      coDela: "Je to velký sval. Když se stáhne, hrudník se zvětší a do plic proudí vzduch.",
      zajimavost: null,
      kostra: null,
      refs: ["NAV", "LAWSON-BR", "LAWSON-LUNG"]
    },
    {
      id: "jatra",
      cs: "Játra",
      la: "Hepar",
      level: "zaklad",
      soustava: "travici",
      kdeJe: "V břiše, hned za bránicí.",
      coDela: "Vyrábějí žluč, která pomáhá trávit tuky. Ukládají zásobu cukru a čistí krev od škodlivých látek.",
      zajimavost: "Játra jsou největší orgán uvnitř těla. Na obrázku vypadají menší, než ve skutečnosti jsou.",
      kostra: null,
      refs: ["NAV", "LAWSON-LIV", "RJ1901"]
    },
    {
      id: "zlucnik",
      cs: "Žlučník",
      la: "Vesica biliaris",
      level: "zvidave",
      soustava: "travici",
      kdeJe: "Schovaný mezi laloky jater.",
      coDela: "Uchovává žluč z jater. Když kočka jí, žlučník se stáhne a žluč pošle do střeva.",
      zajimavost: "Kůň žlučník vůbec nemá.",
      kostra: null,
      refs: ["NAV", "VETHISTO", "RJ1901", "WIKIVET-GB"]
    },
    {
      id: "zaludek",
      cs: "Žaludek",
      la: "Ventriculus",
      level: "zaklad",
      soustava: "travici",
      kdeJe: "V břiše, za játry, víc vlevo.",
      coDela: "Uchová spolknuté jídlo a promíchá ho se žaludeční šťávou, která začne trávit maso.",
      zajimavost: "Žaludeční šťáva obsahuje kyselinu, takže je velmi kyselá.",
      kostra: null,
      refs: ["NAV", "LAWSON-ST", "RJ1901"]
    },
    {
      id: "slezina",
      cs: "Slezina",
      la: "Lien",
      level: "zvidave",
      soustava: "obehova",
      kdeJe: "V břiše, vlevo podél žaludku.",
      coDela: "Odstraňuje z krve staré červené krvinky a pomáhá tělu bránit se nemocem.",
      zajimavost: null,
      kostra: null,
      refs: ["NAV", "RJ1901", "BRIT-SPL"]
    },
    {
      id: "tenke-strevo",
      cs: "Tenké střevo",
      la: "Intestinum tenue",
      level: "zaklad",
      soustava: "travici",
      kdeJe: "V břiše, stočené do mnoha kliček. Zabírá většinu břicha.",
      coDela: "Dokončí trávení a vstřebá živiny z potravy do krve.",
      zajimavost: "Podle staré knihy o kočičí anatomii je asi třikrát delší než kočičí tělo. Do břicha se vejde jen proto, že je stočené.",
      kostra: null,
      refs: ["NAV", "LAWSON-SI", "RJ1901"]
    },
    {
      id: "tluste-strevo",
      cs: "Tlusté střevo",
      la: "Intestinum crassum",
      level: "zaklad",
      soustava: "travici",
      kdeJe: "V břiše, za tenkým střevem. Vede až k pánvi.",
      coDela: "Vstřebává vodu, a tak ze zbytků potravy vzniká trus.",
      zajimavost: "Je mnohem kratší než tenké střevo. Masožravci mají střeva kratší než býložravci.",
      kostra: null,
      refs: ["NAV", "LAWSON-LI", "LAWSON-CARN", "RJ1901"]
    },
    {
      id: "konecnik",
      cs: "Konečník",
      la: "Rectum",
      level: "zvidave",
      soustava: "travici",
      kdeJe: "Pod kořenem ocasu, na konci tlustého střeva.",
      coDela: "Je to poslední část střeva. Jím odchází trus z těla ven.",
      zajimavost: null,
      kostra: null,
      refs: ["NAV", "LAWSON-LI", "RJ1901"]
    },
    {
      id: "ledvina",
      cs: "Ledvina",
      la: "Ren",
      level: "zaklad",
      soustava: "mocova",
      kdeJe: "Nahoře v břiše, pod páteří. Kočka má dvě, každou na jedné straně.",
      coDela: "Čistí krev od odpadních látek a vyrábí z nich moč.",
      zajimavost: "Ledviny mají tvar fazole.",
      kostra: null,
      refs: ["NAV", "LAWSON-KID", "MERCK-DESC"]
    },
    {
      id: "mocovod",
      cs: "Močovod",
      la: "Ureter",
      level: "zvidave",
      soustava: "mocova",
      kdeJe: "Tenká trubička z každé ledviny do močového měchýře.",
      coDela: "Odvádí moč z ledviny do močového měchýře.",
      zajimavost: null,
      kostra: null,
      refs: ["NAV", "LAWSON-KID", "MERCK-DESC"]
    },
    {
      id: "mocovy-mechyr",
      cs: "Močový měchýř",
      la: "Vesica urinaria",
      level: "zaklad",
      soustava: "mocova",
      kdeJe: "Vzadu dole v břiše, před pánví.",
      coDela: "Shromažďuje moč, dokud ji kočka nevyčůrá.",
      zajimavost: "Má tvar hrušky.",
      kostra: null,
      refs: ["NAV", "LAWSON-KID", "RJ1901"]
    }
  ]
};
