/* ========================================
   MODAL DE DETALHES DOS PROJETOS (case study)
   - abre um diálogo com tela real + narrativa: desafio, decisão técnica, resultado
   - os dados saem do que o projeto realmente é, num formato mais rico
   - acessível: role=dialog, foco preso, Esc fecha, devolve o foco ao abrir
   - bilíngue (lê o idioma atual) e injeta o botão "Detalhes" em cada card
   ======================================== */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isEN = () => document.documentElement.lang === "en";

  const DATA = {
    brasilia: {
      shot: "proj-brasilia.jpg",
      shotAlt: ["Maquete 3D do Plano Piloto no Brasília 3D", "3D model of Brasília's Plano Piloto"],
      type: ["Web Interativo · Turismo 3D", "Interactive Web · 3D Tourism"],
      title: ["Brasília 3D — Guia Turístico Interativo", "Brasília 3D — Interactive Tourist Guide"],
      desc: [
        "Guia turístico onde a cidade é desenhada como uma maquete 3D que gira no navegador.",
        "A tourist guide where the city is drawn as a 3D model you can spin in the browser.",
      ],
      challenge: [
        "Mostrar a cidade em 3D no navegador sem usar WebGL nem nenhuma biblioteca gráfica — só o Canvas 2D, que não tem ideia do que é profundidade.",
        "Show the city in 3D in the browser with no WebGL and no graphics library — just the Canvas 2D API, which has no concept of depth.",
      ],
      decision: [
        "Implementei o pipeline 3D na mão: projeção em perspectiva pra achatar os pontos na tela, rotação no eixo vertical com seno e cosseno, e o algoritmo do pintor pra desenhar as faces na ordem certa. A interface é React 19 com Vite e Framer Motion.",
        "I built the 3D pipeline by hand: perspective projection to flatten points onto the screen, vertical-axis rotation with sine and cosine, and the painter's algorithm to draw faces in the right order. The UI is React 19 with Vite and Framer Motion.",
      ],
      result: [
        "A maquete do Plano Piloto gira com o mouse ou o teclado, com nove pontos turísticos etiquetados, fotos da Wikimedia, busca, filtros e favoritos — tudo rodando suave, sem WebGL.",
        "The Plano Piloto model spins with mouse or keyboard, with nine labeled landmarks, Wikimedia photos, search, filters and favorites — all running smoothly, without WebGL.",
      ],
      tech: ["React", "Vite", "Framer Motion", "Canvas 2D"],
      site: "https://luisguilherme605.github.io/Brasilia3D/",
      code: "https://github.com/LuisGuilherme605/Brasilia3D",
    },
    prospecto: {
      shot: "proj-prospecto.jpg",
      shotAlt: ["Painel de vendas B2B do Prospecto", "Prospecto B2B sales dashboard"],
      type: ["Web App · Ferramenta de Vendas B2B", "Web App · B2B Sales Tool"],
      title: ["Prospecto — Motor de Lead Scoring B2B", "Prospecto — B2B Lead Scoring Engine"],
      desc: [
        "Painel de inteligência comercial que responde uma pergunta prática: para quem eu ligo primeiro hoje?",
        "A sales intelligence panel that answers one practical question: who should I call first today?",
      ],
      challenge: [
        "Num painel de vendas, a pergunta real não é “quais leads existem”, e sim “pra quem eu ligo agora”. Eu precisava transformar dados crus numa ordem de prioridade que o vendedor confie — e que explique o porquê.",
        "In a sales panel the real question isn't “which leads exist”, it's “who do I call now”. I had to turn raw data into a priority order the rep trusts — and that explains why.",
      ],
      decision: [
        "Back-end em Node.js com zero dependência externa: servidor HTTP, REST API, autenticação HMAC e rate limiting feitos na mão. O score é explicável, em três eixos independentes (Fit, Intenção e Acessibilidade), com decaimento temporal dos sinais. Persistência em SQLite.",
        "Node.js back-end with zero external dependencies: HTTP server, REST API, HMAC authentication and rate limiting built by hand. The score is explainable, across three independent axes (Fit, Intent and Accessibility), with time decay on signals. SQLite persistence.",
      ],
      result: [
        "Um painel que ordena a carteira por prioridade, mostra a previsão de pipeline em cenários e indica a próxima ação de cada lead. 215 testes automatizados, 98.8% de cobertura.",
        "A panel that ranks the portfolio by priority, shows pipeline forecasts in scenarios and points out the next action for each lead. 215 automated tests, 98.8% coverage.",
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
    '  <img class="pm-shot" alt="">' +
    '  <div class="pm-type"></div>' +
    '  <h2 class="pm-title" id="pm-title"></h2>' +
    '  <p class="pm-desc"></p>' +
    '  <div class="pm-sections"></div>' +
    '  <div class="pm-tech"></div>' +
    '  <div class="pm-links"></div>' +
    "</div>";
  document.body.appendChild(root);

  const panel = root.querySelector(".pm-panel");
  const closeBtn = root.querySelector(".pm-close");
  const elShot = root.querySelector(".pm-shot");
  const elType = root.querySelector(".pm-type");
  const elTitle = root.querySelector(".pm-title");
  const elDesc = root.querySelector(".pm-desc");
  const elSections = root.querySelector(".pm-sections");
  const elTech = root.querySelector(".pm-tech");
  const elLinks = root.querySelector(".pm-links");

  let lastFocus = null;
  let isOpen = false;
  const FOCUSABLE = "a[href], button:not([disabled])";

  function section(labelPt, labelEn, textPt, textEn) {
    const i = isEN() ? 1 : 0;
    const h = document.createElement("h3");
    h.className = "pm-h";
    h.textContent = isEN() ? labelEn : labelPt;
    const p = document.createElement("p");
    p.className = "pm-text";
    p.textContent = i ? textEn : textPt;
    elSections.appendChild(h);
    elSections.appendChild(p);
  }

  function fill(id) {
    const d = DATA[id];
    if (!d) return;
    const i = isEN() ? 1 : 0;

    elShot.src = d.shot;
    elShot.alt = d.shotAlt[i];
    elType.textContent = d.type[i];
    elTitle.textContent = d.title[i];
    elDesc.textContent = d.desc[i];

    elSections.innerHTML = "";
    section("O desafio", "The challenge", d.challenge[0], d.challenge[1]);
    section("A decisão técnica", "The technical call", d.decision[0], d.decision[1]);
    section("O resultado", "The result", d.result[0], d.result[1]);

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
    panel.scrollTop = 0;
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
