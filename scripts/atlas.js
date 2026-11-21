/*
 * Atlas screen: a figure with SVG hotspots, an info card and toggles.
 *
 * Data (plain globals, loaded before this file):
 *   ATLAS_DATA.kostra    content items (data/kostra.js)
 *   ATLAS_DATA.hotspots  polygons per figure and layer (data/hotspots-kostra.js)
 *   ATLAS_DATA.ui        Czech UI strings (data/sections.js)
 *
 * Public API:  window.Atlas.mount(container, { figure: "skeleton" })
 *   options:    figure  hotspot figure id (data/hotspots-kostra.js)
 *               part    show only structures of this Kostra part (part screens)
 *               layers  list of layer ids to offer (default: all of the figure)
 *               maxHeightVh  tall figure: at most this share of the window height (Svaly, Fig. 90)
 *               anyLevel  with only: show those ids at both levels (Jak kočka skáče)
 *               system.chipsHeading / system.links  heading over the buttons, extra links (Jak kočka skáče)
 *               system.alsoIds / system.alsoHeading  ids from earlier steps: lighter outline, own list
 *               card: false  no info card (a screen that shows its own card, Kočka a člověk)
 *               toolbar: false  no toolbar (the partner atlas of a pair has it)
 *               onSelect(id)  called after every tap (id or null); onToggle(state) after a toolbar change
 *   container._atlas: select(id, fromKeyboard, silent), refresh(layer) (re-read the switches), state, selected
 *
 * Interaction:
 *   - tap / click a hotspot, or Tab to it and press Enter / Space -> info card
 *   - a tap that misses every hotspot selects the nearest one within
 *     TAP_TOLERANCE_PX screen pixels (thin bones get a >= 44 px target)
 *   - Escape closes the card
 * Toggles (remembered in localStorage when available):
 *   Popisky     labels in the margin around the figure, with leader lines
 *   Latinsky    Latin name in the info card
 *   Pro zvídavé extra structures (hotspots when drawn; list in the info card)
 */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var TAP_TOLERANCE_PX = 22;      // screen px around a hotspot that still count as a hit
  var MIN_LABEL_PX = 13;          // labels never render smaller than this on screen
  var STORE_KEY = "atlas.toggles";

  var D = window.ATLAS_DATA || {};
  var ui = D.ui || {};

  // ---------- small helpers ----------
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    setAttrs(n, attrs);
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function svgEl(tag, attrs) { var n = document.createElementNS(NS, tag); setAttrs(n, attrs); return n; }
  function setAttrs(n, attrs) {
    if (!attrs) return;
    Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    });
  }
  function loadToggles() {
    var d = { popisky: false, latinsky: false, zvidave: false, layer: "kosti" };
    try {
      var s = JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}");
      Object.keys(d).forEach(function (k) { if (k in s) d[k] = s[k]; });
    } catch (e) { /* storage unavailable (some file:// setups): use defaults */ }
    return d;
  }
  function saveToggles(t) {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(t)); } catch (e) { /* ignore */ }
  }

  // ---------- geometry ----------
  function pointInPoly(x, y, p) {
    var inside = false;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      var xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  // Nearest point on a polygon's outline to (x, y); returns [px, py, dist].
  function nearestOnPoly(x, y, p) {
    var best = [p[0][0], p[0][1], Infinity];
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      var ax = p[j][0], ay = p[j][1], bx = p[i][0], by = p[i][1];
      var dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
      var t = len2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2)) : 0;
      var px = ax + t * dx, py = ay + t * dy, d = Math.hypot(x - px, y - py);
      if (d < best[2]) best = [px, py, d];
    }
    return best;
  }
  function centroid(p) {
    var x = 0, y = 0;
    p.forEach(function (q) { x += q[0]; y += q[1]; });
    return [x / p.length, y / p.length];
  }
  function area(p) {
    var a = 0;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) a += (p[j][0] + p[i][0]) * (p[j][1] - p[i][1]);
    return Math.abs(a / 2);
  }

  // ---------- mount ----------
  function mount(container, opts) {
    var figId = (opts && opts.figure) || "skeleton";
    var fig = (D.hotspots || {})[figId];
    var sections = D.sections || [];
    // Which content file the hotspots belong to ("kostra" unless the figure says otherwise).
    var content = (fig && fig.content) || "kostra";
    var items = (D[content] && D[content].items) || [];
    var parts = (D[content] && D[content].parts) || [];
    var byId = {};
    items.forEach(function (it) { byId[it.id] = it; });

    if (!fig) {
      container.appendChild(el("p", { "class": "placeholder", text: "Chybí data obrázku." }));
      return;
    }

    var part = opts && opts.part;
    // Body system view (Tělesné soustavy): only these organs, all tinted, with the system's text.
    var only = opts && opts.only;
    var system = opts && opts.system;
    var layerIds = Object.keys(fig.layers).filter(function (l) { return !(opts && opts.layers) || opts.layers.indexOf(l) >= 0; });
    var state = loadToggles();
    if (layerIds.indexOf(state.layer) < 0) state.layer = layerIds[0];
    var selected = null;

    // ----- toolbar -----
    var layerNames = { kosti: ui.layerKosti || "Kosti", klouby: ui.layerKlouby || "Klouby", telo: ui.layerTelo || "Části těla", organy: ui.layerOrgany || "Orgány", svaly: ui.layerSvaly || "Svaly", smysly: "Smysly" };
    var layerGroup = el("div", { "class": "seg", role: "group", "aria-label": ui.layerLabel || "Zobrazit" });
    layerIds.forEach(function (ln) {
      var b = el("button", { type: "button", "class": "seg-btn", "data-layer": ln, text: layerNames[ln] || ln });
      b.addEventListener("click", function () { state.layer = ln; selected = null; saveToggles(state); renderAll(); if (opts && opts.onToggle) opts.onToggle(state); if (opts && opts.onSelect) opts.onSelect(null); });
      layerGroup.appendChild(b);
    });
    function toggle(key, label) {
      var b = el("button", { type: "button", "class": "toggle", "data-toggle": key, text: label });
      b.addEventListener("click", function () { state[key] = !state[key]; saveToggles(state); renderAll(); if (opts && opts.onToggle) opts.onToggle(state); });
      return b;
    }
    var toolbar = el("div", { "class": "atlas-toolbar" }, [
      layerIds.length > 1 ? layerGroup : null,
      el("div", { "class": "toggles", role: "group", "aria-label": ui.togglesLabel || "Zobrazení" }, [
        toggle("popisky", ui.togglePopisky || "Popisky"),
        toggle("latinsky", ui.toggleLatinsky || "Latinsky"),
        toggle("zvidave", ui.toggleZvidave || "Pro zvídavé")
      ])
    ]);

    // ----- figure -----
    var svg = svgEl("svg", { "class": "atlas-svg", role: "group", "aria-label": content === "vnejsi" ? (ui.figureLabelVnejsi || "Fotka kočky") :
      content === "organy" ? (ui.figureLabelOrgany || "Obrázek vnitřních orgánů kočky") :
      content === "svaly" ? (ui.figureLabelSvaly || "Obrázek svalů kočky") :
      content === "smysly" ? (ui.figureLabelSmysly || "Obrázek smyslového orgánu u kočky") : (ui.figureLabel || "Obrázek kostry") });
    var maxVh = opts && opts.maxHeightVh;
    if (maxVh) svg.style.margin = "0 auto";
    var figBox = el("div", { "class": "atlas-figure" + (only ? " is-system" : "") }, [svg]);
    // "Reighard & Jennings 1901, Fig. 40" -> "Obrázek 40: J. Reighard a H. S. Jennings, ..."
    var figNo = /Fig\. (\d+)/.exec(fig.figure || "");
    var credit;
    if (fig.credit) {
      // Licensed photo: author, source and licence, each linked (CC BY-SA asks for this).
      credit = el("p", { "class": "atlas-credit" });
      (fig.creditParts || [{ text: fig.credit }]).forEach(function (c) {
        credit.appendChild(c.href ? el("a", { href: c.href, target: "_blank", rel: "noopener", text: c.text }) : document.createTextNode(c.text));
      });
    } else {
      credit = el("p", { "class": "atlas-credit", text: (ui.figurePrefix || "Obrázek") + (figNo ? " " + figNo[1] : "") + ": " + (ui.figureCredit || "") });
    }

    // ----- card -----
    var card = el("section", { "class": "atlas-card", "aria-live": "polite" });

    var layout = el("div", { "class": "atlas-layout" }, [
      el("div", { "class": "atlas-figure-col" }, [figBox, credit]),
      opts && opts.card === false ? null : card
    ]);
    if (opts && opts.card === false) layout.classList.add("no-card");
    if (!(opts && opts.toolbar === false)) container.appendChild(toolbar);
    container.appendChild(layout);

    // ----- rendering -----
    function visibleIds() {
      var lay = fig.layers[state.layer] || {};
      return items.map(function (it) { return it.id; }).filter(function (id) {
        return lay[id] && (!part || byId[id].part === part) && (!only || only.indexOf(id) >= 0) && (byId[id].level === "zaklad" || state.zvidave || (only && opts.anyLevel));
      });
    }

    function renderToolbar() {
      Array.prototype.forEach.call(toolbar.querySelectorAll("[data-layer]"), function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-layer") === state.layer));
      });
      Array.prototype.forEach.call(toolbar.querySelectorAll("[data-toggle]"), function (b) {
        b.setAttribute("aria-pressed", String(!!state[b.getAttribute("data-toggle")]));
      });
    }

    // Labels go in a margin around the figure. Side per structure comes from
    // fig.labelSides (hand-tuned) or, failing that, the nearest figure edge.
    function sideFor(id, poly) {
      var s = fig.labelSides && fig.labelSides[id];
      if (s) return s;
      var c = centroid(poly), W = fig.width, H = fig.height;
      var d = { left: c[0], right: W - c[0], top: c[1] * 2.2, bottom: (H - c[1]) * 2.2 };
      return Object.keys(d).reduce(function (a, b) { return d[a] <= d[b] ? a : b; });
    }

    var polyNodes = {};
    function renderFigure() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      polyNodes = {};
      var W = fig.width, H = fig.height, ids = visibleIds();
      var lay = fig.layers[state.layer] || {};

      // Narrow screens + labels: the figure keeps a readable width and scrolls sideways (CSS).
      figBox.classList.toggle("has-labels", !!state.popisky);
      figBox.classList.toggle("is-wide", W > H * 1.2);   // only wide figures need the sideways scroll
      // First pass with no margins, to know the on-screen scale.
      var boxW = svg.getBoundingClientRect().width || figBox.clientWidth || W;
      var scale = boxW / W;
      var font = Math.max(26, MIN_LABEL_PX / scale);
      var mL = 0, mR = 0, mT = 0, mB = 0, labels = [];

      if (state.popisky) {
        // Measure label widths once at a reference size; widths scale linearly with the font.
        var REF = 100;
        var probe = svgEl("text", { "class": "atlas-label", "font-size": REF });
        svg.appendChild(probe);
        // A larger structure whose smaller parts are all shown (fig.nested) gets no label:
        // the parts cover it, so its leader line could only point at one of them.
        var nestedKids = function (id) { return ((fig.nested || {})[id] || []).filter(function (k) { return ids.indexOf(k) >= 0; }); };
        var sumArea = function (polys) { return polys.reduce(function (a, p) { return a + area(p); }, 0); };
        ids.filter(function (id) {
          var shown = nestedKids(id);
          var covered = shown.reduce(function (a, k) { return a + sumArea(lay[k]); }, 0);
          return !(shown.length && covered > 0.8 * sumArea(lay[id]));
        }).forEach(function (id) {
          var big = lay[id].reduce(function (a, b) { return area(a) >= area(b) ? a : b; });
          probe.textContent = byId[id].cs;
          // getComputedTextLength() can return 0 while the page is not rendered
          // (resize in progress, fonts loading): fall back to an estimate.
          var measured = probe.getComputedTextLength();
          var w1 = measured > 0 ? measured / REF : byId[id].cs.length * 0.58;
          labels.push({ id: id, side: sideFor(id, big), c: centroid(big), w1: w1 });
        });
        svg.removeChild(probe);
        var maxW1 = function (side) { return labels.filter(function (l) { return l.side === side; }).reduce(function (m, l) { return Math.max(m, l.w1); }, 0); };
        var hasTop = labels.some(function (l) { return l.side === "top"; });
        var hasBottom = labels.some(function (l) { return l.side === "bottom"; });
        // Font and margins depend on each other: iterate until they agree.
        for (var k = 0; k < 6; k++) {
          mL = maxW1("left") ? (maxW1("left") + 1.8) * font : 0;
          mR = maxW1("right") ? (maxW1("right") + 1.8) * font : 0;
          mT = hasTop ? font * 2.6 : 0;
          mB = hasBottom ? font * 2.6 : 0;
          scale = boxW / (W + mL + mR);
          var f2 = Math.max(26, MIN_LABEL_PX / scale);
          if (Math.abs(f2 - font) < 0.5) { font = f2; break; }
          font = f2;
        }
        mL = maxW1("left") ? (maxW1("left") + 1.8) * font : 0;
        mR = maxW1("right") ? (maxW1("right") + 1.8) * font : 0;
        mT = hasTop ? font * 2.6 : 0;
        mB = hasBottom ? font * 2.6 : 0;
        labels.forEach(function (l) { l.w = l.w1 * font; });
      }

      svg.setAttribute("viewBox", [-mL, -mT, W + mL + mR, H + mT + mB].join(" "));
      // Tall figure: keep it within maxHeightVh of the window by limiting its width (keeps the aspect ratio).
      if (maxVh) svg.style.maxWidth = "calc(" + maxVh + "vh * " + ((W + mL + mR) / (H + mT + mB)).toFixed(4) + ")";
      svg.appendChild(svgEl("image", { href: fig.image, x: 0, y: 0, width: W, height: H, "class": "atlas-img" }));
      // Older Safari needs xlink:href for <image>.
      svg.lastChild.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", fig.image);

      // System view: fade everything outside the system's organs, so they stand out in their own colours.
      // A system with no organs on the drawing (rozmnožovací) fades the whole picture.
      if (only && (only.length || !(system && system.links))) {   // a jump step with no muscles stays unfaded
        var d = "M0 0H" + W + "V" + H + "H0Z";
        ids.forEach(function (id) {
          lay[id].forEach(function (p) { d += "M" + p.map(function (q) { return q.join(" "); }).join("L") + "Z"; });
        });
        svg.appendChild(svgEl("path", { "class": "system-fade", d: d, "fill-rule": "evenodd", "aria-hidden": "true" }));
      }
      var gHot = svgEl("g", { "class": "hotspots" });
      // Larger structures first, so smaller ones drawn inside them (fig.nested) stay on top.
      ids.slice().sort(function (a, b) { return bigArea(lay[b]) - bigArea(lay[a]); }).forEach(function (id) {
        var it = byId[id];
        var g = svgEl("g", {
          "class": "hotspot" + (id === selected ? " is-selected" : "") + (system && (system.alsoIds || []).indexOf(id) >= 0 ? " is-also" : ""),
          tabindex: "0", role: "button",
          "aria-label": it.cs, "aria-pressed": String(id === selected), "data-id": id
        });
        lay[id].forEach(function (p) {
          g.appendChild(svgEl("polygon", { points: p.map(function (q) { return q.join(","); }).join(" ") }));
        });
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(id, true); }
        });
        polyNodes[id] = g;
        gHot.appendChild(g);
      });
      svg.appendChild(gHot);

      if (state.popisky) drawLabels(labels, font, W, H, mL, mR, mT, mB, lay);
    }

    function drawLabels(labels, font, W, H, mL, mR, mT, mB, lay) {
      var g = svgEl("g", { "class": "labels", "aria-hidden": "true" });
      var gap = font * 1.35, pad = font * 0.6;
      function spreadY(list) {
        list.sort(function (a, b) { return a.c[1] - b.c[1]; });
        var lo = -mT + font, hi = H + mB - font * 0.4;
        list.forEach(function (l, i) { l.ty = Math.max(l.c[1], i ? list[i - 1].ty + gap : lo); });
        var over = list.length ? list[list.length - 1].ty - hi : 0;
        if (over > 0) {
          list[list.length - 1].ty -= over;
          for (var i = list.length - 2; i >= 0; i--) list[i].ty = Math.min(list[i].ty, list[i + 1].ty - gap);
        }
      }
      function spreadX(list) {
        list.sort(function (a, b) { return a.c[0] - b.c[0]; });
        list.forEach(function (l, i) {
          l.tx = i ? Math.max(l.c[0], list[i - 1].tx + (list[i - 1].w + l.w) / 2 + font) : Math.max(l.c[0], -mL + l.w / 2);
        });
        var over = list.length ? list[list.length - 1].tx + list[list.length - 1].w / 2 - (W + mR) : 0;
        if (over > 0) list.forEach(function (l) { l.tx -= over; });
      }
      var bySide = { left: [], right: [], top: [], bottom: [] };
      labels.forEach(function (l) { bySide[l.side].push(l); });
      spreadY(bySide.left); spreadY(bySide.right); spreadX(bySide.top); spreadX(bySide.bottom);

      labels.forEach(function (l) {
        var tx, ty, anchor, lx, ly;
        if (l.side === "left") { tx = -pad; ty = l.ty; anchor = "end"; lx = -pad * 0.6; ly = ty - font * 0.35; }
        else if (l.side === "right") { tx = W + pad; ty = l.ty; anchor = "start"; lx = W + pad * 0.6; ly = ty - font * 0.35; }
        else if (l.side === "top") { tx = l.tx; ty = -mT + font * 1.1; anchor = "middle"; lx = tx; ly = ty + font * 0.3; }
        else { tx = l.tx; ty = H + mB - font * 0.6; anchor = "middle"; lx = tx; ly = ty - font * 1.0; }
        // Leader line ends at the nearest point of the structure (nudged inside).
        var best = null;
        lay[l.id].forEach(function (p) {
          var n = pointInPoly(lx, ly, p) ? [lx, ly, 0] : nearestOnPoly(lx, ly, p);
          if (!best || n[2] < best[2]) { best = n; best.c = centroid(p); }
        });
        var vx = best.c[0] - best[0], vy = best.c[1] - best[1], vl = Math.hypot(vx, vy) || 1;
        // Go a little way in (about one letter height), so the dot sits clearly inside;
        // fall back to 5 px where that would leave the structure (thin or curved shapes).
        var step = Math.min(font * 0.9, vl * 0.35);
        var ax = best[0] + vx / vl * step, ay = best[1] + vy / vl * step;
        if (!lay[l.id].some(function (p) { return pointInPoly(ax, ay, p); })) {
          ax = best[0] + vx / vl * Math.min(5, vl); ay = best[1] + vy / vl * Math.min(5, vl);
        }
        var sel = l.id === selected ? " is-selected" : "";
        g.appendChild(svgEl("line", { x1: lx, y1: ly, x2: ax, y2: ay, "class": "atlas-leader" + sel }));
        g.appendChild(svgEl("circle", { cx: ax, cy: ay, r: font * 0.18, "class": "atlas-dot" + sel }));
        var t = svgEl("text", { x: tx, y: ty, "text-anchor": anchor, "font-size": font, "class": "atlas-label" + sel, "data-id": l.id });
        t.textContent = byId[l.id].cs;
        g.appendChild(t);
      });
      svg.appendChild(g);
    }

    function renderCard() {
      card.textContent = "";
      var it = selected && byId[selected];
      if (!it && system) {
        // System view: what the system does, and its organs as buttons.
        card.appendChild(el("h2", { "class": "card-title", text: system.cs }));
        card.appendChild(el("p", { "class": "card-p", text: system.text }));
        if (system.note) card.appendChild(el("p", { "class": "card-p system-note", text: system.note }));
        if (state.zvidave && system.zvidave) {
          card.appendChild(el("p", { "class": "card-badge", text: ui.toggleZvidave || "Pro zvídavé" }));
          card.appendChild(el("p", { "class": "card-p", text: system.zvidave }));
        }
        var shown = visibleIds(), also = system.alsoIds || [];
        // Two lists when some muscles carry on from earlier steps (Jak kočka skáče); one list otherwise.
        [[shown.filter(function (id) { return also.indexOf(id) < 0; }), system.chipsHeading || ui.systemOrgans || "Patří sem:", ""],
         [shown.filter(function (id) { return also.indexOf(id) >= 0; }), system.alsoHeading, " is-also"]].forEach(function (grp) {
          if (!grp[0].length) return;
          card.appendChild(el("h3", { "class": "card-h", text: grp[1] }));
          var ol = el("ul", { "class": "system-organs" });
          grp[0].forEach(function (id) {
            var b = el("button", { type: "button", "class": "organ-chip" + grp[2], text: byId[id].cs });
            b.addEventListener("click", function () { select(id, true); });
            ol.appendChild(el("li", null, [b]));
          });
          card.appendChild(ol);
        });
        // Close-up screens of this system's organs (Vnitřní orgány).
        var sysParts = ((D.organy && D.organy.parts) || []).filter(function (p) { return byId[p.id] && byId[p.id].soustava === system.id; });
        if (sysParts.length) {
          card.appendChild(el("h3", { "class": "card-h", text: ui.closeupsHeading || "Orgány zblízka" }));
          card.appendChild(el("p", { "class": "card-link" }, sysParts.map(function (p) {
            return el("a", { "class": "part-link", href: "#/organy/" + p.id, text: p.cs + " →" });
          })));
        }
        if (system.links && system.links.length) {
          card.appendChild(el("p", { "class": "card-link" }, system.links.map(function (l) {
            return el("a", { "class": "part-link", href: l.href, text: l.cs });
          })));
        }
        if (!only.length && system.links) return;   // a step with no muscles (Přikrčení)
        var lay1 = fig.layers[state.layer] || {};
        var onFig = only.filter(function (id) { return lay1[id] && byId[id]; });
        if (!onFig.length) {
          card.appendChild(el("p", { "class": "card-empty", text: ui.systemNotOnFigure || "Tyto orgány na obrázku nejsou." }));
          return;
        }
        if (onFig.length > shown.length) card.appendChild(el("p", { "class": "card-empty", text: ui.systemMoreZvidave || "V režimu „Pro zvídavé“ uvidíš i další orgány." }));
        card.appendChild(el("p", { "class": "card-empty", text: content === "svaly" ? (ui.cardEmptySvaly || "Klepni na sval na obrázku.") : (ui.cardEmptyOrgany || "Klepni na orgán na obrázku.") }));
        return;
      }
      if (!it) {
        // Nothing to tap until "Pro zvídavé" is on (e.g. the jaw joint on the skull): say so.
        var lay0 = fig.layers[state.layer] || {};
        var onlyExtra = !visibleIds().length && Object.keys(lay0).some(function (id) { return byId[id] && (!part || byId[id].part === part); });
        card.appendChild(el("p", { "class": "card-empty", text: onlyExtra ? (ui.cardOnlyZvidave || "Na tomhle obrázku najdeš jen zajímavosti pro zvídavé. Zapni si režim „Pro zvídavé“.") :
          state.layer === "klouby" ? (ui.cardEmptyKlouby || "Klepni na kloub na obrázku.") :
          state.layer === "telo" ? (ui.cardEmptyTelo || "Klepni na část těla na fotce.") :
          state.layer === "organy" ? (ui.cardEmptyOrgany || "Klepni na orgán na obrázku.") :
          state.layer === "svaly" ? (ui.cardEmptySvaly || "Klepni na sval na obrázku.") :
          state.layer === "smysly" ? (ui.cardEmptySmysly || "Klepni na část obrázku.") : (ui.cardEmptyKosti || "Klepni na kost na obrázku.") }));
        return;
      }
      var head = el("div", { "class": "card-head" }, [
        el("h2", { "class": "card-title", id: "card-title", text: it.cs }),
        el("button", { type: "button", "class": "card-close", "aria-label": ui.close || "Zavřít", text: "×" })
      ]);
      head.querySelector(".card-close").addEventListener("click", function () { var id = selected; select(null); focusHotspot(id); });
      card.appendChild(head);
      if (state.latinsky && it.la) card.appendChild(el("p", { "class": "card-latin", lang: "la", text: it.la }));
      if (it.level === "zvidave") card.appendChild(el("p", { "class": "card-badge", text: ui.toggleZvidave || "Pro zvídavé" }));
      [["kdeJe", ui.kdeJe || "Kde je?"], ["coDela", ui.coDela || "Co dělá?"], ["zajimavost", ui.zajimavost || "Zajímavost"]].forEach(function (f) {
        if (!it[f[0]]) return;
        card.appendChild(el("h3", { "class": "card-h", text: f[1] }));
        card.appendChild(el("p", { "class": "card-p", text: it[f[0]] }));
      });
      // Extra sentence shown only at "Pro zvídavé" (Svaly: e.g. the scientific name of the Achilles tendon).
      if (state.zvidave && it.zvidave && it.level !== "zvidave") {
        card.appendChild(el("p", { "class": "card-badge", text: ui.toggleZvidave || "Pro zvídavé" }));
        card.appendChild(el("p", { "class": "card-p", text: it.zvidave }));
      }
      // Body part -> the Kostra part screen with the bones underneath.
      var links = [];
      if (it.kostra && (D.kostraViews || {})[it.kostra]) {
        links.push(el("a", { "class": "part-link", href: "#/kostra/" + it.kostra, text: ui.seeBones || "Podívej se na kosti →" }));
      }
      // Bone (Kostra) -> the Svaly tab that shows the muscles of its part, when that section is on.
      if (content === "kostra" && it.part && D.svaly && (D.sections || []).some(function (x) { return x.id === "svaly" && x.status === "active"; })) {
        (D.svaly.views || []).some(function (v, vi) {
          if ((v.kostra || []).indexOf(it.part) < 0) return false;
          links.push(el("a", { "class": "part-link", href: "#/svaly/" + (vi + 1), text: ui.seeMuscles || "Podívej se na svaly →" }));
          return true;
        });
      }
      // Body part (Vnější) -> the Smysly tab that shows it inside, or else its Zajímavosti card, when that section is on.
      if (content === "vnejsi" && D.smysly && (D.sections || []).some(function (x) { return x.id === "smysly" && x.status === "active"; })) {
        var sv = -1;
        (D.smysly.views || []).forEach(function (v, i) { if (sv < 0 && (v.vnejsi || []).indexOf(it.id) >= 0) sv = i; });
        if (sv >= 0) links.push(el("a", { "class": "part-link", href: "#/smysly/" + (sv + 1), text: D.smysly.views[sv].see }));
        else {
          var fk = (D.smysly.fakta || []).filter(function (f) { return f.vnejsi === it.id; })[0];
          if (fk) links.push(el("a", { "class": "part-link", href: "#/smysly/zajimavosti/" + fk.id, text: ui.seeFakt || "Přečti si zajímavost →" }));
        }
      }
      // Body part -> the organ screen ("Vnitřní orgány"), when that section is on.
      if (it.organy && (D.sections || []).some(function (x) { return x.id === "organy" && x.status === "active"; })) {
        links.push(el("a", { "class": "part-link", href: "#/organy", text: ui.seeOrgans || "Podívej se dovnitř →" }));
      }
      // Organ -> its close-up screen (Vnitřní orgány), unless we are on it already.
      if (content === "organy") {
        var cps = (D.organy && D.organy.parts) || [];
        for (var ci = 0; ci < cps.length; ci++) {
          var figs = cps[ci].figures.map(function (f) { return f.figure; });
          if (figs.indexOf(figId) >= 0) continue;
          var at = -1;
          figs.forEach(function (f, fi) {
            var h = (D.hotspots || {})[f];
            if (at < 0 && h && h.layers && Object.keys(h.layers).some(function (l) { return h.layers[l][it.id]; })) at = fi;
          });
          if (at >= 0) {
            links.push(el("a", { "class": "part-link", href: "#/organy/" + cps[ci].id + "/" + (at + 1), text: ui.seeCloseup || "Podívej se zblízka →" }));
            break;
          }
        }
      }
      // Organ -> its body system (Tělesné soustavy), unless we are on it already.
      var sys = it.soustava && ((D.organy && D.organy.soustavy) || []).filter(function (x) { return x.id === it.soustava; })[0];
      if (sys && !(system && system.id === sys.id) && (D.sections || []).some(function (x) { return x.id === "soustavy" && x.status === "active"; })) {
        links.push(el("a", { "class": "part-link", href: "#/soustavy/" + sys.id, text: sys.cs + " →" }));
      }
      if (links.length) card.appendChild(el("p", { "class": "card-link" }, links));
      // Pro zvídavé: other structures of the same part that have no hotspot here.
      if (state.zvidave && it.part) {
        var lay = fig.layers[state.layer] || {};
        var extra = items.filter(function (x) { return x.part === it.part && x.level === "zvidave" && !lay[x.id] && x.id !== it.id; });
        if (extra.length) {
          var partName = (parts.filter(function (p) { return p.id === it.part; })[0] || {}).cs || "";
          card.appendChild(el("h3", { "class": "card-h card-extra-h", text: content === "organy" ? (ui.moreInCloseup || "Na dalším obrázku najdeš ještě:") : (ui.moreInPart || "Další v části") + " " + partName }));
          extra.forEach(function (x) {
            var body = el("div", { "class": "extra-body" });
            if (state.latinsky && x.la) body.appendChild(el("p", { "class": "card-latin", lang: "la", text: x.la }));
            [["kdeJe", ui.kdeJe || "Kde je?"], ["coDela", ui.coDela || "Co dělá?"], ["zajimavost", ui.zajimavost || "Zajímavost"]].forEach(function (f) {
              if (x[f[0]]) body.appendChild(el("p", { "class": "card-p" }, [el("strong", { text: f[1] + " " }), document.createTextNode(x[f[0]])]));
            });
            card.appendChild(el("details", { "class": "extra" }, [el("summary", { text: x.cs }), body]));
          });
        }
      }
    }

    function focusHotspot(id) { if (id && polyNodes[id]) polyNodes[id].focus(); }

    function select(id, fromKeyboard, silent) {
      selected = id;
      renderFigure();
      renderCard();
      if (fromKeyboard) focusHotspot(id);
      if (opts && opts.onSelect && !silent) opts.onSelect(id);
      if (opts && opts.card === false) return;
      // On stacked layouts, bring the card into view after a tap.
      if (id && window.matchMedia("(max-width: 899px), (orientation: portrait)").matches) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }

    function renderAll() { renderToolbar(); renderFigure(); renderCard(); }

    // ----- input -----
    svg.addEventListener("click", function (e) {
      var hit = e.target.closest && e.target.closest(".hotspot");
      if (hit) { select(hit.getAttribute("data-id")); return; }
      var lab = e.target.closest && e.target.closest(".atlas-label");
      if (lab) { select(lab.getAttribute("data-id")); return; }
      // Missed: pick the nearest visible hotspot within the tolerance.
      var id = hitTest(svg, fig.layers[state.layer] || {}, visibleIds(), e.clientX, e.clientY);
      if (id) select(id);
    });
    document.addEventListener("keydown", function onKey(e) {
      if (!document.body.contains(container)) { document.removeEventListener("keydown", onKey); return; }
      if (e.key === "Escape" && selected) { var id = selected; select(null); focusHotspot(id); }
    });
    var lastW = 0;
    window.addEventListener("resize", function onResize() {
      if (!document.body.contains(container)) { window.removeEventListener("resize", onResize); return; }
      if (Math.abs(figBox.clientWidth - lastW) > 4) { lastW = figBox.clientWidth; renderFigure(); }
    });

    renderAll();
    lastW = figBox.clientWidth;
    // Re-measure labels once web fonts are ready (text width may change).
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (state.popisky) renderFigure(); });

    // Expose a tiny hook for automated tests.
    function refresh(layer) {
      var t = loadToggles();
      Object.keys(t).forEach(function (k) { if (k !== "layer") state[k] = t[k]; });
      if (layer && fig.layers[layer]) state.layer = layer;
      if (selected && !(fig.layers[state.layer] || {})[selected]) selected = null;
      renderAll();
    }
    container._atlas = { select: select, refresh: refresh, visible: visibleIds, state: state, get selected() { return selected; } };
  }

  /*
   * Shared hit test: which visible structure does a click at (clientX, clientY) mean?
   * Inside a polygon wins; otherwise the nearest polygon within TAP_TOLERANCE_PX.
   */
  function bigArea(polys) { return (polys || []).reduce(function (m, p) { return Math.max(m, area(p)); }, 0); }

  function hitTest(svg, layer, ids, clientX, clientY) {
    var ctm = svg.getScreenCTM(); if (!ctm) return null;
    var pt = svg.createSVGPoint(); pt.x = clientX; pt.y = clientY;
    var p = pt.matrixTransform(ctm.inverse());
    var tol = TAP_TOLERANCE_PX / ctm.a, best = null;
    ids.forEach(function (id) {
      (layer[id] || []).forEach(function (poly) {
        var d = pointInPoly(p.x, p.y, poly) ? 0 : nearestOnPoly(p.x, p.y, poly)[2];
        if (d > tol) return;
        // Inside two polygons (a smaller structure drawn inside a larger one, see
        // fig.nested): the smaller one wins.
        var a = d === 0 ? area(poly) : Infinity;
        if (!best || d < best.d || (d === 0 && best.d === 0 && a < best.a)) best = { id: id, d: d, a: a };
      });
    });
    return best && best.id;
  }

  window.Atlas = {
    mount: mount,
    hitTest: hitTest,
    geom: { pointInPoly: pointInPoly, nearestOnPoly: nearestOnPoly, centroid: centroid, area: area }
  };
})();
