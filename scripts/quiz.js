/*
 * Quiz "Najdi kost nebo orgán": the child is asked to find a structure and taps
 * the figure.
 *
 * Questions: random structures (no repeats) that are
 *   - level "zaklad",
 *   - not marked quiz: false in data/kostra.js,
 *   - drawn on the quiz layer of the figure (bones, not joints).
 * A tap is judged with Atlas.hitTest (inside a polygon, or the nearest one within
 * 22 screen px). fig.alsoCounts lets e.g. a tap on the neck count as "Páteř".
 * One attempt per question; a tap on empty space does not count.
 *
 * Public API: window.Quiz.mount(container, { figure: "skeleton", layer: "kosti", rounds: 10 })
 */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var D = window.ATLAS_DATA || {};
  var ui = D.ui || {};

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
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
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function firstSentence(text) {
    var m = String(text || "").match(/^.*?[.!?](\s|$)/);
    return (m ? m[0] : String(text || "")).trim();
  }
  function fmt(s, vars) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; }); }

  function mount(container, opts) {
    opts = opts || {};
    var fig = (D.hotspots || {})[opts.figure || "skeleton"];
    var layerName = opts.layer || "kosti";
    var layer = (fig && fig.layers[layerName]) || {};
    var items = (D.kostra && D.kostra.items) || [];
    var byId = {};
    items.forEach(function (it) { byId[it.id] = it; });
    var alsoCounts = (fig && fig.alsoCounts) || {};

    // Every structure on the layer can be tapped; only some can be asked.
    var tappable = items.filter(function (it) { return layer[it.id]; }).map(function (it) { return it.id; });
    var pool = items.filter(function (it) {
      return it.level === "zaklad" && it.quiz !== false && layer[it.id];
    }).map(function (it) { return it.id; });
    var rounds = Math.min(opts.rounds || 10, pool.length);

    var q = { list: [], i: 0, score: 0, missed: [], answered: false, tapped: null };

    // ----- static parts -----
    var progress = el("p", { "class": "quiz-progress" });
    var prompt = el("h2", { "class": "quiz-prompt", "aria-live": "polite" });
    var svg = svgEl("svg", { "class": "atlas-svg quiz-svg", role: "group", "aria-label": ui.quizFigureLabel || "Obrázek kostry – klepni na hledanou část" });
    var figBox = el("div", { "class": "atlas-figure" }, [svg]);
    var feedback = el("section", { "class": "atlas-card quiz-feedback", "aria-live": "polite" });
    var layout = el("div", { "class": "atlas-layout" }, [el("div", { "class": "atlas-figure-col" }, [figBox]), feedback]);
    container.appendChild(el("div", { "class": "quiz-head" }, [progress, prompt]));
    container.appendChild(layout);

    if (!fig || !rounds) {
      prompt.textContent = ui.quizNoData || "Kvíz zatím nemá otázky.";
      return;
    }

    // ----- figure -----
    var nodes = {};
    function drawFigure() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      nodes = {};
      svg.setAttribute("viewBox", "0 0 " + fig.width + " " + fig.height);
      var img = svgEl("image", { href: fig.image, x: 0, y: 0, width: fig.width, height: fig.height });
      img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", fig.image);
      svg.appendChild(img);
      var g = svgEl("g", { "class": "hotspots" });
      tappable.forEach(function (id, n) {
        // Neutral labels during the question, so a screen reader does not give the answer away.
        var h = svgEl("g", { "class": "hotspot quiz-spot", tabindex: "0", role: "button", "data-id": id,
          "aria-label": fmt(ui.quizSpot || "Místo {n}", { n: n + 1 }) });
        layer[id].forEach(function (p) {
          h.appendChild(svgEl("polygon", { points: p.map(function (c) { return c.join(","); }).join(" ") }));
        });
        h.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); answer(id); }
        });
        nodes[id] = h;
        g.appendChild(h);
      });
      svg.appendChild(g);
    }

    function mark(id, cls) { if (nodes[id]) nodes[id].classList.add(cls); }
    function clearMarks() {
      Object.keys(nodes).forEach(function (id) { nodes[id].classList.remove("is-right", "is-wrong"); });
    }

    // ----- flow -----
    function start() {
      q.list = shuffle(pool.slice()).slice(0, rounds);
      q.i = 0; q.score = 0; q.missed = [];
      container.classList.remove("quiz-done");
      layout.hidden = false;
      drawFigure();
      ask();
    }

    function ask() {
      q.answered = false; q.tapped = null;
      clearMarks();
      svg.classList.remove("is-answered");
      var target = byId[q.list[q.i]];
      progress.textContent = fmt(ui.quizProgress || "Otázka {n} z {total}", { n: q.i + 1, total: q.list.length });
      prompt.textContent = (ui.quizFind || "Najdi:") + " " + target.cs;
      feedback.textContent = "";
      feedback.appendChild(el("p", { "class": "card-empty", text: ui.quizHint || "Klepni na obrázek." }));
    }

    function isCorrect(targetId, tappedId) {
      return tappedId === targetId || (alsoCounts[targetId] || []).indexOf(tappedId) >= 0;
    }

    function answer(tappedId) {
      if (q.answered) return;
      var targetId = q.list[q.i], target = byId[targetId];
      feedback.textContent = "";
      if (!tappedId) {
        feedback.appendChild(el("p", { "class": "quiz-miss", text: ui.quizMissTap || "Tady nic není. Zkus to znovu." }));
        return;                                           // does not count as an attempt
      }
      q.answered = true; q.tapped = tappedId;
      svg.classList.add("is-answered");
      var ok = isCorrect(targetId, tappedId);
      if (ok) {
        q.score++;
        mark(tappedId, "is-right");
        feedback.appendChild(el("p", { "class": "quiz-verdict is-right", text: pick(ui.quizPraise || ["Správně!"]) }));
        if (tappedId !== targetId) {
          // e.g. tapped the neck for "Páteř": say what it was.
          feedback.appendChild(el("p", { "class": "card-p", text: fmt(ui.quizAlsoRight || "{tapped} patří k části {target}.", { tapped: byId[tappedId].cs, target: target.cs }) }));
        }
      } else {
        q.missed.push(targetId);
        mark(tappedId, "is-wrong");
        mark(targetId, "is-right");
        (alsoCounts[targetId] || []).forEach(function (id) { mark(id, "is-right"); });
        // Wording avoids singular/plural agreement ("Žebra", "Zuby" are plural).
        feedback.appendChild(el("p", { "class": "quiz-verdict is-wrong", text: fmt(ui.quizWrong || "Tvoje odpověď: {tapped}.", { tapped: byId[tappedId].cs }) }));
        feedback.appendChild(el("p", { "class": "card-p", text: ui.quizShowRight || "Správné místo je zvýrazněné zeleně." }));
        feedback.appendChild(el("p", { "class": "card-p quiz-explain" }, [el("strong", { text: target.cs + ": " }), document.createTextNode(firstSentence(target.kdeJe))]));
      }
      var last = q.i === q.list.length - 1;
      var next = el("button", { type: "button", "class": "quiz-next", text: last ? (ui.quizResult || "Výsledek") : (ui.quizNext || "Další otázka") });
      next.addEventListener("click", function () {
        if (last) finish(); else { q.i++; ask(); }
        prompt.focus && prompt.setAttribute("tabindex", "-1");
        prompt.focus();
      });
      feedback.appendChild(next);
      next.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 899px), (orientation: portrait)").matches) {
        feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }

    function finish() {
      container.classList.add("quiz-done");
      layout.hidden = true;
      progress.textContent = ui.quizDone || "Hotovo!";
      prompt.textContent = fmt(ui.quizScore || "Správně: {score} z {total}", { score: q.score, total: q.list.length });
      var box = el("section", { "class": "atlas-card quiz-summary" });
      var ratio = q.score / q.list.length;
      box.appendChild(el("p", { "class": "quiz-verdict", text: ratio >= 0.9 ? (ui.quizGreat || "Jsi expert na kočičí kostru!") : ratio >= 0.6 ? (ui.quizGood || "Moc dobře!") : (ui.quizTryAgain || "Zkus to ještě jednou, půjde to líp!") }));
      if (q.missed.length) {
        box.appendChild(el("h3", { "class": "card-h", text: ui.quizReview || "Na tyhle se ještě podívej:" }));
        var ul = el("ul", { "class": "quiz-missed" });
        q.missed.forEach(function (id) {
          ul.appendChild(el("li", null, [el("strong", { text: byId[id].cs + " – " }), document.createTextNode(firstSentence(byId[id].kdeJe))]));
        });
        box.appendChild(ul);
      }
      var again = el("button", { type: "button", "class": "quiz-next", text: ui.quizAgain || "Hrát znovu" });
      again.addEventListener("click", function () { box.remove(); start(); });
      var back = el("a", { "class": "quiz-next quiz-secondary", href: "#/kostra", text: ui.quizBack || "Zpět na kostru" });
      box.appendChild(el("div", { "class": "quiz-actions" }, [again, back]));
      container.appendChild(box);
      again.focus({ preventScroll: true });
    }

    // ----- input -----
    svg.addEventListener("click", function (e) {
      if (q.answered) return;
      var spot = e.target.closest && e.target.closest(".quiz-spot");
      answer(spot ? spot.getAttribute("data-id") : window.Atlas.hitTest(svg, layer, tappable, e.clientX, e.clientY));
    });

    start();
    container._quiz = { state: q, answer: answer, start: start, pool: pool };
  }

  window.Quiz = { mount: mount };
})();
