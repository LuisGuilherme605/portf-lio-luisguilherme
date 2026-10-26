/* ========================================
   PORTFOLIO — Luis Guilherme
   ======================================== */

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reduceMotion = motionQuery.matches;
motionQuery.addEventListener("change", (e) => {
  reduceMotion = e.matches;
});

/* Ano do footer sempre atualizado */
(function () {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/* Fade-In Observer */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("vis");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  document.querySelectorAll(".fi").forEach((el) => observer.observe(el));
})();

/* Hamburger Menu */
(function () {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  // Seletor completo de tudo que pode receber foco por teclado
  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function setOpen(open) {
    hamburger.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      // Primeiro item focavel ganha foco pra leitor de tela confirmar a abertura
      const first = mobileMenu.querySelector(FOCUSABLE);
      if (first) first.focus();
    }
  }

  hamburger.addEventListener("click", () => {
    setOpen(!mobileMenu.classList.contains("open"));
  });

  function closeMenu() {
    setOpen(false);
  }

  // Focus trap: Tab/Shift+Tab circulam entre os itens enquanto o menu esta aberto
  mobileMenu.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !mobileMenu.classList.contains("open")) return;
    const items = mobileMenu.querySelectorAll(FOCUSABLE);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !mobileMenu.classList.contains("open")) return;
    closeMenu();
    hamburger.focus();
  });

  // Passou do breakpoint com o menu aberto: o hamburger some, e o scroll
  // da pagina nao pode ficar travado.
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) closeMenu();
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      closeMenu();
      if (target) scrollToTarget(target);
    });
  });
})();

/* Smooth Scroll for Anchor Links */
function scrollToTarget(target) {
  target.classList.add("vis");
  // Aguarda o proximo frame pra garantir que .vis entrou em cena antes do scroll
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
}

(function () {
  document.querySelectorAll('a[href^="#"]:not(.mobile-link)').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });
})();

/* Tilt 3D nos cards (desktop com ponteiro fino) */
(function () {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduceMotion || coarse || window.matchMedia("(max-width: 820px)").matches) return;

  const cards = document.querySelectorAll(".proj-card, .skill-card");
  cards.forEach((card) => {
    let frame = null;
    card.addEventListener(
      "mousemove",
      (e) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.classList.add("tilt-on");
          card.style.transform =
            `perspective(720px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-4px)`;
          frame = null;
        });
      },
      { passive: true }
    );
    card.addEventListener("mouseleave", () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      card.classList.remove("tilt-on");
      card.style.transform = "";
    });
  });
})();

/* Contador animado nos numeros das stats */
(function () {
  if (reduceMotion) return;
  const targets = [];
  document.querySelectorAll(".stat-n").forEach((el) => {
    const raw = el.textContent.trim();
    if (/^\d+$/.test(raw)) {
      el.dataset.end = raw;
      el.textContent = "0";
      targets.push(el);
    }
  });
  if (!targets.length) return;

  function run(el) {
    const end = parseInt(el.dataset.end, 10);
    const dur = 1100;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased).toString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  targets.forEach((el) => obs.observe(el));
})();
