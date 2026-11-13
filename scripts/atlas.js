/*
 * Atlas screen: a figure with SVG hotspots, an info card and toggles.
 *
 * Data (plain globals, loaded before this file):
 *   ATLAS_DATA.kostra    content items (data/kostra.js)
 *   ATLAS_DATA.hotspots  polygons per figure and layer (data/hotspots-kostra.js)
 *   ATLAS_DATA.ui        Czech UI strings (data/sections.js)
 *
 * Public API:  window.Atlas.mount(container, { figure: "skeleton" })
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
    var items = (D.kostra && D.kostra.items) || [];
    var parts = (D.kostra && D.kostra.parts) || [];
    var byId = {};
    items.forEach(function (it) { byId[it.id] = it; });

    if (!fig) {
      container.appendChild(el("p", { "class": "placeholder", text: "Chybí data obrázku." }));
      return;
    }

    var state = loadToggles();
    if (!fig.layers[state.layer]) state.layer = Object.keys(fig.layers)[0];
    var selected = null;

    // ----- toolbar -----
    var layerNames = { kosti: ui.layerKosti || "Kosti", klouby: ui.layerKlouby || "Klouby" };
    var layerGroup = el("div", { "class": "seg", role: "group", "aria-label": ui.layerLabel || "Zobrazit" });
    Object.keys(fig.layers).forEach(function (ln) {
      var b = el("button", { type: "button", "class": "seg-btn", "data-layer": ln, text: layerNames[ln] || ln });
      b.addEventListener("click", function () { state.layer = ln; selected = null; saveToggles(state); renderAll(); });
      layerGroup.appendChild(b);
    });
    function toggle(key, label) {
      var b = el("button", { type: "button", "class": "toggle", "data-toggle": key, text: label });
      b.addEventListener("click", function () { state[key] = !state[key]; saveToggles(state); renderAll(); });
      return b;
    }
    var toolbar = el("div", { "class": "atlas-toolbar" }, [
      layerGroup,
      el("div", { "class": "toggles", role: "group", "aria-label": ui.togglesLabel || "Zobrazení" }, [
        toggle("popisky", ui.togglePopisky || "Popisky"),
        toggle("latinsky", ui.toggleLatinsky || "Latinsky"),
        toggle("zvidave", ui.toggleZvidave || "Pro zvídavé")
      ])
    ]);

    // ----- figure -----
    var svg = svgEl("svg", { "class": "atlas-svg", role: "group", "aria-label": ui.figureLabel || "Obrázek kostry" });
    var figBox = el("div", { "class": "atlas-figure" }, [svg]);
    var credit = el("p", { "class": "atlas-credit", text: ui.figureCredit || "" });

    // ----- card -----
    var card = el("section", { "class": "atlas-card", "aria-live": "polite" });

    var layout = el("div", { "class": "atlas-layout" }, [
      el("div", { "class": "atlas-figure-col" }, [figBox, credit]),
      card
    ]);
    container.appendChild(toolbar);
    container.appendChild(layout);

    // ----- rendering -----
    function visibleIds() {
      var lay = fig.layers[state.layer] || {};
      return items.map(function (it) { return it.id; }).filter(function (id) {
        return lay[id] && (byId[id].level === "zaklad" || state.zvidave);
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
        ids.forEach(function (id) {
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
      svg.appendChild(svgEl("image", { href: fig.image, x: 0, y: 0, width: W, height: H, "class": "atlas-img" }));
      // Older Safari needs xlink:href for <image>.
      svg.lastChild.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", fig.image);

      var gHot = svgEl("g", { "class": "hotspots" });
      ids.forEach(function (id) {
        var it = byId[id];
        var g = svgEl("g", {
          "class": "hotspot" + (id === selected ? " is-selected" : ""),
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
        var ax = best[0] + vx / vl * Math.min(5, vl), ay = best[1] + vy / vl * Math.min(5, vl);
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
      if (!it) {
        card.appendChild(el("p", { "class": "card-empty", text: state.layer === "klouby" ? (ui.cardEmptyKlouby || "Klepni na kloub na obrázku.") : (ui.cardEmptyKosti || "Klepni na kost na obrázku.") }));
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
      // Pro zvídavé: other structures of the same part that have no hotspot here.
      if (state.zvidave) {
        var lay = fig.layers[state.layer] || {};
        var extra = items.filter(function (x) { return x.part === it.part && x.level === "zvidave" && !lay[x.id] && x.id !== it.id; });
        if (extra.length) {
          var partName = (parts.filter(function (p) { return p.id === it.part; })[0] || {}).cs || "";
          card.appendChild(el("h3", { "class": "card-h card-extra-h", text: (ui.moreInPart || "Další v části") + " " + partName }));
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

    function select(id, fromKeyboard) {
      selected = id;
      renderFigure();
      renderCard();
      if (fromKeyboard) focusHotspot(id);
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
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var ctm = svg.getScreenCTM(); if (!ctm) return;
      var p = pt.matrixTransform(ctm.inverse());
      var tol = TAP_TOLERANCE_PX / ctm.a;          // screen px -> figure px
      var lay = fig.layers[state.layer] || {}, best = null;
      visibleIds().forEach(function (id) {
        lay[id].forEach(function (poly) {
          var d = nearestOnPoly(p.x, p.y, poly)[2];
          if (d <= tol && (!best || d < best.d)) best = { id: id, d: d };
        });
      });
      if (best) select(best.id);
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
    container._atlas = { select: select, state: state, get selected() { return selected; } };
  }

  window.Atlas = { mount: mount };
})();
