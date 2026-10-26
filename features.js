/* ========================================
   IDIOMA PT / EN
   Mantem o portugues como padrao do HTML; o ingles fica em data-en.
   Funciona no desktop (botao na nav) e no mobile (botao no menu).
   ======================================== */
(function () {
  const STORE = "lang";
  const toggles = [
    document.getElementById("langToggle"),
    document.getElementById("langToggleMobile"),
  ].filter(Boolean);

  function translate(lang) {
    const els = document.querySelectorAll("[data-en]");
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      const en = el.getAttribute("data-en");
      if (en === null) continue;
      if (lang === "en") {
        if (el.getAttribute("data-pt") === null) {
          el.setAttribute("data-pt", el.innerHTML);
        }
        el.innerHTML = en;
      } else {
        const pt = el.getAttribute("data-pt");
        if (pt !== null) el.innerHTML = pt;
      }
    }
  }

  // O titulo em portugues vem do proprio HTML, para nao divergir dele.
  const titlePt = document.title;
  const titleEn = "Luis Guilherme — JavaScript, React & Node.js Developer";

  function apply(lang) {
    const en = lang === "en";
    document.documentElement.lang = en ? "en" : "pt-BR";
    document.body.classList.toggle("en", en);
    translate(en ? "en" : "pt");
    document.title = en ? titleEn : titlePt;
    toggles.forEach((btn) => btn.setAttribute("aria-pressed", String(en)));
  }

  // Idioma inicial: escolha salva, senao detecta o navegador (PT por padrao)
  let saved = null;
  try {
    saved = localStorage.getItem(STORE);
  } catch (e) {}
  const initial =
    saved ||
    (navigator.language && navigator.language.toLowerCase().indexOf("pt") === 0
      ? "pt"
      : "en");
  apply(initial === "en" ? "en" : "pt");

  function toggleLang() {
    const next = document.documentElement.lang === "en" ? "pt" : "en";
    apply(next);
    try {
      localStorage.setItem(STORE, next);
    } catch (e) {}
  }

  toggles.forEach((btn) => btn.addEventListener("click", toggleLang));
})();
