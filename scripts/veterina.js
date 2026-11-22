/*
 * Na veterině (#73): the vet section.
 *
 * Routes (scripts/app.js calls Veterina.render(sub, sub2)):
 *   #/veterina                  the section start: Ordinace (the game, stage 4c) and Kočičí nemoci
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
    // Ordinace (the game) comes in stage 4c; until then it is shown like a section that is not ready yet.
    list.appendChild(el("li", null, [el("div", { "class": "menu-card is-soon", "aria-disabled": "true",
      "aria-label": (ui.vetOrdinace || "Ordinace") + " – " + (ui.soon || "Připravujeme") }, [
      el("span", { "class": "menu-icon", "aria-hidden": "true", text: "🩺" }),
      el("span", { "class": "menu-label", text: ui.vetOrdinace || "Ordinace" }),
      el("span", { "class": "menu-badge", text: ui.soon || "Připravujeme" })])]));
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

  function render(sub, sub2) {
    if (sub === "nemoci") return renderNemoci(sub2);
    return renderStart();
  }

  window.Veterina = { render: render };
})();
