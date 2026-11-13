/*
 * App shell: hash-based routing and screen rendering.
 *
 * Routes:
 *   #/          -> main menu (7 sections)
 *   #/kostra    -> Kostra section (placeholder until the atlas UI, stage 5)
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

  function renderSection(section) {
    var back = el("a", { "class": "back-link", href: "#/", text: "← " + ui.back });
    var title = el("h1", { "class": "screen-title", text: section.cs });
    var note = el("p", { "class": "placeholder", text: ui.kostraPlaceholder });
    return [back, title, note];
  }

  function render() {
    var id = location.hash.replace(/^#\/?/, "");
    var section = findSection(id);
    var nodes = (section && section.status === "active") ? renderSection(section) : renderMenu();

    app.textContent = "";
    nodes.forEach(function (n) { app.appendChild(n); });

    // Move focus to the new screen so keyboard and screen-reader users start at the top.
    if (id) app.focus();
  }

  window.addEventListener("hashchange", render);
  render();
})();
