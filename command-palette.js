/* ========================================
   COMMAND PALETTE — busca rapida pra navegar e agir
   atalho: Ctrl+K (Windows/Linux) ou Cmd+K (Mac).
   - componente autossuficiente: monta o proprio DOM (so aparece se o JS roda)
   - teclado completo: setas, Enter, Esc, e foco preso enquanto aberto
   - semantica ARIA de combobox + listbox pra leitor de tela
   - bilingue: le o idioma atual do site (pt-BR / en)
   ======================================== */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isEN = () => document.documentElement.lang === "en";
  const t = (pt, en) => (isEN() ? en : pt);

  // tira acento e caixa pra busca casar "formacao" com "formação", "acoes" etc.
  const norm = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // reaproveita o scroll suave do site quando existe; senao faz o proprio
  function go(hash) {
    const target = hash === "#top" ? document.body : document.querySelector(hash);
    if (hash === "#top") {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    if (!target) return;
    if (typeof window.scrollToTarget === "function") {
      window.scrollToTarget(target);
    } else {
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }
  const openUrl = (url) => window.open(url, "_blank", "noopener,noreferrer");

  /* ---- icones (SVG inline, herdam a cor via currentColor) ---- */
  const svg = (paths) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  const ICON = {
    arrow: svg('<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>'),
    user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
    spark: svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
    stack: svg('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
    grid: svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
    cap: svg('<path d="M22 9L12 4 2 9l10 5 10-5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    top: svg('<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>'),
    copy: svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'),
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/>'),
    code: svg('<path d="M8 9l-4 3 4 3"/><path d="M16 9l4 3-4 3"/><path d="M13 6l-2 12"/>'),
    link: svg('<path d="M10 14a4 4 0 0 0 6 0l2-2a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-2 2a4 4 0 0 0 6 6l1-1"/>'),
    phone: svg('<path d="M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z"/>'),
    chat: svg('<path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-5A8 8 0 1 1 21 12z"/>'),
  };

  const EMAIL = "lg5104891@gmail.com";

  /* ---- modelo de acoes: cada item sabe o que faz ---- */
  const actions = [
    { cat: ["Navegar", "Go to"], icon: ICON.top, pt: "Início", en: "Home", keys: "inicio home topo top", run: () => go("#top") },
    { cat: ["Navegar", "Go to"], icon: ICON.user, pt: "Sobre", en: "About", keys: "sobre about perfil quem", run: () => go("#sobre") },
    { cat: ["Navegar", "Go to"], icon: ICON.spark, pt: "Habilidades", en: "Skills", keys: "habilidades skills competencias", run: () => go("#habilidades") },
    { cat: ["Navegar", "Go to"], icon: ICON.stack, pt: "Stack", en: "Stack", keys: "stack tecnologias ferramentas tools", run: () => go("#stack") },
    { cat: ["Navegar", "Go to"], icon: ICON.grid, pt: "Projetos", en: "Projects", keys: "projetos projects trabalhos portfolio", run: () => go("#projetos") },
    { cat: ["Navegar", "Go to"], icon: ICON.cap, pt: "Formação", en: "Education", keys: "formacao educacao education cursos", run: () => go("#formacao") },
    { cat: ["Navegar", "Go to"], icon: ICON.mail, pt: "Contato", en: "Contact", keys: "contato contact falar", run: () => go("#contato") },

    { cat: ["Projetos", "Projects"], icon: ICON.link, pt: "Brasília 3D — abrir site", en: "Brasília 3D — open site", keys: "brasilia 3d canvas react site demo", run: () => openUrl("https://luisguilherme605.github.io/Brasilia3D/") },
    { cat: ["Projetos", "Projects"], icon: ICON.code, pt: "Brasília 3D — ver código", en: "Brasília 3D — view code", keys: "brasilia 3d github codigo code repo", run: () => openUrl("https://github.com/LuisGuilherme605/Brasilia3D") },
    { cat: ["Projetos", "Projects"], icon: ICON.link, pt: "Prospecto — abrir demo", en: "Prospecto — open demo", keys: "prospecto lead scoring node demo b2b", run: () => openUrl("https://teste1-k71r.onrender.com") },
    { cat: ["Projetos", "Projects"], icon: ICON.code, pt: "Prospecto — ver código", en: "Prospecto — view code", keys: "prospecto github codigo code repo node", run: () => openUrl("https://github.com/LuisGuilherme605/prospecto-demo") },

    { cat: ["Ações", "Actions"], icon: ICON.copy, pt: "Copiar e-mail", en: "Copy e-mail", keys: "copiar email copy mail contato", run: copyEmail },
    { cat: ["Ações", "Actions"], icon: ICON.globe, pt: "Trocar idioma (PT / EN)", en: "Switch language (PT / EN)", keys: "idioma lingua language ingles portugues pt en", run: switchLang },

    { cat: ["Links", "Links"], icon: ICON.mail, pt: "E-mail", en: "E-mail", keys: "email mail", run: () => openUrl("mailto:" + EMAIL) },
    { cat: ["Links", "Links"], icon: ICON.chat, pt: "WhatsApp", en: "WhatsApp", keys: "whatsapp zap telefone mensagem", run: () => openUrl("https://wa.me/5561998730501?text=Ol%C3%A1%20Luis%2C%20vi%20seu%20portf%C3%B3lio%21") },
    { cat: ["Links", "Links"], icon: ICON.phone, pt: "Telefone", en: "Phone", keys: "telefone phone ligar celular", run: () => openUrl("tel:+5561998730501") },
    { cat: ["Links", "Links"], icon: ICON.code, pt: "GitHub", en: "GitHub", keys: "github git codigo repositorios", run: () => openUrl("https://github.com/LuisGuilherme605") },
    { cat: ["Links", "Links"], icon: ICON.link, pt: "LinkedIn", en: "LinkedIn", keys: "linkedin rede profissional vaga", run: () => openUrl("https://www.linkedin.com/in/luis-guilherme-126072360") },
  ];

  function switchLang() {
    const btn = document.getElementById("langToggle") || document.getElementById("langToggleMobile");
    if (btn) btn.click();
  }

  function copyEmail() {
    const done = () => toast(t("E-mail copiado ✓", "E-mail copied ✓"));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done).catch(() => fallbackCopy(EMAIL, done));
    } else {
      fallbackCopy(EMAIL, done);
    }
  }

  function fallbackCopy(text, done) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    } catch (e) {
      toast(t("Copie: ", "Copy: ") + text);
    }
  }

  /* ---- toast curto, anunciado pro leitor de tela ---- */
  let toastTimer = null;
  function toast(msg) {
    let el = document.querySelector(".cmdk-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "cmdk-toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ========================================
     MONTAGEM DO DOM
     ======================================== */
  const root = document.createElement("div");
  root.className = "cmdk";
  root.id = "cmdk";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.hidden = true;
  root.innerHTML =
    '<div class="cmdk-backdrop" data-close></div>' +
    '<div class="cmdk-panel" role="document">' +
    '  <div class="cmdk-input-wrap">' +
    '    <span class="cmdk-search" aria-hidden="true">' + ICON.grid + "</span>" +
    '    <input class="cmdk-input" type="text" role="combobox" aria-expanded="true"' +
    '           aria-controls="cmdk-list" aria-autocomplete="list" autocomplete="off"' +
    '           spellcheck="false" />' +
    '    <kbd class="cmdk-esc">esc</kbd>' +
    "  </div>" +
    '  <ul class="cmdk-list" id="cmdk-list" role="listbox"></ul>' +
    '  <p class="cmdk-empty" hidden></p>' +
    '  <div class="cmdk-foot" aria-hidden="true">' +
    '    <span><kbd>↑</kbd><kbd>↓</kbd> <i class="k-nav"></i></span>' +
    '    <span><kbd>↵</kbd> <i class="k-open"></i></span>' +
    '    <span><kbd>esc</kbd> <i class="k-close"></i></span>' +
    "  </div>" +
    "</div>";
  document.body.appendChild(root);

  const panel = root.querySelector(".cmdk-panel");
  const input = root.querySelector(".cmdk-input");
  const list = root.querySelector("#cmdk-list");
  const empty = root.querySelector(".cmdk-empty");

  let visible = [];       // acoes atualmente filtradas, em ordem
  let activeIndex = 0;    // item destacado
  let lastFocus = null;   // devolve o foco ao fechar
  let isOpen = false;

  function labelOf(a) {
    return isEN() ? a.en : a.pt;
  }
  function catOf(a) {
    return isEN() ? a.cat[1] : a.cat[0];
  }

  function render(query) {
    const q = norm(query || "").trim();
    const words = q ? q.split(/\s+/) : [];

    visible = actions.filter((a) => {
      if (!words.length) return true;
      const hay = norm(labelOf(a) + " " + a.keys + " " + catOf(a));
      return words.every((w) => hay.indexOf(w) !== -1);
    });

    list.innerHTML = "";
    if (!visible.length) {
      empty.hidden = false;
      empty.textContent = t('Nada encontrado para "', 'No results for "') + query + '"';
      input.setAttribute("aria-activedescendant", "");
      return;
    }
    empty.hidden = true;

    let lastCat = null;
    visible.forEach((a, i) => {
      const cat = catOf(a);
      if (cat !== lastCat) {
        const h = document.createElement("li");
        h.className = "cmdk-group";
        h.setAttribute("role", "presentation");
        h.textContent = cat;
        list.appendChild(h);
        lastCat = cat;
      }
      const li = document.createElement("li");
      li.className = "cmdk-opt";
      li.id = "cmdk-opt-" + i;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      li.innerHTML =
        '<span class="cmdk-opt-ic" aria-hidden="true">' + a.icon + "</span>" +
        '<span class="cmdk-opt-label">' + labelOf(a) + "</span>" +
        '<span class="cmdk-opt-arrow" aria-hidden="true">' + ICON.arrow + "</span>";
      li.addEventListener("click", () => runAt(i));
      li.addEventListener("mousemove", () => setActive(i));
      list.appendChild(li);
    });

    activeIndex = 0;
    highlight();
  }

  function highlight() {
    const opts = list.querySelectorAll(".cmdk-opt");
    opts.forEach((o, i) => {
      const on = i === activeIndex;
      o.classList.toggle("active", on);
      o.setAttribute("aria-selected", String(on));
      if (on) {
        input.setAttribute("aria-activedescendant", o.id);
        o.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function setActive(i) {
    if (i === activeIndex) return;
    activeIndex = i;
    highlight();
  }

  function move(delta) {
    if (!visible.length) return;
    activeIndex = (activeIndex + delta + visible.length) % visible.length;
    highlight();
  }

  function runAt(i) {
    const a = visible[i];
    if (!a) return;
    close();
    // deixa o fechamento acontecer antes de navegar/abrir
    requestAnimationFrame(() => a.run());
  }

  /* ---- abrir / fechar ---- */
  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    // textos que dependem do idioma atual
    input.placeholder = t("Buscar seções, projetos, ações…", "Search sections, projects, actions…");
    input.setAttribute("aria-label", t("Buscar no portfólio", "Search the portfolio"));
    root.setAttribute("aria-label", t("Paleta de comandos", "Command palette"));
    root.querySelector(".k-nav").textContent = t("navegar", "navigate");
    root.querySelector(".k-open").textContent = t("abrir", "open");
    root.querySelector(".k-close").textContent = t("fechar", "close");
    input.value = "";
    root.hidden = false;
    document.body.classList.add("cmdk-lock");
    render("");
    requestAnimationFrame(() => {
      root.classList.add("open");
      input.focus();
    });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("open");
    document.body.classList.remove("cmdk-lock");
    const hide = () => { root.hidden = true; };
    if (reduce) hide();
    else setTimeout(hide, 160);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function toggle() {
    isOpen ? close() : open();
  }

  /* ---- teclado ---- */
  // atalho global Ctrl/Cmd+K, e "/" como atalho rapido (fora de campos de texto)
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === "k") {
      e.preventDefault();
      toggle();
      return;
    }
    if (!isOpen && k === "/" && !/^(input|textarea|select)$/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      open();
    }
  });

  // navegacao dentro da paleta
  root.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(visible.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        runAt(activeIndex);
        break;
      case "Tab":
        // foco preso: o unico campo focavel e o input, entao so cancela o Tab
        e.preventDefault();
        input.focus();
        break;
    }
  });

  input.addEventListener("input", () => render(input.value));

  // clique fora (backdrop) fecha
  root.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) close();
  });

  /* ---- gatilho visivel na navegacao (desktop) ---- */
  (function injectTrigger() {
    const nav = document.querySelector("nav");
    const langBtn = document.getElementById("langToggle");
    if (!nav) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cmdk-trigger";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-label", "Abrir busca rápida (Ctrl K)");
    const mac = /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);
    btn.innerHTML =
      '<span class="cmdk-trigger-ic" aria-hidden="true">' + ICON.grid + "</span>" +
      '<kbd aria-hidden="true">' + (mac ? "⌘" : "Ctrl") + " K</kbd>";
    btn.addEventListener("click", open);
    if (langBtn) nav.insertBefore(btn, langBtn);
    else nav.appendChild(btn);
  })();

  // expoe pra quem quiser abrir por codigo (ex.: outros scripts)
  window.commandPalette = { open, close, toggle };
})();
