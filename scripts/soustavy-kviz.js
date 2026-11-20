/*
 * Quiz "Do které soustavy patří…?": an organ is outlined on the organ drawing
 * and the child picks its body system from four buttons: the right one, two
 * other real systems and one made-up funny system.
 *
 * - One attempt per question with a real system.
 * - A funny system gets a funny reply and is set aside; it is not a mistake.
 * Content: data/organy.js (organs, systems), data/soustavy-kviz.js (rules, texts).
 *
 * Cards (scripts/infocard.js): "Nápověda" while asking, "Přečti si kartičku" after the answer.
 *
 * Public API: window.SoustavyKviz.mount(container, { backHref: "#/organy" })
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
  function fmt(s, vars) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; }); }
  // "Tenké střevo" -> "tenké střevo" inside the question.
  function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  function mount(container, opts) {
    opts = opts || {};
    var cfg = D.soustavyKviz || {};
    var t = cfg.ui || {};
    var fig = (D.hotspots || {})["organs-side"];
    var layer = (fig && fig.layers.organy) || {};
    var systems = (D.organy && D.organy.soustavy) || [];
    var sysById = {};
    systems.forEach(function (x) { sysById[x.id] = x; });
    var pool = ((D.organy && D.organy.items) || []).filter(function (it) {
      return it.level === "zaklad" && sysById[it.soustava] && layer[it.id];
    });
    var total = Math.min(cfg.questions || 8, pool.length);
    var q = { list: [], i: 0, score: 0, missed: [], answered: false };
    var funnyLeft = [];

    container.textContent = "";
    var progress = el("p", { "class": "quiz-progress" });
    var prompt = el("h2", { "class": "quiz-prompt", tabindex: "-1", "aria-live": "polite" });
    var svg = svgEl("svg", { "class": "atlas-svg", role: "img", "aria-label": t.figureLabel || "" });
    var figBox = el("div", { "class": "atlas-figure is-system sk-figure" }, [svg]);
    var answers = el("ul", { "class": "spoj-col sk-answers", "aria-label": t.answersLabel || "Soustavy" });
    var feedback = el("p", { "class": "spoj-feedback", "aria-live": "polite" });
    var next = el("button", { type: "button", "class": "quiz-next", hidden: "" });
    var more = el("p", { "class": "card-link quiz-more" });   // "Nápověda" while asking, "Přečti si kartičku" after
    var side = el("section", { "class": "atlas-card sk-card" }, [answers, feedback, more, next]);
    var layout = el("div", { "class": "atlas-layout" }, [el("div", { "class": "atlas-figure-col" }, [figBox]), side]);
    var summary = el("section", { "class": "atlas-card quiz-summary", hidden: "" });
    container.appendChild(el("div", { "class": "quiz-head" }, [progress, prompt]));
    container.appendChild(layout);
    container.appendChild(summary);

    if (!fig || !total) { prompt.textContent = ui.quizNoData || "Kvíz zatím nemá otázky."; layout.hidden = true; return; }

    next.addEventListener("click", function () {
      if (q.i + 1 < q.list.length) { q.i++; ask(); } else finish();
      prompt.focus();
    });

    function drawFigure(id) {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var W = fig.width, H = fig.height;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      var img = svgEl("image", { href: fig.image, x: 0, y: 0, width: W, height: H });
      img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", fig.image);
      svg.appendChild(img);
      // Everything except the asked organ is faded (same look as Tělesné soustavy).
      var d = "M0 0H" + W + "V" + H + "H0Z";
      layer[id].forEach(function (p) { d += "M" + p.map(function (c) { return c.join(" "); }).join("L") + "Z"; });
      svg.appendChild(svgEl("path", { "class": "system-fade", d: d, "fill-rule": "evenodd" }));
      var g = svgEl("g", { "class": "hotspot sk-spot" });
      layer[id].forEach(function (p) {
        g.appendChild(svgEl("polygon", { points: p.map(function (c) { return c.join(","); }).join(" ") }));
      });
      svg.appendChild(g);
    }

    function start() {
      q.list = shuffle(pool.slice()).slice(0, total);
      q.i = 0; q.score = 0; q.missed = [];
      funnyLeft = shuffle((cfg.funny || []).slice());
      layout.hidden = false; summary.hidden = true;
      ask();
    }

    function ask() {
      q.answered = false;
      var it = q.list[q.i];
      progress.textContent = fmt(t.progress || "Otázka {n} z {total}", { n: q.i + 1, total: q.list.length });
      prompt.textContent = fmt(t.question || "Do které soustavy patří {organ}?", { organ: lower(it.cs) });
      drawFigure(it.id);
      var others = shuffle(systems.filter(function (x) { return x.id !== it.soustava; })).slice(0, (cfg.realOptions || 3) - 1);
      var opts2 = [sysById[it.soustava]].concat(others).map(function (x) { return { id: x.id, text: x.cs }; });
      for (var k = 0; k < (cfg.funnyOptions || 1); k++) {
        if (!funnyLeft.length) funnyLeft = shuffle((cfg.funny || []).slice());
        opts2.push({ id: null, text: funnyLeft.pop() });
      }
      answers.textContent = "";
      shuffle(opts2).forEach(function (o) {
        var b = el("button", { type: "button", "class": "spoj-btn sk-option", text: o.text });
        if (o.id) b.setAttribute("data-id", o.id); else b.setAttribute("data-funny", "1");
        b.addEventListener("click", function () { choose(o, b); });
        answers.appendChild(el("li", null, [b]));
      });
      feedback.textContent = ""; feedback.className = "spoj-feedback";
      more.textContent = "";
      if (window.InfoCard) more.appendChild(window.InfoCard.hintButton("organy", it.id));
      next.hidden = true;
    }

    function say(text, kind) {
      feedback.textContent = text;
      feedback.className = "spoj-feedback" + (kind ? " is-" + kind : "");
    }

    function choose(o, b) {
      if (q.answered || b.disabled) return;
      if (!o.id) {   // funny system: never right, never a penalty
        b.disabled = true; b.classList.add("is-funny");
        say(pick(t.funnyReplies || ["Ha!"]), "funny");
        return;
      }
      q.answered = true;
      var it = q.list[q.i], right = sysById[it.soustava];
      Array.prototype.forEach.call(answers.querySelectorAll("button"), function (x) {
        x.disabled = true;
        if (x.getAttribute("data-id") === right.id) x.classList.add("is-right");
      });
      if (o.id === right.id) {
        q.score++;
        say(t.right || "Správně!", "right");
      } else {
        q.missed.push(it);
        b.classList.add("is-wrong", "is-chosen-wrong");
        say((t.wrong || "Tohle není ono.") + " " + fmt(t.rightIs || "Správná odpověď: {system}.", { system: right.cs }), "wrong");
      }
      more.textContent = "";
      if (window.InfoCard) more.appendChild(window.InfoCard.moreButton("organy", it.id));
      next.textContent = q.i + 1 < q.list.length ? (t.next || "Další otázka") : (t.finish || "Výsledek");
      next.hidden = false;
      next.focus({ preventScroll: true });
    }

    function finish() {
      layout.hidden = true;
      progress.textContent = ui.quizDone || "Hotovo!";
      prompt.textContent = fmt(t.score || "Správně: {score} z {total}", { score: q.score, total: q.list.length });
      summary.textContent = "";
      var ratio = q.score / q.list.length;
      summary.appendChild(el("p", { "class": "quiz-verdict", text: ratio >= 0.9 ? (t.great || "") : ratio >= 0.6 ? (ui.quizGood || "Moc dobře!") : (ui.quizTryAgain || "") }));
      if (q.missed.length) {
        summary.appendChild(el("h3", { "class": "card-h", text: t.review || ui.quizReview || "" }));
        var ul = el("ul", { "class": "quiz-missed" });
        q.missed.forEach(function (it) {
          ul.appendChild(el("li", null, [el("strong", { text: it.cs + " – " }), document.createTextNode(sysById[it.soustava].cs)]));
        });
        summary.appendChild(ul);
      }
      var again = el("button", { type: "button", "class": "quiz-next", text: t.again || "Hrát znovu" });
      again.addEventListener("click", function () { start(); prompt.focus(); });
      summary.appendChild(el("div", { "class": "quiz-actions" }, [again,
        el("a", { "class": "quiz-next quiz-secondary", href: (D.returnTo || {}).href || opts.backHref || "#/organy", text: (D.returnTo || {}).text || opts.back || t.back || "Zpět" })]));
      summary.hidden = false;
      again.focus({ preventScroll: true });
    }

    start();
    container._sk = { state: q, pool: pool };
  }

  window.SoustavyKviz = { mount: mount };
})();
