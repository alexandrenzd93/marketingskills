/* ==========================================================================
   BLEU BLANC COUTURE — global.js  (Shopify theme)
   Shared behaviour for every page. Each module self-guards: if its markup
   isn't present it does nothing, so the single file loads on every template.

   01. boot
   02. announceBar     — dismissible top bar (remembers within session)
   03. header          — scroll colour flip (transparent pages only)
   04. mobileMenu      — fullscreen overlay + iOS-safe scroll lock
   05. reveal          — IntersectionObserver fade-up
   06. typewriter      — manifesto, character by character
   07. pageTransition  — cinematic cream fade on internal navigation
   08. forms           — graceful inline feedback for mock forms
   09. facets          — collection filters: auto-submit + mobile toggle
   10. productForm     — gallery, variant picker, quantity, AJAX add to cart
   11. accordion       — FAQ / product detail accordions
   12. cartRefresh     — keep the header cart count in sync
   ========================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var money = function (cents) {
    try {
      return (cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
    } catch (e) { return (cents / 100) + " €"; }
  };


  /* 02. ANNOUNCEMENT BAR ------------------------------------------------- */
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


  /* 03. HEADER — solid/cream flip past a small scroll threshold ---------- */
  function header() {
    var head = $(".site-header");
    if (!head || head.classList.contains("header-solid")) return;
    var ticking = false;
    function update() { head.classList.toggle("scrolled", window.scrollY > 40); ticking = false; }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }


  /* 04. MOBILE MENU — overlay + body scroll lock ------------------------- */
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
      document.body.style.left = "0"; document.body.style.right = "0"; document.body.style.width = "100%";
    }
    function unlock() {
      document.body.style.position = ""; document.body.style.top = "";
      document.body.style.left = ""; document.body.style.right = ""; document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
    function open() { menu.classList.add("open"); menu.setAttribute("aria-hidden", "false"); burger.setAttribute("aria-expanded", "true"); lock(); }
    function close() { menu.classList.remove("open"); menu.setAttribute("aria-hidden", "true"); burger.setAttribute("aria-expanded", "false"); unlock(); }
    burger.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    $$(".mobile-menu__link", menu).forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) close(); });
  }


  /* 05. REVEAL ----------------------------------------------------------- */
  function reveal() {
    var els = $$(".reveal");
    if (!els.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }


  /* 06. TYPEWRITER ------------------------------------------------------- */
  function typewriter() {
    var live = $(".manifeste__live");
    if (!live) return;
    var text = (live.textContent || "").trim();
    if (!text) return;
    if (prefersReduced || !("IntersectionObserver" in window)) { live.innerHTML = renderTyped(text, text.length); return; }
    var started = false;
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) { started = true; obs.unobserve(entry.target); runType(live, text); }
      });
    }, { threshold: 0.4 });
    io.observe(live);
  }
  function escapeChar(c) { if (c === "&") return "&amp;"; if (c === "<") return "&lt;"; if (c === ">") return "&gt;"; return c; }
  function renderTyped(text, n) {
    var out = "";
    for (var i = 0; i < n; i++) { var c = text.charAt(i); out += c === "." ? '<span class="dot">.</span>' : escapeChar(c); }
    return out;
  }
  function runType(el, text) {
    var i = 0; var caret = '<span class="caret" aria-hidden="true"></span>';
    (function step() {
      i++; el.innerHTML = renderTyped(text, i) + (i < text.length ? caret : "");
      if (i < text.length) { setTimeout(step, 30); }
      else { setTimeout(function () { el.innerHTML = renderTyped(text, text.length); }, 900); }
    })();
  }


  /* 07. PAGE TRANSITION -------------------------------------------------- */
  function pageTransition() {
    var overlay = $(".page-transition");
    if (!overlay || prefersReduced) return;
    function isInternal(a) {
      if (!a) return false;
      if (a.target === "_blank" || a.hasAttribute("download")) return false;
      if (a.dataset.noTransition !== undefined) return false;
      var href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#") return false;
      if (/^(mailto:|tel:|https?:)/i.test(href)) { return a.hostname === window.location.hostname; }
      return true;
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
    window.addEventListener("pageshow", function () { overlay.classList.remove("is-active"); });
  }


  /* 08. FORMS — inline feedback for mock (non-Shopify) forms ------------- */
  function forms() {
    $$("[data-fakeform]").forEach(function (form) {
      var msg = $(".form-msg", form) || form.parentNode.querySelector(".form-msg");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"], input[type="text"], input');
        var ok = !input || input.value.trim() !== "";
        if (!ok) { if (msg) msg.textContent = "Merci d’indiquer votre adresse e-mail."; if (input) input.focus(); return; }
        if (msg) msg.textContent = form.getAttribute("data-success") || "Merci — vous êtes des nôtres.";
        form.reset();
      });
    });
  }


  /* 09. FACETS — collection filters ------------------------------------- */
  function facets() {
    var form = $("[data-facet-form]");
    var toggle = $("[data-filter-toggle]");
    var panel = $("[data-filter-panel]");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    if (form) {
      $$("input, select", form).forEach(function (input) {
        input.addEventListener("change", function () { form.submit(); });
      });
    }
    var reset = $("[data-filter-reset]");
    if (reset) {
      reset.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = reset.getAttribute("href") || window.location.pathname;
      });
    }
  }


  /* 10. PRODUCT FORM — gallery, variants, quantity, add to cart --------- */
  function productForm() {
    var root = $("[data-product]");
    if (!root) return;

    /* --- Gallery --- */
    var mainImg = $("[data-gallery-image]", root);
    var thumbs = $$("[data-gallery-thumb]", root);
    function showMedia(src, srcset) {
      if (!mainImg || !src) return;
      mainImg.src = src;
      if (srcset) mainImg.srcset = srcset; else mainImg.removeAttribute("srcset");
    }
    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        showMedia(thumb.getAttribute("data-src"), thumb.getAttribute("data-srcset"));
        thumbs.forEach(function (t) { t.classList.remove("is-active"); });
        thumb.classList.add("is-active");
      });
    });

    /* --- Variants --- */
    var variants = [];
    var dataEl = $("[data-variant-json]", root);
    if (dataEl) { try { variants = JSON.parse(dataEl.textContent); } catch (e) { variants = []; } }

    var idInput = $("[data-variant-id]", root);
    var priceEl = $("[data-product-price]", root);
    var addBtn = $("[data-add-to-cart]", root);
    var addLabel = addBtn ? (addBtn.querySelector("span") || addBtn) : null;
    var selected = {};

    $$("[data-option-index]", root).forEach(function (group) {
      var idx = group.getAttribute("data-option-index");
      if (group.tagName === "SELECT") { selected[idx] = group.value; return; }
      var active = $(".is-active[data-value]", group) || $("[data-value]", group);
      if (active) selected[idx] = active.getAttribute("data-value");
    });

    function findVariant() {
      for (var k = 0; k < variants.length; k++) {
        var v = variants[k]; var match = true;
        for (var i = 0; i < v.options.length; i++) { if (selected[i] !== v.options[i]) { match = false; break; } }
        if (match) return v;
      }
      return null;
    }

    function updateVariant() {
      var v = findVariant();
      if (!v) return;
      if (idInput) idInput.value = v.id;
      if (priceEl) {
        if (v.compare_at_price && v.compare_at_price > v.price) {
          priceEl.innerHTML = '<s>' + money(v.compare_at_price) + '</s> ' + money(v.price);
        } else { priceEl.textContent = money(v.price); }
      }
      if (addBtn) {
        if (v.available) { addBtn.disabled = false; if (addLabel) addLabel.textContent = addBtn.getAttribute("data-add-label") || "Ajouter au panier"; }
        else { addBtn.disabled = true; if (addLabel) addLabel.textContent = "Épuisé"; }
      }
      if (v.media_src) showMedia(v.media_src, v.media_srcset);
    }

    $$("[data-option-index]", root).forEach(function (group) {
      var idx = group.getAttribute("data-option-index");
      if (group.tagName === "SELECT") {
        group.addEventListener("change", function () { selected[idx] = group.value; updateVariant(); });
        return;
      }
      $$("[data-value]", group).forEach(function (btn) {
        btn.addEventListener("click", function () {
          selected[idx] = btn.getAttribute("data-value");
          $$("[data-value]", group).forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          updateVariant();
        });
      });
    });
    updateVariant();

    /* --- Quantity stepper --- */
    $$("[data-qty]", root).forEach(function (stepper) {
      var input = $("input", stepper);
      var minus = $("[data-qty-minus]", stepper);
      var plus = $("[data-qty-plus]", stepper);
      function set(v) { input.value = Math.max(1, Math.min(99, v)); }
      if (minus) minus.addEventListener("click", function () { set((parseInt(input.value, 10) || 1) - 1); });
      if (plus) plus.addEventListener("click", function () { set((parseInt(input.value, 10) || 1) + 1); });
    });

    /* --- AJAX add to cart --- */
    var form = $("[data-product-form]", root);
    if (form && addBtn) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (addBtn.disabled) return;
        var original = addLabel ? addLabel.textContent : "";
        if (addLabel) addLabel.textContent = "…";
        var qtyInput = form.querySelector("[data-qty] input");
        fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ id: idInput ? idInput.value : null, quantity: (qtyInput && parseInt(qtyInput.value, 10)) || 1 })
        })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
          if (!res.ok) {
            if (addLabel) addLabel.textContent = res.data.description || "Indisponible";
            setTimeout(function () { if (addLabel) addLabel.textContent = original; }, 2000);
            return;
          }
          if (addLabel) addLabel.textContent = "Ajouté au panier ✓";
          addBtn.classList.add("is-added");
          refreshCart();
          setTimeout(function () { if (addLabel) addLabel.textContent = original; addBtn.classList.remove("is-added"); }, 1800);
        })
        .catch(function () { if (addLabel) addLabel.textContent = original; });
      });
    }
  }


  /* 11. ACCORDION ------------------------------------------------------- */
  function accordion() {
    var items = $$("[data-accordion]");
    if (!items.length) return;
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
    window.addEventListener("load", setOpenHeights);
    items.forEach(function (item) {
      var trigger = $(".accordion__trigger", item);
      var panel = $(".accordion__panel", item);
      if (!trigger || !panel) return;
      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        var group = item.getAttribute("data-group");
        if (group) {
          items.forEach(function (other) {
            if (other !== item && other.getAttribute("data-group") === group && other.classList.contains("open")) {
              other.classList.remove("open");
              var op = $(".accordion__panel", other); var ot = $(".accordion__trigger", other);
              if (op) op.style.maxHeight = ""; if (ot) ot.setAttribute("aria-expanded", "false");
            }
          });
        }
        item.classList.toggle("open", !isOpen);
        trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
        panel.style.maxHeight = isOpen ? "" : panel.scrollHeight + "px";
      });
    });
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


  /* 12. CART REFRESH ---------------------------------------------------- */
  function refreshCart() {
    fetch("/cart.js", { headers: { "Accept": "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        $$("[data-cart-count]").forEach(function (el) { el.textContent = cart.item_count > 0 ? cart.item_count : ""; });
      })
      .catch(function () {});
  }


  /* 01. BOOT ------------------------------------------------------------ */
  function init() {
    announceBar();
    header();
    mobileMenu();
    reveal();
    typewriter();
    pageTransition();
    forms();
    facets();
    productForm();
    accordion();
    window.requestAnimationFrame(function () { document.body.classList.add("is-loaded"); });
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); }
  else { init(); }
})();
