/* ==========================================================================
   BLEU BLANC COUTURE — main.js
   Shared behaviour for every page. Each module is self-guarding: if its
   markup isn't on the current page it silently does nothing, so any page can
   load this single file with zero console errors.

   Modules
   01. boot            — flag JS, run on load
   02. announceBar     — dismissible top bar (remembers within session)
   03. header          — scroll state + colour flip
   04. mobileMenu      — fullscreen overlay + iOS-safe scroll lock
   05. reveal          — IntersectionObserver fade-up
   06. typewriter      — manifesto character-by-character
   07. pageTransition  — cinematic cream fade on internal navigation
   08. newsletter      — graceful fake submit
   09. catalogue       — filter + sort + load more   (catalogue.html)
   10. product         — gallery, size, quantity      (produit.html)
   11. accordion       — FAQ / product accordions      (faq.html, produit.html)
   ========================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };


  /* ----------------------------------------------------------------------
     02. ANNOUNCEMENT BAR
     ---------------------------------------------------------------------- */
  function announceBar() {
    var bar = $(".announce");
    if (!bar) return;
    var close = $(".announce__close", bar);

    if (sessionStorage.getItem("bbc-announce-closed") === "1") {
      document.body.classList.add("announce-hidden");
    }
    if (close) {
      close.addEventListener("click", function () {
        document.body.classList.add("announce-hidden");
        try { sessionStorage.setItem("bbc-announce-closed", "1"); } catch (e) {}
      });
    }
  }


  /* ----------------------------------------------------------------------
     03. HEADER — toggle solid/cream state past a small scroll threshold
     ---------------------------------------------------------------------- */
  function header() {
    var head = $(".site-header");
    if (!head) return;
    // Inner pages opt into a permanently solid header.
    if (head.classList.contains("header-solid")) return;

    var ticking = false;
    function update() {
      head.classList.toggle("scrolled", window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }


  /* ----------------------------------------------------------------------
     04. MOBILE MENU — overlay + body scroll lock (position:fixed for iOS)
     ---------------------------------------------------------------------- */
  function mobileMenu() {
    var burger = $(".nav__burger");
    var menu   = $(".mobile-menu");
    if (!burger || !menu) return;
    var closeBtn = $(".mobile-menu__close", menu);
    var scrollY = 0;

    function lock() {
      scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = "-" + scrollY + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }
    function unlock() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
    function open() {
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      lock();
    }
    function close() {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      unlock();
    }

    burger.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    $$(".mobile-menu__link", menu).forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) close();
    });
  }


  /* ----------------------------------------------------------------------
     05. REVEAL — fade up on scroll
     ---------------------------------------------------------------------- */
  function reveal() {
    var els = $$(".reveal");
    if (!els.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    els.forEach(function (el) { io.observe(el); });
  }


  /* ----------------------------------------------------------------------
     06. TYPEWRITER — manifesto, periods rendered in gold
     ---------------------------------------------------------------------- */
  function typewriter() {
    var live = $(".manifeste__live");
    if (!live) return;

    var text = (live.textContent || "").trim();
    if (!text) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      live.innerHTML = renderTyped(text, text.length);
      return;
    }

    var started = false;
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) {
          started = true;
          obs.unobserve(entry.target);
          runType(live, text);
        }
      });
    }, { threshold: 0.4 });
    io.observe(live);
  }

  function escapeChar(c) {
    if (c === "&") return "&amp;";
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    return c;
  }
  // Build the markup for the first n characters; periods get the gold class.
  function renderTyped(text, n) {
    var out = "";
    for (var i = 0; i < n; i++) {
      var c = text.charAt(i);
      out += c === "." ? '<span class="dot">.</span>' : escapeChar(c);
    }
    return out;
  }
  function runType(el, text) {
    var i = 0;
    var caret = '<span class="caret" aria-hidden="true"></span>';
    (function step() {
      i++;
      el.innerHTML = renderTyped(text, i) + (i < text.length ? caret : "");
      if (i < text.length) {
        setTimeout(step, 30); // 30ms per character
      } else {
        setTimeout(function () { el.innerHTML = renderTyped(text, text.length); }, 900);
      }
    })();
  }


  /* ----------------------------------------------------------------------
     07. PAGE TRANSITION — brief cream fade before internal navigation
     ---------------------------------------------------------------------- */
  function pageTransition() {
    var overlay = $(".page-transition");
    if (!overlay || prefersReduced) return;

    function isInternal(a) {
      if (!a) return false;
      if (a.target === "_blank" || a.hasAttribute("download")) return false;
      if (a.dataset.noTransition !== undefined) return false;
      var href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#") return false;
      if (/^(mailto:|tel:|https?:)/i.test(href)) {
        // allow same-origin absolute links, block external
        return a.hostname === window.location.hostname;
      }
      return true; // relative .html links
    }

    document.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var a = e.target.closest && e.target.closest("a");
      if (!isInternal(a)) return;
      var url = a.href;
      if (url === window.location.href) return;
      e.preventDefault();
      overlay.classList.add("is-active");
      setTimeout(function () { window.location.href = url; }, 300);
    });

    // Returning via back/forward (bfcache) — make sure overlay is clear.
    window.addEventListener("pageshow", function () {
      overlay.classList.remove("is-active");
    });
  }


  /* ----------------------------------------------------------------------
     08. NEWSLETTER / SIMPLE FORMS — graceful fake submit for the mockup
     ---------------------------------------------------------------------- */
  function forms() {
    $$("[data-fakeform]").forEach(function (form) {
      var msg = $(".form-msg", form) || form.parentNode.querySelector(".form-msg");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"], input[type="text"], input');
        var ok = !input || input.value.trim() !== "";
        if (!ok) {
          if (msg) msg.textContent = "Merci d’indiquer votre adresse e-mail.";
          if (input) input.focus();
          return;
        }
        if (msg) msg.textContent = form.getAttribute("data-success") || "Merci — vous êtes des nôtres.";
        form.reset();
      });
    });
  }


  /* ----------------------------------------------------------------------
     09. CATALOGUE — filters, sort, load more  (only on catalogue.html)
     ---------------------------------------------------------------------- */
  function catalogue() {
    var grid = $("[data-catalogue]");
    if (!grid) return;

    var cards = $$(".product-card", grid);
    var countEl = $("[data-count]");
    var filterInputs = $$("[data-filter]");
    var sortSelect = $("[data-sort]");
    var loadMoreBtn = $("[data-loadmore]");
    var perPage = 9;
    var shown = perPage;

    function activeFilters() {
      var groups = {};
      filterInputs.forEach(function (input) {
        if (!input.checked) return;
        var group = input.getAttribute("data-filter");
        (groups[group] = groups[group] || []).push(input.value);
      });
      return groups;
    }

    function matches(card, groups) {
      return Object.keys(groups).every(function (group) {
        var vals = groups[group];
        if (!vals.length) return true;
        var attr = (card.getAttribute("data-" + group) || "").split("|");
        return vals.some(function (v) { return attr.indexOf(v) !== -1; });
      });
    }

    function apply() {
      var groups = activeFilters();
      var visible = cards.filter(function (card) { return matches(card, groups); });

      cards.forEach(function (card) { card.classList.add("is-hidden"); });
      visible.slice(0, shown).forEach(function (card) { card.classList.remove("is-hidden"); });

      if (countEl) {
        countEl.textContent = visible.length + (visible.length > 1 ? " pièces" : " pièce");
      }
      if (loadMoreBtn) {
        loadMoreBtn.style.display = visible.length > shown ? "" : "none";
      }
      var empty = $("[data-empty]");
      if (empty) empty.style.display = visible.length === 0 ? "block" : "none";
    }

    function sort(mode) {
      var arr = cards.slice();
      arr.sort(function (a, b) {
        var pa = parseFloat(a.getAttribute("data-price")) || 0;
        var pb = parseFloat(b.getAttribute("data-price")) || 0;
        var na = parseInt(a.getAttribute("data-order"), 10) || 0;
        var nb = parseInt(b.getAttribute("data-order"), 10) || 0;
        if (mode === "price-asc") return pa - pb;
        if (mode === "price-desc") return pb - pa;
        return na - nb; // "Nouveautés"
      });
      arr.forEach(function (card) { grid.appendChild(card); });
      cards = arr;
    }

    filterInputs.forEach(function (input) {
      input.addEventListener("change", function () { shown = perPage; apply(); });
    });
    if (sortSelect) {
      sortSelect.addEventListener("change", function () { sort(sortSelect.value); apply(); });
    }
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () { shown += perPage; apply(); });
    }

    // Mobile collapsible filter panel
    var filterToggle = $("[data-filter-toggle]");
    var filterPanel = $("[data-filter-panel]");
    if (filterToggle && filterPanel) {
      filterToggle.addEventListener("click", function () {
        var open = filterPanel.classList.toggle("open");
        filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // Reset
    var reset = $("[data-filter-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        filterInputs.forEach(function (i) { i.checked = false; });
        shown = perPage;
        apply();
      });
    }

    apply();
  }


  /* ----------------------------------------------------------------------
     10. PRODUCT — gallery swap, size selector, quantity stepper
     ---------------------------------------------------------------------- */
  function product() {
    // Gallery
    var main = $("[data-gallery-main]");
    var thumbs = $$("[data-thumb]");
    if (main && thumbs.length) {
      thumbs.forEach(function (thumb) {
        thumb.addEventListener("click", function () {
          var tone = thumb.getAttribute("data-thumb");
          main.className = main.className.replace(/tone-[\w-]+/g, "").trim() + " " + tone;
          thumbs.forEach(function (t) { t.classList.remove("is-active"); });
          thumb.classList.add("is-active");
        });
      });
    }

    // Size selector
    $$("[data-size]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var group = btn.parentNode;
        $$("[data-size]", group).forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
      });
    });

    // Quantity stepper
    $$("[data-qty]").forEach(function (stepper) {
      var input = $("input", stepper);
      var minus = $("[data-qty-minus]", stepper);
      var plus = $("[data-qty-plus]", stepper);
      function set(v) { input.value = Math.max(1, Math.min(99, v)); }
      if (minus) minus.addEventListener("click", function () { set((parseInt(input.value, 10) || 1) - 1); });
      if (plus) plus.addEventListener("click", function () { set((parseInt(input.value, 10) || 1) + 1); });
    });

    // Add to cart (mockup feedback only)
    $$("[data-addcart]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var label = btn.querySelector("span") || btn;
        var original = label.textContent;
        label.textContent = "Ajouté au panier ✓";
        btn.classList.add("is-added");
        var counter = $(".nav__cart-count");
        if (counter) counter.textContent = (parseInt(counter.textContent, 10) || 0) + 1;
        setTimeout(function () { label.textContent = original; btn.classList.remove("is-added"); }, 1800);
      });
    });
  }


  /* ----------------------------------------------------------------------
     11. ACCORDION — FAQ + product detail sections
     ---------------------------------------------------------------------- */
  function accordion() {
    var items = $$("[data-accordion]");
    if (!items.length) return;

    // Initialise any panel that starts open so it can animate closed cleanly.
    function setOpenHeights() {
      items.forEach(function (item) {
        var panel = $(".accordion__panel", item);
        var trigger = $(".accordion__trigger", item);
        if (item.classList.contains("open") && panel) {
          panel.style.maxHeight = panel.scrollHeight + "px";
          if (trigger) trigger.setAttribute("aria-expanded", "true");
        }
      });
    }
    setOpenHeights();
    // Recompute once fonts/images settle (their reflow changes scrollHeight).
    window.addEventListener("load", setOpenHeights);

    items.forEach(function (item) {
      var trigger = $(".accordion__trigger", item);
      var panel = $(".accordion__panel", item);
      if (!trigger || !panel) return;

      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        // Close siblings within the same group (one open at a time)
        var group = item.getAttribute("data-group");
        if (group) {
          items.forEach(function (other) {
            if (other !== item && other.getAttribute("data-group") === group && other.classList.contains("open")) {
              other.classList.remove("open");
              var op = $(".accordion__panel", other);
              var ot = $(".accordion__trigger", other);
              if (op) op.style.maxHeight = "";
              if (ot) ot.setAttribute("aria-expanded", "false");
            }
          });
        }
        item.classList.toggle("open", !isOpen);
        trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
        panel.style.maxHeight = isOpen ? "" : panel.scrollHeight + "px";
      });
    });

    // Recompute open panel heights on resize (content reflow)
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        items.forEach(function (item) {
          if (item.classList.contains("open")) {
            var panel = $(".accordion__panel", item);
            if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
          }
        });
      }, 150);
    }, { passive: true });
  }


  /* ----------------------------------------------------------------------
     01. BOOT
     ---------------------------------------------------------------------- */
  function init() {
    announceBar();
    header();
    mobileMenu();
    reveal();
    typewriter();
    pageTransition();
    forms();
    catalogue();
    product();
    accordion();
    // Trigger hero entrance after first paint
    window.requestAnimationFrame(function () {
      document.body.classList.add("is-loaded");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
