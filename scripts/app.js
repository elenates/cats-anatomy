/*
 * App shell: hash-based routing and screen rendering.
 *
 * Routes:
 *   #/          -> main menu (7 sections)
 *   #/kostra       -> Kostra atlas (scripts/atlas.js)
 *   #/kostra/kviz  -> quiz "Najdi kost nebo orgán" (scripts/quiz.js)
 *   #/kostra/spoj  -> quiz "Spoj, co patří k sobě" (scripts/spoj.js)
 *   #/kostra/<part>[/<n>] -> part screen, figure tab n (ATLAS_DATA.kostraViews)
 *   #/svaly[/<n>]  -> Svaly, figure tab n (ATLAS_DATA.svaly.views)
 *   #/svaly/skok[/<n>] -> Jak kočka skáče, step n (ATLAS_DATA.svaly.skok)
 *   #/svaly/kviz   -> quiz Najdi sval (Figs. 68 and 90)
 *   #/svaly/spoj   -> Spoj, co patří k sobě with muscles (ATLAS_DATA.spojSvaly)
 *   #/smysly[/<n>] -> Smysly, figure tab n (ATLAS_DATA.smysly.views)
 *   #/smysly/zajimavosti[/<id>] -> Zajímavosti tab: the fact cards (ATLAS_DATA.smysly.fakta), card id highlighted
 *   #/smysly/kviz  -> quiz Najdi část oka, ucha nebo jazyka (Figs. 167, 173, 95)
 *   #/smysly/spoj  -> Spoj, co patří k sobě with the senses (ATLAS_DATA.spojSmysly)
 *   #/vnejsi/kviz  -> quiz Najdi část těla (cat photo)
 *   #/vnejsi/spoj  -> Spoj, co patří k sobě with body parts (ATLAS_DATA.spojVnejsi)
 *   #/rentgen[/kosti] -> Kočičí rentgen, Kosti on the 1845 cat with the magnifying glass (scripts/rentgen.js)
 *   #/rentgen/organy, #/rentgen/svaly -> the same glass over the photo, organs / muscles
 *   #/rentgen/skutecny[/<n>] -> real X-ray n (1 front, 2 back of the body)
 *   #/rentgen/zajimave[/<id>] -> Zajímavé rentgeny: the gallery / one X-ray
 *   #/clovek[/kostra|organy|rozmnozovaci|zajimavosti[/<view or card id>]] -> Kočka a člověk (scripts/clovek.js)
 *   #/o-aplikaci   -> O aplikaci a zdrojích (ATLAS_DATA.zdroje); linked from the footer of every screen
 *   #/procvicovani -> Procvičování: all games of the atlas (ATLAS_DATA.procvicovani)
 *   #/procvicovani/popisky[/<figure>] -> Doplň popisky: choose a picture / play on it (ATLAS_DATA.popisky)
 *   #/procvicovani/zaverecny -> Závěrečný kvíz with the Diplom (ATLAS_DATA.zaverecny)
 *   <game route>?od=procvicovani -> the game, with its back links returning to Procvičování
 *
 * Hash routing is used because it works both on GitHub Pages and from file://.
 */
(function () {
  "use strict";

  var data = window.ATLAS_DATA || {};
  var sections = data.sections || [];
  var ui = data.ui || {};
  var app = document.getElementById("app");

  /* Small helper to create elements without innerHTML (safe for text content). */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === "text") node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key]);
      });
    }
    (children || []).forEach(function (child) { node.appendChild(child); });
    return node;
  }

  function findSection(id) {
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].id === id) return sections[i];
    }
    return null;
  }

  function renderMenu() {
    var list = el("ul", { "class": "menu" });

    sections.forEach(function (s) {
      var icon = el("span", { "class": "menu-icon", "aria-hidden": "true", text: s.icon });
      var label = el("span", { "class": "menu-label", text: s.cs });
      var item;

      if (s.status === "active") {
        item = el("a", { "class": "menu-card", href: "#/" + s.id }, [icon, label]);
      } else {
        // Inactive sections are not links: visible but not focusable or clickable.
        var badge = el("span", { "class": "menu-badge", text: ui.soon });
        item = el("div", {
          "class": "menu-card is-soon",
          "aria-disabled": "true",
          "aria-label": s.cs + " – " + ui.soon
        }, [icon, label, badge]);
      }
      list.appendChild(el("li", null, [item]));
    });

    var nodes = [el("h1", { "class": "screen-title", text: ui.menuHeading }), list];
    if (data.zarazeni) nodes.push(renderZarazeni(data.zarazeni));
    return nodes;
  }

  /* Mini card "Zařazení kočky v přírodě". Uses the atlas toggles: Latin names
     with "Latinsky", extra ranks with "Pro zvídavé". */
  function renderZarazeni(z) {
    var t = {};
    try { t = JSON.parse(window.localStorage.getItem("atlas.toggles") || "{}"); } catch (e) { /* no storage */ }
    var list = el("ol", { "class": "zar-list" });
    z.rows.forEach(function (r) {
      if (r.level === "zvidave" && !t.zvidave) return;
      var head = el("p", { "class": "zar-head" }, [
        el("span", { "class": "zar-rank", text: r.rank }),
        el("strong", { "class": "zar-name", text: r.cs })
      ]);
      if (t.latinsky && r.la) head.appendChild(el("span", { "class": "zar-la", lang: "la", text: r.la }));
      var li = el("li", { "class": "zar-row" + (r.cs === "kočka domácí" ? " is-cat" : "") }, [head, el("p", { "class": "zar-text", text: r.text })]);
      if (r.link) li.appendChild(el("a", { "class": "zar-link", href: r.link.href, text: r.link.cs + " →" }));
      list.appendChild(li);
    });
    var summary = el("summary", { "class": "zar-summary", text: z.title });
    return el("details", { "class": "zarazeni" }, [summary, el("p", { "class": "zar-intro", text: z.intro }), list]);
  }

  function renderSection(section, sub, sub2) {
    var back = el("a", { "class": "back-link", href: "#/", text: "← " + ui.back });
    var title = el("h1", { "class": "screen-title", text: section.cs });
    if (section.id === "rentgen" && window.Rentgen && data.rentgenKosti && data.rentgenAreas) {
      var rview = { organy: "organy", svaly: "svaly", skutecny: "skutecny", zajimave: "galerie" }[sub] || "kresba";
      var rhost = el("div", { "class": "atlas" });
      rhost._mount = function () { window.Rentgen.mount(rhost, { view: rview, n: parseInt(sub2, 10) || 1, id: sub2 }); };
      return [back, title, rhost];
    }
    if (section.id === "kostra" && sub === "kviz" && window.Quiz) {
      var qback = el("a", { "class": "back-link", href: "#/kostra", text: "← " + (ui.quizBack || "Zpět na kostru") });
      var qhost = el("div", { "class": "atlas quiz" });
      qhost._mount = function () { window.Quiz.mount(qhost, { figure: "skeleton", layer: "kosti", rounds: 10 }); };
      return [qback, el("h1", { "class": "screen-title", text: ui.quizTitle || "Kvíz" }), qhost];
    }
    if (section.id === "kostra" && sub === "spoj" && window.Spoj) {
      var sp = data.spoj && data.spoj.ui || {};
      var sback = el("a", { "class": "back-link", href: "#/kostra", text: "← " + (sp.back || "Zpět na kostru") });
      var shost = el("div", { "class": "spoj" });
      shost._mount = function () { window.Spoj.mount(shost); };
      return [sback, el("h1", { "class": "screen-title", text: sp.title || "Spoj, co patří k sobě" }), shost];
    }
    var views = data.kostraViews || {};
    if (section.id === "kostra" && views[sub] && window.Atlas) return renderPart(sub, parseInt(sub2, 10) || 1);
    if (section.id === "kostra" && window.Atlas) {
      var host = el("div", { "class": "atlas" });
      var quizLink = el("a", { "class": "quiz-open", href: "#/kostra/kviz", text: ui.quizOpen || "Hrát kvíz" });
      var spojLink = el("a", { "class": "quiz-open quiz-secondary", href: "#/kostra/spoj", text: (data.spoj && data.spoj.ui && data.spoj.ui.open) || "Spoj, co patří k sobě" });
      title = el("div", { "class": "screen-head" }, [title, el("div", { "class": "quiz-actions screen-games" }, [quizLink, spojLink])]);
      // The atlas measures text and the figure width, so it is mounted after insertion.
      host._mount = function () { window.Atlas.mount(host, { figure: "skeleton" }); };
      return [back, title, partNav(), host];
    }
    if (section.id === "vnejsi" && sub === "kviz" && window.Quiz) {
      var vqhost = el("div", { "class": "atlas quiz" });
      vqhost._mount = function () {
        window.Quiz.mount(vqhost, { figure: "cat-side", layer: "telo", rounds: 10, texts: {
          figureLabel: ui.quizFigureLabelVnejsi, great: ui.quizGreatVnejsi, back: ui.quizBackVnejsi, backHref: "#/vnejsi" } });
      };
      return [el("a", { "class": "back-link", href: "#/vnejsi", text: "← " + (ui.quizBackVnejsi || "Zpět na vnější stavbu těla") }),
        el("h1", { "class": "screen-title", text: ui.quizTitleVnejsi || "Kvíz: Najdi část těla" }), vqhost];
    }
    if (section.id === "vnejsi" && sub === "spoj" && window.Spoj && data.spojVnejsi) {
      var vsp = data.spojVnejsi.ui || {};
      var vshost = el("div", { "class": "spoj" });
      vshost._mount = function () { window.Spoj.mount(vshost, { content: "vnejsi", config: data.spojVnejsi }); };
      return [el("a", { "class": "back-link", href: "#/vnejsi", text: "← " + (vsp.back || "Zpět na vnější stavbu těla") }),
        el("h1", { "class": "screen-title", text: vsp.title || "Spoj, co patří k sobě" }), vshost];
    }
    if (section.id === "vnejsi" && window.Atlas) {
      var vhost = el("div", { "class": "atlas" });
      vhost._mount = function () { window.Atlas.mount(vhost, { figure: "cat-side" }); };
      var vGames = el("div", { "class": "quiz-actions screen-games" }, [
        el("a", { "class": "quiz-open", href: "#/vnejsi/kviz", text: ui.quizOpenVnejsi || "Najdi část těla" }),
        data.spojVnejsi ? el("a", { "class": "quiz-open quiz-secondary", href: "#/vnejsi/spoj", text: data.spojVnejsi.ui.open }) : null].filter(Boolean));
      return [back, el("div", { "class": "screen-head" }, [title, vGames]), vhost];
    }
    var cparts = (data.organy && data.organy.parts) || [];
    var sk = data.soustavyKviz && data.soustavyKviz.ui || {};
    if (section.id === "organy" && sub === "kviz" && window.Quiz) {
      var oqback = el("a", { "class": "back-link", href: "#/organy", text: "← " + (ui.quizBackOrgany || "Zpět na vnitřní orgány") });
      var oqhost = el("div", { "class": "atlas quiz" });
      oqhost._mount = function () {
        window.Quiz.mount(oqhost, { figure: "organs-side", layer: "organy", rounds: 10, texts: {
          figureLabel: ui.quizFigureLabelOrgany, great: ui.quizGreatOrgany, back: ui.quizBackOrgany, backHref: "#/organy" } });
      };
      return [oqback, el("h1", { "class": "screen-title", text: ui.quizTitleOrgany || "Kvíz: Najdi orgán" }), oqhost];
    }
    if ((section.id === "organy" && sub === "soustavy-kviz" || section.id === "soustavy" && sub === "kviz") && window.SoustavyKviz) {
      var from = section.id === "organy" ? "#/organy" : "#/soustavy";
      var backText = section.id === "organy" ? (sk.back || "Zpět na vnitřní orgány") : (sk.backSoustavy || "Zpět na tělesné soustavy");
      var skhost = el("div", { "class": "atlas quiz soustavy-kviz" });
      skhost._mount = function () { window.SoustavyKviz.mount(skhost, { backHref: from, back: backText }); };
      return [el("a", { "class": "back-link", href: from, text: "← " + backText }),
        el("h1", { "class": "screen-title", text: sk.title || "Do které soustavy patří?" }), skhost];
    }
    if (section.id === "organy" && window.Atlas && cparts.some(function (p) { return p.id === sub; })) return renderCloseup(sub, parseInt(sub2, 10) || 1);
    if (section.id === "organy" && window.Atlas) {
      var ohost = el("div", { "class": "atlas" });
      ohost._mount = function () { window.Atlas.mount(ohost, { figure: "organs-side" }); };
      var clist = el("ul", { "class": "part-nav" });
      cparts.forEach(function (p) { clist.appendChild(el("li", null, [el("a", { "class": "part-link", href: "#/organy/" + p.id, text: p.cs })])); });
      var cnav = el("nav", { "class": "parts", "aria-label": ui.closeupsHeading || "Orgány zblízka" }, [
        el("h2", { "class": "parts-h", text: ui.closeupsHeading || "Orgány zblízka" }), clist]);
      var oGames = el("div", { "class": "quiz-actions screen-games" }, [
        el("a", { "class": "quiz-open", href: "#/organy/kviz", text: ui.quizOpenOrgany || "Najdi orgán" }),
        el("a", { "class": "quiz-open quiz-secondary", href: "#/organy/soustavy-kviz", text: sk.open || "Do které soustavy patří?" })]);
      return [back, el("div", { "class": "screen-head" }, [title, oGames]), cnav, ohost];
    }
    if (section.id === "soustavy" && window.Atlas && data.organy) return renderSystems(sub, sk);
    if (section.id === "svaly" && sub === "spoj" && window.Spoj && data.svaly && data.spojSvaly) {
      var ssp = data.spojSvaly.ui || {};
      var sshost = el("div", { "class": "spoj" });
      sshost._mount = function () { window.Spoj.mount(sshost, { content: "svaly", config: data.spojSvaly }); };
      return [el("a", { "class": "back-link", href: "#/svaly", text: "← " + (ssp.back || "Zpět na svaly") }),
        el("h1", { "class": "screen-title", text: ssp.title || "Spoj, co patří k sobě" }), sshost];
    }
    if (section.id === "svaly" && sub === "kviz" && window.Quiz && data.svaly) {
      var mqhost = el("div", { "class": "atlas quiz" });
      var mvh = {};
      (data.svaly.views || []).forEach(function (v) { if (v.maxHeightVh) mvh[v.figure] = v.maxHeightVh; });
      mqhost._mount = function () {
        window.Quiz.mount(mqhost, { figures: ["muscles-superficial", "muscles-hindleg"], layer: "svaly", rounds: 10, maxHeightVh: mvh, texts: {
          figureLabel: ui.quizFigureLabelSvaly, great: ui.quizGreatSvaly, back: ui.quizBackSvaly, backHref: "#/svaly" } });
      };
      return [el("a", { "class": "back-link", href: "#/svaly", text: "← " + (ui.quizBackSvaly || "Zpět na svaly") }),
        el("h1", { "class": "screen-title", text: ui.quizTitleSvaly || "Kvíz: Najdi sval" }), mqhost];
    }
    if (section.id === "svaly" && window.Atlas && data.svaly) return sub === "skok" ? renderSkok(parseInt(sub2, 10) || 1) : renderSvaly(section, parseInt(sub, 10) || 1);
    if (section.id === "smysly" && sub === "spoj" && window.Spoj && data.smysly && data.spojSmysly) {
      var ysp = data.spojSmysly.ui || {};
      var yshost = el("div", { "class": "spoj" });
      yshost._mount = function () { window.Spoj.mount(yshost, { content: "smysly", config: data.spojSmysly }); };
      return [el("a", { "class": "back-link", href: "#/smysly", text: "← " + (ysp.back || "Zpět na smysly") }),
        el("h1", { "class": "screen-title", text: ysp.title || "Spoj, co patří k sobě" }), yshost];
    }
    if (section.id === "smysly" && sub === "kviz" && window.Quiz && data.smysly) {
      var yqhost = el("div", { "class": "atlas quiz" });
      var yvh = {};
      (data.smysly.views || []).forEach(function (v) { if (v.maxHeightVh) yvh[v.figure] = v.maxHeightVh; });
      yqhost._mount = function () {
        window.Quiz.mount(yqhost, { figures: ["eye", "inner-ear", "tongue"], layer: "smysly", rounds: 10, maxHeightVh: yvh, texts: {
          figureLabel: ui.quizFigureLabelSmysly, great: ui.quizGreatSmysly, back: ui.quizBackSmysly, backHref: "#/smysly" } });
      };
      return [el("a", { "class": "back-link", href: "#/smysly", text: "← " + (ui.quizBackSmysly || "Zpět na smysly") }),
        el("h1", { "class": "screen-title", text: ui.quizTitleSmysly || "Kvíz: Najdi část oka, ucha nebo jazyka" }), yqhost];
    }
    if (section.id === "smysly" && window.Atlas && data.smysly) return sub === "zajimavosti" ? renderFakta(section, sub2) : renderSmysly(section, parseInt(sub, 10) || 1);
    if (section.id === "clovek" && window.Clovek && window.Atlas && data.clovek) return window.Clovek.render(sub, sub2);
    if (section.id === "procvicovani" && sub === "popisky" && data.popisky) return renderPopisky(sub2);
    if (section.id === "procvicovani" && sub === "zaverecny" && data.zaverecny && window.Zaverecny) {
      var zt = data.zaverecny.ui || {};
      var zhost = el("div", { "class": "atlas final" });
      zhost._mount = function () { window.Zaverecny.mount(zhost); };
      return [el("a", { "class": "back-link", href: "#/procvicovani", text: "← " + (zt.back || "Zpět na procvičování") }),
        el("h1", { "class": "screen-title", text: zt.title || "Závěrečný kvíz" }), zhost];
    }
    if (section.id === "procvicovani") return renderProcvicovani(section);
    var note = el("p", { "class": "placeholder", text: ui.kostraPlaceholder });
    return [back, title, note];
  }

  /* Procvičování: every game, grouped by section (ATLAS_DATA.procvicovani). */
  function gameTitle(key) {
    var cfg = { spoj: data.spoj, spojVnejsi: data.spojVnejsi, spojSvaly: data.spojSvaly, spojSmysly: data.spojSmysly, soustavyKviz: data.soustavyKviz,
      kdoMa: data.kdoMa, spojClovek: data.spojClovek }[key];
    return cfg ? (cfg.ui && cfg.ui.title) || key : ui[key] || key;
  }
  function renderProcvicovani(section) {
    var nodes = [el("a", { "class": "back-link", href: "#/", text: "← " + ui.back }), el("h1", { "class": "screen-title", text: section.cs }),
      el("p", { "class": "fig-note", text: ui.procvicovaniIntro || "" })];
    var list = el("div", { "class": "hub" });
    (data.procvicovani || []).forEach(function (g) {
      var s = findSection(g.section);
      if (!s || s.status !== "active") return;
      list.appendChild(el("section", { "class": "hub-group", "data-section": g.section }, [
        el("h2", { "class": "hub-h" }, [el("span", { "aria-hidden": "true", text: s.icon + " " }), document.createTextNode(s.cs)]),
        el("div", { "class": "quiz-actions" }, g.games.map(function (x, i) {
          return el("a", { "class": "quiz-open" + (i ? " quiz-secondary" : ""), href: x.href + "?od=procvicovani", text: gameTitle(x.title) });
        }))]));
    });
    if (data.popisky && window.Popisky) list.appendChild(popiskyCard());
    if (data.zaverecny && window.Zaverecny) {
      var zt = data.zaverecny.ui || {};
      list.appendChild(el("section", { "class": "hub-group", "data-game": "zaverecny" }, [
        el("h2", { "class": "hub-h" }, [el("span", { "aria-hidden": "true", text: "🏆 " }), document.createTextNode(zt.title || "Závěrečný kvíz")]),
        el("p", { "class": "fig-note", text: zt.intro || "" }),
        el("div", { "class": "quiz-actions" }, [el("a", { "class": "quiz-open", href: "#/procvicovani/zaverecny", text: zt.open || "Závěrečný kvíz" })])]));
    }
    nodes.push(list);
    return nodes;
  }

  /* Doplň popisky: a card with one button per picture; the game screen. */
  function popiskyCard() {
    var pt = data.popisky.ui || {};
    return el("section", { "class": "hub-group", "data-game": "popisky" }, [
      el("h2", { "class": "hub-h" }, [el("span", { "aria-hidden": "true", text: "🏷️ " }), document.createTextNode(pt.title || "Doplň popisky")]),
      el("p", { "class": "fig-note", text: pt.intro || "" }),
      el("div", { "class": "quiz-actions" }, data.popisky.figures.map(function (f, i) {
        return el("a", { "class": "quiz-open" + (i ? " quiz-secondary" : ""), href: "#/procvicovani/popisky/" + f.figure, text: f.cs });
      }))]);
  }
  function renderPopisky(figId) {
    var pt = data.popisky.ui || {};
    var f = data.popisky.figures.filter(function (x) { return x.figure === figId; })[0];
    var back = el("a", { "class": "back-link", href: "#/procvicovani", text: "← " + (pt.back || "Zpět na procvičování") });
    if (!f || !window.Popisky) {
      var hub = el("div", { "class": "hub" }, [popiskyCard()]);
      return [back, el("h1", { "class": "screen-title", text: pt.title || "Doplň popisky" }), hub];
    }
    var host = el("div", { "class": "atlas popisky" });
    host._mount = function () { window.Popisky.mount(host, { figure: f.figure, layer: f.layer }); };
    return [back, el("h1", { "class": "screen-title", text: (pt.title || "Doplň popisky") + ": " + f.cs }), host];
  }

  /* Links to the five Kostra part screens (on the overview). */
  function partNav() {
    var parts = (data.kostra && data.kostra.parts) || [];
    var list = el("ul", { "class": "part-nav" });
    parts.forEach(function (p) {
      if (!(data.kostraViews || {})[p.id]) return;
      list.appendChild(el("li", null, [el("a", { "class": "part-link", href: "#/kostra/" + p.id, text: p.cs })]));
    });
    return el("nav", { "class": "parts", "aria-label": ui.partsHeading || "Části kostry" }, [
      el("h2", { "class": "parts-h", text: ui.partsHeading || "Části kostry" }), list]);
  }

  /* Organ close-up screen (Vnitřní orgány): tabs for its 1901 figures. */
  function renderCloseup(partId, n) {
    var part = data.organy.parts.filter(function (p) { return p.id === partId; })[0];
    var tabs = part.figures;
    if (n < 1 || n > tabs.length) n = 1;
    var view = tabs[n - 1];
    var back = el("a", { "class": "back-link", href: "#/organy", text: "← " + (ui.closeupBack || "Zpět na vnitřní orgány") });
    var nodes = [back, el("h1", { "class": "screen-title", text: part.cs })];
    if (tabs.length > 1) {
      var tabList = el("ul", { "class": "fig-tabs" });
      tabs.forEach(function (t, i) {
        var a = el("a", { "class": "fig-tab", href: "#/organy/" + partId + "/" + (i + 1), text: t.cs });
        if (i === n - 1) a.setAttribute("aria-current", "page");
        tabList.appendChild(el("li", null, [a]));
      });
      nodes.push(el("nav", { "class": "fig-nav", "aria-label": ui.partFiguresLabel || "Obrázky" }, [tabList]));
    }
    if (view.note) nodes.push(el("p", { "class": "fig-note", text: view.note }));
    var host = el("div", { "class": "atlas" });
    host._mount = function () { window.Atlas.mount(host, { figure: view.figure }); };
    nodes.push(host);
    return nodes;
  }

  /* Tělesné soustavy: one tab per body system; its organs light up on the organ figure. */
  function renderSystems(sysId, sk) {
    var systems = data.organy.soustavy || [];
    var sys = systems.filter(function (x) { return x.id === sysId; })[0] || systems[0];
    var back = el("a", { "class": "back-link", href: "#/", text: "← " + ui.back });
    var sTitle = el("h1", { "class": "screen-title", text: (data.sections.filter(function (x) { return x.id === "soustavy"; })[0] || {}).cs });
    var sGames = window.SoustavyKviz ? el("div", { "class": "quiz-actions screen-games" }, [
      el("a", { "class": "quiz-open", href: "#/soustavy/kviz", text: (sk && sk.open) || "Do které soustavy patří?" })]) : null;
    var nodes = [back, el("div", { "class": "screen-head" }, [sTitle, sGames])];
    var tabList = el("ul", { "class": "fig-tabs system-tabs" });
    systems.forEach(function (x) {
      var a = el("a", { "class": "fig-tab", href: "#/soustavy/" + x.id, text: x.cs });
      if (x.id === sys.id) a.setAttribute("aria-current", "page");
      tabList.appendChild(el("li", null, [a]));
    });
    nodes.push(el("nav", { "class": "fig-nav", "aria-label": ui.systemsLabel || "Soustavy" }, [tabList]));
    var ids = (data.organy.items || []).filter(function (it) { return it.soustava === sys.id; }).map(function (it) { return it.id; });
    var host = el("div", { "class": "atlas" });
    host._mount = function () { window.Atlas.mount(host, { figure: "organs-side", only: ids, system: sys }); };
    nodes.push(host);
    return nodes;
  }

  /* Svaly: one tab per 1901 muscle figure (ATLAS_DATA.svaly.views). */
  function renderSvaly(section, n) {
    var tabs = data.svaly.views || [];
    if (n < 1 || n > tabs.length) n = 1;
    var view = tabs[n - 1];
    var skok = data.svaly.skok;
    var sTitle = el("h1", { "class": "screen-title", text: section.cs });
    var nodes = [el("a", { "class": "back-link", href: "#/", text: "← " + ui.back }),
      skok ? el("div", { "class": "screen-head" }, [sTitle, el("div", { "class": "quiz-actions screen-games" }, [
        el("a", { "class": "quiz-open", href: "#/svaly/kviz", text: ui.quizOpenSvaly || "Najdi sval" }),
        data.spojSvaly ? el("a", { "class": "quiz-open quiz-secondary", href: "#/svaly/spoj", text: data.spojSvaly.ui.open }) : null,
        el("a", { "class": "quiz-open quiz-secondary", href: "#/svaly/skok", text: skok.open })].filter(Boolean))]) : sTitle];
    var tabList = el("ul", { "class": "fig-tabs" });
    tabs.forEach(function (t, i) {
      var a = el("a", { "class": "fig-tab", href: "#/svaly/" + (i + 1), text: t.cs });
      if (i === n - 1) a.setAttribute("aria-current", "page");
      tabList.appendChild(el("li", null, [a]));
    });
    nodes.push(el("nav", { "class": "fig-nav", "aria-label": ui.svalyTabsLabel || "Obrázky svalů" }, [tabList]));
    if (view.note) nodes.push(el("p", { "class": "fig-note", text: view.note }));
    var host = el("div", { "class": "atlas" });
    host._mount = function () { window.Atlas.mount(host, { figure: view.figure, maxHeightVh: view.maxHeightVh }); };
    nodes.push(host);
    return nodes;
  }

  /* Smysly: one tab per 1901 figure (ATLAS_DATA.smysly.views), then the Zajímavosti tab with the fact cards. */
  function smyslyTabs(current) {
    var tabList = el("ul", { "class": "fig-tabs" });
    (data.smysly.views || []).map(function (t, i) { return { cs: t.cs, href: "#/smysly/" + (i + 1), key: i + 1 }; })
      .concat([{ cs: ui.faktaTab || "Zajímavosti", href: "#/smysly/zajimavosti", key: "zajimavosti" }])
      .forEach(function (t) {
        var a = el("a", { "class": "fig-tab", href: t.href, text: t.cs });
        if (t.key === current) a.setAttribute("aria-current", "page");
        tabList.appendChild(el("li", null, [a]));
      });
    return el("nav", { "class": "fig-nav", "aria-label": ui.smyslyTabsLabel || "Obrázky smyslů" }, [tabList]);
  }
  function smyslyHead(section) {
    return el("div", { "class": "screen-head" }, [el("h1", { "class": "screen-title", text: section.cs }), el("div", { "class": "quiz-actions screen-games" }, [
      el("a", { "class": "quiz-open", href: "#/smysly/kviz", text: ui.quizOpenSmysly || "Najdi část oka, ucha nebo jazyka" }),
      data.spojSmysly ? el("a", { "class": "quiz-open quiz-secondary", href: "#/smysly/spoj", text: data.spojSmysly.ui.open }) : null].filter(Boolean))]);
  }
  function renderSmysly(section, n) {
    var tabs = data.smysly.views || [];
    if (n < 1 || n > tabs.length) n = 1;
    var view = tabs[n - 1];
    var nodes = [el("a", { "class": "back-link", href: "#/", text: "← " + ui.back }), smyslyHead(section), smyslyTabs(n)];
    if (view.note) nodes.push(el("p", { "class": "fig-note", text: view.note }));
    var host = el("div", { "class": "atlas" });
    host._mount = function () { window.Atlas.mount(host, { figure: view.figure, maxHeightVh: view.maxHeightVh }); };
    nodes.push(host);
    return nodes;
  }

  /* The "Pro zvídavé" switch is shared with the atlas screens (same stored setting). */
  var TOGGLES_KEY = "atlas.toggles";
  function zvidaveOn() { try { return !!JSON.parse(localStorage.getItem(TOGGLES_KEY) || "{}").zvidave; } catch (e) { return false; } }
  function setZvidave(on) {
    try { var t = JSON.parse(localStorage.getItem(TOGGLES_KEY) || "{}"); t.zvidave = on; localStorage.setItem(TOGGLES_KEY, JSON.stringify(t)); } catch (e) { /* ignore */ }
  }
  function renderFakta(section, focusId) {
    var fakta = data.smysly.fakta || [], views = data.smysly.views || [];
    var nodes = [el("a", { "class": "back-link", href: "#/", text: "← " + ui.back }), smyslyHead(section), smyslyTabs("zajimavosti")];
    var on = zvidaveOn();
    var tg = el("button", { type: "button", "class": "toggle", "data-toggle": "zvidave", "aria-pressed": String(on), text: ui.toggleZvidave || "Pro zvídavé" });
    var list = el("div", { "class": "fakta" });
    nodes.push(el("div", { "class": "fakta-head" }, [el("p", { "class": "fig-note", text: ui.faktaIntro || "" }), tg]), list);
    function fill() {
      list.textContent = "";
      fakta.forEach(function (f) {
        var card = el("article", { "class": "fakt" + (f.id === focusId ? " is-focus" : ""), id: "fakt-" + f.id }, [
          el("h2", { "class": "card-title", text: f.cs }), el("p", { "class": "card-p", text: f.text })]);
        if (f.image) {
          card.appendChild(el("figure", { "class": "fakt-fig" }, [
            el("img", { src: "images/smysly/" + f.image + ".webp", alt: f.cs }),
            el("figcaption", { "class": "atlas-credit", text: (ui.figurePrefix || "Obrázek") + (f.imageFig ? " " + f.imageFig : "") + ": " + (ui.figureCredit || "") })]));
        }
        if (on && f.zvidave) {
          card.appendChild(el("p", { "class": "card-badge", text: ui.toggleZvidave || "Pro zvídavé" }));
          card.appendChild(el("p", { "class": "card-p", text: f.zvidave }));
        }
        var vi = -1;
        views.forEach(function (v, i) { if (vi < 0 && f.organ && v.organ === f.organ) vi = i; });
        if (vi >= 0) card.appendChild(el("p", { "class": "card-link" }, [el("a", { "class": "part-link", href: "#/smysly/" + (vi + 1), text: (ui.faktaSeeFigure || "Podívej se na obrázek →") })]));
        list.appendChild(card);
      });
    }
    tg.addEventListener("click", function () { on = !on; setZvidave(on); tg.setAttribute("aria-pressed", String(on)); fill(); });
    fill();
    list._mount = function () {   // after render() has moved focus to the screen top
      setTimeout(function () { var c = focusId && document.getElementById("fakt-" + focusId); if (c) c.scrollIntoView({ block: "center" }); }, 0);
    };
    return nodes;
  }

  /* Jak kočka skáče: one step per tab on the hind-leg figure; the step's muscles are lit up, the rest is faded. */
  function renderSkok(n) {
    var skok = data.svaly.skok, steps = skok.steps;
    if (n < 1 || n > steps.length) n = 1;
    var st = steps[n - 1];
    // Muscles that switched on in earlier steps keep working (lighter outline).
    var earlier = [];
    steps.slice(0, n - 1).forEach(function (s) { s.muscles.forEach(function (m) { if (st.muscles.indexOf(m) < 0 && earlier.indexOf(m) < 0) earlier.push(m); }); });
    var hind = (data.svaly.views || []).filter(function (v) { return v.figure === "muscles-hindleg"; })[0] || {};
    var nodes = [el("a", { "class": "back-link", href: "#/svaly/3", text: "← " + skok.back }), el("h1", { "class": "screen-title", text: skok.cs })];
    if (skok.intro) nodes.push(el("p", { "class": "fig-note", text: skok.intro }));
    var tabList = el("ol", { "class": "fig-tabs step-tabs" });
    steps.forEach(function (t, i) {
      var a = el("a", { "class": "fig-tab", href: "#/svaly/skok/" + (i + 1), text: (i + 1) + ". " + t.cs });
      if (i === n - 1) a.setAttribute("aria-current", "step");
      tabList.appendChild(el("li", null, [a]));
    });
    nodes.push(el("nav", { "class": "fig-nav", "aria-label": skok.cs }, [tabList]));
    var host = el("div", { "class": "atlas" });
    host._mount = function () {
      window.Atlas.mount(host, { figure: "muscles-hindleg", only: st.muscles.concat(earlier), anyLevel: true, maxHeightVh: hind.maxHeightVh,
        system: { id: "skok-" + st.id, cs: n + ". " + st.cs, text: st.text, zvidave: st.zvidave, chipsHeading: skok.muscles, alsoIds: earlier, alsoHeading: skok.still, links: st.links } });
    };
    nodes.push(host);
    nodes.push(el("p", { "class": "step-nav" }, [
      n > 1 ? el("a", { "class": "part-link", href: "#/svaly/skok/" + (n - 1), text: skok.prev }) : null,
      n < steps.length ? el("a", { "class": "part-link", href: "#/svaly/skok/" + (n + 1), text: skok.next }) : null].filter(Boolean)));
    return nodes;
  }

  /* Part screen: tabs for its figures, atlas showing only this part. */
  function renderPart(partId, n) {
    var parts = (data.kostra && data.kostra.parts) || [];
    var part = parts.filter(function (p) { return p.id === partId; })[0] || { cs: partId };
    var tabs = data.kostraViews[partId];
    if (n < 1 || n > tabs.length) n = 1;
    var view = tabs[n - 1];
    var back = el("a", { "class": "back-link", href: "#/kostra", text: "← " + (ui.partBack || "Zpět na celou kostru") });
    var title = el("h1", { "class": "screen-title", text: part.cs });
    var nodes = [back, title];
    if (tabs.length > 1) {
      var tabList = el("ul", { "class": "fig-tabs" });
      tabs.forEach(function (t, i) {
        var a = el("a", { "class": "fig-tab", href: "#/kostra/" + partId + "/" + (i + 1), text: t.cs });
        if (i === n - 1) a.setAttribute("aria-current", "page");
        tabList.appendChild(el("li", null, [a]));
      });
      nodes.push(el("nav", { "class": "fig-nav", "aria-label": ui.partFiguresLabel || "Obrázky" }, [tabList]));
    }
    var host = el("div", { "class": "atlas" });
    host._mount = function () { window.Atlas.mount(host, { figure: view.figure, part: partId, layers: view.layers }); };
    nodes.push(host);
    return nodes;
  }

  /* O aplikaci a zdrojích (ATLAS_DATA.zdroje): text parts are [{ text, href? }]. */
  function parts(list, cls) {
    return el("p", { "class": cls || "about-p" }, list.map(function (x) {
      return x.href ? el("a", { href: x.href, target: "_blank", rel: "noopener", text: x.text }) : x.em ? el("em", { text: x.text }) : document.createTextNode(x.text);
    }));
  }
  function renderAbout() {
    var z = data.zdroje;
    var nodes = [el("a", { "class": "back-link", href: "#/", text: "← " + ui.back }), el("h1", { "class": "screen-title", text: z.title }),
      el("p", { "class": "about-p", text: z.intro })];
    var imgs = el("section", { "class": "about-section" }, [el("h2", { text: z.imagesHeading })]);
    z.images.forEach(function (g) {
      var card = el("article", { "class": "about-card" }, [Array.isArray(g.heading) ? (function () { var h = parts(g.heading, ""); var h3 = el("h3"); while (h.firstChild) h3.appendChild(h.firstChild); return h3; })() : el("h3", { text: g.heading })]);
      ["parts", "source", "licence", "changes"].forEach(function (k) { if (g[k]) card.appendChild(parts(g[k])); });
      if (g.figures.length > 1 || g.figures[0].no) {
        card.appendChild(el("ul", { "class": "about-figs" }, g.figures.map(function (f) {
          return el("li", { "data-file": f.file }, [f.no ? el("strong", { text: (ui.figurePrefix || "Obrázek") + " " + f.no + ": " }) : null, document.createTextNode(f.cs)].filter(Boolean));
        })));
      } else card.setAttribute("data-file", g.figures[0].file);
      imgs.appendChild(card);
    });
    nodes.push(imgs);
    [["textsHeading", "texts"], ["privacyHeading", "privacy"], ["codeHeading", "code"]].forEach(function (k) {
      nodes.push(el("section", { "class": "about-section" }, [el("h2", { text: z[k[0]] })].concat(z[k[1]].map(function (x) { return parts(x); }))));
    });
    return nodes;
  }

  function render() {
    var hq = location.hash.replace(/^#\/?/, "").split("?");
    var path = hq[0].split("/");
    // A game opened from Procvičování: its back links (top link and end screen) return there.
    data.returnTo = /(^|&)od=procvicovani(&|$)/.test(hq[1] || "") ? { href: "#/procvicovani", text: ui.backProcvicovani || "Zpět na procvičování" } : null;
    var id = path[0], sub = path[1] || "";
    var section = findSection(id);
    var nodes = id === "o-aplikaci" && data.zdroje ? renderAbout()
      : (section && section.status === "active") ? renderSection(section, sub, path[2]) : renderMenu();

    app.textContent = "";
    if (data.returnTo) nodes.forEach(function (n) {
      if (n.classList && n.classList.contains("back-link")) { n.setAttribute("href", data.returnTo.href); n.textContent = "← " + data.returnTo.text; }
    });
    nodes.forEach(function (n) { app.appendChild(n); });
    nodes.forEach(function (n) { if (n._mount) n._mount(); });

    // Move focus to the new screen so keyboard and screen-reader users start at the top.
    if (id) app.focus();
  }

  window.addEventListener("hashchange", render);
  render();
})();
