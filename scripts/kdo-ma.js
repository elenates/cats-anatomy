/*
 * Quiz "Má to kočka, člověk, nebo oba?" (Kočka a člověk, #72 stage 5).
 *
 * A question ("Kdo má ocas?") and four buttons: Kočka, Člověk, Oba and one made-up funny answer.
 *   - One attempt per question with a real answer; the right button turns green, the explanation follows.
 *   - A funny answer gets a funny reply and is set aside; it is never a mistake.
 *   - Nápověda opens the question's Kočka a člověk card (scripts/infocard.js); a right answer after it does not count.
 *   - After the answer "Přečti si kartičku" opens that card.
 * Content: data/clovek-hry.js (ATLAS_DATA.kdoMa), cards from data/clovek.js.
 *
 * Public API: window.KdoMa.mount(container)
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
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function fmt(s, vars) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; }); }

  function mount(container) {
    var cfg = D.kdoMa || {};
    var t = cfg.ui || {};
    var names = cfg.answers || { kocka: "Kočka", clovek: "Člověk", oba: "Oba" };
    var pool = (cfg.items || []).slice();
    var total = Math.min(cfg.questions || 10, pool.length);
    var q = { list: [], i: 0, score: 0, missed: [], answered: false, hinted: false };
    var funnyLeft = [];

    container.textContent = "";
    var progress = el("p", { "class": "quiz-progress" });
    var prompt = el("h2", { "class": "quiz-prompt", tabindex: "-1", "aria-live": "polite" });
    var answers = el("ul", { "class": "spoj-col sk-answers kdo-answers", "aria-label": t.answersLabel || "Odpovědi" });
    var feedback = el("p", { "class": "spoj-feedback", "aria-live": "polite" });
    var explain = el("p", { "class": "card-p quiz-explain" });
    var more = el("p", { "class": "card-link quiz-more" });
    var next = el("button", { type: "button", "class": "quiz-next", hidden: "" });
    var box = el("section", { "class": "atlas-card kdo-card" }, [answers, feedback, explain, more, next]);
    var summary = el("section", { "class": "atlas-card quiz-summary", hidden: "" });
    container.appendChild(el("div", { "class": "quiz-head" }, [progress, prompt]));
    container.appendChild(box);
    container.appendChild(summary);
    if (!total) { prompt.textContent = ui.quizNoData || "Kvíz zatím nemá otázky."; box.hidden = true; return; }

    next.addEventListener("click", function () {
      if (q.i + 1 < q.list.length) { q.i++; ask(); } else finish();
      prompt.focus();
    });

    function start() {
      q.list = shuffle(pool.slice()).slice(0, total);
      q.i = 0; q.score = 0; q.missed = [];
      funnyLeft = shuffle((cfg.funny || []).slice());
      box.hidden = false; summary.hidden = true;
      ask();
    }

    function ask() {
      var it = q.list[q.i];
      q.answered = false; q.hinted = false;
      progress.textContent = fmt(t.progress || "Otázka {n} z {total}", { n: q.i + 1, total: q.list.length });
      prompt.textContent = it.q;
      if (!funnyLeft.length) funnyLeft = shuffle((cfg.funny || []).slice());
      var opts = ["kocka", "clovek", "oba"].map(function (k) { return { id: k, text: names[k] }; });
      if (funnyLeft.length) opts.splice(Math.floor(Math.random() * 4), 0, { id: null, text: funnyLeft.pop() });
      answers.textContent = "";
      opts.forEach(function (o) {
        var b = el("button", { type: "button", "class": "spoj-btn sk-option", text: o.text });
        if (o.id) b.setAttribute("data-id", o.id); else b.setAttribute("data-funny", "1");
        b.addEventListener("click", function () { choose(o, b); });
        answers.appendChild(el("li", null, [b]));
      });
      feedback.textContent = ""; feedback.className = "spoj-feedback";
      explain.textContent = ""; explain.hidden = true;
      more.textContent = "";
      if (it.card && window.InfoCard) more.appendChild(window.InfoCard.hintButton("clovek", it.card, { onOpen: function () { q.hinted = true; } }));
      next.hidden = true;
    }

    function say(text, kind) { feedback.textContent = text; feedback.className = "spoj-feedback" + (kind ? " is-" + kind : ""); }

    function choose(o, b) {
      if (q.answered || b.disabled) return;
      if (!o.id) { b.disabled = true; b.classList.add("is-funny"); say(pick(t.funnyReplies || ["Ha!"]), "funny"); return; }
      q.answered = true;
      var it = q.list[q.i];
      Array.prototype.forEach.call(answers.querySelectorAll("button"), function (x) {
        x.disabled = true;
        if (x.getAttribute("data-id") === it.a) x.classList.add("is-right");
      });
      if (o.id === it.a) {
        if (q.hinted) q.missed.push(it); else q.score++;
        say((t.right || "Správně!") + (q.hinted ? " " + (ui.hintNoScore || "") : ""), "right");
      } else {
        q.missed.push(it);
        b.classList.add("is-wrong", "is-chosen-wrong");
        say((t.wrong || "Tohle není ono.") + " " + fmt(t.rightIs || "Správná odpověď: {answer}.", { answer: names[it.a] }), "wrong");
      }
      explain.textContent = it.text; explain.hidden = false;
      more.textContent = "";
      if (it.card && window.InfoCard) more.appendChild(window.InfoCard.moreButton("clovek", it.card));
      next.textContent = q.i + 1 < q.list.length ? (t.next || "Další otázka") : (t.finish || "Výsledek");
      next.hidden = false;
      next.focus({ preventScroll: true });
    }

    function finish() {
      box.hidden = true;
      progress.textContent = ui.quizDone || "Hotovo!";
      prompt.textContent = fmt(t.score || "Správně: {score} z {total}", { score: q.score, total: q.list.length });
      summary.textContent = "";
      var ratio = q.score / q.list.length;
      summary.appendChild(el("p", { "class": "quiz-verdict", text: ratio >= 0.9 ? (t.great || "") : ratio >= 0.6 ? (ui.quizGood || "Moc dobře!") : (ui.quizTryAgain || "") }));
      if (q.missed.length) {
        summary.appendChild(el("h3", { "class": "card-h", text: t.review || ui.quizReview || "" }));
        var ul = el("ul", { "class": "quiz-missed" });
        q.missed.forEach(function (it) { ul.appendChild(el("li", null, [el("strong", { text: it.q + " " }), document.createTextNode(it.text)])); });
        summary.appendChild(ul);
      }
      var again = el("button", { type: "button", "class": "quiz-next", text: t.again || "Hrát znovu" });
      again.addEventListener("click", function () { start(); prompt.focus(); });
      summary.appendChild(el("div", { "class": "quiz-actions" }, [again,
        el("a", { "class": "quiz-next quiz-secondary", href: (D.returnTo || {}).href || t.backHref || "#/clovek", text: (D.returnTo || {}).text || t.back || "Zpět" })]));
      summary.hidden = false;
      again.focus({ preventScroll: true });
    }

    start();
    container._kdo = { state: q };
  }

  window.KdoMa = { mount: mount };
})();
