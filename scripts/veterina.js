/*
 * Na veterině (#73): the vet section.
 *
 * Routes (scripts/app.js calls Veterina.render(sub, sub2)):
 *   #/veterina                  the section start: Ordinace (the game) and Kočičí nemoci
 *   #/veterina/ordinace         Ordinace, the waiting room: every patient photo, a paw 🐾 on the cats already treated
 *                               (kept only while the page is open: no points, nothing saved; Lenka 2026-11-22),
 *                               and Náhodný pacient
 *   #/veterina/ordinace/<id>    one case (ATLAS_DATA.veterina.pripady): the story, the examinations (any number,
 *                               „Nic důležitého.“ when a case has no finding), „Co kočce je?“ (three cards; a wrong
 *                               one says why), „Co pomůže?“ (three answers; a wrong one says why), the end with the
 *                               case's Pozor!, a link to the card in Kočičí nemoci and the next patient
 *   #/veterina/nemoci[/<id>]    Kočičí nemoci: the cards grouped by badge (ATLAS_DATA.nemoci); a tap opens the card
 *                               in the pop-up (scripts/infocard.js); with <id> that card opens at once
 *
 * The card pop-up shows the badge, the five headings, Pozor!, the card's picture, a link to its X-ray in
 * Zajímavé rentgeny and buttons with the body parts; a body part opens its atlas card in the same pop-up,
 * with a button back to the illness.
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
  function section() { return (D.sections || []).filter(function (s) { return s.id === "veterina"; })[0] || { cs: "Na veterině" }; }
  function back(href, text) { return el("a", { "class": "back-link", href: href, text: "← " + text }); }

  function renderStart() {
    var nodes = [back("#/", ui.back || "Zpět na menu"), el("h1", { "class": "screen-title", text: section().cs })];
    var list = el("ul", { "class": "menu vet-menu" });
    list.appendChild(el("li", null, [el("a", { "class": "menu-card", href: "#/veterina/ordinace" }, [
      el("span", { "class": "menu-icon", "aria-hidden": "true", text: "🩺" }),
      el("span", { "class": "menu-label" }, [el("span", { text: ui.vetOrdinace || "Ordinace" }),
        el("span", { "class": "menu-sub", text: ui.vetOrdinaceText || "" })])])]));
    list.appendChild(el("li", null, [el("a", { "class": "menu-card", href: "#/veterina/nemoci" }, [
      el("span", { "class": "menu-icon", "aria-hidden": "true", text: "📖" }),
      el("span", { "class": "menu-label" }, [el("span", { text: ui.vetNemoci || "Kočičí nemoci" }),
        el("span", { "class": "menu-sub", text: ui.vetNemociText || "" })])])]));
    nodes.push(list);
    return nodes;
  }

  function renderNemoci(openId) {
    var N = D.nemoci || { items: [], badges: {} };
    var nodes = [back("#/veterina", ui.vetBack || "Zpět na veterinu"), el("h1", { "class": "screen-title", text: ui.vetNemoci || "Kočičí nemoci" }),
      el("p", { "class": "fig-note", text: ui.vetNemociIntro || "" })];
    Object.keys(N.badges).forEach(function (b) {
      var items = N.items.filter(function (c) { return c.badge === b; });
      if (!items.length) return;
      nodes.push(el("section", { "class": "nemoci-group", id: "skupina-" + b }, [
        el("h2", { "class": "nemoci-h badge-" + b, text: N.badges[b] }),
        el("ul", { "class": "part-nav nemoci-list" }, items.map(function (c) {
          var btn = el("button", { type: "button", "class": "part-link nemoc-btn", "data-nemoc": c.id, text: c.cs });
          btn.addEventListener("click", function () { window.InfoCard.open("nemoci", c.id); });
          return el("li", null, [btn]);
        }))]));
    });
    var last = nodes[nodes.length - 1];
    if (openId && window.InfoCard.find("nemoci", openId)) {
      last._mount = function () {
        var b = document.querySelector("[data-nemoc='" + openId + "']");
        if (b) { b.scrollIntoView({ block: "center" }); b.focus(); }
        window.InfoCard.open("nemoci", openId);
      };
    }
    return nodes;
  }


  /* ---------- Ordinace: the game ---------- */
  var cured = {};   // case id -> true; only while the page is open (no points, nothing saved)
  function V() { return D.veterina || { pripady: [], vysetreni: [] }; }
  function findCase(id) { return V().pripady.filter(function (p) { return p.id === id; })[0]; }
  function card(id) { return window.InfoCard.find("nemoci", id) || { cs: id }; }
  function fmt(s, v) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return v[k]; }); }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function randomCase(except) {
    var all = V().pripady.filter(function (p) { return p.id !== except; });
    var open = all.filter(function (p) { return !cured[p.id]; });
    var from = open.length ? open : all;
    return from[Math.floor(Math.random() * from.length)];
  }
  function goRandom(except) { var p = randomCase(except); if (p) location.hash = "#/veterina/ordinace/" + p.id; }

  function renderCekarna() {
    var nodes = [back("#/veterina", ui.vetBack || "Zpět na veterinu"), el("h1", { "class": "screen-title", text: ui.vetOrdinace || "Ordinace" })];
    var rnd = el("button", { type: "button", "class": "quiz-open vet-random", text: "🎲 " + (ui.vetNahodny || "Náhodný pacient") });
    rnd.addEventListener("click", function () { goRandom(); });
    nodes.push(el("div", { "class": "screen-head" }, [el("h2", { "class": "vet-h", text: ui.vetCekarna || "Čekárna" }), rnd]));
    nodes.push(el("p", { "class": "fig-note", text: ui.vetCekarnaIntro || "" }));
    nodes.push(el("ul", { "class": "vet-cekarna" }, V().pripady.map(function (p) {
      var rest = p.kocka.slice(p.jmeno.length).replace(/^,\s*/, "");
      var a = el("a", { "class": "vet-pacient" + (cured[p.id] ? " is-cured" : ""), href: "#/veterina/ordinace/" + p.id, "data-pacient": p.id }, [
        el("img", { src: "images/veterina/" + p.foto + ".webp", alt: "", loading: "lazy" }),
        el("span", { "class": "vet-jmeno", text: p.jmeno }), el("span", { "class": "vet-kocka", text: rest }),
        cured[p.id] ? el("span", { "class": "vet-tlapka", role: "img", "aria-label": ui.vetOsetreno || "ošetřeno", text: "🐾" }) : null]);
      return el("li", null, [a]);
    })));
    return nodes;
  }

  function verdict(ok, text) {
    return el("div", { "class": "vet-feedback", role: "status" }, [
      el("p", { "class": "quiz-verdict " + (ok ? "is-right" : "is-wrong"), text: ok ? (ui.vetSpravne || "Správně!") : (ui.vetSpatne || "To není ono.") }),
      text ? el("p", { "class": "card-p", text: text }) : null,
      ok ? null : el("p", { "class": "quiz-miss", text: ui.vetZkus || "Zkus jinou odpověď." })]);
  }
  function step(host, title, cls) {
    var h = el("h2", { "class": "vet-h", tabindex: "-1", text: title });
    var sec = el("section", { "class": "vet-step " + cls }, [h]);
    host.appendChild(sec);
    return { sec: sec, focus: function () { sec.scrollIntoView({ block: "start", behavior: "smooth" }); h.focus({ preventScroll: true }); } };
  }
  // A choice: buttons in random order; a wrong one is marked and says why, the right one ends the step.
  function choice(sec, options, onRight) {
    var fb = el("div", { "class": "vet-fb" });
    var list = el("ul", { "class": "spoj-col vet-options" });
    var buttons = [];
    shuffle(options).forEach(function (o) {
      var b = el("button", { type: "button", "class": "spoj-btn", "data-option": o.key, text: o.text });
      buttons.push(b);
      b.addEventListener("click", function () {
        fb.textContent = "";
        if (o.right) {
          b.classList.add("is-right");
          buttons.forEach(function (x) { x.disabled = true; });
          fb.appendChild(verdict(true, o.why));
          onRight();
        } else {
          b.classList.remove("is-wrong"); void b.offsetWidth; b.classList.add("is-wrong", "is-tried");
          b.disabled = true;
          fb.appendChild(verdict(false, o.why));
        }
      });
      list.appendChild(el("li", null, [b]));
    });
    sec.appendChild(list); sec.appendChild(fb);
  }

  function renderPripad(id) {
    var p = findCase(id);
    if (!p) return renderCekarna();
    var c = card(p.nemoc);
    var nodes = [back("#/veterina/ordinace", ui.vetDoCekarny || "Zpět do čekárny"), el("h1", { "class": "screen-title", text: p.jmeno })];
    nodes.push(el("div", { "class": "vet-patient" }, [
      el("img", { src: "images/veterina/" + p.foto + ".webp", alt: p.kocka }),
      el("div", null, [el("p", { "class": "vet-kocka-line", text: p.kocka }), el("p", { "class": "vet-pribeh", text: p.pribeh })])]));
    var host = el("div", { "class": "vet-game", "data-case": p.id });
    nodes.push(host);

    // 1. Examinations
    var s1 = step(host, ui.vetVysetreni || "Vyšetření", "vet-s-vysetreni");
    s1.sec.appendChild(el("p", { "class": "fig-note", text: ui.vetVysetreniIntro || "" }));
    var grid = el("ul", { "class": "vet-exams" });
    var results = el("ol", { "class": "vet-nalezy", "aria-live": "polite" });
    var next = el("button", { type: "button", "class": "quiz-next", disabled: "", text: ui.vetVim || "Vím, co kočce je →" });
    V().vysetreni.forEach(function (v) {
      var b = el("button", { type: "button", "class": "vet-exam", "data-exam": v.id }, [
        el("img", { src: "images/veterina/nastroje/" + v.id + ".svg", alt: "" }), el("span", { text: v.cs })]);
      b.addEventListener("click", function () {
        if (b.classList.contains("is-done")) {   // already done: show its result again
          var old = results.querySelector("[data-nalez='" + v.id + "']");
          if (old) { old.scrollIntoView({ block: "nearest" }); old.classList.remove("is-flash"); void old.offsetWidth; old.classList.add("is-flash"); }
          return;
        }
        b.classList.add("is-done"); b.setAttribute("aria-pressed", "true");
        var f = p.nalezy[v.id];
        var li = el("li", { "class": "vet-nalez" + (f ? "" : " is-nic"), "data-nalez": v.id }, [
          el("img", { src: "images/veterina/nastroje/" + v.id + ".svg", alt: "" }),
          el("div", null, [el("strong", { text: v.cs }), el("p", { "class": "card-p", text: f || V().nic })])]);
        // The card's own picture (the dental X-ray) goes with the X-ray finding.
        if (v.id === "rentgen" && f && c.obrazek) li.lastChild.appendChild(el("img", { "class": "vet-nalez-obr", src: "images/veterina/" + c.obrazek + ".webp",
          alt: (ui.vetObrazky || {})[c.obrazek] || "" }));
        results.appendChild(li);
        next.disabled = false;
        li.scrollIntoView({ block: "nearest" });
      });
      grid.appendChild(el("li", null, [b]));
    });
    s1.sec.appendChild(grid);
    s1.sec.appendChild(el("h3", { "class": "card-h", text: ui.vetVysledky || "Výsledky vyšetření" }));
    s1.sec.appendChild(results);
    s1.sec.appendChild(next);

    next.addEventListener("click", function () {
      next.hidden = true;
      // 2. Diagnosis
      var s2 = step(host, ui.vetCoJe || "Co kočce je?", "vet-s-coje");
      choice(s2.sec, p.moznosti.map(function (m) { return { key: m, text: card(m).cs, right: m === p.nemoc, why: m === p.nemoc ? "" : p.proc[m] }; }), function () {
        // 3. Treatment
        var s3 = step(host, ui.vetCoPomuze || "Co pomůže?", "vet-s-pomuze");
        var opts = [{ key: "lecba", text: p.lecba, right: true, why: "" }].concat(p.spatne.map(function (w, i) { return { key: "spatne-" + i, text: w.text, right: false, why: w.proc }; }));
        choice(s3.sec, opts, function () {
          // End
          cured[p.id] = true;
          var s4 = step(host, ui.vetHotovo || "Výborně! Víš, co kočce je i co jí pomůže.", "vet-s-konec");
          if (p.pozor) s4.sec.appendChild(el("div", { "class": "nemoc-pozor", role: "note" }, [
            el("strong", { text: (D.nemoci.labels || {}).pozor || "Pozor!" }), document.createTextNode(" " + p.pozor)]));
          var more = el("a", { "class": "part-link", href: "#/veterina/nemoci/" + p.nemoc, "data-karta": p.nemoc,
            text: fmt(ui.readCard || "Přečti si kartičku: {name} →", { name: c.cs }) });
          var dalsi = el("button", { type: "button", "class": "quiz-open vet-dalsi", text: ui.vetDalsi || "Další pacient" });
          dalsi.addEventListener("click", function () { goRandom(p.id); });
          s4.sec.appendChild(el("p", null, [more]));
          s4.sec.appendChild(el("div", { "class": "quiz-actions" }, [dalsi,
            el("a", { "class": "quiz-open quiz-secondary", href: "#/veterina/ordinace", text: ui.vetDoCekarny || "Zpět do čekárny" })]));
          s4.focus();
        });
        s3.focus();
      });
      s2.focus();
    });
    return nodes;
  }

  function render(sub, sub2) {
    if (sub === "nemoci") return renderNemoci(sub2);
    if (sub === "ordinace") return sub2 ? renderPripad(sub2) : renderCekarna();
    return renderStart();
  }

  window.Veterina = { render: render, cured: cured };
})();
