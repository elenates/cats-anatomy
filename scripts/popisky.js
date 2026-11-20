/*
 * Doplň popisky: Základ structures of one picture get an empty circle each; the child puts the
 * matching Czech label on it, by dragging the label onto the circle or by tapping the label and then
 * the circle (also with the keyboard: Enter on a label, then Enter on a circle).
 *   - right: the circle turns green and gets the label's number; the label is numbered too;
 *   - wrong: the circle flashes red; that label no longer counts as "first try".
 * A circle sits on a point inside the structure that is not inside a smaller structure drawn over it
 * (fig.nested), and circles of one round keep apart from each other.
 *
 * Cards (scripts/infocard.js): a 💡 next to each label opens its card as a hint; after placing a label (right
 * or wrong) "Přečti si kartičku" opens it.
 *
 * Public API: window.Popisky.mount(container, { figure, layer })
 */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var D = window.ATLAS_DATA || {};

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k]; else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function svgEl(tag, attrs) { var n = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); }); return n; }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmt(s, v) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return v[k]; }); }

  function inPoly(x, y, p) {
    var c = false;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      var xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  function distToEdges(x, y, p) {
    var best = Infinity;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      var ax = p[j][0], ay = p[j][1], bx = p[i][0], by = p[i][1], dx = bx - ax, dy = by - ay;
      var t = dx || dy ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))) : 0;
      best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
    }
    return best;
  }
  function area(p) { var a = 0; for (var i = 0, j = p.length - 1; i < p.length; j = i++) a += (p[j][0] + p[i][0]) * (p[j][1] - p[i][1]); return Math.abs(a / 2); }

  /* The point of a structure farthest from its edges (grid search), outside the smaller structures drawn over it. */
  function spotFor(id, layer, nested) {
    var polys = layer[id].slice().sort(function (a, b) { return area(b) - area(a); });
    var p = polys[0], inner = [];
    (nested[id] || []).forEach(function (s) { (layer[s] || []).forEach(function (q) { inner.push(q); }); });
    var xs = p.map(function (c) { return c[0]; }), ys = p.map(function (c) { return c[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var best = null, bd = -1, N = 40;
    for (var i = 0; i <= N; i++) for (var j = 0; j <= N; j++) {
      var x = x0 + (x1 - x0) * i / N, y = y0 + (y1 - y0) * j / N;
      if (!inPoly(x, y, p) || inner.some(function (q) { return inPoly(x, y, q); })) continue;
      var d = Math.min(distToEdges(x, y, p), inner.reduce(function (m, q) { return Math.min(m, distToEdges(x, y, q)); }, Infinity));
      if (d > bd) { bd = d; best = [x, y]; }
    }
    return best;
  }

  function mount(container, opts) {
    var cfg = D.popisky || {}, t = cfg.ui || {};
    var fig = (D.hotspots || {})[opts.figure];
    var content = (fig && fig.content) || "kostra";
    var items = (D[content] && D[content].items) || [];
    var layer = (fig && fig.layers[opts.layer]) || {};
    var nested = (fig && fig.nested) || {};
    var pool = items.filter(function (it) { return it.level === "zaklad" && it.quiz !== false && layer[it.id]; });
    var spots = {};
    pool.forEach(function (it) { spots[it.id] = spotFor(it.id, layer, nested); });
    pool = pool.filter(function (it) { return spots[it.id]; });
    var per = Math.min(cfg.perRound || 5, pool.length);
    var nRounds = Math.max(1, Math.min(cfg.rounds || 2, Math.floor(pool.length / per)));
    var minGap = fig ? Math.max(fig.width, fig.height) * 0.07 : 0;   // circles of one round keep apart

    function makeRounds() {
      var left = shuffle(pool.slice()), out = [];
      for (var r = 0; r < nRounds; r++) {
        var round = [];
        left.forEach(function (it) {
          if (round.length >= per) return;
          var s = spots[it.id];
          if (round.every(function (o) { var q = spots[o.id]; return Math.hypot(q[0] - s[0], q[1] - s[1]) >= minGap; })) round.push(it);
        });
        left = left.filter(function (x) { return round.indexOf(x) < 0; });
        out.push(round);
      }
      return out.filter(function (r) { return r.length; });
    }

    var progress = el("p", { "class": "quiz-progress" });
    var howTo = el("p", { "class": "fig-note", text: t.howTo || "" });
    var svg = svgEl("svg", { "class": "atlas-svg popisky-svg", role: "group", "aria-label": t.title || "Doplň popisky" });
    var credit = el("p", { "class": "atlas-credit" });
    if (fig && fig.credit) (fig.creditParts || [{ text: fig.credit }]).forEach(function (c) {
      credit.appendChild(c.href ? el("a", { href: c.href, target: "_blank", rel: "noopener", text: c.text }) : document.createTextNode(c.text));
    });
    else credit.hidden = true;
    var labels = el("ul", { "class": "popisky-labels", "aria-label": t.labelsHeading || "Popisky" });
    var feedback = el("p", { "class": "spoj-feedback", "aria-live": "polite" });
    var more = el("p", { "class": "card-link quiz-more" });   // "Přečti si kartičku" after placing a label
    var next = el("button", { type: "button", "class": "quiz-next", hidden: "hidden" });
    var side = el("section", { "class": "atlas-card popisky-card" }, [el("h2", { "class": "spoj-h", text: t.labelsHeading || "Popisky" }), labels, feedback, more, next]);
    var game = el("div", { "class": "popisky-game" }, [progress, howTo,
      el("div", { "class": "atlas-layout" }, [el("div", { "class": "atlas-figure-col" }, [el("div", { "class": "atlas-figure" }, [svg]), credit]), side])]);
    var summary = el("section", { "class": "atlas-card quiz-summary", hidden: "hidden" });
    container.appendChild(game); container.appendChild(summary);

    var roundList = [], ri = 0, failed = {}, sel = null, placed = {}, count = 0, circles = {}, chips = {};
    function say(text, kind, cardId) {
      feedback.textContent = text; feedback.className = "spoj-feedback" + (kind ? " is-" + kind : "");
      more.textContent = "";
      if (cardId && window.InfoCard) more.appendChild(window.InfoCard.moreButton(content, cardId));
    }

    function radius() { var w = svg.getBoundingClientRect().width || fig.width; return Math.max(10, 16 * fig.width / w); }
    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute("viewBox", "0 0 " + fig.width + " " + fig.height);
      var img = svgEl("image", { href: fig.image, x: 0, y: 0, width: fig.width, height: fig.height });
      img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", fig.image);
      svg.appendChild(img);
      var r = radius(); circles = {};
      roundList[ri].forEach(function (it, n) {
        var s = spots[it.id], done = placed[it.id];
        var g = svgEl("g", { "class": "popisky-spot" + (done ? " is-right" : ""), tabindex: "0", role: "button", "data-id": it.id,
          "aria-label": done ? fmt(t.spotDone || "{n}: {name}", { n: done, name: it.cs }) : fmt(t.spot || "Kolečko {n}", { n: n + 1 }) });
        g.appendChild(svgEl("circle", { cx: s[0], cy: s[1], r: r }));
        var tx = svgEl("text", { x: s[0], y: s[1], "font-size": r * 1.15, "text-anchor": "middle", "dominant-baseline": "central" });
        tx.textContent = done ? String(done) : "?";
        g.appendChild(tx);
        g.addEventListener("click", function () { drop(it.id); });
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); drop(it.id); } });
        circles[it.id] = g; svg.appendChild(g);
      });
    }

    function startRound() {
      sel = null; placed = {}; count = 0; next.hidden = true; say(t.pickLabel || "");
      progress.textContent = fmt(t.round || "{n}/{total}", { n: ri + 1, total: roundList.length });
      labels.textContent = ""; chips = {};
      shuffle(roundList[ri].slice()).forEach(function (it) {
        var b = el("button", { type: "button", "class": "spoj-btn spoj-name popisky-label", "aria-pressed": "false", "data-id": it.id }, [el("span", { text: it.cs })]);
        b.addEventListener("click", function () { if (b._dragged) { b._dragged = false; return; } choose(it); });
        b.addEventListener("pointerdown", function (e) { dragStart(e, it, b); });
        chips[it.id] = b;
        var hint = window.InfoCard ? window.InfoCard.hintIcon(content, it.id) : null;
        labels.appendChild(el("li", { "class": hint ? "has-hint" : null }, [b, hint]));
      });
      draw();
    }
    function choose(it) {
      if (placed[it.id]) return;
      if (sel) { chips[sel.id].setAttribute("aria-pressed", "false"); chips[sel.id].classList.remove("is-picked"); }
      if (sel && sel.id === it.id) { sel = null; say(t.pickLabel || ""); return; }
      sel = it; chips[it.id].setAttribute("aria-pressed", "true"); chips[it.id].classList.add("is-picked");
      say(fmt(t.pickSpot || "{name}", { name: it.cs }));
    }
    function drop(spotId) {
      if (!sel) { say(t.pickLabel || ""); return; }
      if (placed[spotId]) return;
      var it = sel, b = chips[it.id];
      if (spotId === it.id) {
        count += 1; placed[it.id] = count; sel = null;
        b.setAttribute("aria-pressed", "false"); b.disabled = true; b.classList.remove("is-picked"); b.classList.add("is-right");
        b.insertBefore(el("span", { "class": "spoj-num", "aria-hidden": "true", text: String(count) }), b.firstChild);
        say(fmt(t.right || "{name}", { name: it.cs }), "right", it.id);
        draw();
        if (count === roundList[ri].length) {
          next.textContent = ri < roundList.length - 1 ? (t.nextRound || "Další kolo") : (t.finish || "Výsledek");
          next.hidden = false; next.focus();
        } else if (circles[it.id]) circles[it.id].focus();
      } else {
        failed[it.id] = true;
        var g = circles[spotId]; g.classList.add("is-wrong");
        setTimeout(function () { g.classList.remove("is-wrong"); }, 700);
        say(t.wrong || "", "wrong", it.id);
      }
    }

    // Drag a label onto a circle (mouse, pen or finger). A short press without moving is a tap.
    function dragStart(e, it, b) {
      if (placed[it.id] || e.button > 0) return;
      var sx = e.clientX, sy = e.clientY, ghost = null;
      function move(ev) {
        if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
        if (!ghost) {
          ghost = el("div", { "class": "popisky-ghost", text: it.cs }); document.body.appendChild(ghost);
          if (!sel || sel.id !== it.id) choose(it);
        }
        ev.preventDefault();
        ghost.style.left = ev.clientX + "px"; ghost.style.top = ev.clientY + "px";
      }
      function up(ev) {
        document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up);
        if (!ghost) return;
        ghost.remove(); b._dragged = true;
        var hit = null;
        Object.keys(circles).forEach(function (id) {
          var c = circles[id].getBoundingClientRect(), cx = c.left + c.width / 2, cy = c.top + c.height / 2;
          if (Math.hypot(ev.clientX - cx, ev.clientY - cy) <= Math.max(c.width, 44) / 2 + 8 && !hit) hit = id;
        });
        if (hit) drop(hit);
      }
      document.addEventListener("pointermove", move, { passive: false }); document.addEventListener("pointerup", up);
    }

    next.addEventListener("click", function () { if (ri < roundList.length - 1) { ri += 1; startRound(); } else finish(); });

    function finish() {
      var all = [].concat.apply([], roundList);
      var score = all.filter(function (it) { return !failed[it.id]; }).length;
      summary.textContent = "";
      summary.appendChild(el("h2", { "class": "quiz-prompt", text: fmt(t.score || "{score}/{total}", { score: score, total: all.length }) }));
      var ratio = all.length ? score / all.length : 0;
      var ui = D.ui || {};
      summary.appendChild(el("p", { "class": "quiz-verdict", text: ratio >= 0.9 ? (t.great || "") : ratio >= 0.6 ? (ui.quizGood || "") : (ui.quizTryAgain || "") }));
      var missed = all.filter(function (it) { return failed[it.id]; });
      if (missed.length) {
        summary.appendChild(el("p", { text: ui.quizReview || "Na tyhle se ještě podívej:" }));
        summary.appendChild(el("ul", { "class": "quiz-missed" }, missed.map(function (it) { return el("li", null, [el("strong", { text: it.cs })]); })));
      }
      var again = el("button", { type: "button", "class": "quiz-next", text: t.again || "Hrát znovu" });
      again.addEventListener("click", start);
      summary.appendChild(el("div", { "class": "quiz-actions" }, [again,
        el("a", { "class": "quiz-next quiz-secondary", href: "#/procvicovani/popisky", text: t.otherFigure || "Jiný obrázek" }),
        el("a", { "class": "quiz-next quiz-secondary", href: "#/procvicovani", text: t.back || "Zpět" })]));
      game.hidden = true; summary.hidden = false;
      summary.querySelector("h2").setAttribute("tabindex", "-1"); summary.querySelector("h2").focus();
    }
    function start() { roundList = makeRounds(); ri = 0; failed = {}; game.hidden = false; summary.hidden = true; startRound(); }

    var redraw = function () {
      if (!document.body.contains(container)) { window.removeEventListener("resize", redraw); return; }
      if (!game.hidden && roundList.length) draw();
    };
    window.addEventListener("resize", redraw);
    container._popisky = { state: function () { return { rounds: roundList.map(function (r) { return r.map(function (i) { return i.id; }); }), ri: ri, placed: placed, spots: spots }; } };
    if (!fig || !pool.length) { progress.textContent = (D.ui || {}).quizNoData || ""; return; }
    start();
  }

  window.Popisky = { mount: mount };
})();
