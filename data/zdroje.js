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
        { no: "173", cs: "Vnitřní ucho", file: "images/smysly/inner-ear.webp" },
        { cs: "Svaly upravené podle fotografie kočky (Kočičí rentgen, podle obrázku 68)", file: "images/rentgen/layer-svaly.webp" }
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
      parts: [{ text: "Autor původní fotografie: Bhaskaranaidu. Pozadí odstranil YukiKoKo. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Black_mackerel_tabby_DSH_(no_background).jpg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: ". Naši upravenou verzi sdílíme pod stejnou licencí." }],
      changes: [{ text: "Úpravy: obrázek oříznut." }],
      figures: [{ cs: "Kočka z boku", file: "images/rentgen/cat-photo.webp" }, { cs: "Kočka jako rentgenový snímek", file: "images/rentgen/xray-base.webp" }]
    },
    {
      heading: [{ text: "Kočka a její kostra z knihy " }, { text: "Anatomie descriptive et comparative du chat", em: true }, { text: " (1845)" }],
      parts: [{ text: "Autor: Hercule Straus-Durkheim. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Anatomie_descriptive_et_comparative_du_chat_(1845)_Pl-XI.jpg" }, { text: ". Na tabuli I je kočka divoká." }],
      licence: [{ text: "Licence: volné dílo." }],
      changes: [{ text: "Úpravy: kostru z tabule XI jsme upravili tak, aby vypadala jako rentgenový snímek. Pro použití pod lupou jsme ji také trochu posunuli, aby odpovídala poloze kočky z tabule I." }],
      figures: [{ cs: "Kočka divoká (tabule I)", file: "images/rentgen/1845/kocka.webp" }, { cs: "Kostra kočky (tabule XI)", file: "images/rentgen/1845/kostra.webp" },
        { cs: "Kostra z tabule XI jako rentgenový snímek (Kočičí rentgen)", file: "images/rentgen/1845/kostra-rentgen.webp" },
        { cs: "Kostra z tabule XI posunutá podle kočky z tabule I (Kočičí rentgen)", file: "images/rentgen/1845/kostra-na-kocce.webp" }]
    },
    {
      heading: "Rentgen: přední část těla (Kočičí rentgen)",
      parts: [{ text: "Autor: AurelioAHeckert. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Radiografia-lateral-gato.jpg" }, { text: "." }],
      licence: [{ text: "Licence: volné dílo." }],
      changes: [{ text: "Úpravy: obrázek zmenšen." }],
      figures: [{ cs: "Rentgen: přední část těla", file: "images/rentgen/skutecny/predni-cast.webp" }]
    },
    {
      heading: "Rentgen: zadní část těla (Kočičí rentgen)",
      parts: [{ text: "Autor: Kalumet. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Roentgen_Katze_CNI_LL_nativ.jpg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: obrázek zmenšen." }],
      figures: [{ cs: "Rentgen: zadní část těla", file: "images/rentgen/skutecny/zadni-cast.webp" }]
    },
    {
      heading: "Rentgen: březí kočka (Kočičí rentgen)",
      parts: [{ text: "Autor: Santamarcanda. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Radiography_of_a_pregnant_cat.jpg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: obrázek zmenšen." }],
      figures: [{ cs: "Rentgen: březí kočka", file: "images/rentgen/skutecny/brezi-kocka.webp" }]
    },
    {
      heading: "Rentgen: mikročip (Kočičí rentgen)",
      parts: [{ text: "Autor: Joelmills. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Feline_identifying_microchip.JPG" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: obrázek zmenšen." }],
      figures: [{ cs: "Rentgen: mikročip", file: "images/rentgen/skutecny/mikrocip.webp" }]
    },
    {
      heading: "Rentgen: spolknutá jehla (Kočičí rentgen)",
      parts: [{ text: "Autor: Joel Mills. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:X-ray_Needle_swallowed_by_cat.JPG" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: obrázek zmenšen." }],
      figures: [{ cs: "Rentgen: spolknutá jehla", file: "images/rentgen/skutecny/jehla.webp" }]
    },
    {
      heading: "Rentgen: prsty navíc (Kočičí rentgen)",
      parts: [{ text: "Autor: Sharon Otten-Boult. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Pr%C3%A4axiale_Polydaktylie_Maine_Coon_Katze-2.jpg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: žádné, pouze převedeno do jiného formátu." }],
      figures: [{ cs: "Rentgen: prsty navíc", file: "images/rentgen/skutecny/prsty-navic.webp" }]
    },
    {
      heading: "Rentgen: kontrastní látka v žaludku (Kočičí rentgen)",
      parts: [{ text: "Autor: ArtBrom. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Gizmo_X-Ray_3.jpg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 2.0", href: "https://creativecommons.org/licenses/by-sa/2.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: žádné, pouze převedeno do jiného formátu." }],
      figures: [{ cs: "Rentgen: kontrastní látka v žaludku", file: "images/rentgen/skutecny/kontrastni-latka.webp" }]
    },
    {
      heading: "Rentgen: zlomená pánev (Kočičí rentgen)",
      parts: [{ text: "Autor: Poowang. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Pelvic_fracture_in_cat.jpg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: žádné, pouze převedeno do jiného formátu." }],
      figures: [{ cs: "Rentgen: zlomená pánev", file: "images/rentgen/skutecny/zlomena-panev.webp" }]
    },
    {
      heading: "Rentgen: močové kameny (Kočičí rentgen)",
      parts: [{ text: "Autor: Xlnt84. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Diagnoz.JPG" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: žádné, pouze převedeno do jiného formátu." }],
      figures: [{ cs: "Rentgen: močové kameny", file: "images/rentgen/skutecny/mocove-kameny.webp" }]
    },
    {
      heading: "Rentgen: kolíček v koleni (Kočičí rentgen)",
      parts: [{ text: "Autor: Jonathanischoice. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Feline_Grade_3_LP_RH_X-Ray.jpg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC0", href: "https://creativecommons.org/publicdomain/zero/1.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: žádné, pouze převedeno do jiného formátu." }],
      figures: [{ cs: "Rentgen: kolíček v koleni", file: "images/rentgen/skutecny/kolicek-v-koleni.webp" }]
    },
    {
      heading: "CT snímky kočky plemene munchkin (Kočičí rentgen)",
      parts: [{ text: "Autoři: Struck, Braun, Detering a další (BMC Genetics, 2020). Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Munchkin_cat_x-ray.webp" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY 4.0", href: "https://creativecommons.org/licenses/by/4.0/" }, { text: "." }],
      changes: [{ text: "Úpravy: žádné, pouze převedeno do jiného formátu." }],
      figures: [{ cs: "CT snímky kočky plemene munchkin", file: "images/rentgen/skutecny/munchkin.webp" }]
    },
    {
      heading: "Kresba vnitřních orgánů (Vnitřní orgány, Tělesné soustavy)",
      parts: [{ text: "Autoři: Persian Poet Gal, Surachit, Whidou, RuM a další, " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:Scheme_cat_anatomy.svg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: ". Naši upravenou verzi sdílíme pod stejnou licencí." }],
      changes: [{ text: "Úpravy: odstraněny popisky, obrázek oříznut a zmenšen." }],
      figures: [{ cs: "Vnitřní orgány kočky", file: "images/organy/organs-side.webp" }, { cs: "Vnitřní orgány upravené podle fotografie kočky (Kočičí rentgen)", file: "images/rentgen/layer-organy.webp" }]
    },
    {
      heading: [{ text: "Kostry člověka a tygra z díla " }, { text: "A Comparative Anatomical Exposition of the Structure of the Human Body with that of a Tiger and a Common Fowl", em: true }, { text: " (1795–1806)" }],
      parts: [{ text: "Autor: George Stubbs. Kresby jsou ve sbírce Yale Center for British Art. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:George_Stubbs_-_A_Comparative_Anatomical_Exposition_of_the_Structure_of_the_Human_Body_with_that_of_a_Tiger_and_a_Co..._-_Google_Art_Project_(2351546).jpg" }, { text: "." }],
      licence: [{ text: "Licence: volné dílo." }],
      changes: [{ text: "Úpravy: obrázky převedeny do černobílé podoby, papír vybělen, obrázky oříznuty a zmenšeny." }],
      figures: [{ cs: "Kostra člověka na všech čtyřech", file: "images/clovek/kostra-na-ctyrech.webp" }, { cs: "Kostra člověka zepředu", file: "images/clovek/kostra-zepredu.webp" },
        { cs: "Kostra člověka z boku", file: "images/clovek/kostra-zboku.webp" }, { cs: "Kostra člověka zezadu", file: "images/clovek/kostra-zezadu.webp" },
        { cs: "Kostra tygra", file: "images/clovek/tygr-kostra.webp" }, { cs: "Tygr stojící jako člověk", file: "images/clovek/tygr-stoji.webp" }]
    },
    {
      heading: "Kresba vnitřních orgánů člověka (Kočka a člověk)",
      parts: [{ text: "Autor: Madhero88. Použité části pocházejí od LadyofHats, ZooFari, Piom, Patrick.lynch a Mikaela Häggströma. Zdroj: " }, { text: "Wikimedia Commons", href: "https://commons.wikimedia.org/wiki/File:SVG_Human_With_All_Organs.svg" }, { text: "." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }, { text: ". Naši upravenou verzi sdílíme pod stejnou licencí." }],
      changes: [{ text: "Úpravy: obrázek oříznut a zmenšen." }],
      figures: [{ cs: "Vnitřní orgány člověka", file: "images/clovek/organy.webp" }]
    },
    {
      heading: "Kresby rozmnožovacích orgánů člověka (Kočka a člověk)",
      parts: [{ text: "Autoři: " }, { text: "T. Kebert", href: "https://commons.wikimedia.org/wiki/File:Male_reproductive_lateral_without_labels.svg" }, { text: " (mužská kresba) a " }, { text: "RWhitwam", href: "https://commons.wikimedia.org/wiki/File:Female_reproductive_system_lateral_unlabeled.svg" }, { text: " (ženská kresba). Zdroj: Wikimedia Commons." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }, { text: ". Naše upravené verze sdílíme pod stejnou licencí." }],
      changes: [{ text: "Úpravy: z kresby muže jsme použili jen levou část a z kresby ženy odstranili písmena popisků. Obě kresby jsme ořízli." }],
      figures: [{ cs: "Rozmnožovací orgány muže", file: "images/clovek/rozmnozovaci-muz.webp" }, { cs: "Rozmnožovací orgány ženy", file: "images/clovek/rozmnozovaci-zena.webp" }]
    },
    {
      heading: "Rentgen zubů (Na veterině)",
      parts: [{ text: "Autor: " }, { text: "Corak80", href: "https://commons.wikimedia.org/wiki/File:Feline_tooth_resorption_-_dental_radiograph_of_the_left_mandibular_third_premolar_(307).png" }, { text: ". Zdroj: Wikimedia Commons." }],
      licence: [{ text: "Licence: " }, { text: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }, { text: ". Naši upravenou verzi sdílíme pod stejnou licencí." }],
      changes: [{ text: "Úpravy: převedeno do formátu WebP." }],
      figures: [{ cs: "Rentgen zubů kočky", file: "images/veterina/zub-resorpce.webp" }]
    },
    {
      heading: "Ikony nástrojů (Na veterině)",
      parts: [{ text: "Autor: projekt Kočičí tělo pod lupou. Vlastní kresby nakreslené přímo pro tuto aplikaci." }],
      licence: [{ text: "Licence: MIT, stejně jako kód aplikace." }],
      changes: [{ text: "Úpravy: žádné, jde o původní kresby." }],
      figures: [{ cs: "Barvivo do oka a modré světlo", file: "images/veterina/nastroje/barvivo-oko.svg" }, { cs: "Speciální krmení", file: "images/veterina/nastroje/dieta.svg" }, { cs: "Hřeben", file: "images/veterina/nastroje/hrebinek.svg" }, { cs: "Inhalátor s maskou", file: "images/veterina/nastroje/inhalator.svg" }, { cs: "Injekce", file: "images/veterina/nastroje/injekce.svg" }, { cs: "Kapky", file: "images/veterina/nastroje/kapky.svg" }, { cs: "Krevní test", file: "images/veterina/nastroje/krevni-test.svg" }, { cs: "Léky", file: "images/veterina/nastroje/leky.svg" }, { cs: "Prohlédnout kočku", file: "images/veterina/nastroje/lupa.svg" }, { cs: "Mikroskop", file: "images/veterina/nastroje/mikroskop.svg" }, { cs: "Nůžky na drápky", file: "images/veterina/nastroje/nuzky-drapy.svg" }, { cs: "Obvaz", file: "images/veterina/nastroje/obvaz.svg" }, { cs: "Očkovací průkaz", file: "images/veterina/nastroje/ockovaci-prukaz.svg" }, { cs: "Operace", file: "images/veterina/nastroje/operace.svg" }, { cs: "Otoskop se světýlkem", file: "images/veterina/nastroje/otoskop.svg" }, { cs: "Pinzeta", file: "images/veterina/nastroje/pinzeta.svg" }, { cs: "Prohmatat bříško", file: "images/veterina/nastroje/prohmatat.svg" }, { cs: "Rentgen", file: "images/veterina/nastroje/rentgen.svg" }, { cs: "Stetoskop", file: "images/veterina/nastroje/stetoskop.svg" }, { cs: "Teploměr", file: "images/veterina/nastroje/teplomer.svg" }, { cs: "Vyšetření moči", file: "images/veterina/nastroje/test-moci.svg" }, { cs: "Ultrazvuk", file: "images/veterina/nastroje/ultrazvuk.svg" }, { cs: "UV lampa", file: "images/veterina/nastroje/uv-lampa.svg" }, { cs: "Váha", file: "images/veterina/nastroje/vaha.svg" }]
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
