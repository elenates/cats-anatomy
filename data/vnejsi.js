/*
 * Vnější stavba těla (outside of the body) content, v0.3.
 *
 * Generated from the review sheet "Vnější stavba těla – content review (v0.3)".
 * Edit the sheet first, then regenerate this file.
 * Plain script (no ES modules) so the app works from file://.
 *
 * Fields per item (same meaning as in data/kostra.js):
 *   id, cs, la (NAV 2017), level, kdeJe, coDela, zajimavost (may be null), refs
 *   kostra   Kostra part screen that shows the bones under this body part, or null
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.vnejsi = {
  items: [
    {
      id: "hlava",
      cs: "Hlava",
      la: "Caput",
      level: "zaklad",
      kdeJe: "Vpředu na těle, na konci krku.",
      coDela: "Jsou na ní oči, uši, nos a tlama. Uvnitř lebky je ukrytý mozek.",
      zajimavost: null,
      kostra: "lebka-celisti",
      refs: ["NAV", "LAWSON-SK"]
    },
    {
      id: "ucho",
      cs: "Ucho",
      la: "Auris",
      level: "zaklad",
      kdeJe: "Po obou stranách hlavy, nahoře.",
      coDela: "Zachytává zvuky. Kočka slyší i vysoké zvuky, které ty neslyšíš.",
      zajimavost: "Kočka umí každým uchem otáčet samostatně, dokonce skoro dozadu.",
      kostra: null,
      refs: ["NAV", "CSW-KD"]
    },
    {
      id: "oko",
      cs: "Oko",
      la: "Oculus",
      level: "zaklad",
      kdeJe: "Vpředu na hlavě, nad nosem.",
      coDela: "Kočka jím vidí, a to dobře i v šeru.",
      zajimavost: "Ve tmě kočičí oči svítí. Vzadu v oku mají vrstvu, která odráží světlo.",
      kostra: "lebka-celisti",
      refs: ["NAV", "CSW-KD", "VFU-CHOV"]
    },
    {
      id: "nos",
      cs: "Nos",
      la: "Nasus",
      level: "zaklad",
      kdeJe: "Vpředu na hlavě, mezi očima a tlamou.",
      coDela: "Kočka jím dýchá a čichá. Čichem pozná jídlo i jiné kočky.",
      zajimavost: "V nose má kočka asi 200 milionů čichových buněk.",
      kostra: null,
      refs: ["NAV", "CSW-KD"]
    },
    {
      id: "vousy",
      cs: "Hmatové vousy",
      la: "Pili tactiles",
      level: "zaklad",
      kdeJe: "Na tvářích kolem tlamy a nad očima.",
      coDela: "Kočka jimi vnímá doteky a okolí. Pomáhají jí při lovu i při pohybu ve tmě.",
      zajimavost: "Kočka má hmatové chlupy i na předních nohou, u zápěstí.",
      kostra: null,
      refs: ["NAV", "VFU-CHOV", "CSW-KD"]
    },
    {
      id: "krk",
      cs: "Krk",
      la: "Collum",
      level: "zaklad",
      kdeJe: "Mezi hlavou a trupem.",
      coDela: "Nese hlavu a umožňuje kočce otáčet hlavou.",
      zajimavost: "Uvnitř krku je 7 krčních obratlů – stejně jako u tebe.",
      kostra: "pater-hrudnik",
      refs: ["NAV", "POL15", "MUNI-OST"]
    },
    {
      id: "hrbet",
      cs: "Hřbet",
      la: "Dorsum",
      level: "zaklad",
      kdeJe: "Nahoře na trupu, od krku až k ocasu.",
      coDela: "Uvnitř vede páteř. Kočka umí hřbet prohnout do oblouku.",
      zajimavost: "Kočičí páteř je tak ohebná, že se kočka umí stočit skoro do klubíčka.",
      kostra: "pater-hrudnik",
      refs: ["NAV", "RANDAU17", "CSW-KD"]
    },
    {
      id: "hrudnik",
      cs: "Hrudník",
      la: "Thorax",
      level: "zaklad",
      kdeJe: "Přední část trupu, za předními nohami.",
      coDela: "Uvnitř jsou srdce a plíce. Chrání je žebra.",
      zajimavost: null,
      kostra: "pater-hrudnik",
      refs: ["NAV", "LAWSON-RIB"]
    },
    {
      id: "bricho",
      cs: "Břicho",
      la: "Abdomen",
      level: "zaklad",
      kdeJe: "Spodní část trupu, mezi hrudníkem a zadními nohami.",
      coDela: "Uvnitř jsou žaludek a střeva, ve kterých se tráví potrava.",
      zajimavost: null,
      kostra: null,
      refs: ["NAV", "CSW-AKD"]
    },
    {
      id: "predni-noha",
      cs: "Přední noha",
      la: "Membrum thoracicum",
      level: "zaklad",
      kdeJe: "Vpředu, pod hrudníkem.",
      coDela: "Kočka na předních nohách chodí a běhá. Přidržuje jimi také kořist.",
      zajimavost: "Na přední tlapce má kočka 5 prstů.",
      kostra: "predni-koncetiny",
      refs: ["NAV", "CSW-KOC", "TF-META", "CSW-KD"]
    },
    {
      id: "zadni-noha",
      cs: "Zadní noha",
      la: "Membrum pelvinum",
      level: "zaklad",
      kdeJe: "Vzadu, pod pánví.",
      coDela: "Pomáhá kočce silně se odrazit při skoku.",
      zajimavost: "Na zadní tlapce má kočka jen 4 prsty.",
      kostra: "panev-zadni",
      refs: ["NAV", "UMN-RUN", "CSW-KD"]
    },
    {
      id: "tlapka",
      cs: "Tlapka",
      la: "Manus / Pes",
      level: "zaklad",
      kdeJe: "Na konci každé nohy.",
      coDela: "Kočka našlapuje na prsty a měkké polštářky, a proto chodí potichu.",
      zajimavost: null,
      kostra: "predni-koncetiny",
      refs: ["NAV", "CSW-KD", "UMN-RUN"]
    },
    {
      id: "drapy",
      cs: "Drápy",
      la: "Unguiculae",
      level: "zaklad",
      kdeJe: "Na konci prstů. Když kočka chodí, má je schované.",
      coDela: "Kočka je vysune, když šplhá, loví nebo se brání.",
      zajimavost: "Drápy umí schovat všechny kočkovité šelmy kromě geparda.",
      kostra: "predni-koncetiny",
      refs: ["NAV", "CSW-KD", "CSW-DRAP", "UMN-FEL"]
    },
    {
      id: "ocas",
      cs: "Ocas",
      la: "Cauda",
      level: "zaklad",
      kdeJe: "Na konci hřbetu.",
      coDela: "Pomáhá kočce udržet rovnováhu.",
      zajimavost: "V ocasu je 20 až 23 ocasních obratlů.",
      kostra: "pater-hrudnik",
      refs: ["NAV", "CSW-AKD", "POL15", "IMA-VERT"]
    },
    {
      id: "srst",
      cs: "Srst",
      la: "Pili",
      level: "zaklad",
      kdeJe: "Pokrývá skoro celé tělo.",
      coDela: "Chrání kůži a pomáhá kočce udržet teplo.",
      zajimavost: "Na jednom čtverečním centimetru kůže může mít kočka až 20 000 chlupů.",
      kostra: null,
      refs: ["NAV", "CSW-AKD", "CSW-SAV", "CSW-KD"]
    },
    {
      id: "nosni-zrcatko",
      cs: "Nosní zrcátko",
      la: "Planum nasale",
      level: "zvidave",
      kdeJe: "Holá kůže na špičce nosu.",
      coDela: "Je to jedno z mála míst na těle, kde kočka nemá srst.",
      zajimavost: null,
      kostra: null,
      refs: ["NAV", "CSW-KD"]
    },
    {
      id: "polstarky",
      cs: "Polštářky",
      la: "Tori",
      level: "zvidave",
      kdeJe: "Na spodní straně tlapek.",
      coDela: "Jsou měkké a holé. Kočka na nich našlapuje tiše a vnímá jimi i chvění země.",
      zajimavost: "Kočka má malý polštářek i na zápěstí přední nohy.",
      kostra: null,
      refs: ["NAV", "CSW-KD"]
    }
  ]
};
