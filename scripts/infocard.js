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
 *   open(content, id, { hint })   content = "kostra" | "vnejsi" | "organy" | "svaly" | "smysly"
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
    opener = document.activeElement;
    d.textContent = "";
    d.setAttribute("data-id", id); d.setAttribute("data-mode", opts.hint ? "hint" : "card");
    var x = el("button", { type: "button", "class": "card-close", "aria-label": ui.close || "Zavřít", text: "×" });
    x.addEventListener("click", close);
    var box = el("div", { "class": "atlas-card info-card" }, [el("div", { "class": "card-head" }, [
      el("h2", { "class": "card-title", id: "info-title", text: it.cs }), x])]);
    if (opts.hint) box.insertBefore(el("p", { "class": "card-badge info-badge", text: ui.hintBadge || "Nápověda" }), box.firstChild);
    if (latinOn() && it.la) box.appendChild(el("p", { "class": "card-latin", lang: "la", text: it.la }));
    [["kdeJe", ui.kdeJe || "Kde je?"], ["coDela", ui.coDela || "Co dělá?"], ["zajimavost", ui.zajimavost || "Zajímavost"]].forEach(function (f) {
      if (!it[f[0]]) return;
      box.appendChild(el("h3", { "class": "card-h", text: f[1] }));
      box.appendChild(el("p", { "class": "card-p", text: it[f[0]] }));
    });
    var ok = el("button", { type: "button", "class": "info-ok", text: ui.close || "Zavřít" });
    ok.addEventListener("click", close);
    box.appendChild(el("div", { "class": "quiz-actions" }, [ok]));
    d.appendChild(box);
    if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
    ok.focus();
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
