/* ========================================
   ENHANCEMENTS — detalhes de produto feitos em JS puro
   1) barra de progresso de leitura (topo da pagina)
   2) scrollspy: acende o link da nav da seção visível
   3) botão "voltar ao topo" que surge ao rolar
   4) relógio de Brasília ao vivo no hero
   5) assinatura no console pra quem abre o DevTools
   Tudo respeita prefers-reduced-motion e é à prova de ausência de elementos.
   ======================================== */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------
     1) BARRA DE PROGRESSO DE LEITURA
     width proporcional ao quanto da pagina ja foi rolado.
     atualiza dentro de requestAnimationFrame pra nao pesar no scroll.
     ---------------------------------------- */
  (function readingProgress() {
    const bar = document.createElement("div");
    bar.className = "read-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    let ticking = false;
    function update() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      bar.style.transform = "scaleX(" + Math.min(Math.max(p, 0), 1).toFixed(4) + ")";
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  })();

  /* ----------------------------------------
     2) SCROLLSPY — link da nav da seção atual fica ativo
     IntersectionObserver com margem que mira a faixa superior da tela,
     assim a seção "ativa" é a que está sendo lida, não a que mal apareceu.
     ---------------------------------------- */
  (function scrollSpy() {
    const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!links.length) return;

    const map = new Map(); // id da seção -> link da nav
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const sec = id && document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    if (!map.size) return;

    function setActive(link) {
      links.forEach((a) => {
        const on = a === link;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // entre as seções cruzando a faixa, pega a mais alta na página
        const hits = entries.filter((e) => e.isIntersecting);
        if (!hits.length) return;
        hits.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const link = map.get(hits[0].target);
        if (link) setActive(link);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    map.forEach((_, sec) => observer.observe(sec));
  })();

  /* ----------------------------------------
     3) VOLTAR AO TOPO — aparece depois de rolar ~uma tela
     ---------------------------------------- */
  (function backToTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Voltar ao topo");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg>';
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      btn.blur();
    });
    document.body.appendChild(btn);

    let ticking = false;
    function check() {
      const show = window.scrollY > window.innerHeight * 0.9;
      btn.classList.toggle("show", show);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(check);
        }
      },
      { passive: true }
    );
    check();
  })();

  /* ----------------------------------------
     4) RELÓGIO DE BRASÍLIA — hora local ao vivo no hero
     usa Intl com fuso America/Sao_Paulo, então mostra a hora certa
     de Brasília mesmo pra quem acessa de outro fuso/país.
     elemento separado (não é alvo de [data-en]), então o toggle de
     idioma não apaga o relógio.
     ---------------------------------------- */
  (function brasiliaClock() {
    const eyebrow = document.querySelector(".hero-eyebrow");
    if (!eyebrow) return;

    const sep = document.createElement("span");
    sep.className = "hero-clock-sep";
    sep.setAttribute("aria-hidden", "true");
    sep.textContent = "·";

    const clock = document.createElement("span");
    clock.className = "hero-clock";
    clock.setAttribute("aria-hidden", "true");

    eyebrow.appendChild(sep);
    eyebrow.appendChild(clock);

    let fmt;
    try {
      fmt = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      sep.remove();
      clock.remove();
      return;
    }

    function tick() {
      clock.textContent = fmt.format(new Date()) + " BRT";
    }
    tick();
    setInterval(tick, 15000); // a cada 15s já mantém o minuto certo
  })();

  /* ----------------------------------------
     5) ASSINATURA NO CONSOLE
     quem abre o DevTools (recrutador, professor, outro dev) encontra um
     recado. detalhe de quem pensa na experiência de quem olha o código.
     ---------------------------------------- */
  (function consoleSignature() {
    try {
      const big =
        "color:#18bccb;font-size:15px;font-weight:700;font-family:monospace;";
      const soft = "color:#869099;font-size:12px;font-family:monospace;";
      const warm = "color:#4b8bf4;font-size:12px;font-family:monospace;";
      console.log("%cLuis Guilherme — LG.dev", big);
      console.log(
        "%cValeu por abrir o console 👋  Curtiu o site? Tenta o atalho %cCtrl/Cmd + K%c.",
        soft,
        warm,
        soft
      );
      console.log("%ccontato: lg5104891@gmail.com · github.com/LuisGuilherme605", soft);
    } catch (e) {}
  })();
})();
