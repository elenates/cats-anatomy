/*
 * Quiz "Spoj, co patří k sobě": match a bone or joint with what it does.
 *
 * Each round shows a few Základ structures (left) and their "Co dělá?" texts
 * (right), shuffled together with made-up funny answers that belong to nothing.
 * The child taps a name and an answer, in either order.
 *   - a right pair turns green and gets a number, so the pairs are easy to see;
 *   - a wrong pair flashes red; that structure no longer counts as "first try";
 *   - a funny answer gets a funny reply and is set aside (greyed out, no label).
 * Score: structures matched on the first try.
 * Content: data/kostra.js (names, texts) and data/spoj.js (rules, funny answers).
 *
 * opts.content (default "kostra") and opts.config (default ATLAS_DATA.spoj) give the same game
 * for another section (Svaly: content "svaly", config ATLAS_DATA.spojSvaly).
 *
 * Cards (scripts/infocard.js): a 💡 next to each name opens its whole card as a hint (that name then no longer
 * counts as "first try"); after a pair (right or wrong) "Přečti si kartičku" opens the name's card.
 *
 * Public API: window.Spoj.mount(container, { content, config })
 */
(function () {
  "use strict";

  var D = window.ATLAS_DATA || {};
  var ui = D.ui || {};

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k]; else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
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

  /* Rounds of structures with no two from the same conflicts group in a round,
     and no structure twice in a game. */
  function makeRounds(pool, cfg) {
    var groups = cfg.conflicts || [];
    function clash(a, b) { return groups.some(function (g) { return g.indexOf(a) >= 0 && g.indexOf(b) >= 0; }); }
    for (var attempt = 0; attempt < 50; attempt++) {
      var left = shuffle(pool.slice()), rounds = [], ok = true;
      for (var r = 0; r < cfg.rounds && ok; r++) {
        var round = [];
        for (var i = 0; i < left.length && round.length < cfg.pairs; i++) {
          var id = left[i].id;
          if (round.every(function (x) { return !clash(x.id, id); })) round.push(left[i]);
        }
        if (round.length < cfg.pairs) ok = false;
        left = left.filter(function (x) { return round.indexOf(x) < 0; });
        rounds.push(round);
      }
      if (ok) return rounds;
    }
    return rounds;   // best effort (only with very small pools)
  }

  function mount(container, opts) {
    opts = opts || {};
    var cfg = opts.config || D.spoj || {};
    var t = cfg.ui || {};
    var content = opts.content || "kostra";
    var items = (D[content] && D[content].items) || [];
    var pool = items.filter(function (it) { return it.level === "zaklad" && it.quiz !== false && it.coDela; });
    var rounds = 0, roundList = [], r = 0, failed = {}, funnyLeft = [];
    var sel = { name: null, answer: null }, matched = {}, pairNo = 0, hinted = {};

    container.textContent = "";
    var progress = el("p", { "class": "quiz-progress" });
    var howTo = el("p", { "class": "spoj-howto", text: t.howTo || "" });
    var names = el("ul", { "class": "spoj-col spoj-names", "aria-label": t.namesLabel || "Kosti a klouby" });
    var answers = el("ul", { "class": "spoj-col spoj-answers", "aria-label": t.answersLabel || "Co dělá?" });
    var board = el("div", { "class": "spoj-board" }, [
      el("div", null, [el("h2", { "class": "spoj-h", text: t.namesLabel || "Kosti a klouby" }), names]),
      el("div", null, [el("h2", { "class": "spoj-h", text: t.answersLabel || "Co dělá?" }), answers])
    ]);
    var feedback = el("p", { "class": "spoj-feedback", "aria-live": "polite" });
    var more = el("p", { "class": "card-link quiz-more" });   // "Přečti si kartičku" after a pair
    var next = el("button", { type: "button", "class": "quiz-next", hidden: "" });
    var game = el("div", { "class": "spoj-game" }, [progress, howTo, board, feedback, more, next]);
    var summary = el("section", { "class": "quiz-summary", hidden: "" });
    container.appendChild(game);
    container.appendChild(summary);
    container._spoj = { state: function () { return { round: r, rounds: roundList, sel: sel, matched: matched, failed: failed }; } };

    next.addEventListener("click", function () { if (r + 1 < roundList.length) { r++; startRound(); } else showSummary(); });

    function start() {
      roundList = makeRounds(pool, { rounds: cfg.rounds || 3, pairs: cfg.pairs || 4, conflicts: cfg.conflicts });
      funnyLeft = shuffle((cfg.funny || []).slice());
      r = 0; failed = {}; hinted = {};
      game.hidden = false; summary.hidden = true;
      startRound();
    }

    function say(text, kind, cardId, cardOpts) {
      more.textContent = "";
      if (cardId && window.InfoCard) more.appendChild(window.InfoCard.moreButton(content, cardId, cardOpts));
      feedback.textContent = text;
      feedback.className = "spoj-feedback" + (kind ? " is-" + kind : "");
    }

    function startRound() {
      var round = roundList[r];
      sel = { name: null, answer: null }; matched = {}; pairNo = 0;
      progress.textContent = fmt(t.round || "Kolo {n} z {total}", { n: r + 1, total: roundList.length });
      names.textContent = ""; answers.textContent = "";
      round.forEach(function (it) {
        var b = el("button", { type: "button", "class": "spoj-btn spoj-name", "data-id": it.id, "aria-pressed": "false", text: it.cs });
        b.addEventListener("click", function () { tapName(it, b); });
        // Hint: the whole card; a structure whose hint was opened no longer counts as "first try".
        var hint = window.InfoCard ? window.InfoCard.hintIcon(content, it.id, {
          onOpen: function (id) { if (!matched[id]) { failed[id] = true; hinted[id] = true; } },
          done: function (id) { return !!matched[id]; } }) : null;
        names.appendChild(el("li", { "class": hint ? "has-hint" : null }, [b, hint]));
      });
      var fun = [];
      for (var k = 0; k < (cfg.funnyPerRound || 2); k++) { if (!funnyLeft.length) funnyLeft = shuffle((cfg.funny || []).slice()); fun.push(funnyLeft.pop()); }
      var list = round.map(function (it) { return { id: it.id, text: it.coDela }; })
        .concat(fun.map(function (f) { return { id: null, text: f }; }));
      shuffle(list).forEach(function (a) {
        var b = el("button", { type: "button", "class": "spoj-btn spoj-answer", "aria-pressed": "false", text: a.text });
        if (a.id) b.setAttribute("data-id", a.id); else b.setAttribute("data-funny", "1");
        b.addEventListener("click", function () { tapAnswer(a, b); });
        answers.appendChild(el("li", null, [b]));
      });
      next.hidden = true;
      say(t.pickName || "");
    }

    function press(b, on) { if (b) { b.setAttribute("aria-pressed", String(on)); b.classList.toggle("is-picked", on); } }

    function tapName(it, b) {
      if (matched[it.id]) return;
      if (sel.name && sel.name.b === b) { press(b, false); sel.name = null; say(t.pickName || ""); return; }
      if (sel.name) press(sel.name.b, false);
      sel.name = { it: it, b: b }; press(b, true);
      if (sel.answer) check(); else say(fmt(t.pickAnswer || "", { name: it.cs }));
    }

    function tapAnswer(a, b) {
      if (b.disabled) return;
      if (!a.id) {   // a funny answer: never right, never a penalty for the child
        b.disabled = true; b.classList.add("is-funny");
        if (sel.answer) { press(sel.answer.b, false); sel.answer = null; }
        say(pick(t.funnyReplies || ["Ha!"]), "funny");
        return;
      }
      if (sel.answer && sel.answer.b === b) { press(b, false); sel.answer = null; return; }
      if (sel.answer) press(sel.answer.b, false);
      sel.answer = { a: a, b: b }; press(b, true);
      if (sel.name) check(); else say(t.pickName || "");
    }

    function check() {
      var n = sel.name, a = sel.answer;
      press(n.b, false); press(a.b, false);
      sel = { name: null, answer: null };
      if (a.a.id === n.it.id) {
        pairNo++; matched[n.it.id] = true;
        [n.b, a.b].forEach(function (b) {
          b.disabled = true; b.classList.remove("is-wrong"); b.classList.add("is-right");
          b.insertBefore(el("span", { "class": "spoj-num", "aria-hidden": "true", text: String(pairNo) }), b.firstChild);
        });
        say(fmt(t.right || "{name} – správně!", { name: n.it.cs }) + (hinted[n.it.id] ? " " + (ui.hintNoScore || "S nápovědou se odpověď do výsledku nepočítá.") : ""), "right", n.it.id);
        var done = roundList[r].every(function (it) { return matched[it.id]; });
        if (done) {
          // Funny answers that were not tapped stay as they are; the round is over.
          Array.prototype.forEach.call(answers.querySelectorAll("button"), function (b) { b.disabled = true; });
          next.textContent = r + 1 < roundList.length ? (t.nextRound || "Další kolo") : (t.finish || "Výsledek");
          next.hidden = false; next.focus();
        }
      } else {
        failed[n.it.id] = true;
        [n.b, a.b].forEach(function (b) {
          b.classList.remove("is-wrong"); void b.offsetWidth; b.classList.add("is-wrong");
          setTimeout(function () { b.classList.remove("is-wrong"); }, 900);   // red only for a moment
        });
        say(t.wrong || "Tohle k sobě nepatří.", "wrong", n.it.id);
      }
    }

    function showSummary() {
      var all = [];
      roundList.forEach(function (round) { all = all.concat(round); });
      var score = all.filter(function (it) { return !failed[it.id]; }).length;
      var ratio = all.length ? score / all.length : 0;
      summary.textContent = "";
      summary.appendChild(el("h2", { "class": "quiz-prompt", text: fmt(t.score || "{score} z {total}", { score: score, total: all.length }) }));
      summary.appendChild(el("p", { "class": "quiz-verdict", text: ratio >= 0.9 ? (t.great || ui.quizGreat || "") : ratio >= 0.6 ? (ui.quizGood || "") : (ui.quizTryAgain || "") }));
      var missed = all.filter(function (it) { return failed[it.id]; });
      if (missed.length) {
        summary.appendChild(el("p", { text: ui.quizReview || "Na tyhle se ještě podívej:" }));
        var ul = el("ul", { "class": "quiz-missed" });
        missed.forEach(function (it) { ul.appendChild(el("li", null, [el("strong", { text: it.cs }), document.createTextNode(" – " + it.coDela)])); });
        summary.appendChild(ul);
      }
      var again = el("button", { type: "button", "class": "quiz-next", text: t.again || "Hrát znovu" });
      again.addEventListener("click", start);
      summary.appendChild(el("div", { "class": "quiz-actions" }, [again, el("a", { "class": "quiz-next quiz-secondary", href: (D.returnTo || {}).href || t.backHref || "#/kostra", text: (D.returnTo || {}).text || t.back || "Zpět na kostru" })]));
      game.hidden = true; summary.hidden = false;
      summary.querySelector("h2").setAttribute("tabindex", "-1"); summary.querySelector("h2").focus();
    }

    start();
  }

  window.Spoj = { mount: mount };
})();
