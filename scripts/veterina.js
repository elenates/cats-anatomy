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
  function findCase(id) { return V().pripady.concat(V().zvlastni || [], V().prenosky || []).filter(function (p) { return p.id === id; })[0]; }
  // The surprise patients (#104): shown once enough cats are cured while the page is open.
  function curedCount() { return V().pripady.filter(function (p) { return cured[p.id]; }).length; }
  function surprises() { return (V().zvlastni || []).filter(function (z) { return curedCount() >= z.odemknout; }); }
  // Sounds (#113): only after a tap, a button switches them off. Sick cats meow on the table (two recordings,
  // taken in turn by the order of the cases), frightened cats hiss, cured cats purr (two recordings in turn; the third one Lenka picked was too low to hear on laptop and phone speakers),
  // Rádža growls when frightened. Healthy visits do not meow; Šuma and Fred have no sound (no free recording).
  // The choice is kept in localStorage when the browser allows it. Veterina.zvuky logs what played (for the tests).
  var zvuky = [], ztlumeno = false;
  try { ztlumeno = localStorage.getItem("vet-zvuky") === "vypnute"; } catch (e) { /* file:// or private mode */ }
  function zvuk(name) {
    if (ztlumeno || !name) return;
    zvuky.push(name);
    try { var a = new Audio("sounds/veterina/" + name + ".mp3"); var pr = a.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) { /* no audio */ }
  }
  function zvukyFor(p) {
    var i = V().pripady.indexOf(p), card = p.nemoc && (D.nemoci.items || []).filter(function (c) { return c.id === p.nemoc; })[0];
    if (p.id === "radza") return { strach: "tygr" };
    if (i < 0) return {};
    return { stul: card && card.badge === "zdrava" ? null : "mnoukani-" + (i % 2 + 1), strach: "syceni", hotovo: "predeni-" + (i % 2 + 1) };
  }
  function zvukButton() {
    var b = el("button", { type: "button", "class": "vet-zvuk", "aria-pressed": String(!ztlumeno) });
    function show() { b.textContent = ztlumeno ? (ui.vetZvukVyp || "🔇 Zvuky vypnuté") : (ui.vetZvukZap || "🔊 Zvuky zapnuté"); b.setAttribute("aria-pressed", String(!ztlumeno)); }
    b.addEventListener("click", function () {
      ztlumeno = !ztlumeno; show();
      try { localStorage.setItem("vet-zvuky", ztlumeno ? "vypnute" : "zapnute"); } catch (e) { /* not kept */ }
    });
    show(); return b;
  }

  // The carrier patients (#113): closed carriers in the waiting room once Rádža is cured; the child chooses one.
  // The order is shuffled once per page load, so the child does not know who is in which carrier.
  var opened = {}, carrierOrder = null;
  function carriers() {
    if (!cured.radza) return [];
    if (!carrierOrder) carrierOrder = shuffle(V().prenosky || []);
    return carrierOrder;
  }
  // The birthday guest (#113): only on the days in narozeniny.dny by the device clock; „#/veterina/ordinace/<id>“ opens
  // it on any day (the hidden test address).
  // Today, or the day in the hidden test address „#/veterina/ordinace?datum=RRRR-MM-DD“ (#118), so every holiday
  // can be seen on any day.
  function dnes() {
    var m = /[?&]datum=(\d{4})-(\d{1,2})-(\d{1,2})/.exec(location.hash);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date();
  }
  // Advent Sundays (#118): the four Sundays before 25 December. Returns 1–4, or 0 on any other day.
  function adventSunday(now) {
    now = now || dnes();
    if (now.getDay() !== 0) return 0;
    var xmas = new Date(now.getFullYear(), 11, 25), fourth = new Date(xmas);
    fourth.setDate(25 - (xmas.getDay() || 7));   // the last Sunday before Christmas Day
    var weeks = Math.round((fourth - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 6048e5);
    return weeks >= 0 && weeks <= 3 ? 4 - weeks : 0;
  }
  // The wreath: own drawing in code (MIT), n candles lit.
  function venec(n) {
    var NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 200 130"); svg.setAttribute("class", "vet-venec-svg"); svg.setAttribute("aria-hidden", "true");
    var h = '<ellipse cx="100" cy="104" rx="88" ry="20" fill="#2f6b3a"/><ellipse cx="100" cy="100" rx="84" ry="18" fill="#3f8a4b"/>' +
      '<g fill="#b5562a">' + [30, 62, 100, 138, 170].map(function (x, i) { return '<circle cx="' + x + '" cy="' + (i % 2 ? 112 : 96) + '" r="5"/>'; }).join("") + '</g>';
    [44, 82, 118, 156].forEach(function (x, i) {
      var lit = i < n, y = i % 2 ? 46 : 40;
      h += '<rect x="' + (x - 9) + '" y="' + y + '" width="18" height="' + (100 - y) + '" rx="4" fill="' + (lit ? "#f3d9e6" : "#e6e1dc") + '" stroke="#2b2420" stroke-width="2.5"/>' +
        '<path d="M' + x + ' ' + y + 'v-6" stroke="#2b2420" stroke-width="2"/>' +
        (lit ? '<path class="vet-plamen" d="M' + x + ' ' + (y - 6) + 'c-7-8 0-16 0-24 7 8 7 16 0 24z" fill="#ffcc3d" stroke="#b5562a" stroke-width="2"/>' : "");
    });
    svg.innerHTML = h;
    return svg;
  }
  function birthdayToday(now) {
    var B = V().narozeniny; now = now || dnes();
    return !!B && B.dny.some(function (d) { return d[0] === now.getMonth() + 1 && d[1] === now.getDate(); });
  }
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
    surprises().forEach(function (z) {
      nodes.push(el("a", { "class": "vet-prekvapeni", href: "#/veterina/ordinace/" + z.id, "data-pacient": z.id }, [
        el("img", { src: "images/veterina/" + z.foto + ".webp", alt: "" }),
        el("span", null, [el("strong", { text: ui.vetPrekvapeni || "Překvapení!" }), document.createTextNode(" " + (ui.vetPrekvapeniText || "")),
          el("span", { "class": "vet-jmeno", text: z.kocka })])]));
    });
    var an = adventSunday(), A = V().advent;
    if (an && A) {
      var tip = A.tipy[an - 1];
      nodes.push(el("section", { "class": "vet-advent", "aria-label": fmt(A.nadpis, { n: an }) }, [venec(an),
        el("div", null, [el("h2", { "class": "card-h", text: fmt(A.nadpis, { n: an }) }),
          el("p", { "class": "card-p", text: fmt(A.text, { svicky: A.svicky[an - 1] }) }),
          el("div", { "class": "nemoc-pozor", role: "note" }, [el("strong", { text: (D.nemoci.labels || {}).pozor || "Pozor!" }),
            document.createTextNode(" " + tip.tema + ": " + tip.text)])])]));
    }
    if (birthdayToday()) {
      var B = V().narozeniny;
      nodes.push(el("a", { "class": "vet-prekvapeni vet-narozeniny", href: "#/veterina/ordinace/" + B.id, "data-pacient": B.id }, [
        el("img", { src: "images/veterina/krabice-dort.svg", alt: "" }),
        el("span", null, [el("strong", { text: B.dlazdice }), el("span", { "class": "vet-jmeno", text: B.kocka })])]));
    }
    var C = carriers();
    if (C.length) {
      nodes.push(el("section", { "class": "vet-prenosky", "aria-label": ui.vetPrenoskyH || "Kdo je v přepravce?" }, [
        el("p", null, [el("strong", { text: (ui.vetPrekvapeni || "Překvapení!") + " " + (ui.vetPrenoskyH || "Kdo je v přepravce?") }),
          document.createTextNode(" " + (ui.vetPrenoskyText || ""))]),
        el("ul", { "class": "vet-cekarna" }, C.map(function (p, i) {
          var n = { n: i + 1 }, open = opened[p.id];
          var a = el("a", { "class": "vet-pacient vet-prenoska" + (open ? " is-open" : "") + (cured[p.id] ? " is-cured" : ""),
            href: "#/veterina/ordinace/" + p.id, "data-pacient": p.id, "aria-label": open ? p.kocka : fmt(ui.vetOtevrit || "Otevřít {n}. přepravku", n) },
            open ? [el("img", { src: "images/veterina/" + p.foto + ".webp", alt: "" }), el("span", { "class": "vet-jmeno", text: p.jmeno }),
                    el("span", { "class": "vet-kocka", text: p.kocka.slice(p.jmeno.length).replace(/^,\s*/, "") }),
                    cured[p.id] ? el("span", { "class": "vet-tlapka", role: "img", "aria-label": ui.vetOsetreno || "ošetřeno", text: "🐾" }) : null]
                 : [el("img", { src: "images/veterina/prepravka.svg", alt: "" }), el("span", { "class": "vet-jmeno", text: fmt(ui.vetPrenoska || "{n}. přepravka", n) })]);
          return el("li", null, [a]);
        }))]));
    }
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
    var B = V().narozeniny;
    if (B && id === B.id) return renderNarozeniny(B);
    var p = findCase(id);
    if (!p) return renderCekarna();
    opened[p.id] = true;
    // The surprise patient's own wording instead of „kočka“ (#104); every other case uses the shared strings.
    var ui = Object.assign({}, D.ui || {}, p.texty || {});
    function vcs(v) { return (p.vysetreniCs || {})[v.id] || v.cs; }   // e.g. „Prohlédnout Rádžu“
    var c = p.nemoc ? card(p.nemoc) : null;   // the surprise patient has no illness card
    var nodes = [back("#/veterina/ordinace", ui.vetDoCekarny || "Zpět do čekárny"), el("h1", { "class": "screen-title", text: p.jmeno })];
    nodes.push(el("div", { "class": "vet-patient" }, [
      el("img", { src: "images/veterina/" + p.foto + ".webp", alt: p.kocka }),
      el("div", null, [el("p", { "class": "vet-kocka-line", text: p.kocka }), el("p", { "class": "vet-pribeh", text: p.pribeh })])]));
    var host = el("div", { "class": "vet-game", "data-case": p.id });
    nodes.push(host);

    // 1. Examinations, in the exam room (#104): put the cat on the table, calm a frightened cat first,
    // then take a tool from the cabinet, the ultrasound from the trolley or carry the cat to the X-ray room.
    var s1 = step(host, ui.vetVysetreni || "Vyšetření", "vet-s-vysetreni");
    var hint = el("p", { "class": "fig-note vet-room-hint", "aria-live": "polite", text: p.naStul || ui.vetNaStul || "" });
    s1.sec.appendChild(hint);
    var results = el("ol", { "class": "vet-nalezy", "aria-live": "polite" });
    var next = el("button", { type: "button", "class": "quiz-next", disabled: "", text: p.vim || ui.vetVim || "Vím, co kočce je →" });
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
    // The cabinet's things live in their own layer: over the cabinet on a big screen, a grid with names under the
    // room on a phone, where the room is too small to tap them (#104).
    var shelf = el("div", { "class": "vet-shelf", role: "group", "aria-label": ui.vetSkrinka || "Skříňka" });
    var tools = [];   // examination buttons: disabled until the cat is on the table (and calm)
    var SHELF = { stetoskop: [0, 0], teplomer: [0, 1], vaha: [0, 2], prohmatat: [0, 3], lupa: [0, 4], otoskop: [0, 5], "krevni-test": [0, 6],
      "test-moci": [0, 7], "barvivo-oko": [0, 8], mikroskop: [0, 9], hrebinek: [1, 0], "uv-lampa": [1, 1] };
    // Ten places a shelf; the treatment things fill the rest of the middle shelf and the bottom one.
    function slot(row, col) { return { left: (19.4 + col * 3.27) + "%", top: (19.8 + row * 16.2) + "%" }; }
    var mode = "exam", treat = null;   // treat: {need, ok, used, done} while the child treats the cat (#104 stage F)
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
      if (v.id === "rentgen") {
        room.classList.remove("is-xray"); void room.offsetWidth; room.classList.add("is-xray");
        // Remove it afterwards, or the trip would replay when the room moves into „Ošetři kočku“.
        clearTimeout(room._xray); room._xray = setTimeout(function () { room.classList.remove("is-xray"); }, 1700);
      }
      else { b.classList.remove("is-used"); void b.offsetWidth; b.classList.add("is-used"); }
      var f = p.nalezy[v.id];
      var li = el("li", { "class": "vet-nalez" + (f ? "" : " is-nic"), "data-nalez": v.id }, [
        el("img", { src: "images/veterina/nastroje/" + v.id + ".svg", alt: "" }),
        el("div", null, [el("strong", { text: vcs(v) }), el("p", { "class": "card-p", text: f || V().nic })])]);
      // The card's own picture (the dental X-ray) goes with the X-ray finding.
      if (v.id === "rentgen" && f && c && c.obrazek) li.lastChild.appendChild(el("img", { "class": "vet-nalez-obr", src: "images/veterina/" + c.obrazek + ".webp",
        alt: (ui.vetObrazky || {})[c.obrazek] || "" }));
      results.appendChild(li);
      next.disabled = false;
      li.scrollIntoView({ block: "nearest" });
    }
    V().vysetreni.forEach(function (v) {
      var where = v.id === "rentgen" ? "vet-t-rentgen" : v.id === "ultrazvuk" ? "vet-t-ultrazvuk" : "vet-t-police";
      var b = el("button", { type: "button", "class": "vet-exam " + where, "data-exam": v.id, "aria-label": vcs(v), title: vcs(v), disabled: "" },
        v.id === "rentgen" ? [] : [el("img", { src: "images/veterina/nastroje/" + v.id + ".svg", alt: "" })]);
      if (SHELF[v.id]) place(b, slot(SHELF[v.id][0], SHELF[v.id][1]));
      b.addEventListener("click", function () { if (mode === "treat") useItem(v.id, b); else examine(v, b); });
      if (SHELF[v.id]) b.appendChild(el("span", { "class": "vet-tool-name", text: vcs(v) }));
      tools.push(b); (SHELF[v.id] ? shelf : room).appendChild(b);
    });
    // The treatment things on the lower shelves: before the diagnosis a tap only says they are for later;
    // in „Ošetři kočku“ the child uses the right ones on the cat.
    (V().lecba || []).forEach(function (t, i) {
      var b = el("button", { type: "button", "class": "vet-lecba", "data-lecba": t.id, "aria-label": t.cs, title: t.cs },
        [el("img", { src: "images/veterina/nastroje/" + t.id + ".svg", alt: "" }), el("span", { "class": "vet-tool-name", text: t.cs })]);
      place(b, i < 8 ? slot(1, 2 + i) : slot(2, i - 8));
      b.addEventListener("click", function () {
        if (mode !== "treat") { hint.textContent = ui.vetLecbaPolice || ""; return; }
        if (t.id === "leky") { toggleDrawer(); return; }   // „Léky“ opens the drawer with the kinds of medicine
        useItem(t.id, b);
      });
      shelf.appendChild(b);
    });
    // The medicine drawer: the kinds of medicine, never a medicine name.
    var drawer = el("div", { "class": "vet-leky", role: "group", "aria-label": ui.vetLekyH || "Léky", hidden: "" }, [
      el("div", { "class": "vet-leky-head" }, [el("strong", { text: ui.vetLekyH || "Léky" })])]);
    var close = el("button", { type: "button", "class": "vet-leky-zavrit", "aria-label": ui.vetZavrit || "Zavřít", text: "✕" });
    close.addEventListener("click", function () { toggleDrawer(false); });
    drawer.firstChild.appendChild(close);
    var lekList = el("ul", { "class": "vet-leky-list" });
    (V().leky || []).forEach(function (t) {
      var b = el("button", { type: "button", "class": "vet-lek", "data-lek": t.id }, [
        el("img", { src: "images/veterina/nastroje/" + t.id + ".svg", alt: "" }), el("span", { text: t.cs })]);
      b.addEventListener("click", function () { useItem(t.id, b); });
      lekList.appendChild(el("li", null, [b]));
    });
    drawer.appendChild(lekList);
    shelf.appendChild(drawer);
    function toggleDrawer(open) {
      var show = open === undefined ? drawer.hidden : open;
      drawer.hidden = !show;
      if (show) { var f = drawer.querySelector(".vet-lek"); if (f) f.focus(); }
    }
    function useItem(id, b) {
      if (!treat || treat.done) return;
      if (treat.ok.indexOf(id) < 0) { treat.say(ui.vetNepomuze || "Tohle teď kočce nepomůže.", false); return; }
      if (treat.used.indexOf(id) >= 0) return;
      treat.used.push(id); b.classList.add("is-applied"); b.classList.remove("is-used"); void b.offsetWidth; b.classList.add("is-used");
      room.classList.remove("is-treated"); void room.offsetWidth; room.classList.add("is-treated");
      clearTimeout(room._glow); room._glow = setTimeout(function () { room.classList.remove("is-treated"); }, 1100);
      var left = treat.need.filter(function (x) { return treat.used.indexOf(x) < 0; });
      if (left.length) { treat.say(ui.vetChybi || "Správně! Ještě něco chybí.", true); return; }
      treat.done = true; treat.say(ui.vetOsetrenaHotovo || "Hotovo, kočka je ošetřená.", true); treat.finish();
    }
    // The frightened patient (#104 stage C): the signs, the photo and the safe first step.
    var S = V().strach, Z = zvukyFor(p);
    function scared() {
      var box = el("section", { "class": "vet-strach", role: "region", "aria-label": ui.vetStrachH || "Pozor, kočka se bojí!" }, [
        el("h3", { "class": "card-h", text: ui.vetStrachH || "Pozor, kočka se bojí!" }),
        el("div", { "class": "vet-strach-row" }, [
          el("img", { src: "images/veterina/" + (p.strachFoto || S.foto) + ".webp", alt: p.strachFoto ? p.strach : (ui.vetStrachFoto || "") }),
          el("div", null, [el("p", { "class": "card-p vet-strach-znaky", text: p.strach }), p.strachSpravne ? null : el("p", { "class": "card-p", text: S.jak }),
            el("p", { "class": "card-p vet-strach-otazka", text: p.strachOtazka || S.otazka })])])]);
      s1.sec.insertBefore(box, results.previousSibling);
      var right = p.strachSpravne || S.spravne;   // a tiger cub is never handled like a pet cat
      var opts = [{ key: "spravne", text: right.text, right: true, why: right.proc }].concat((p.strachSpatne || S.spatne).map(function (w, i) {
        return { key: "strach-" + i, text: w.text, right: false, why: w.proc }; }));
      choice(box, opts, function () {
        calm = true; room.classList.remove("is-scared"); setTools();
        if (!p.strachSpravne) box.appendChild(el("div", { "class": "nemoc-pozor", role: "note" }, [document.createTextNode(S.doma)]));
        hint.textContent = ui.vetNastroje || "";
      });
    }
    function putOnTable() {
      if (onTable) return;
      onTable = true; room.classList.add("is-on-table"); cat.disabled = true;
      cat.setAttribute("aria-label", p.jmeno);
      if (p.strach) { room.classList.add("is-scared"); hint.textContent = ui.vetStrachHint || ""; scared(); zvuk(Z.strach); }
      else { hint.textContent = ui.vetNastroje || ""; zvuk(Z.stul); }
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
    var wrap = el("div", { "class": "vet-room-wrap" }, [room, shelf]);
    s1.sec.appendChild(el("div", { "class": "vet-zvuk-row" }, [zvukButton()]));
    s1.sec.appendChild(wrap);
    s1.sec.appendChild(el("h3", { "class": "card-h", text: ui.vetVysledky || "Výsledky vyšetření" }));
    s1.sec.appendChild(results);
    s1.sec.appendChild(next);

    // End, after the treatment (or straight after „Co pomůže?“ for a healthy cat)
    function finish() {
      cured[p.id] = true; zvuk(Z.hotovo);
      var s4 = step(host, p.hotovo || ui.vetHotovo || "Výborně! Víš, co kočce je i co jí pomůže.", "vet-s-konec");
      if (p.pozor) s4.sec.appendChild(el("div", { "class": "nemoc-pozor", role: "note" }, [
        el("strong", { text: (D.nemoci.labels || {}).pozor || "Pozor!" }), document.createTextNode(" " + p.pozor)]));
      if (c) s4.sec.appendChild(el("p", null, [el("a", { "class": "part-link", href: "#/veterina/nemoci/" + p.nemoc, "data-karta": p.nemoc,
        text: fmt(ui.readCard || "Přečti si kartičku: {name} →", { name: c.cs }) })]));
      var dalsi = el("button", { type: "button", "class": "quiz-open vet-dalsi", text: ui.vetDalsi || "Další pacient" });
      dalsi.addEventListener("click", function () { goRandom(p.id); });
      s4.sec.appendChild(el("div", { "class": "quiz-actions" }, [dalsi,
        el("a", { "class": "quiz-open quiz-secondary", href: "#/veterina/ordinace", text: ui.vetDoCekarny || "Zpět do čekárny" })]));
      s4.focus();
    }
    // Treat the cat (#104 stage F): the room moves down here; use every needed thing on the cat.
    function treatThenFinish() {
      var need = p.osetreni || [], also = p.osetreniNavic || [];
      if (!need.length && !also.length) { finish(); return; }   // a healthy cat needs no treatment
      var s5 = step(host, p.osetriNadpis || ui.vetOsetri || "Ošetři kočku", "vet-s-osetri");
      var say = el("p", { "class": "fig-note vet-room-hint", "aria-live": "polite", text: ui.vetOsetriIntro || "" });
      s5.sec.appendChild(say);
      s5.sec.appendChild(wrap);
      mode = "treat";
      treat = { need: need, ok: need.concat(also), used: [], done: false,
        say: function (t, ok) { say.textContent = t; say.classList.toggle("is-wrong", !ok); },
        finish: finish };
      s5.focus();
    }

    next.addEventListener("click", function () {
      next.hidden = true;
      if (p.potrebuje) {
        // The surprise patient is healthy: „Co Rádža potřebuje?“ instead of a diagnosis and a treatment
        var sz = step(host, p.otazka, "vet-s-coje");
        choice(sz.sec, [{ key: "potrebuje", text: p.potrebuje.text, right: true, why: p.potrebuje.proc }].concat(p.spatne.map(function (w, i) {
          return { key: "spatne-" + i, text: w.text, right: false, why: w.proc }; })), treatThenFinish);
        sz.focus();
        return;
      }
      // 2. Diagnosis
      var s2 = step(host, ui.vetCoJe || "Co kočce je?", "vet-s-coje");
      choice(s2.sec, p.moznosti.map(function (m) { return { key: m, text: card(m).cs, right: m === p.nemoc, why: m === p.nemoc ? "" : p.proc[m] }; }), function () {
        // 3. Treatment
        var s3 = step(host, ui.vetCoPomuze || "Co pomůže?", "vet-s-pomuze");
        var opts = [{ key: "lecba", text: p.lecba, right: true, why: "" }].concat(p.spatne.map(function (w, i) { return { key: "spatne-" + i, text: w.text, right: false, why: w.proc }; }));
        choice(s3.sec, opts, treatThenFinish);
        s3.focus();
      });
      s2.focus();
    });
    return nodes;
  }

  // The birthday guest (#113): put the cat on the table, open the box, the cake and „Všechno nejlepší!“.
  function renderNarozeniny(B) {
    var nodes = [back("#/veterina/ordinace", ui.vetDoCekarny || "Zpět do čekárny"), el("h1", { "class": "screen-title", text: B.jmeno })];
    nodes.push(el("div", { "class": "vet-patient" }, [
      el("img", { src: "images/veterina/" + B.foto + ".webp", alt: B.kocka }),
      el("div", null, [el("p", { "class": "vet-kocka-line", text: B.kocka }), el("p", { "class": "vet-pribeh", text: B.pribeh })])]));
    var host = el("div", { "class": "vet-game", "data-case": B.id });
    nodes.push(host);
    var s1 = step(host, ui.vetPrekvapeni || "Překvapení!", "vet-s-narozeniny");
    var hint = el("p", { "class": "fig-note vet-room-hint", "aria-live": "polite", text: B.naStul });
    s1.sec.appendChild(hint);
    var room = el("div", { "class": "vet-room vet-room-oslava", role: "group", "aria-label": ui.vetOrdinace || "Ordinace" });
    room.appendChild(el("img", { "class": "vet-room-bg", src: "images/veterina/ordinace.svg", alt: "" }));
    var table = el("button", { type: "button", "class": "vet-table", "aria-label": ui.vetStul || "Vyšetřovací stůl" });
    var cat = el("button", { type: "button", "class": "vet-cat", "aria-label": B.naStul }, [
      el("img", { src: "images/veterina/vyrezy/" + B.id + ".webp", alt: "", draggable: "false" })]);
    var box = el("button", { type: "button", "class": "vet-krabice", "aria-label": ui.vetKrabice || "Otevřít krabici", disabled: "" }, [
      el("img", { src: "images/veterina/krabice-dort.svg", alt: "", draggable: "false" })]);
    room.appendChild(table); room.appendChild(cat); room.appendChild(box);
    s1.sec.appendChild(el("div", { "class": "vet-zvuk-row" }, [zvukButton()]));
    s1.sec.appendChild(el("div", { "class": "vet-room-wrap" }, [room]));
    var onTable = false, done = false;
    function putOnTable() {
      if (onTable) return;
      onTable = true; room.classList.add("is-on-table"); cat.disabled = true; cat.setAttribute("aria-label", B.jmeno);
      box.disabled = false; box.focus({ preventScroll: true });
    }
    function openBox() {
      if (!onTable || done) return;
      done = true; room.classList.add("is-open"); box.disabled = true; zvuk("predeni-2");
      box.firstChild.src = "images/veterina/dort.svg"; box.setAttribute("aria-label", B.hotovo);
      var s2 = step(host, B.hotovo, "vet-s-konec");
      s2.sec.appendChild(el("div", { "class": "nemoc-pozor", role: "note" }, [
        el("strong", { text: (D.nemoci.labels || {}).pozor || "Pozor!" }), document.createTextNode(" " + B.pozor)]));
      s2.sec.appendChild(el("div", { "class": "quiz-actions" }, [
        el("a", { "class": "quiz-open", href: "#/veterina/ordinace", text: ui.vetDoCekarny || "Zpět do čekárny" })]));
      s2.focus();
    }
    // Tap or drag: the cat onto the table, then the box open.
    function draggable(n, act) {
      var drag = null;
      n.addEventListener("pointerdown", function (e) { if (n.disabled) return; drag = { x: e.clientX, y: e.clientY }; n.setPointerCapture(e.pointerId); });
      n.addEventListener("pointermove", function (e) { if (drag) n.style.transform = "translate(" + (e.clientX - drag.x) + "px," + (e.clientY - drag.y) + "px)"; });
      n.addEventListener("pointerup", function () { if (!drag) return; drag = null; n.style.transform = ""; act(); });
      n.addEventListener("click", function (e) { if (e.detail === 0) act(); });   // keyboard
    }
    draggable(cat, putOnTable); draggable(box, openBox);
    table.addEventListener("click", putOnTable);
    return nodes;
  }

  function render(sub, sub2) {
    if (sub === "nemoci") return renderNemoci(sub2);
    if (sub === "ordinace") return sub2 ? renderPripad(sub2) : renderCekarna();
    return renderStart();
  }

  window.Veterina = { render: render, cured: cured, birthdayToday: birthdayToday, adventSunday: adventSunday, zvuky: zvuky };
})();
