/*
 * O aplikaci / Zdroje (M8): what the app is, where every picture comes from (with author, licence and
 * changes), which sources the texts were checked against, privacy, and the code licence.
 * images: one group per source; files = the image files of the group (tests/test_o_aplikaci.py checks that
 * every file in images/ is listed here and in sources/image-licenses.md).
 * Czech text: to proofread.
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};

window.ATLAS_DATA.zdroje = {
  title: "O aplikaci a zdrojích",
  link: "O aplikaci a zdrojích",
  intro: "Kočičí tělo pod lupou je atlas kočičí anatomie pro děti. Ukazuje kostru, vnější stavbu těla, vnitřní orgány, svaly a smysly kočky.",

  imagesHeading: "Obrázky",
  images: [
    {
      heading: "Kresby z knihy Anatomy of the Cat (1901)",
      parts: [{ text: "Autoři knihy: Jacob Reighard a Herbert Spencer Jennings. Kresby: Louise Burridge Jennings. Kniha vyšla v roce 1901 v New Yorku." }],
      licence: [{ text: "Licence: volné dílo. Doba ochrany autorských práv již uplynula, obrázky tedy může používat kdokoli." }],
      source: [{ text: "Zdroje: " }, { text: "Project Gutenberg", href: "https://www.gutenberg.org/ebooks/58394" },
               { text: "; pro obrázky smyslů také rozsáhlejší sken knihy z " }, { text: "Internet Archive", href: "https://archive.org/details/anatomyofcat00reig" }, { text: "." }],
      changes: [{ text: "Úpravy: převedeny do černobílé podoby, vyčištěny a některé oříznuty. Písmena původních popisků jsme ponechali." }],
      figures: [
        { no: "1", cs: "Kostra", file: "images/kostra/skeleton.webp" },
        { no: "40", cs: "Lebka", file: "images/kostra/skull.webp" },
        { no: "47", cs: "Kost pažní", file: "images/kostra/humerus.webp" },
        { no: "49", cs: "Kost vřetenní a kost loketní", file: "images/kostra/radius-ulna.webp" },
        { no: "51", cs: "Kosti přední tlapky", file: "images/kostra/forepaw.webp" },
        { no: "55", cs: "Pánevní kost", file: "images/kostra/pelvis.webp" },
        { no: "56", cs: "Kost stehenní", file: "images/kostra/femur.webp" },
        { no: "57", cs: "Kost holenní a kost lýtková", file: "images/kostra/tibia-fibula.webp" },
        { no: "58", cs: "Kosti zadní tlapky", file: "images/kostra/hindpaw.webp" },
        { no: "68", cs: "Svaly pod kůží", file: "images/svaly/muscles-superficial.webp" },
        { no: "73", cs: "Hlubší svaly", file: "images/svaly/muscles-deep.webp" },
        { no: "90", cs: "Svaly zadní nohy", file: "images/svaly/muscles-hindleg.webp" },
        { no: "95", cs: "Jazyk", file: "images/smysly/tongue.webp" },
        { no: "97", cs: "Žaludek", file: "images/organy/stomach.webp" },
        { no: "102", cs: "Slinivka břišní a slezina", file: "images/organy/pancreas-spleen.webp" },
        { no: "106", cs: "Průdušky a plíce", file: "images/organy/lungs.webp" },
        { no: "108", cs: "Ledvina", file: "images/organy/kidney.webp" },
        { no: "109", cs: "Ledvina v řezu", file: "images/organy/kidney-section.webp" },
        { no: "111", cs: "Pohlavní orgány kocoura", file: "images/organy/repro-male.webp" },
        { no: "112", cs: "Pohlavní a močové orgány kočky", file: "images/organy/repro-female.webp" },
        { no: "115", cs: "Srdce", file: "images/organy/heart.webp" },
        { no: "117", cs: "Srdce s otevřenou pravou komorou", file: "images/organy/heart-open.webp" },
        { no: "137", cs: "Mozek", file: "images/organy/brain.webp" },
        { no: "165", cs: "Třetí víčko", file: "images/smysly/third-eyelid.webp" },
        { no: "167", cs: "Oko v řezu", file: "images/smysly/eye.webp" },
        { no: "170", cs: "Bubínek a sluchové kůstky", file: "images/smysly/eardrum.webp" },
        { no: "173", cs: "Vnitřní ucho", file: "images/smysly/inner-ear.webp" }
      ]
    },
    {
      heading: "Fotka kočky na sněhu (Vnější stavba těla)",
      parts: [{ text: "Autor: Von.grzanka, " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Felis_catus-cat_on_snow.jpg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: ". Naši upravenou verzi sdílíme pod stejnou licencí." }],
      changes: [{ text: "Úpravy: obrázek zmenšen." }],
      figures: [{ cs: "Kočka na sněhu", file: "images/vnejsi/cat-side.webp" }]
    },
    {
      heading: "Fotka kočky z boku (Kočičí rentgen)",
      parts: [{ text: "Autor: Bhaskaranaidu, pozadí odstranil YukiKoKo, " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Black_mackerel_tabby_DSH_(no_background).jpg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: ". Naši upravenou verzi sdílíme pod stejnou licencí." }],
      changes: [{ text: "Úpravy: obrázek oříznut." }],
      figures: [{ cs: "Kočka z boku", file: "images/rentgen/cat-photo.webp" }]
    },
    {
      heading: "Kresba vnitřních orgánů (Vnitřní orgány, Tělesné soustavy)",
      parts: [{ text: "Autoři: Persian Poet Gal, Surachit, Whidou, RuM a další, " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Scheme_cat_anatomy.svg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: ". Naši upravenou verzi sdílíme pod stejnou licencí." }],
      changes: [{ text: "Úpravy: odstraněny popisky, obrázek oříznut a zmenšen." }],
      figures: [{ cs: "Vnitřní orgány kočky", file: "images/organy/organs-side.webp" }]
    }
  ],

  textsHeading: "Odborné zdroje",
  texts: [
    [{ text: "Latinské názvy odpovídají mezinárodnímu seznamu Nomina Anatomica Veterinaria (6. vydání, 2017)." }],
    [{ text: "Všechny údaje v textech jsme ověřili alespoň v jednom odborném zdroji. Úplný seznam zdrojů je v souboru " },
     { text: "sources/references.md", href: "https://github.com/elenates/cats-anatomy/blob/main/sources/references.md" }, { text: "." }],
    [{ text: "Podrobnosti ke každému obrázku jsou v souboru " },
     { text: "sources/image-licenses.md", href: "https://github.com/elenates/cats-anatomy/blob/main/sources/image-licenses.md" }, { text: "." }]
  ],

  privacyHeading: "Soukromí",
  privacy: [
    [{ text: "Aplikace nic neposílá na internet a neukládá žádné osobní údaje. Jméno na diplomu se nikam neukládá." }],
    [{ text: "Prohlížeč si pamatuje pouze stav přepínačů Popisky, Latinsky a Pro zvídavé." }]
  ],

  codeHeading: "Zdrojový kód",
  code: [
    [{ text: "Zdrojový kód aplikace je volně dostupný na " }, { text: "GitHubu", href: "https://github.com/elenates/cats-anatomy" },
     { text: " pod licencí MIT." }]
  ]
};
