/*
 * Kočičí rentgen (#43): the X-ray screen.
 *
 * Data (plain globals): ATLAS_DATA.rentgen (texts, data/rentgen.js), rentgenKosti (data/rentgen-kosti.js),
 * rentgenAreas (data/rentgen-areas.js), the content files kostra / organy / svaly (cards) and zdroje (credits).
 *
 * Public API:  window.Rentgen.mount(container, { view, n, id })
 *   view "kresba"   Kosti on the 1845 cat: a magnifying glass shows the skeleton; a button X-rays the whole cat
 *        "organy"   Orgány on the photo, the same glass and button
 *        "svaly"    Svaly on the photo, the same glass and button
 *        "skutecny" real X-ray n (1 = front of the body, 2 = back of the body)
 *        "galerie"  Zajímavé rentgeny: the list, or the X-ray `id`
 *
 * Interaction (glass views): the glass follows the mouse; on a touch screen it is dragged. A tap (or letting go
 * of the glass) lists everything at that spot ("Na tomhle místě najdeš: …"), the smallest structure first, and
 * opens its card; the other names in the list switch the highlight. Keyboard: Tab to the glass, arrows move it,
 * Enter picks the spot under its centre. Latinsky and Pro zvídavé are the atlas switches (same stored setting).
 * Exposes container._rentgen (pickAt, state) for automated tests.
 */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var STORE_KEY = "atlas.toggles";
  var TOL_PX = 16;   // screen px around an area that still count as a hit

  var D = window.ATLAS_DATA || {};
  var R = D.rentgen || {};
  var U = R.ui || {};
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
  function svgEl(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  function geom() { return (window.Atlas && window.Atlas.geom) || {}; }

  function loadToggles() {
    try { return JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function saveToggle(key, on) {
    try { var t = loadToggles(); t[key] = on; window.localStorage.setItem(STORE_KEY, JSON.stringify(t)); } catch (e) { /* no storage */ }
  }

  function itemOf(content, id) {
    var list = (D[content] && D[content].items) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* Picture credit from data/zdroje.js: author, source and licence of every group that holds one of the files. */
  function credit(files) {
    var box = el("div", { "class": "rg-credits" });
    ((D.zdroje && D.zdroje.images) || []).forEach(function (g) {
      if (!g.figures.some(function (f) { return files.indexOf(f.file) >= 0; })) return;
      var p = el("p", { "class": "atlas-credit" });
      [].concat(g.parts || [], [{ text: " " }], g.licence || []).forEach(function (x) {
        p.appendChild(x.href ? el("a", { href: x.href, target: "_blank", rel: "noopener", text: x.text }) : x.em ? el("em", { text: x.text }) : document.createTextNode(x.text));
      });
      box.appendChild(p);
    });
    return box;
  }

  function tabs(list, label) {
    var ul = el("ul", { "class": "fig-tabs" });
    list.forEach(function (t) {
      var a = el("a", { "class": "fig-tab", href: t.href, text: t.cs });
      if (t.current) a.setAttribute("aria-current", "page");
      ul.appendChild(el("li", null, [a]));
    });
    return el("nav", { "class": "fig-nav", "aria-label": label }, [ul]);
  }

  function toggleBtn(key, label, state, onChange) {
    var b = el("button", { type: "button", "class": "toggle", "data-toggle": key, "aria-pressed": String(!!state[key]), text: label });
    b.addEventListener("click", function () {
      state[key] = !state[key]; saveToggle(key, state[key]);
      b.setAttribute("aria-pressed", String(state[key])); onChange();
    });
    return b;
  }

  /* ---------- a picture with clickable areas (shared by all views) ---------- */
  /*
   * cfg: { W, H, areas: {id: {content, polys}}, nested, state }
   * Returns { stage, svg, find(x, y) -> [ids], highlight(ids, cls), toImage(clientX, clientY) }
   */
  function picture(cfg) {
    var stage = el("div", { "class": "rg-stage" });
    var svg = svgEl("svg", { "class": "rg-svg", viewBox: "0 0 " + cfg.W + " " + cfg.H, preserveAspectRatio: "none", "aria-hidden": "true" });
    var hl = svgEl("g", { "class": "rg-hl" });
    svg.appendChild(hl);
    function setSize(W, H) {
      cfg.W = W; cfg.H = H;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      stage.style.aspectRatio = W + " / " + H;
    }
    setSize(cfg.W, cfg.H);
    function visible(id) {
      var a = cfg.areas[id], it = a && a.content ? itemOf(a.content, id) : null;
      if (a && !a.content) return true;
      return !!it && (it.level !== "zvidave" || !!cfg.state.zvidave);
    }
    function toImage(cx, cy) {
      var r = stage.getBoundingClientRect();
      return { x: (cx - r.left) / r.width * cfg.W, y: (cy - r.top) / r.height * cfg.H, scale: cfg.W / r.width };
    }
    function find(x, y, scale) {
      var g = geom(), tol = TOL_PX * (scale || 1), hits = [];
      Object.keys(cfg.areas).forEach(function (id) {
        if (!visible(id)) return;
        var best = null;
        cfg.areas[id].polys.forEach(function (p) {
          var inside = g.pointInPoly(x, y, p);
          var d = inside ? 0 : g.nearestOnPoly(x, y, p)[2];
          if (d > tol) return;
          var a = g.area(p);
          if (!best || d < best.d || (d === best.d && a < best.a)) best = { id: id, d: d, a: a };
        });
        if (best) hits.push(best);
      });
      // Inside first, the smallest (deepest) structure first; then the near misses, nearest first.
      var inside = hits.filter(function (h) { return h.d === 0; });
      if (inside.length) hits = inside;
      hits.sort(function (a, b) { return a.d - b.d || a.a - b.a; });
      return hits.map(function (h) { return h.id; });
    }
    function highlight(ids, cls) {
      hl.textContent = "";
      (ids || []).forEach(function (id) {
        var d = "";
        (cfg.areas[id] ? cfg.areas[id].polys : []).forEach(function (p) {
          d += "M" + p.map(function (q) { return q[0] + " " + q[1]; }).join("L") + "Z";
        });
        if (d) hl.appendChild(svgEl("path", { d: d, "class": cls || "rg-sel", "data-id": id }));
      });
    }
    return { stage: stage, svg: svg, find: find, highlight: highlight, toImage: toImage, setSize: setSize, cfg: cfg };
  }

  /* ---------- the card: list of what is at the spot, and the selected structure ---------- */
  function cardPanel(state, emptyText) {
    var card = el("div", { "class": "atlas-card rg-card", "aria-live": "polite" });
    var api = { hits: [], selected: null, areas: {}, onSelect: null, emptyText: emptyText };
    function render() {
      card.textContent = "";
      if (!api.hits) { card.appendChild(el("p", { "class": "card-empty", text: U.nothing })); return; }
      if (!api.hits.length) { card.appendChild(el("p", { "class": "card-empty", text: api.emptyText })); return; }
      card.appendChild(el("h3", { "class": "card-h rg-found-h", text: U.found }));
      var ul = el("ul", { "class": "system-organs rg-found" });
      api.hits.forEach(function (id) {
        var a = api.areas[id], it = itemOf(a.content, id);
        var b = el("button", { type: "button", "class": "organ-chip", "data-id": id, "aria-pressed": String(id === api.selected), text: it ? it.cs : id });
        b.addEventListener("click", function () { api.select(id); });
        ul.appendChild(el("li", null, [b]));
      });
      card.appendChild(ul);
      var it = itemOf(api.areas[api.selected].content, api.selected);
      if (!it) return;
      card.appendChild(el("h2", { "class": "card-title rg-title", text: it.cs }));
      if (state.latinsky && it.la) card.appendChild(el("p", { "class": "card-latin", lang: "la", text: it.la }));
      if (it.level === "zvidave") card.appendChild(el("p", { "class": "card-badge", text: ui.toggleZvidave || "Pro zvídavé" }));
      [["kdeJe", ui.kdeJe || "Kde je?"], ["coDela", ui.coDela || "Co dělá?"], ["zajimavost", ui.zajimavost || "Zajímavost"]].forEach(function (f) {
        if (!it[f[0]]) return;
        card.appendChild(el("h3", { "class": "card-h", text: f[1] }));
        card.appendChild(el("p", { "class": "card-p", text: it[f[0]] }));
      });
      var c = api.areas[api.selected].content;
      var link = { kostra: ["#/kostra", U.seeAtlasKostra], organy: ["#/organy", U.seeAtlasOrgany], svaly: ["#/svaly", U.seeAtlasSvaly] }[c];
      if (link) card.appendChild(el("p", { "class": "card-link" }, [el("a", { "class": "part-link", href: link[0], text: link[1] })]));
    }
    api.show = function (hits, areas) { api.areas = areas; api.hits = hits; api.selected = hits && hits[0] || null; render(); if (api.onSelect) api.onSelect(api.selected); };
    api.select = function (id) { api.selected = id; render(); if (api.onSelect) api.onSelect(id); };
    api.render = render;
    api.node = card;
    render();
    return api;
  }

  function scrollToCard(card) {
    if (window.matchMedia("(max-width: 899px), (orientation: portrait)").matches) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------- glass views: Kosti (1845), Orgány and Svaly (photo) ---------- */
  function glassView(container, view) {
    var state = loadToggles();
    var src;
    if (view === "kresba") {
      var K = D.rentgenKosti.kresba;
      src = { W: K.width, H: K.height, base: K.image, glass: [K.skeleton], areas: K.areas, nested: K.nested, files: [K.image],
        whole: { W: K.cela.width, H: K.cela.height, base: K.cela.image, layers: [], areas: K.cela.areas } };
    } else {
      var A = D.rentgenAreas, layer = (A.layers.filter(function (l) { return l.id === view; })[0] || {}).image;
      src = { W: A.width, H: A.height, base: A.image, glass: [layer, A.base], areas: A.areas[view], nested: A.nested, files: [A.image, layer],
        whole: { W: A.width, H: A.height, base: A.base, layers: [layer], areas: A.areas[view] } };
    }
    var whole = false;
    var pic = picture({ W: src.W, H: src.H, areas: src.areas, nested: src.nested, state: state });
    var base = el("img", { "class": "rg-base", src: src.base, alt: "", draggable: "false" });
    var over = el("div", { "class": "rg-over" });
    var lens = el("div", { "class": "rg-lens", tabindex: "0", role: "button", "aria-label": U.lensLabel });
    // The highlight lies over the glass, so it shows inside it too; it lets taps through to the picture and the glass.
    pic.svg.classList.add("rg-svg-top");
    pic.stage.appendChild(base); pic.stage.appendChild(over); pic.stage.appendChild(lens); pic.stage.appendChild(pic.svg);
    var card = cardPanel(state, U.cardEmpty);
    card.onSelect = function (id) { pic.highlight(id ? [id] : []); };

    // glass position in image pixels
    var all = [];
    Object.keys(src.areas).forEach(function (k) { src.areas[k].polys.forEach(function (p) { all = all.concat(p); }); });
    var xs = all.map(function (q) { return q[0]; }), ys = all.map(function (q) { return q[1]; });
    var pos = { x: (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, y: (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2 };

    function placeLens() {
      if (whole) return;
      var r = pic.stage.getBoundingClientRect(); if (!r.width) return;
      var L = Math.round(Math.max(110, Math.min(220, r.width * 0.26)));
      var cx = pos.x / src.W * r.width, cy = pos.y / src.H * r.height;
      lens.style.width = lens.style.height = L + "px";
      lens.style.left = (cx - L / 2) + "px"; lens.style.top = (cy - L / 2) + "px";
      lens.style.backgroundImage = src.glass.map(function (g) { return "url(\"" + g + "\")"; }).join(", ");
      lens.style.backgroundSize = src.glass.map(function () { return r.width + "px " + r.height + "px"; }).join(", ");
      lens.style.backgroundPosition = src.glass.map(function () { return (L / 2 - cx) + "px " + (L / 2 - cy) + "px"; }).join(", ");
    }
    function moveTo(x, y) {
      var W = whole ? src.whole.W : src.W, H = whole ? src.whole.H : src.H;
      pos.x = Math.max(0, Math.min(W, x)); pos.y = Math.max(0, Math.min(H, y)); placeLens();
    }
    function pickAt(x, y, scale) {
      var areas = whole ? src.whole.areas : src.areas;
      var hits = pic.find(x, y, scale);
      card.show(hits.length ? hits : null, areas);
      if (hits.length) scrollToCard(card.node);
    }

    function setWhole(on) {
      whole = on;
      wholeBtn.setAttribute("aria-pressed", String(on));
      wholeBtn.textContent = on ? U.wholeOff : U.wholeOn;
      container.classList.toggle("is-whole", on);
      var s = on ? src.whole : src;
      base.src = s.base;
      pic.cfg.areas = s.areas; pic.setSize(s.W, s.H);
      over.textContent = "";
      if (on) src.whole.layers.forEach(function (l) { over.appendChild(el("img", { src: l, alt: "" })); });
      lens.hidden = on;
      hint.hidden = on;
      card.emptyText = on ? U.cardEmptyWhole : U.cardEmpty;
      card.show([], s.areas); pic.highlight([]);
      if (!on) { pos.x = Math.min(pos.x, src.W); pos.y = Math.min(pos.y, src.H); placeLens(); }
    }

    // mouse: the glass follows the pointer; any click picks the spot
    pic.stage.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || drag) return;
      var p = pic.toImage(e.clientX, e.clientY); moveTo(p.x, p.y);
    });
    pic.stage.addEventListener("click", function (e) {
      if (e.target === lens) return;   // the glass handles its own taps (pointerup)
      var p = pic.toImage(e.clientX, e.clientY); moveTo(p.x, p.y); pickAt(p.x, p.y, p.scale);
    });
    // touch and pen: drag the glass; a tap on it (or letting go after a drag) picks the spot
    var drag = null;
    lens.addEventListener("pointerdown", function (e) {
      drag = { x: e.clientX, y: e.clientY, moved: false };
      try { lens.setPointerCapture(e.pointerId); } catch (err) { /* old browsers */ }
      e.preventDefault();
    });
    lens.addEventListener("pointermove", function (e) {
      if (!drag) return;
      if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 6) drag.moved = true;
      if (drag.moved) { var p = pic.toImage(e.clientX, e.clientY); moveTo(p.x, p.y); }
    });
    lens.addEventListener("pointerup", function (e) {
      if (!drag) return;
      var moved = drag.moved; drag = null;
      var p = pic.toImage(e.clientX, e.clientY);
      if (moved) pickAt(pos.x, pos.y, p.scale); else { moveTo(p.x, p.y); pickAt(p.x, p.y, p.scale); }
    });
    lens.addEventListener("pointercancel", function () { drag = null; });
    lens.addEventListener("keydown", function (e) {
      var step = src.W * 0.03, k = e.key;
      if (k === "ArrowLeft") moveTo(pos.x - step, pos.y);
      else if (k === "ArrowRight") moveTo(pos.x + step, pos.y);
      else if (k === "ArrowUp") moveTo(pos.x, pos.y - step);
      else if (k === "ArrowDown") moveTo(pos.x, pos.y + step);
      else if (k === "Enter" || k === " ") { var r = pic.stage.getBoundingClientRect(); pickAt(pos.x, pos.y, src.W / r.width); }
      else return;
      e.preventDefault();
    });

    var wholeBtn = el("button", { type: "button", "class": "seg-btn rg-whole-btn", "aria-pressed": "false", text: U.wholeOn });
    wholeBtn.addEventListener("click", function () { setWhole(!whole); });
    var rerender = function () { card.show([], whole ? src.whole.areas : src.areas); pic.highlight([]); };
    var toolbar = el("div", { "class": "atlas-toolbar" }, [wholeBtn, el("div", { "class": "toggles" }, [
      toggleBtn("latinsky", ui.toggleLatinsky || "Latinsky", state, function () { card.render(); }),
      toggleBtn("zvidave", ui.toggleZvidave || "Pro zvídavé", state, rerender)])]);
    var hint = el("p", { "class": "fig-note rg-hint", text: U.lensHint });
    var notes = [el("p", { "class": "fig-note rg-approx", text: U.approx })];
    if (view === "kresba") notes.unshift(el("p", { "class": "fig-note rg-wildcat", text: U.wildcat }));
    var fig = el("div", { "class": "atlas-figure rg-figure" }, [pic.stage, credit(src.files.concat(view === "kresba" ? [D.rentgenKosti.kresba.cela.image] : []))]);
    container.appendChild(toolbar);
    container.appendChild(hint);
    container.appendChild(el("div", { "class": "atlas-layout" }, [el("div", null, [fig].concat(notes)), card.node]));

    window.addEventListener("resize", function onResize() {
      if (!document.body.contains(container)) { window.removeEventListener("resize", onResize); return; }
      placeLens();
    });
    if (base.complete) placeLens(); else base.addEventListener("load", placeLens, { once: true });
    placeLens();
    container._rentgen = { state: state, pickAt: pickAt, moveTo: moveTo, setWhole: setWhole, get whole() { return whole; }, card: card, pos: pos };
  }

  /* ---------- Skutečný rentgen ---------- */
  function realView(container, n) {
    var list = D.rentgenKosti.skutecny, f = list[n - 1] || list[0], state = loadToggles();
    container.appendChild(tabs(list.map(function (x, i) {
      return { cs: i === 0 ? U.realA : U.realB, href: "#/rentgen/skutecny/" + (i + 1), current: x === f };
    }), U.realTabsLabel));
    var pic = picture({ W: f.width, H: f.height, areas: f.areas, nested: f.nested, state: state });
    pic.stage.appendChild(el("img", { "class": "rg-base", src: f.image, alt: "", draggable: "false" }));
    pic.stage.appendChild(pic.svg);
    pic.stage.classList.add("rg-real");
    var card = cardPanel(state, U.cardEmptyReal);
    card.onSelect = function (id) { pic.highlight(id ? [id] : []); };
    function pickAt(x, y, scale) { var h = pic.find(x, y, scale); card.show(h.length ? h : null, f.areas); if (h.length) scrollToCard(card.node); }
    pic.svg.addEventListener("click", function (e) { var p = pic.toImage(e.clientX, e.clientY); pickAt(p.x, p.y, p.scale); });
    container.appendChild(el("div", { "class": "atlas-toolbar" }, [el("div", { "class": "toggles" }, [
      toggleBtn("latinsky", ui.toggleLatinsky || "Latinsky", state, function () { card.render(); }),
      toggleBtn("zvidave", ui.toggleZvidave || "Pro zvídavé", state, function () { card.show([], f.areas); pic.highlight([]); })])]));
    container.appendChild(el("p", { "class": "fig-note rg-real-note", text: U.realNote }));
    container.appendChild(el("div", { "class": "atlas-layout" }, [el("div", null, [
      el("div", { "class": "atlas-figure rg-figure rg-dark" }, [pic.stage, credit([f.image])]),
      el("p", { "class": "fig-note rg-approx", text: U.approx })]), card.node]));
    container._rentgen = { state: state, pickAt: pickAt, card: card };
  }

  /* ---------- Zajímavé rentgeny ---------- */
  function galleryView(container, id) {
    var G = D.rentgenKosti.galerie, T = R.galerie || {};
    var g = G.filter(function (x) { return x.id === id; })[0];
    if (!g) {
      container.appendChild(el("p", { "class": "fig-note", text: U.galleryIntro }));
      var grid = el("ul", { "class": "rg-gallery" });
      G.forEach(function (x) {
        grid.appendChild(el("li", null, [el("a", { "class": "rg-gal-card", href: "#/rentgen/zajimave/" + x.id, "data-id": x.id }, [
          el("span", { "class": "rg-gal-img" }, [el("img", { src: x.image, alt: "", loading: "lazy" })]),
          el("span", { "class": "rg-gal-title", text: (T[x.id] || {}).cs || x.id })])]));
      });
      container.appendChild(grid);
      return;
    }
    var t = T[g.id] || { areas: {} }, areas = {};
    g.areas.forEach(function (a) { areas[a.id] = { polys: a.shapes, label: a.label }; });
    container.appendChild(el("a", { "class": "part-link rg-gal-back", href: "#/rentgen/zajimave", text: "← " + U.galleryBack }));
    container.appendChild(el("h2", { "class": "rg-gal-h", text: t.cs }));
    container.appendChild(el("p", { "class": "card-p rg-gal-text", text: t.text }));
    var pic = picture({ W: g.width, H: g.height, areas: areas, state: {} });
    pic.stage.appendChild(el("img", { "class": "rg-base", src: g.image, alt: t.cs, draggable: "false" }));
    pic.stage.appendChild(pic.svg);
    var card = el("div", { "class": "atlas-card rg-card", "aria-live": "polite" });
    function showArea(aid) {
      card.textContent = "";
      card.appendChild(el("h2", { "class": "card-title rg-title", text: areas[aid].label }));
      card.appendChild(el("p", { "class": "card-p", text: t.areas[aid] }));
    }
    function message(text) { card.textContent = ""; card.appendChild(el("p", { "class": "card-empty", text: text })); }
    function pickAt(x, y, scale) {
      var h = pic.find(x, y, scale);
      if (h.length) { pic.highlight([h[0]]); showArea(h[0]); scrollToCard(card); }
      else { pic.highlight([]); message(U.galleryMiss); }
    }
    pic.svg.addEventListener("click", function (e) { var p = pic.toImage(e.clientX, e.clientY); pickAt(p.x, p.y, p.scale); });
    var show = el("button", { type: "button", "class": "quiz-open quiz-secondary rg-show", text: U.galleryShow });
    show.addEventListener("click", function () {
      pic.highlight(Object.keys(areas), "rg-sel rg-shown");
      card.textContent = "";
      Object.keys(areas).forEach(function (aid) {
        card.appendChild(el("h2", { "class": "card-title rg-title", text: areas[aid].label }));
        card.appendChild(el("p", { "class": "card-p", text: t.areas[aid] }));
      });
    });
    message(U.galleryFind);
    container.appendChild(el("div", { "class": "atlas-toolbar" }, [show]));
    container.appendChild(el("div", { "class": "atlas-layout" }, [
      el("div", { "class": "atlas-figure rg-figure rg-dark" }, [pic.stage, credit([g.image])]), card]));
    container._rentgen = { pickAt: pickAt, areas: areas };
  }

  function mount(container, opts) {
    var view = opts.view || "kresba";
    var kosti = view === "kresba" || view === "skutecny" || view === "galerie";
    container.classList.add("rentgen");
    container.appendChild(tabs([
      { cs: U.modeKosti, href: "#/rentgen/kosti", current: kosti },
      { cs: U.modeOrgany, href: "#/rentgen/organy", current: view === "organy" },
      { cs: U.modeSvaly, href: "#/rentgen/svaly", current: view === "svaly" }], U.modesLabel));
    if (kosti) container.appendChild(tabs([
      { cs: U.viewKresba, href: "#/rentgen/kosti", current: view === "kresba" },
      { cs: U.viewSkutecny, href: "#/rentgen/skutecny", current: view === "skutecny" },
      { cs: U.viewGalerie, href: "#/rentgen/zajimave", current: view === "galerie" }], U.kostiLabel));
    var body = el("div", { "class": "rg-body" });
    container.appendChild(body);
    if (view === "skutecny") realView(body, opts.n || 1);
    else if (view === "galerie") galleryView(body, opts.id);
    else glassView(body, view);
    container._rentgen = body._rentgen;
  }

  window.Rentgen = { mount: mount };
})();
