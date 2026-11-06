/* ========================================
   TEMA CLARO / ESCURO
   o tema inicial já foi aplicado por um script no <head> (sem flash).
   aqui ficam os botões de alternância (nav + menu mobile), a persistência
   e a atualização do theme-color pra barra do navegador acompanhar.
   ======================================== */
(function () {
  "use strict";

  const STORE = "theme";
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const META_COLOR = { dark: "#07070f", light: "#f6f1ea" };
  const buttons = [];

  const current = () => (root.getAttribute("data-theme") === "light" ? "light" : "dark");

  const sun =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4' +
    'M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
  const moon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';

  function labelFor(theme) {
    const en = root.lang === "en";
    return theme === "light"
      ? en ? "Switch to dark theme" : "Ativar tema escuro"
      : en ? "Switch to light theme" : "Ativar tema claro";
  }

  function sync() {
    const t = current();
    if (meta) meta.setAttribute("content", META_COLOR[t]);
    root.style.colorScheme = t;
    buttons.forEach((b) => {
      b.setAttribute("aria-pressed", String(t === "light"));
      b.setAttribute("aria-label", labelFor(t));
    });
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    sync();
  }

  function toggle() {
    const next = current() === "light" ? "dark" : "light";
    apply(next);
    try {
      localStorage.setItem(STORE, next);
    } catch (e) {}
  }

  function makeBtn(cls) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.innerHTML =
      '<span class="theme-ic theme-ic-sun">' + sun + "</span>" +
      '<span class="theme-ic theme-ic-moon">' + moon + "</span>";
    b.addEventListener("click", toggle);
    buttons.push(b);
    return b;
  }

  // botão no topo (desktop) — antes do seletor de idioma
  const nav = document.querySelector("nav");
  if (nav) {
    const b = makeBtn("theme-toggle");
    const langBtn = document.getElementById("langToggle");
    if (langBtn) nav.insertBefore(b, langBtn);
    else nav.appendChild(b);
  }

  // botão no menu mobile — antes do seletor de idioma mobile
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    const b = makeBtn("theme-toggle theme-toggle--mobile");
    const langMobile = document.getElementById("langToggleMobile");
    if (langMobile) mobileMenu.insertBefore(b, langMobile);
    else mobileMenu.appendChild(b);
  }

  sync();

  // reavalia os aria-labels quando o idioma muda
  const langToggles = [
    document.getElementById("langToggle"),
    document.getElementById("langToggleMobile"),
  ].filter(Boolean);
  langToggles.forEach((b) => b.addEventListener("click", () => setTimeout(sync, 0)));

  window.themeToggle = { toggle, current, set: apply };
})();
