/*
 * Kočka a člověk (#72): the cat and the human side by side.
 *
 * Routes (scripts/app.js calls Clovek.render(sub, sub2)):
 *   #/clovek[/kostra[/<view>]]  skeletons: the cat skeleton (Fig. 1) next to the human one (view: na-ctyrech, zepredu,
 *                                zboku, zezadu); layers Kosti / Klouby
 *   #/clovek/organy             the cat organ drawing next to the human one
 *   #/clovek/rozmnozovaci[/muz|zena]  the cat drawings (1901 Figs. 111 / 112) next to the human ones
 *   #/clovek/zajimavosti[/<id>] the fact cards (ATLAS_DATA.clovek.fakta), card id highlighted
 *   #/clovek/kdo-ma, #/clovek/najdi, #/clovek/spoj  the games (scripts/kdo-ma.js, quiz.js, spoj.js; data/clovek-hry.js)
 *
 * Two atlases (scripts/atlas.js) without their own cards: a tap on either picture selects the part in both
 * (human items share the cat id, or name it in "kocka"), and one card below shows the human item with its
 * Stejné / Jiné badge, the comparison and a button with the cat card (scripts/infocard.js).
 * The human atlas has the toolbar; the cat one follows its switches.
 */
(function () {
  "use strict";
  var D = window.ATLAS_DATA || {};
  var ui = D.ui || {};

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null) return;
      if (k === "text") n.textContent = attrs[k]; else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function fmt(s, v) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return v[k]; }); }
  function latinOn() { try { return !!JSON.parse(localStorage.getItem("atlas.toggles") || "{}").latinsky; } catch (e) { return false; } }

  var TABS = [
    { id: "kostra", cs: ui.clovekTabKostra || "Kostra", views: [
      { id: "na-ctyrech", cs: ui.clovekNaCtyrech || "Na všech čtyřech", cat: "skeleton", human: "clovek-na-ctyrech" },
      { id: "zepredu", cs: ui.clovekZepredu || "Zepředu", cat: "skeleton", human: "clovek-zepredu", tall: true, note: "clovekCatSideOnly" },
      { id: "zboku", cs: ui.clovekZboku || "Z boku", cat: "skeleton", human: "clovek-zboku" },
      { id: "zezadu", cs: ui.clovekZezadu || "Zezadu", cat: "skeleton", human: "clovek-zezadu", tall: true, note: "clovekCatSideOnly" }] },
    { id: "organy", cs: ui.clovekTabOrgany || "Vnitřní orgány", views: [
      { id: "organy", cat: "organs-side", human: "clovek-organy", tall: true }] },
    { id: "rozmnozovaci", cs: ui.clovekTabRozmn || "Rozmnožovací orgány", views: [
      { id: "muz", cs: ui.clovekMuz || "Kocour a muž", cat: "repro-male", human: "clovek-muz" },
      { id: "zena", cs: ui.clovekZena || "Kočka a žena", cat: "repro-female", human: "clovek-zena" }] },
    { id: "zajimavosti", cs: ui.clovekTabFakta || "Zajímavosti" }
  ];

  function items() { return (D.clovek && D.clovek.items) || []; }
  function human(id) { return items().filter(function (x) { return x.id === id; })[0] || null; }
  function catItem(content, id) { return ((D[content] && D[content].items) || []).filter(function (x) { return x.id === id; })[0] || null; }
  /* the human item that belongs to a cat id (same id, or named in "kocka") */
  function humanForCat(catId) { return items().filter(function (x) { return x.kocka === catId; })[0] || null; }

  function tabNav(cur) {
    var list = el("ul", { "class": "fig-tabs" });
    TABS.forEach(function (t) {
      var a = el("a", { "class": "fig-tab", href: "#/clovek/" + t.id, text: t.cs });
      if (t.id === cur) a.setAttribute("aria-current", "page");
      list.appendChild(el("li", null, [a]));
    });
    return el("nav", { "class": "fig-nav", "aria-label": ui.clovekTabsLabel || "Kočka a člověk" }, [list]);
  }
  function viewNav(tab, cur) {
    if (tab.views.length < 2) return null;
    var list = el("ul", { "class": "fig-tabs sub-tabs" });
    tab.views.forEach(function (v) {
      var a = el("a", { "class": "fig-tab", href: "#/clovek/" + tab.id + "/" + v.id, text: v.cs });
      if (v.id === cur) a.setAttribute("aria-current", "page");
      list.appendChild(el("li", null, [a]));
    });
    return el("nav", { "class": "fig-nav", "aria-label": tab.id === "kostra" ? (ui.clovekViewsLabel || "Pohled") : tab.cs }, [list]);
  }

  /* The games (stage 5): Má to kočka, člověk, nebo oba? · Najdi kost u člověka · Spoj, co patří k sobě */
  function backTo(text) { return el("a", { "class": "back-link", href: "#/clovek", text: "← " + text }); }
  function renderGame(sub) {
    var host;
    if (sub === "kdo-ma" && window.KdoMa && D.kdoMa) {
      var kt = D.kdoMa.ui || {};
      host = el("div", { "class": "atlas quiz kdo-ma" });
      host._mount = function () { window.KdoMa.mount(host); };
      return [backTo(kt.back || "Zpět"), el("h1", { "class": "screen-title", text: kt.title || "" }), host];
    }
    if (sub === "najdi" && window.Quiz) {
      host = el("div", { "class": "atlas quiz" });
      host._mount = function () {
        window.Quiz.mount(host, { figures: ["clovek-zepredu", "clovek-zboku"], layer: "kosti", rounds: 10,
          maxHeightVh: { "clovek-zepredu": 70, "clovek-zboku": 70 },
          texts: { figureLabel: ui.quizFigureLabelClovek, great: ui.quizGreatClovek, back: ui.quizBackClovek, backHref: "#/clovek" } });
      };
      return [backTo(ui.quizBackClovek || "Zpět"), el("h1", { "class": "screen-title", text: ui.quizTitleClovek || "" }), host];
    }
    if (sub === "spoj" && window.Spoj && D.spojClovek) {
      var st = D.spojClovek.ui || {};
      host = el("div", { "class": "spoj" });
      host._mount = function () { window.Spoj.mount(host, { content: "clovek", config: D.spojClovek }); };
      return [backTo(st.back || "Zpět"), el("h1", { "class": "screen-title", text: st.title || "" }), host];
    }
    return null;
  }
  function games() {
    return el("div", { "class": "quiz-actions screen-games clovek-games" }, [
      D.kdoMa ? el("a", { "class": "quiz-open", href: "#/clovek/kdo-ma", text: D.kdoMa.ui.open }) : null,
      el("a", { "class": "quiz-open quiz-secondary", href: "#/clovek/najdi", text: ui.quizOpenClovek || "Najdi kost u člověka" }),
      D.spojClovek ? el("a", { "class": "quiz-open quiz-secondary", href: "#/clovek/spoj", text: D.spojClovek.ui.open }) : null]);
  }

  function render(sub, sub2) {
    var game = renderGame(sub); if (game) return game;
    var tab = TABS.filter(function (t) { return t.id === sub; })[0] || TABS[0];
    var nodes = [el("a", { "class": "back-link", href: "#/", text: "← " + (ui.back || "Zpět na menu") }),
      el("div", { "class": "screen-head" }, [
        el("h1", { "class": "screen-title", text: (D.sections || []).filter(function (s) { return s.id === "clovek"; }).map(function (s) { return s.cs; })[0] || "Kočka a člověk" }),
        games()]),
      tabNav(tab.id)];
    if (tab.id === "zajimavosti") return nodes.concat(renderFakta(sub2));
    var view = tab.views.filter(function (v) { return v.id === sub2; })[0] || tab.views[0];
    var vn = viewNav(tab, view.id); if (vn) nodes.push(vn);
    nodes.push(el("p", { "class": "fig-note", text: ui.clovekIntro || "" }));
    return nodes.concat(renderPair(view));
  }

  function renderPair(view) {
    var catHost = el("div", { "class": "atlas clovek-cat" });
    var humHost = el("div", { "class": "atlas clovek-human" });
    var card = el("section", { "class": "atlas-card clovek-card", "aria-live": "polite" });
    var catFig = (D.hotspots || {})[view.cat] || {};
    var catContent = catFig.content || "kostra";
    var col = function (title, host, note) {
      return el("div", { "class": "clovek-col" }, [el("h2", { "class": "clovek-h", text: title }), note ? el("p", { "class": "clovek-note", text: note }) : null, host]);
    };
    var pair = el("div", { "class": "clovek-pair" + (view.tall ? " is-tall" : "") }, [
      col(ui.clovekCat || "Kočka", catHost, view.note ? ui[view.note] : null),
      col(ui.clovekHuman || "Člověk", humHost)]);
    var bar = el("div", { "class": "clovek-bar" });
    var current = null;   // { human: item or null, cat: id or null }

    function catApi() { return catHost._atlas; }
    function humApi() { return humHost._atlas; }
    function onFig(figId, layer, id) {
      var f = (D.hotspots || {})[figId]; return !!(f && f.layers[layer] && f.layers[layer][id]);
    }
    function fromHuman(id) {
      if (!id) { current = null; if (catApi()) catApi().select(null, false, true); drawCard(); return; }
      var h = human(id), c = h && h.kocka;
      var lay = humApi().state.layer;
      var catShown = c && onFig(view.cat, lay, c) && catApi().visible().indexOf(c) >= 0;
      catApi().select(catShown ? c : null, false, true);
      current = { human: h, cat: c, catShown: catShown };
      drawCard(true);
    }
    function fromCat(id) {
      if (!id) { current = null; if (humApi()) humApi().select(null, false, true); drawCard(); return; }
      var h = humanForCat(id);
      var lay = humApi().state.layer;
      var humShown = h && onFig(view.human, lay, h.id) && humApi().visible().indexOf(h.id) >= 0;
      humApi().select(humShown ? h.id : null, false, true);
      current = { human: h, cat: id, catShown: true, humMissing: !humShown };
      drawCard(true);
    }

    function badge(v) {
      return el("p", { "class": "card-badge vztah vztah-" + v, text: v === "stejne" ? (ui.clovekStejne || "Stejné") : (ui.clovekJine || "Jiné") });
    }
    function catButton(id) {
      var it = catItem(catContent, id) || catItem("kostra", id) || catItem("organy", id);
      if (!it || !window.InfoCard) return null;
      var content = catItem(catContent, id) ? catContent : (catItem("kostra", id) ? "kostra" : "organy");
      var b = el("button", { type: "button", "class": "part-link more-btn", "data-cat": id, text: fmt(ui.clovekCatCard || "Kočičí kartička: {name} →", { name: it.cs }) });
      b.addEventListener("click", function () { window.InfoCard.open(content, id); });
      return b;
    }
    function drawCard(scroll) {
      card.textContent = "";
      if (!current) { card.appendChild(el("p", { "class": "card-empty", text: ui.clovekEmpty || "Klepni na část těla." })); return; }
      var h = current.human;
      if (!h) {
        var ci = catItem(catContent, current.cat);
        card.appendChild(el("div", { "class": "card-head" }, [el("h2", { "class": "card-title", text: ci ? ci.cs : current.cat })]));
        card.appendChild(el("p", { "class": "card-empty", text: ui.clovekCatOnly || "" }));
        var cb = catButton(current.cat); if (cb) card.appendChild(el("p", { "class": "card-link" }, [cb]));
      } else {
        card.appendChild(el("div", { "class": "card-head" }, [el("h2", { "class": "card-title", text: h.cs })]));
        if (latinOn() && h.la) card.appendChild(el("p", { "class": "card-latin", lang: "la", text: h.la }));
        card.appendChild(el("div", { "class": "card-badges" }, [badge(h.vztah),
          h.level === "zvidave" ? el("p", { "class": "card-badge", text: ui.toggleZvidave || "Pro zvídavé" }) : null]));
        if (current.humMissing) card.appendChild(el("p", { "class": "card-empty", text: ui.clovekCatOnly || "" }));
        [["kdeJe", ui.clovekKdeJe || "Kde ji najdeš u člověka?"], ["srovnani", ui.clovekSrovnani || "Kočka a člověk"]].forEach(function (f) {
          if (!h[f[0]]) return;
          card.appendChild(el("h3", { "class": "card-h", text: f[1] }));
          card.appendChild(el("p", { "class": "card-p", text: h[f[0]] }));
        });
        if (h.kocka && !current.catShown) card.appendChild(el("p", { "class": "card-empty", text: ui.clovekNotOnCat || "" }));
        var b = h.kocka ? catButton(h.kocka) : null;
        if (b) card.appendChild(el("p", { "class": "card-link" }, [b]));
      }
      if (scroll && window.matchMedia("(max-width: 899px), (orientation: portrait)").matches) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Both atlases measure their figures, so they are mounted after the screen is in the page.
    bar._mount = function () {
      window.Atlas.mount(humHost, { figure: view.human, card: false, maxHeightVh: view.tall ? 62 : null, onSelect: fromHuman,
        onToggle: function (st) { catApi().refresh(st.layer); if (current && current.human) fromHuman(current.human.id); else drawCard(); } });
      window.Atlas.mount(catHost, { figure: view.cat, card: false, toolbar: false, onSelect: fromCat });
      catApi().refresh(humApi().state.layer);
      // One toolbar for both pictures, above them.
      var tb = humHost.querySelector(".atlas-toolbar"); if (tb) bar.appendChild(tb);
      drawCard();
    };
    return [bar, pair, card];
  }

  function renderFakta(focusId) {
    var fakta = (D.clovek && D.clovek.fakta) || [];
    var list = el("div", { "class": "fakta" });
    fakta.forEach(function (f) {
      var card = el("article", { "class": "fakt" + (f.id === focusId ? " is-focus" : ""), id: "fakt-" + f.id }, [
        el("h2", { "class": "card-title", text: f.cs }), badgeFor(f), el("p", { "class": "card-p", text: f.text })]);
      var imgs = f.image ? (typeof f.image === "string" ? [f.image] : f.image) : [];
      var caps = { "tygr-kostra": ui.clovekTygrKostra || "Kostra tygra", "tygr-stoji": ui.clovekTygrStoji || "Tygr stojící jako člověk" };
      imgs.forEach(function (im) {
        card.appendChild(el("figure", { "class": "fakt-fig" }, [el("img", { src: "images/clovek/" + im + ".webp", alt: caps[im] || f.cs }),
          el("figcaption", { "class": "atlas-credit", text: caps[im] || "" })]));
      });
      if (imgs.length) card.appendChild(el("p", { "class": "atlas-credit", text: ui.clovekTygrCredit || "" }));
      list.appendChild(card);
    });
    list._mount = function () {
      setTimeout(function () { var c = focusId && document.getElementById("fakt-" + focusId); if (c) c.scrollIntoView({ block: "center" }); }, 0);
    };
    return [el("p", { "class": "fig-note", text: ui.clovekFaktaIntro || "" }), list];
  }
  function badgeFor(f) {
    return el("p", { "class": "card-badge vztah vztah-" + f.vztah, text: f.vztah === "stejne" ? (ui.clovekStejne || "Stejné") : (ui.clovekJine || "Jiné") });
  }

  window.Clovek = { render: render };
})();
