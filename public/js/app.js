(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNav() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.querySelector(".nav-panel");
    if (!header) return;

    function onScroll() {
      var y = window.scrollY || 0;
      header.classList.toggle("is-scrolled", y > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toggle && panel) {
      function setNavOpen(open) {
        panel.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("nav-open", open);
      }

      toggle.addEventListener("click", function () {
        setNavOpen(!panel.classList.contains("is-open"));
      });
      panel.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          setNavOpen(false);
        });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && panel.classList.contains("is-open")) {
          setNavOpen(false);
          toggle.focus();
        }
      });
      window.addEventListener(
        "resize",
        function () {
          if (window.matchMedia("(min-width: 861px)").matches) {
            setNavOpen(false);
          }
        },
        { passive: true }
      );
    }
  }

  function isNarrowViewport() {
    return window.matchMedia("(max-width: 719px)").matches;
  }

  function initParallax() {
    if (prefersReducedMotion || isNarrowViewport()) return;
    var layers = document.querySelectorAll("[data-parallax]");
    if (!layers.length) return;

    var ticking = false;
    function update() {
      if (window.matchMedia("(max-width: 719px)").matches) {
        layers.forEach(function (el) {
          el.style.removeProperty("--parallax-y");
        });
        return;
      }
      var scrollY = window.scrollY || 0;
      var vh = window.innerHeight || 1;
      layers.forEach(function (el) {
        var depth = parseFloat(el.getAttribute("data-parallax") || "0.15");
        var rect = el.getBoundingClientRect();
        var centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
        var translate = scrollY * depth * 0.35 + centerOffset * 24 * depth;
        el.style.setProperty("--parallax-y", translate.toFixed(2) + "px");
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  function initHeroTilt() {
    if (prefersReducedMotion || isNarrowViewport()) return;
    var hero = document.querySelector(".hero-stage");
    if (!hero) return;

    var max = 8;
    hero.addEventListener(
      "mousemove",
      function (e) {
        var r = hero.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        var y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        hero.style.setProperty("--tilt-x", (y * max).toFixed(2) + "deg");
        hero.style.setProperty("--tilt-y", (-x * max).toFixed(2) + "deg");
      },
      { passive: true }
    );
    hero.addEventListener("mouseleave", function () {
      hero.style.setProperty("--tilt-x", "0deg");
      hero.style.setProperty("--tilt-y", "0deg");
    });
  }

  function initReveal() {
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;
    if (prefersReducedMotion) {
      nodes.forEach(function (n) {
        n.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initMarquee() {
    var root = document.querySelector("[data-marquee]");
    if (!root || prefersReducedMotion) return;
    var inner = root.querySelector(".marquee-inner");
    var track = root.querySelector(".marquee-track");
    if (!inner || !track) return;
    var clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    inner.appendChild(clone);
  }

  function initAmbientVideos() {
    var videos = document.querySelectorAll("video.video-ambient");
    if (!videos.length) return;
    videos.forEach(function (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.volume = 0;
      v.setAttribute("muted", "");
      if (prefersReducedMotion) {
        v.removeAttribute("autoplay");
        v.pause();
        var card = v.closest(".video-card--ambient");
        var poster = card && card.getAttribute("data-static-poster");
        if (card && poster) {
          v.style.display = "none";
          card.style.backgroundImage = "url('" + poster.replace(/'/g, "\\'") + "')";
          card.style.backgroundSize = "cover";
          card.style.backgroundPosition = "center";
          card.style.backgroundColor = "#000";
        }
        return;
      }
      var p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () {});
      }
    });
  }

  function initCardSpotlight() {
    if (prefersReducedMotion) return;
    document.querySelectorAll(".feature-card").forEach(function (card) {
      card.addEventListener(
        "pointermove",
        function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
          card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
        },
        { passive: true }
      );
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initParallax();
    initHeroTilt();
    initReveal();
    initMarquee();
    initAmbientVideos();
    initCardSpotlight();
  });
})();
