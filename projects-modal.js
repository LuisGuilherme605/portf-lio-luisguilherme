/* ========================================
   MODAL DE DETALHES DOS PROJETOS
   - abre um diálogo com descrição completa e destaques do projeto
   - os dados saem do que já está no site, só num formato mais rico
   - acessível: role=dialog, foco preso, Esc fecha, devolve o foco ao abrir
   - bilíngue (lê o idioma atual) e injeta o botão "Detalhes" em cada card
   ======================================== */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isEN = () => document.documentElement.lang === "en";

  const DATA = {
    brasilia: {
      type: ["Web Interativo · Turismo 3D", "Interactive Web · 3D Tourism"],
      title: ["Brasília 3D — Guia Turístico Interativo", "Brasília 3D — Interactive Tourist Guide"],
      desc: [
        "Guia turístico onde a cidade é desenhada como uma maquete 3D rodando no navegador — e todo o 3D foi feito do zero, sem WebGL e sem biblioteca gráfica.",
        "A tourist guide where the city is drawn as a 3D model running in the browser — and all the 3D was built from scratch, with no WebGL and no graphics library.",
      ],
      highlights: [
        [
          "Motor 3D escrito na mão em Canvas 2D: projeção em perspectiva, rotação no eixo vertical e algoritmo do pintor pra ordenar as faces.",
          "Interface em React 19 com Vite e animações em Framer Motion.",
          "Nove pontos turísticos com fotos da Wikimedia, busca, filtros e favoritos.",
        ],
        [
          "Hand-written 3D engine in Canvas 2D: perspective projection, vertical-axis rotation and the painter's algorithm to sort faces.",
          "React 19 interface with Vite and Framer Motion animations.",
          "Nine landmarks with Wikimedia photos, search, filters and favorites.",
        ],
      ],
      tech: ["React", "Vite", "Framer Motion", "Canvas 2D"],
      site: "https://luisguilherme605.github.io/Brasilia3D/",
      code: "https://github.com/LuisGuilherme605/Brasilia3D",
    },
    prospecto: {
      type: ["Web App · Ferramenta de Vendas B2B", "Web App · B2B Sales Tool"],
      title: ["Prospecto — Motor de Lead Scoring B2B", "Prospecto — B2B Lead Scoring Engine"],
      desc: [
        "Painel de inteligência comercial que responde uma pergunta prática: para quem eu ligo primeiro hoje? Back-end em Node.js, com zero dependências externas.",
        "A sales intelligence panel that answers a practical question: who should I call first today? Node.js back-end, with zero external dependencies.",
      ],
      highlights: [
        [
          "Back-end em Node.js sem dependência externa: servidor HTTP, REST API, autenticação HMAC e rate limiting feitos na mão.",
          "Lead scoring explicável em três eixos independentes — Fit, Intenção e Acessibilidade — com decaimento temporal dos sinais.",
          "Persistência em SQLite e cadência de contato automática. 215 testes, 98.8% de cobertura.",
        ],
        [
          "Node.js back-end with no external dependency: HTTP server, REST API, HMAC authentication and rate limiting built by hand.",
          "Explainable lead scoring across three independent axes — Fit, Intent and Accessibility — with time decay on signals.",
          "SQLite persistence and automatic contact cadence. 215 tests, 98.8% coverage.",
        ],
      ],
      tech: ["Node.js", "JavaScript", "SQLite", "REST API"],
      site: "https://teste1-k71r.onrender.com",
      code: "https://github.com/LuisGuilherme605/prospecto-demo",
    },
  };

  /* ---- monta o DOM do modal (uma vez) ---- */
  const root = document.createElement("div");
  root.className = "pm";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-labelledby", "pm-title");
  root.hidden = true;
  root.innerHTML =
    '<div class="pm-backdrop" data-close></div>' +
    '<div class="pm-panel" role="document">' +
    '  <button type="button" class="pm-close" aria-label="Fechar">' +
    '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    "  </button>" +
    '  <div class="pm-type"></div>' +
    '  <h2 class="pm-title" id="pm-title"></h2>' +
    '  <p class="pm-desc"></p>' +
    '  <h3 class="pm-h"></h3>' +
    '  <ul class="pm-highlights"></ul>' +
    '  <div class="pm-tech"></div>' +
    '  <div class="pm-links"></div>' +
    "</div>";
  document.body.appendChild(root);

  const panel = root.querySelector(".pm-panel");
  const closeBtn = root.querySelector(".pm-close");
  const elType = root.querySelector(".pm-type");
  const elTitle = root.querySelector(".pm-title");
  const elDesc = root.querySelector(".pm-desc");
  const elH = root.querySelector(".pm-h");
  const elHigh = root.querySelector(".pm-highlights");
  const elTech = root.querySelector(".pm-tech");
  const elLinks = root.querySelector(".pm-links");

  let lastFocus = null;
  let isOpen = false;

  const FOCUSABLE = 'a[href], button:not([disabled])';

  function fill(id) {
    const d = DATA[id];
    if (!d) return;
    const i = isEN() ? 1 : 0;

    elType.textContent = d.type[i];
    elTitle.textContent = d.title[i];
    elDesc.textContent = d.desc[i];
    elH.textContent = isEN() ? "Highlights" : "Destaques";

    elHigh.innerHTML = "";
    d.highlights[i].forEach((h) => {
      const li = document.createElement("li");
      li.textContent = h;
      elHigh.appendChild(li);
    });

    elTech.innerHTML = "";
    d.tech.forEach((tag) => {
      const s = document.createElement("span");
      s.className = "sk-tag";
      s.textContent = tag;
      elTech.appendChild(s);
    });

    elLinks.innerHTML = "";
    elLinks.appendChild(makeLink(d.site, isEN() ? "Visit site →" : "Ver site →", "primary"));
    elLinks.appendChild(makeLink(d.code, isEN() ? "View code →" : "Ver código →", ""));

    closeBtn.setAttribute("aria-label", isEN() ? "Close" : "Fechar");
  }

  function makeLink(href, text, variant) {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "pm-link" + (variant === "primary" ? " pm-link--primary" : "");
    a.textContent = text;
    return a;
  }

  function open(id) {
    if (!DATA[id]) return;
    lastFocus = document.activeElement;
    fill(id);
    root.hidden = false;
    document.body.classList.add("cmdk-lock");
    requestAnimationFrame(() => {
      root.classList.add("open");
      closeBtn.focus();
    });
    isOpen = true;
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("open");
    document.body.classList.remove("cmdk-lock");
    const hide = () => { root.hidden = true; };
    if (reduce) hide();
    else setTimeout(hide, 180);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  root.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) close();
  });
  closeBtn.addEventListener("click", close);

  root.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Tab") {
      const items = root.querySelectorAll(FOCUSABLE);
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
    }
  });

  /* ---- injeta o botão "Detalhes" em cada card ---- */
  document.querySelectorAll(".proj-card[data-proj]").forEach((card) => {
    const id = card.getAttribute("data-proj");
    const row = card.querySelector(".proj-links-row");
    if (!row || !DATA[id]) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "proj-link proj-link--details";
    btn.setAttribute("aria-haspopup", "dialog");
    const label = card.querySelector(".proj-name");
    btn.setAttribute(
      "aria-label",
      (isEN() ? "Details about " : "Detalhes de ") + (label ? label.textContent : id)
    );
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.6" r="0.6" fill="currentColor"/></svg>';
    // texto no idioma atual + data-pt/data-en pra o toggle de idioma continuar pegando
    const span = document.createElement("span");
    span.setAttribute("data-en", "Details");
    span.setAttribute("data-pt", "Detalhes");
    span.textContent = isEN() ? "Details" : "Detalhes";
    btn.appendChild(span);
    btn.addEventListener("click", () => open(id));
    row.insertBefore(btn, row.firstChild);
  });

  window.projectModal = { open, close };
})();
