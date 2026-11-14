/*
 * App shell: hash-based routing and screen rendering.
 *
 * Routes:
 *   #/          -> main menu (7 sections)
 *   #/kostra       -> Kostra atlas (scripts/atlas.js)
 *   #/kostra/kviz  -> quiz "Najdi kost nebo orgán" (scripts/quiz.js)
 *   #/kostra/<part>[/<n>] -> part screen, figure tab n (ATLAS_DATA.kostraViews)
 *
 * Hash routing is used because it works both on GitHub Pages and from file://.
 */
(function () {
  "use strict";

  var data = window.ATLAS_DATA || {};
  var sections = data.sections || [];
  var ui = data.ui || {};
  var app = document.getElementById("app");

  /* Small helper to create elements without innerHTML (safe for text content). */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === "text") node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key]);
      });
    }
    (children || []).forEach(function (child) { node.appendChild(child); });
    return node;
  }

  function findSection(id) {
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].id === id) return sections[i];
    }
    return null;
  }

  function renderMenu() {
    var list = el("ul", { "class": "menu" });

    sections.forEach(function (s) {
      var icon = el("span", { "class": "menu-icon", "aria-hidden": "true", text: s.icon });
      var label = el("span", { "class": "menu-label", text: s.cs });
      var item;

      if (s.status === "active") {
        item = el("a", { "class": "menu-card", href: "#/" + s.id }, [icon, label]);
      } else {
        // Inactive sections are not links: visible but not focusable or clickable.
        var badge = el("span", { "class": "menu-badge", text: ui.soon });
        item = el("div", {
          "class": "menu-card is-soon",
          "aria-disabled": "true",
          "aria-label": s.cs + " – " + ui.soon
        }, [icon, label, badge]);
      }
      list.appendChild(el("li", null, [item]));
    });

    return [el("h1", { "class": "screen-title", text: ui.menuHeading }), list];
  }

  function renderSection(section, sub, sub2) {
    var back = el("a", { "class": "back-link", href: "#/", text: "← " + ui.back });
    var title = el("h1", { "class": "screen-title", text: section.cs });
    if (section.id === "kostra" && sub === "kviz" && window.Quiz) {
      var qback = el("a", { "class": "back-link", href: "#/kostra", text: "← " + (ui.quizBack || "Zpět na kostru") });
      var qhost = el("div", { "class": "atlas quiz" });
      qhost._mount = function () { window.Quiz.mount(qhost, { figure: "skeleton", layer: "kosti", rounds: 10 }); };
      return [qback, el("h1", { "class": "screen-title", text: ui.quizTitle || "Kvíz" }), qhost];
    }
    var views = data.kostraViews || {};
    if (section.id === "kostra" && views[sub] && window.Atlas) return renderPart(sub, parseInt(sub2, 10) || 1);
    if (section.id === "kostra" && window.Atlas) {
      var host = el("div", { "class": "atlas" });
      var quizLink = el("a", { "class": "quiz-open", href: "#/kostra/kviz", text: ui.quizOpen || "Hrát kvíz" });
      title = el("div", { "class": "screen-head" }, [title, quizLink]);
      // The atlas measures text and the figure width, so it is mounted after insertion.
      host._mount = function () { window.Atlas.mount(host, { figure: "skeleton" }); };
      return [back, title, partNav(), host];
    }
    var note = el("p", { "class": "placeholder", text: ui.kostraPlaceholder });
    return [back, title, note];
  }

  /* Links to the five Kostra part screens (on the overview). */
  function partNav() {
    var parts = (data.kostra && data.kostra.parts) || [];
    var list = el("ul", { "class": "part-nav" });
    parts.forEach(function (p) {
      if (!(data.kostraViews || {})[p.id]) return;
      list.appendChild(el("li", null, [el("a", { "class": "part-link", href: "#/kostra/" + p.id, text: p.cs })]));
    });
    return el("nav", { "class": "parts", "aria-label": ui.partsHeading || "Části kostry" }, [
      el("h2", { "class": "parts-h", text: ui.partsHeading || "Části kostry" }), list]);
  }

  /* Part screen: tabs for its figures, atlas showing only this part. */
  function renderPart(partId, n) {
    var parts = (data.kostra && data.kostra.parts) || [];
    var part = parts.filter(function (p) { return p.id === partId; })[0] || { cs: partId };
    var tabs = data.kostraViews[partId];
    if (n < 1 || n > tabs.length) n = 1;
    var view = tabs[n - 1];
    var back = el("a", { "class": "back-link", href: "#/kostra", text: "← " + (ui.partBack || "Zpět na celou kostru") });
    var title = el("h1", { "class": "screen-title", text: part.cs });
    var nodes = [back, title];
    if (tabs.length > 1) {
      var tabList = el("ul", { "class": "fig-tabs" });
      tabs.forEach(function (t, i) {
        var a = el("a", { "class": "fig-tab", href: "#/kostra/" + partId + "/" + (i + 1), text: t.cs });
        if (i === n - 1) a.setAttribute("aria-current", "page");
        tabList.appendChild(el("li", null, [a]));
      });
      nodes.push(el("nav", { "class": "fig-nav", "aria-label": ui.partFiguresLabel || "Obrázky" }, [tabList]));
    }
    var host = el("div", { "class": "atlas" });
    host._mount = function () { window.Atlas.mount(host, { figure: view.figure, part: partId, layers: view.layers }); };
    nodes.push(host);
    return nodes;
  }

  function render() {
    var path = location.hash.replace(/^#\/?/, "").split("/");
    var id = path[0], sub = path[1] || "";
    var section = findSection(id);
    var nodes = (section && section.status === "active") ? renderSection(section, sub, path[2]) : renderMenu();

    app.textContent = "";
    nodes.forEach(function (n) { app.appendChild(n); });
    nodes.forEach(function (n) { if (n._mount) n._mount(); });

    // Move focus to the new screen so keyboard and screen-reader users start at the top.
    if (id) app.focus();
  }

  window.addEventListener("hashchange", render);
  render();
})();
