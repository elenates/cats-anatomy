/*
 * Závěrečný kvíz: questions from all sections (data/zaverecny.js), three kinds:
 *   najdi  – find the structure on its picture: one tap, judged with Atlas.hitTest (fig.alsoCounts too);
 *   coDela – pick its "Co dělá?" text among three of the same section (Spoj conflicts kept apart): one answer;
 *   kam    – pick its section; a funny answer gets a funny reply and is set aside, the first real answer counts.
 * Questions are spread over the sections (each about equally often), no structure twice.
 * At the end: score, missed list, and a Diplom with the typed-in name (not saved) to print.
 *
 * Public API: window.Zaverecny.mount(container)
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
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function fmt(s, v) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return v[k]; }); }

  function mount(container) {
    var cfg = D.zaverecny || {}, t = cfg.ui || {};
    var secName = {};
    (D.sections || []).forEach(function (s) { secName[s.id] = s.cs; });
    var maxVh = {};
    [D.svaly, D.smysly].forEach(function (c) { ((c && c.views) || []).forEach(function (v) { if (v.maxHeightVh) maxVh[v.figure] = v.maxHeightVh; }); });

    // Základ structures of each section, with the picture(s) they are on.
    var secs = (cfg.sections || []).filter(function (s) { return D[s.id] && secName[s.id]; }).map(function (s) {
      var items = D[s.id].items.filter(function (it) { return it.level === "zaklad" && it.quiz !== false; });
      var figOf = {};
      items.forEach(function (it) {
        (s.figures || []).some(function (f) {
          var h = (D.hotspots || {})[f.figure];
          if (h && h.layers[f.layer] && h.layers[f.layer][it.id]) { figOf[it.id] = f; return true; }
          return false;
        });
      });
      var spoj = s.spoj && D[s.spoj];
      return { id: s.id, cs: secName[s.id], items: items, figOf: figOf, conflicts: (spoj && spoj.conflicts) || [], kam: s.kam };
    });

    function clash(sec, a, b) { return sec.conflicts.some(function (g) { return g.indexOf(a) >= 0 && g.indexOf(b) >= 0; }); }
    function canAsk(sec, it, kind) {
      if (kind === "najdi") return !!sec.figOf[it.id];
      if (kind === "kam") return sec.kam;
      return !!it.coDela && sec.items.filter(function (o) { return o.id !== it.id && o.coDela && !clash(sec, o.id, it.id); }).length >= 2;
    }

    function makeQuestions() {
      var kinds = [];
      Object.keys(cfg.counts || {}).forEach(function (k) { for (var i = 0; i < cfg.counts[k]; i++) kinds.push(k); });
      // One slot per question, the sections taking turns; "kam" questions go to slots of sections that
      // can ask them, the other kinds fill the remaining slots.
      var slots = [];
      while (slots.length < kinds.length) slots = slots.concat(shuffle(secs.slice()));
      slots = slots.slice(0, kinds.length);
      var plan = new Array(slots.length), free = shuffle(slots.map(function (s, i) { return i; }));
      kinds.filter(function (k) { return k === "kam"; }).forEach(function (k) {
        for (var i = 0; i < free.length; i++) if (slots[free[i]].kam) { plan[free[i]] = k; free.splice(i, 1); return; }
      });
      shuffle(kinds.filter(function (k) { return k !== "kam"; })).forEach(function (k) { plan[free.shift()] = k; });
      var order = shuffle(plan.map(function (k, i) { return i; }));
      var used = {}, out = [];
      order.forEach(function (si) {
        var kind = plan[si];
        if (!kind) return;
        // the planned section, or else any section that can ask this kind
        var tries = [slots[si]].concat(shuffle(secs.slice()));
        for (var i = 0; i < tries.length; i++) {
          var sec = tries[i];
          var cand = shuffle(sec.items.filter(function (it) { return !used[it.id] && canAsk(sec, it, kind); }));
          if (cand.length) { used[cand[0].id] = true; out.push({ kind: kind, sec: sec, it: cand[0] }); return; }
        }
      });
      return out;
    }

    var progress = el("p", { "class": "quiz-progress" });
    var prompt = el("h2", { "class": "quiz-prompt", "aria-live": "polite" });
    var body = el("div", { "class": "final-body" });
    var game = el("div", { "class": "final-game" }, [el("div", { "class": "quiz-head" }, [progress, prompt]), body]);
    var summary = el("section", { "class": "atlas-card quiz-summary final-summary", hidden: "hidden" });
    container.appendChild(game); container.appendChild(summary);

    var qs = [], qi = 0, score = 0, missed = [], funnyLeft = [];
    var nextBtn = el("button", { type: "button", "class": "quiz-next" });
    nextBtn.addEventListener("click", function () { qi += 1; if (qi < qs.length) ask(); else finish(); });

    function feedbackBox() { return el("section", { "class": "atlas-card quiz-feedback", "aria-live": "polite" }); }
    function done(fb, ok, q, extra) {
      if (ok) score += 1; else missed.push(q);
      fb.textContent = "";
      fb.appendChild(el("p", { "class": "quiz-verdict " + (ok ? "is-right" : "is-wrong"), text: ok ? (t.right || "Správně!") : (t.wrong || "") }));
      if (!ok && extra) fb.appendChild(el("p", { "class": "card-p", text: extra }));
      nextBtn.textContent = qi < qs.length - 1 ? (t.next || "Další otázka") : (t.finish || "Výsledek");
      fb.appendChild(nextBtn);
      nextBtn.focus({ preventScroll: true });
      fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function ask() {
      var q = qs[qi];
      progress.textContent = fmt(t.progress || "{n}/{total}", { n: qi + 1, total: qs.length });
      prompt.textContent = fmt(t[q.kind] || "{name}", { name: q.it.cs });
      body.textContent = "";
      body.setAttribute("data-kind", q.kind);
      if (q.kind === "najdi") askFind(q); else askChoice(q);
    }

    function askFind(q) {
      var f = q.sec.figOf[q.it.id], fig = D.hotspots[f.figure], layer = fig.layers[f.layer], also = fig.alsoCounts || {};
      var ids = q.sec.items.filter(function (it) { return layer[it.id]; }).map(function (it) { return it.id; });
      var svg = svgEl("svg", { "class": "atlas-svg quiz-svg", role: "group", viewBox: "0 0 " + fig.width + " " + fig.height,
        "aria-label": fmt(t.najdi || "{name}", { name: q.it.cs }) });
      var vh = maxVh[f.figure];
      if (vh) { svg.style.maxWidth = "calc(" + vh + "vh * " + (fig.width / fig.height).toFixed(4) + ")"; svg.style.margin = "0 auto"; }
      var img = svgEl("image", { href: fig.image, x: 0, y: 0, width: fig.width, height: fig.height });
      img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", fig.image);
      svg.appendChild(img);
      var nodes = {}, answered = false, fb = feedbackBox();
      fb.appendChild(el("p", { "class": "card-empty", text: t.hint || "" }));
      ids.forEach(function (id, n) {
        var g = svgEl("g", { "class": "hotspot quiz-spot", tabindex: "0", role: "button", "data-id": id, "aria-label": fmt((D.ui || {}).quizSpot || "Místo {n}", { n: n + 1 }) });
        layer[id].forEach(function (p) { g.appendChild(svgEl("polygon", { points: p.map(function (c) { return c.join(","); }).join(" ") })); });
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(id); } });
        nodes[id] = g; svg.appendChild(g);
      });
      svg.addEventListener("click", function (e) {
        if (answered) return;
        var id = window.Atlas.hitTest(svg, layer, ids, e.clientX, e.clientY);
        if (id) tap(id); else { fb.textContent = ""; fb.appendChild(el("p", { "class": "quiz-miss", text: t.missTap || "" })); }
      });
      function tap(id) {
        if (answered) return;
        answered = true; svg.classList.add("is-answered");
        var ok = id === q.it.id || (also[q.it.id] || []).indexOf(id) >= 0;
        nodes[q.it.id].classList.add("is-right");
        if (!ok) nodes[id].classList.add("is-wrong");
        done(fb, ok, q, t.rightIsFigure);
      }
      var credit = el("p", { "class": "atlas-credit" });
      if (fig.credit) (fig.creditParts || [{ text: fig.credit }]).forEach(function (c) {
        credit.appendChild(c.href ? el("a", { href: c.href, target: "_blank", rel: "noopener", text: c.text }) : document.createTextNode(c.text));
      });
      else credit.hidden = true;
      body.appendChild(el("div", { "class": "atlas-layout" }, [el("div", { "class": "atlas-figure-col" }, [el("div", { "class": "atlas-figure" }, [svg]), credit]), fb]));
    }

    function askChoice(q) {
      var opts = [], right;
      if (q.kind === "coDela") {
        right = q.it.coDela;
        var others = shuffle(q.sec.items.filter(function (o) { return o.id !== q.it.id && o.coDela && !clash(q.sec, o.id, q.it.id); }));
        var picked = [];
        others.forEach(function (o) { if (picked.length < 2 && picked.every(function (p) { return !clash(q.sec, p.id, o.id); })) picked.push(o); });
        opts = [{ text: right, ok: true }].concat(picked.map(function (o) { return { text: o.coDela, ok: false }; }));
      } else {
        right = q.sec.cs;
        var other = pick(secs.filter(function (s) { return s.id !== q.sec.id; }));
        if (!funnyLeft.length) funnyLeft = shuffle((cfg.funny || []).slice());
        opts = [{ text: right, ok: true }, { text: other.cs, ok: false }, { text: funnyLeft.pop(), funny: true }];
      }
      opts = shuffle(opts);
      var fb = el("p", { "class": "spoj-feedback", "aria-live": "polite" });
      var list = el("ul", { "class": "spoj-col final-answers" });
      var answered = false, buttons = [];
      opts.forEach(function (o) {
        var b = el("button", { type: "button", "class": "spoj-btn final-answer", "data-ok": o.ok ? "1" : null, "data-funny": o.funny ? "1" : null, text: o.text });
        b.addEventListener("click", function () {
          if (answered || b.disabled) return;
          if (o.funny) {
            b.disabled = true; b.classList.add("is-funny");
            fb.textContent = pick(t.funnyReplies || [""]); fb.className = "spoj-feedback is-funny";
            return;
          }
          answered = true;
          buttons.forEach(function (x) { x.disabled = true; if (x._ok) x.classList.add("is-right"); });
          if (!o.ok) b.classList.add("is-wrong");
          fb.textContent = ""; fb.className = "spoj-feedback";
          done(card, o.ok, q, fmt(t.rightIs || "{answer}", { answer: right }));
        });
        b._ok = o.ok; buttons.push(b);
        list.appendChild(el("li", null, [b]));
      });
      var card = el("section", { "class": "atlas-card quiz-feedback final-card", "aria-live": "polite" });
      body.appendChild(el("div", { "class": "final-choice" }, [list, fb, card]));
    }

    function finish() {
      game.hidden = true; summary.hidden = false; summary.textContent = "";
      var total = qs.length, ui = D.ui || {}, ratio = total ? score / total : 0;
      summary.appendChild(el("h2", { "class": "quiz-prompt", tabindex: "-1", text: fmt(t.score || "{score}/{total}", { score: score, total: total }) }));
      summary.appendChild(el("p", { "class": "quiz-verdict", text: ratio >= 0.9 ? (t.great || "") : ratio >= 0.6 ? (ui.quizGood || "") : (ui.quizTryAgain || "") }));
      if (missed.length) {
        summary.appendChild(el("p", { text: t.review || "" }));
        summary.appendChild(el("ul", { "class": "quiz-missed" }, missed.map(function (q) {
          return el("li", null, [el("strong", { text: q.it.cs }), document.createTextNode(" (" + q.sec.cs + ")")]);
        })));
      }
      // Diplom: the typed name goes into the page only; nothing is stored.
      var input = el("input", { type: "text", id: "diplom-name", maxlength: "40", autocomplete: "off", "class": "diplom-input" });
      var make = el("button", { type: "button", "class": "quiz-next", text: t.makeDiplom || "Vytvořit diplom" });
      var paper = el("div", { "class": "diplom", hidden: "hidden" });
      var printBtn = el("button", { type: "button", "class": "quiz-next", hidden: "hidden", text: t.print || "Vytisknout" });
      make.addEventListener("click", function () {
        var d = new Date();
        paper.textContent = "";
        [el("p", { "class": "diplom-cat", "aria-hidden": "true", text: "🐈" }),
         el("h3", { "class": "diplom-title", text: t.diplomTitle || "Diplom" }),
         el("p", { "class": "diplom-for", text: t.diplomFor || "" }),
         el("p", { "class": "diplom-name", text: input.value.trim() || "…" }),
         el("p", { "class": "diplom-text" }, [document.createTextNode((t.diplomText || "") + (t.diplomAtlas ? " " : "")),
           t.diplomAtlas ? el("em", { text: t.diplomAtlas }) : null]),
         el("p", { "class": "diplom-score", text: fmt(t.diplomScore || "", { score: score, total: total }) }),
         el("p", { "class": "diplom-date", text: fmt(t.diplomDate || "{date}", { date: d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear() }) })
        ].forEach(function (n) { paper.appendChild(n); });
        paper.hidden = false; printBtn.hidden = false; printBtn.focus();
      });
      printBtn.addEventListener("click", function () {
        document.body.classList.add("print-diplom");
        var off = function () { document.body.classList.remove("print-diplom"); window.removeEventListener("afterprint", off); };
        window.addEventListener("afterprint", off);
        window.print();
      });
      summary.appendChild(el("section", { "class": "diplom-box" }, [
        el("h3", { "class": "card-h", text: t.diplomHeading || "Diplom" }),
        el("label", { "for": "diplom-name", text: t.nameLabel || "" }), input,
        el("p", { "class": "atlas-credit", text: t.nameNote || "" }),
        el("div", { "class": "quiz-actions" }, [make, printBtn]), paper]));
      var again = el("button", { type: "button", "class": "quiz-next quiz-secondary", text: t.again || "Hrát znovu" });
      again.addEventListener("click", start);
      summary.appendChild(el("div", { "class": "quiz-actions" }, [again,
        el("a", { "class": "quiz-next quiz-secondary", href: "#/procvicovani", text: t.back || "Zpět" })]));
      summary.querySelector("h2").focus();
    }

    function start() {
      qs = makeQuestions(); qi = 0; score = 0; missed = []; funnyLeft = [];
      game.hidden = false; summary.hidden = true; ask();
    }
    container._final = { state: function () { return { qi: qi, score: score, questions: qs.map(function (q) { return { kind: q.kind, sec: q.sec.id, id: q.it.id }; }) }; } };
    start();
  }

  window.Zaverecny = { mount: mount };
})();
