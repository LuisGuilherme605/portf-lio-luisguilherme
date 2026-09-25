/* ========================================
   PORTFOLIO — Luis Guilherme
   ======================================== */

/* Fade-In Observer */
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("vis");
        }
      });
    },
    { threshold: 0.05 }
  );

  document.querySelectorAll(".fi").forEach(function (el) {
    observer.observe(el);
  });
})();

/* Hamburger Menu */
(function () {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    var isOpen = mobileMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  document.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.querySelector(link.getAttribute("href"));
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (target) {
        target.classList.add("vis");
        setTimeout(function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    });
  });
})();

/* Smooth Scroll for Anchor Links */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href === "#") return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.classList.add("vis");
        setTimeout(function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    });
  });
})();

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Tilt 3D nos cards */
(function () {
  if (reduceMotion || window.matchMedia("(max-width: 820px)").matches) return;
  var cards = document.querySelectorAll(".proj-card, .skill-card");
  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("tilt-on");
      card.style.transform =
        "perspective(720px) rotateX(" +
        (-py * 5).toFixed(2) +
        "deg) rotateY(" +
        (px * 5).toFixed(2) +
        "deg) translateY(-4px)";
    });
    card.addEventListener("mouseleave", function () {
      card.classList.remove("tilt-on");
      card.style.transform = "";
    });
  });
})();

/* Contador animado nos numeros das stats */
(function () {
  if (reduceMotion) return;
  var targets = [];
  document.querySelectorAll(".stat-n").forEach(function (el) {
    var raw = el.textContent.trim();
    if (/^\d+$/.test(raw)) {
      el.dataset.end = raw;
      el.textContent = "0";
      targets.push(el);
    }
  });
  if (!targets.length) return;

  function run(el) {
    var end = parseInt(el.dataset.end, 10);
    var dur = 1100,
      start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased).toString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  targets.forEach(function (el) {
    obs.observe(el);
  });
})();
