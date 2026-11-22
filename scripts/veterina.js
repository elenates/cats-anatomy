/*
 * Na veterině (#73): the vet section.
 *
 * Routes (scripts/app.js calls Veterina.render(sub, sub2)):
 *   #/veterina                  the section start: Ordinace (the game) and Kočičí nemoci
 *   #/veterina/ordinace         Ordinace, the waiting room: every patient photo, a paw 🐾 on the cats already treated
 *                               (kept only while the page is open: no points, nothing saved; Lenka 2026-11-22),
 *                               and Náhodný pacient
 *   #/veterina/ordinace/<id>    one case (ATLAS_DATA.veterina.pripady): the story, the exam room (#104: the cat's
 *                               cut-out is tapped or dragged onto the table; a frightened patient needs the safe first
 *                               step first; tools from the cabinet, ultrasound on the trolley, the X-ray room door),
 *                               the examinations (any number,
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

    // 1. Examinations, in the exam room (#104): put the cat on the table, calm a frightened cat first,
    // then take a tool from the cabinet, the ultrasound from the trolley or carry the cat to the X-ray room.
    var s1 = step(host, ui.vetVysetreni || "Vyšetření", "vet-s-vysetreni");
    var hint = el("p", { "class": "fig-note vet-room-hint", "aria-live": "polite", text: ui.vetNaStul || "" });
    s1.sec.appendChild(hint);
    var results = el("ol", { "class": "vet-nalezy", "aria-live": "polite" });
    var next = el("button", { type: "button", "class": "quiz-next", disabled: "", text: ui.vetVim || "Vím, co kočce je →" });
    var room = el("div", { "class": "vet-room", role: "group", "aria-label": ui.vetOrdinace || "Ordinace" });
    room.appendChild(el("img", { "class": "vet-room-bg", src: "images/veterina/ordinace.svg", alt: "" }));
    room.appendChild(el("span", { "class": "vet-room-label vet-l-cekarna", "aria-hidden": "true", text: ui.vetCekarna || "Čekárna" }));
    room.appendChild(el("span", { "class": "vet-room-label vet-l-rentgen", "aria-hidden": "true", text: ui.vetRentgenDvere || "Rentgen" }));
    var table = el("button", { type: "button", "class": "vet-table", "aria-label": ui.vetStul || "Vyšetřovací stůl" });
    room.appendChild(table);
    var cat = el("button", { type: "button", "class": "vet-cat", "aria-label": fmt(ui.vetPolozit || "Položit kočku {name} na stůl", { name: p.jmeno }) }, [
      el("img", { src: "images/veterina/vyrezy/" + p.id + ".webp", alt: "", draggable: "false" })]);
    room.appendChild(cat);
    var flash = el("div", { "class": "vet-flash", "aria-hidden": "true" });
    room.appendChild(flash);
    var tools = [];   // examination buttons: disabled until the cat is on the table (and calm)
    var SHELF = { stetoskop: [0, 0], teplomer: [0, 1], vaha: [0, 2], prohmatat: [0, 3], lupa: [0, 4], otoskop: [0, 5], "krevni-test": [0, 6],
      "test-moci": [0, 7], "barvivo-oko": [1, 0], mikroskop: [1, 1], hrebinek: [1, 2], "uv-lampa": [1, 3] };
    var LECBA = ["leky", "injekce", "kapky", "obvaz", "dieta", "inhalator", "nuzky-drapy", "pinzeta", "ockovaci-prukaz", "operace"];
    function slot(row, col) { return { left: (19.9 + col * 4.0) + "%", top: (13.3 + row * 16.2) + "%" }; }
    function place(n, pos) { Object.keys(pos).forEach(function (k) { n.style[k] = pos[k]; }); }
    var onTable = false, calm = !p.strach;
    function setTools() { tools.forEach(function (b) { b.disabled = !(onTable && calm); }); }
    function examine(v, b) {
      if (b.classList.contains("is-done")) {   // already done: show its result again
        var old = results.querySelector("[data-nalez='" + v.id + "']");
        if (old) { old.scrollIntoView({ block: "nearest" }); old.classList.remove("is-flash"); void old.offsetWidth; old.classList.add("is-flash"); }
        return;
      }
      b.classList.add("is-done"); b.setAttribute("aria-pressed", "true");
      // A short movement: the tool to the cat, or the cat to the X-ray room and back.
      if (v.id === "rentgen") { room.classList.remove("is-xray"); void room.offsetWidth; room.classList.add("is-xray"); }
      else { b.classList.remove("is-used"); void b.offsetWidth; b.classList.add("is-used"); }
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
    }
    V().vysetreni.forEach(function (v) {
      var where = v.id === "rentgen" ? "vet-t-rentgen" : v.id === "ultrazvuk" ? "vet-t-ultrazvuk" : "vet-t-police";
      var b = el("button", { type: "button", "class": "vet-exam " + where, "data-exam": v.id, "aria-label": v.cs, title: v.cs, disabled: "" },
        v.id === "rentgen" ? [] : [el("img", { src: "images/veterina/nastroje/" + v.id + ".svg", alt: "" })]);
      if (SHELF[v.id]) place(b, slot(SHELF[v.id][0], SHELF[v.id][1]));
      b.addEventListener("click", function () { examine(v, b); });
      tools.push(b); room.appendChild(b);
    });
    // The treatment things on the lower shelves are for later: a tap only says so.
    LECBA.forEach(function (id, i) {
      var pos = i < 2 ? slot(1, 6 + i) : slot(2, i - 2);
      var b = el("button", { type: "button", "class": "vet-lecba", "data-lecba": id, "aria-label": ui.vetLecbaPolice || "", title: ui.vetLecbaPolice || "" },
        [el("img", { src: "images/veterina/nastroje/" + id + ".svg", alt: "" })]);
      place(b, pos);
      b.addEventListener("click", function () { hint.textContent = ui.vetLecbaPolice || ""; });
      room.appendChild(b);
    });

    // The frightened patient (#104 stage C): the signs, the photo and the safe first step.
    var S = V().strach;
    function scared() {
      var box = el("section", { "class": "vet-strach", role: "region", "aria-label": ui.vetStrachH || "Pozor, kočka se bojí!" }, [
        el("h3", { "class": "card-h", text: ui.vetStrachH || "Pozor, kočka se bojí!" }),
        el("div", { "class": "vet-strach-row" }, [
          el("img", { src: "images/veterina/" + S.foto + ".webp", alt: ui.vetStrachFoto || "" }),
          el("div", null, [el("p", { "class": "card-p vet-strach-znaky", text: p.strach }), el("p", { "class": "card-p", text: S.jak }),
            el("p", { "class": "card-p vet-strach-otazka", text: S.otazka })])])]);
      s1.sec.insertBefore(box, results.previousSibling);
      var opts = [{ key: "spravne", text: S.spravne.text, right: true, why: S.spravne.proc }].concat(S.spatne.map(function (w, i) {
        return { key: "strach-" + i, text: w.text, right: false, why: w.proc }; }));
      choice(box, opts, function () {
        calm = true; room.classList.remove("is-scared"); setTools();
        box.appendChild(el("div", { "class": "nemoc-pozor", role: "note" }, [document.createTextNode(S.doma)]));
        hint.textContent = ui.vetNastroje || "";
      });
    }
    function putOnTable() {
      if (onTable) return;
      onTable = true; room.classList.add("is-on-table"); cat.disabled = true;
      cat.setAttribute("aria-label", p.jmeno);
      if (p.strach) { room.classList.add("is-scared"); hint.textContent = ui.vetStrachHint || ""; scared(); }
      else hint.textContent = ui.vetNastroje || "";
      setTools();
    }
    table.addEventListener("click", putOnTable);
    // Tap the cat, or drag it onto the table.
    var drag = null;
    cat.addEventListener("pointerdown", function (e) {
      if (onTable) return;
      drag = { x: e.clientX, y: e.clientY, moved: false }; cat.setPointerCapture(e.pointerId);
    });
    cat.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
      cat.style.transform = "translate(" + dx + "px," + dy + "px)";
    });
    cat.addEventListener("pointerup", function (e) {
      if (!drag) return;
      var moved = drag.moved; drag = null; cat.style.transform = "";
      var t = table.getBoundingClientRect();
      var over = e.clientX >= t.left - 40 && e.clientX <= t.right + 40 && e.clientY >= t.top - 200 && e.clientY <= t.bottom + 40;
      if (!moved || over) putOnTable();
    });
    cat.addEventListener("click", function (e) { if (e.detail === 0) putOnTable(); });   // keyboard
    s1.sec.appendChild(el("div", { "class": "vet-room-wrap" }, [room]));
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
