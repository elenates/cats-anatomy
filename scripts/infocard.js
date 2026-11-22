/*
 * Info card in a pop-up, for the games: the structure's usual card (Kde je? / Co dělá? / Zajímavost) over the
 * game, so the round is not lost. Used two ways:
 *   - hint ("Nápověda") on the question screen: the whole card, which the child can open before answering
 *     (Lenka, 2026-11-20). opts.onOpen is called when it opens: the games then do not count that question
 *     as right on the first try;
 *   - "Přečti si kartičku: … →" after an answer (right or wrong): the full card.
 * Latinsky follows the atlas switch (same stored setting). Escape or "Zavřít" closes it; focus returns.
 *
 * Public API (window.InfoCard):
 *   open(content, id, { hint, back })   content = "kostra" | "vnejsi" | "organy" | "svaly" | "smysly" | "clovek" | "nemoci"
 *                                  ("nemoci": a Kočičí nemoci card; back = {content, id}: a button back to that card)
 *   hintButton(content, id, { onOpen })  button "💡 Nápověda"
 *   hintIcon(content, id, { onOpen, done })  small 💡 button for a list item (labelled "Nápověda: <name>");
 *                                        done(id) true = already answered: the card without the hint badge
 *   moreButton(content, id, opts)        button "Přečti si kartičku: <name> →"
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
  function fmt(s, v) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return v[k]; }); }
  function find(content, id) {
    var list = (D[content] && D[content].items) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function latinOn() {
    try { return !!JSON.parse(window.localStorage.getItem("atlas.toggles") || "{}").latinsky; } catch (e) { return false; }
  }

  var dialog = null, opener = null;
  function close() {
    if (!dialog) return;
    if (dialog.close && dialog.open) dialog.close(); else dialog.removeAttribute("open");
  }
  function ensure() {
    if (dialog) return dialog;
    dialog = el("dialog", { "class": "info-dialog", "aria-labelledby": "info-title" });
    dialog.addEventListener("close", function () { if (opener && document.body.contains(opener)) opener.focus(); });
    // A click on the dark backdrop (outside the card) closes it.
    dialog.addEventListener("click", function (e) { if (e.target === dialog) close(); });
    document.body.appendChild(dialog);
    return dialog;
  }

  function open(content, id, opts) {
    opts = opts || {};
    var it = find(content, id); if (!it) return;
    var d = ensure();
    if (!d.open) opener = document.activeElement;   // a card opened from inside the pop-up keeps the first opener
    d.textContent = "";
    d.setAttribute("data-id", id); d.setAttribute("data-mode", opts.hint ? "hint" : "card");
    var x = el("button", { type: "button", "class": "card-close", "aria-label": ui.close || "Zavřít", text: "×" });
    x.addEventListener("click", close);
    var box = el("div", { "class": "atlas-card info-card" }, [el("div", { "class": "card-head" }, [
      el("h2", { "class": "card-title", id: "info-title", text: it.cs }), x])]);
    if (opts.hint) box.insertBefore(el("p", { "class": "card-badge info-badge", text: ui.hintBadge || "Nápověda" }), box.firstChild);
    if (opts.back) {   // a body part opened from an illness card: a way back to it
      var bk = find(opts.back.content, opts.back.id);
      var bb = el("button", { type: "button", "class": "part-link card-back", "data-back": opts.back.id,
        text: "← " + fmt(ui.vetCardBack || "Zpět na: {name}", { name: bk ? bk.cs : opts.back.id }) });
      bb.addEventListener("click", function () { open(opts.back.content, opts.back.id); });
      box.insertBefore(bb, box.firstChild);
    }
    if (content === "nemoci") { nemoc(box, it, id); finish(d, box); return; }
    if (latinOn() && it.la) box.appendChild(el("p", { "class": "card-latin", lang: "la", text: it.la }));
    // Kočka a člověk items have "srovnani" instead of "coDela" / "zajimavost", and their own "Kde je" heading.
    var human = content === "clovek";
    [["kdeJe", human ? (ui.clovekKdeJe || "Kde ji najdeš u člověka?") : (ui.kdeJe || "Kde je?")], ["coDela", ui.coDela || "Co dělá?"],
     ["zajimavost", ui.zajimavost || "Zajímavost"], ["srovnani", ui.clovekSrovnani || "Kočka a člověk"]].forEach(function (f) {
      if (!it[f[0]]) return;
      box.appendChild(el("h3", { "class": "card-h", text: f[1] }));
      box.appendChild(el("p", { "class": "card-p", text: it[f[0]] }));
    });
    finish(d, box);
  }
  function finish(d, box) {
    var ok = el("button", { type: "button", "class": "info-ok", text: ui.close || "Zavřít" });
    ok.addEventListener("click", close);
    box.appendChild(el("div", { "class": "quiz-actions" }, [ok]));
    d.appendChild(box);
    if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
    d.scrollTop = 0;
    ok.focus({ preventScroll: true });
  }

  // Kočičí nemoci card (#73): badge, the five headings, Pozor!, picture, gallery X-ray, body parts.
  function nemoc(box, it, id) {
    var N = D.nemoci || {}, L = N.labels || {};
    box.insertBefore(el("p", { "class": "card-badge badge-" + it.badge, text: (N.badges || {})[it.badge] }), box.querySelector(".card-head").nextSibling);
    ["coToJe", "jakToPoznas", "jakToVetZjisti", "coPomuze", "jakTomuPredejit"].forEach(function (k) {
      box.appendChild(el("h3", { "class": "card-h", text: L[k] }));
      box.appendChild(el("p", { "class": "card-p", text: it[k] }));
    });
    if (it.pozor) box.appendChild(el("div", { "class": "nemoc-pozor", role: "note" }, [
      el("strong", { text: L.pozor || "Pozor!" }), document.createTextNode(" " + it.pozor)]));
    if (it.obrazek) {
      var cap = (ui.vetObrazky || {})[it.obrazek] || "";
      box.appendChild(el("figure", { "class": "nemoc-obrazek" }, [
        el("img", { src: "images/veterina/" + it.obrazek + ".webp", alt: cap }), cap ? el("figcaption", { text: cap }) : null]));
    }
    var links = [];
    if (it.rentgen) {
      var a = el("a", { "class": "part-link", href: "#/rentgen/zajimave/" + it.rentgen, "data-rentgen": it.rentgen, text: ui.vetRentgen || "Podívej se na rentgen →" });
      a.addEventListener("click", close);
      links.push(a);
    }
    if (links.length) box.appendChild(el("div", { "class": "quiz-actions" }, links));
    if (it.telo && it.telo.length) {
      box.appendChild(el("h3", { "class": "card-h", text: ui.vetTelo || "Kde to je v těle?" }));
      box.appendChild(el("ul", { "class": "part-nav" }, it.telo.map(function (t) {
        var part = find(t.content, t.id);
        var b = el("button", { type: "button", "class": "part-link", "data-telo": t.content + "/" + t.id, text: part ? part.cs : t.id });
        b.addEventListener("click", function () { open(t.content, t.id, { back: { content: "nemoci", id: id } }); });
        return el("li", null, [b]);
      })));
    }
  }

  function hintButton(content, id, opts) {
    var b = el("button", { type: "button", "class": "hint-btn", "data-hint": id, text: "💡 " + (ui.hint || "Nápověda") });
    b.addEventListener("click", function () {
      if (opts && opts.onOpen) opts.onOpen(id);
      open(content, id, { hint: true });
    });
    return b;
  }
  function hintIcon(content, id, opts) {
    var it = find(content, id);
    var b = el("button", { type: "button", "class": "hint-icon", "data-hint": id, text: "💡",
      "aria-label": fmt(ui.hintFor || "Nápověda: {name}", { name: it ? it.cs : id }), title: ui.hint || "Nápověda" });
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      if (opts && opts.onOpen) opts.onOpen(id);
      open(content, id, { hint: !(opts && opts.done && opts.done(id)) });
    });
    return b;
  }
  function moreButton(content, id, opts) {
    var it = find(content, id); if (!it) return null;
    var b = el("button", { type: "button", "class": "part-link more-btn", "data-more": id, text: fmt(ui.readCard || "Přečti si kartičku: {name} →", { name: it.cs }) });
    b.addEventListener("click", function () { open(content, id, opts); });
    return b;
  }

  window.InfoCard = { open: open, close: close, hintButton: hintButton, hintIcon: hintIcon, moreButton: moreButton, find: find };
})();
