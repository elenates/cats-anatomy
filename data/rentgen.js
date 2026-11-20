/*
 * Kočičí rentgen (#43), stage 4: texts of the screen (scripts/rentgen.js).
 * The pictures and clickable areas are generated: data/rentgen-kosti.js (Kosti) and data/rentgen-areas.js
 * (Orgány and Svaly on the photo). Picture credits come from data/zdroje.js.
 * galerie: one entry per X-ray of Zajímavé rentgeny (ids as in data/rentgen-kosti.js); "areas" = the card text
 * for each clickable area of that X-ray.
 * Czech text: to proofread.
 */
window.ATLAS_DATA = window.ATLAS_DATA || {};
window.ATLAS_DATA.rentgen = {
  ui: {
    modesLabel: "Co chceš prosvítit?",
    modeKosti: "Kosti",
    modeOrgany: "Orgány",
    modeSvaly: "Svaly",
    kostiLabel: "Rentgeny kostí",
    viewKresba: "Kreslená kočka",
    viewSkutecny: "Skutečný rentgen",
    viewGalerie: "Zajímavé rentgeny",
    lensHint: "Posouvej lupu po kočce. Klepni na místo, které tě zajímá.",
    wholeOn: "Prosvítit celou kočku",
    wholeOff: "Zpět na lupu",
    lensLabel: "Rentgenová lupa. Posouvej ji šipkami, klávesou Enter vybereš místo pod jejím středem.",
    found: "Na tomhle místě najdeš:",
    nothing: "Tady nic nenajdeš. Klepni na kočku.",
    cardEmpty: "Klepni na kočku a uvidíš, co je pod lupou.",
    cardEmptyWhole: "Klepni na místo, které tě zajímá.",
    cardEmptyReal: "Klepni na kost na snímku.",
    approx: "Kosti, orgány a svaly jsou na obrázku jen přibližně.",
    wildcat: "Kočka na obrázku z roku 1845 je kočka divoká. Kostra kočky divoké a kočky domácí vypadá téměř stejně.",
    realNote: "Tohle je skutečný rentgenový snímek kočky. Kosti jsou světlé, protože rentgenové paprsky jimi projdou hůř než svaly a orgány.",
    realTabsLabel: "Snímky",
    realA: "Přední část těla",
    realB: "Zadní část těla",
    galleryIntro: "Rentgen pomáhá zvěrolékařům zjistit, co se kočce děje uvnitř těla. Vyber si snímek.",
    galleryBack: "Zpět na zajímavé rentgeny",
    galleryFind: "Najdi na snímku, co je na něm zvláštního, a klepni na to.",
    galleryShow: "Ukaž mi to",
    galleryMiss: "Tady to není. Zkus to jinde, nebo klepni na „Ukaž mi to“.",
    seeAtlasKostra: "Podívej se do Kostry →",
    seeAtlasOrgany: "Podívej se do Vnitřních orgánů →",
    seeAtlasSvaly: "Podívej se do Svalů →",
    zoomHint: "Na menších obrazovkách můžeš snímek přiblížit prsty."
  },
  galerie: {
    "brezi-kocka": {
      cs: "Březí kočka",
      text: "Tahle kočka čeká koťata. Snímek je pořízený zespodu, asi 6 týdnů od začátku březosti. V bříšku má pět koťat.",
      areas: { "kotata": "Koťata rostou v děloze. Jejich kosti jsou zatím měkké, a tak jsou na rentgenu vidět jen slabě. Kočka nosí koťata asi 9 týdnů." }
    },
    "mikrocip": {
      cs: "Mikročip",
      text: "Mikročip je malý asi jako zrnko rýže. Zvěrolékař ho kočce vpraví pod kůži jehlou.",
      areas: { "mikrocip": "V mikročipu je uložené číslo. Když se kočka ztratí, zvěrolékař nebo útulek číslo přečte čtečkou a najde majitele." }
    },
    "jehla": {
      cs: "Spolknutá jehla",
      text: "Tahle kočka spolkla jehlu. Na snímku je vidět i trubička, která jí pomáhala dýchat, když spala v narkóze.",
      areas: { "jehla": "Jehla uvízla v jícnu, tedy v trubici, kterou jde potrava do žaludku. Kov je na rentgenu jasně bílý. Jehly a nitě proto uklízej tak, aby se k nim kočka nedostala." }
    },
    "prsty-navic": {
      cs: "Prsty navíc",
      text: "Tahle mainská mývalí kočka má na tlapkách víc prstů, než je obvyklé. Říká se tomu polydaktylie.",
      areas: { "prsty-navic": "Na každé přední tlapce má šest prstů. Běžná kočka má vpředu pět prstů a vzadu čtyři." }
    },
    "kontrastni-latka": {
      cs: "Kontrastní látka",
      text: "Tahle kočka spolkla kontrastní látku. Na snímku jsou dva pohledy: zespodu a z boku.",
      areas: { "kontrastni-latka": "Kontrastní látka je na rentgenu bílá. Zvěrolékař tak vidí, jak vypadá žaludek a střeva a kudy jde potrava." }
    },
    "zlomena-panev": {
      cs: "Zlomená pánev",
      text: "Snímek je pořízený zespodu. Kočka při něm leží na zádech a zadní nohy má natažené.",
      areas: { "zlomenina": "Tady je pánev zlomená. Pánevní kosti často srostou samy, když má kočka několik týdnů klid. Někdy je musí zvěrolékař spravit při operaci." }
    },
    "mocove-kameny": {
      cs: "Močové kameny",
      text: "Snímek je pořízený z boku. Kočka měla nemoc, při které se v močových cestách tvoří kameny.",
      areas: { "kameny": "Tady jsou vidět kulaté světlé stíny. Podle popisu snímku jde o močové kameny. Kameny jsou tvrdé, a proto jsou na rentgenu světlé." }
    },
    "kolicek-v-koleni": {
      cs: "Kolíček v koleni",
      text: "Tahle kočka měla nemocné koleno: čéška jí vyskakovala ze svého místa. Zvěrolékař jí koleno spravil při operaci.",
      areas: { "kolicek": "Kovový kolíček drží kousek kosti pod kolenem na správném místě, dokud nesroste. Kov je na rentgenu jasně bílý." }
    },
    "munchkin": {
      cs: "Munchkin",
      text: "Tohle nejsou obyčejné rentgeny, ale obrázky kostí z počítače (CT). Vlevo je kočka plemene munchkin, vpravo kočka s běžnými nohami.",
      areas: {
        "kratke-nohy": "Munchkin má krátké nohy, protože kosti jeho nohou rostou méně do délky. Krátké nohy zdědí po rodičích.",
        "bezne-nohy": "Tohle je kočka s běžnými nohami. Porovnej, o kolik jsou kosti jejích nohou delší."
      }
    }
  }
};
