/* ========================================
   PORTFOLIO — Luis Guilherme
   ======================================== */

/* Stars Background — drifting + twinkling */
(function () {
  const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");
  let width, height;
  const stars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 160; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.2,
      alpha: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.004 + 0.0015,
      dx: (Math.random() - 0.5) * 0.12,
      dy: Math.random() * 0.12 + 0.02,
    });
  }

  let rafId = null;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(function (star) {
      star.alpha += star.speed;
      star.x += star.dx;
      star.y += star.dy;
      if (star.x < 0) star.x = width;
      else if (star.x > width) star.x = 0;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
      const tw = (Math.sin(star.alpha) * 0.5 + 0.5) * 0.7 + 0.1;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(186,168,255," + tw + ")";
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }

  draw();

  // Pausa as estrelas quando a aba nao esta visivel — economiza CPU e bateria.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (rafId === null) {
      draw();
    }
  });
})();

/* Hero parallax — fundo reage ao mouse (desktop) */
(function () {
  if (window.matchMedia("(max-width: 900px)").matches) return;
  var hero = document.querySelector(".hero");
  var grid = document.querySelector(".hero-grid-bg");
  if (!hero || !grid) return;
  var ticking = false;
  hero.addEventListener("mousemove", function (e) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var r = hero.getBoundingClientRect();
      var mx = (e.clientX - r.left) / r.width - 0.5;
      var my = (e.clientY - r.top) / r.height - 0.5;
      grid.style.transform = "translate(" + mx * 20 + "px," + my * 20 + "px)";
    });
  });
})();

/* Custom Cursor */
(function () {
  var cursor = document.getElementById("cursor");
  var trail = document.getElementById("cursor-trail");

  document.addEventListener("mousemove", function (e) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";
  });

  document.querySelectorAll("a, button").forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      cursor.style.width = "20px";
      cursor.style.height = "20px";
      trail.style.width = "60px";
      trail.style.height = "60px";
    });
    el.addEventListener("mouseleave", function () {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      trail.style.width = "36px";
      trail.style.height = "36px";
    });
  });
})();

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

/* Robo mascote 3D (WebGL) fica em robot3d.js, carregado como modulo */

/* Tilt 3D nos cards — mesmo motivo do robo: reagem ao cursor */
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
        "deg) translateY(-6px)";
    });
    card.addEventListener("mouseleave", function () {
      card.classList.remove("tilt-on");
      card.style.transform = "";
    });
  });
})();

/* Contador animado nos numeros das stats (ao entrar na tela) */
(function () {
  if (reduceMotion) return;
  var targets = [];
  document.querySelectorAll(".stat-n").forEach(function (el) {
    var raw = el.textContent.trim();
    if (/^\d+$/.test(raw)) {
      el.dataset.end = raw; // guarda o alvo ANTES de zerar
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
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubico
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
