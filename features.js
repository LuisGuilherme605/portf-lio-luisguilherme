/* ========================================
   IDIOMA PT / EN
   Mantem o portugues como padrao do HTML; o ingles fica em data-en.
   Funciona no desktop (botao na nav) e no mobile (botao no menu).
   ======================================== */
(function () {
  var STORE = "lang";
  var toggles = [
    document.getElementById("langToggle"),
    document.getElementById("langToggleMobile"),
  ];

  function translate(lang) {
    var els = document.querySelectorAll("[data-en]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var en = el.getAttribute("data-en");
      if (en === null) continue;
      if (lang === "en") {
        if (el.getAttribute("data-pt") === null) {
          el.setAttribute("data-pt", el.innerHTML);
        }
        el.innerHTML = en;
      } else {
        var pt = el.getAttribute("data-pt");
        if (pt !== null) el.innerHTML = pt;
      }
    }
  }

  // O titulo em portugues vem do proprio HTML, para nao divergir dele.
  var titlePt = document.title;
  var titleEn = "Luis Guilherme — JavaScript, React & Node.js Developer";

  // aria-label nao passa pelo data-en, entao os rotulos de acessibilidade
  // fixos ficam aqui.
  var labels = {
    hamburger: ["Abrir menu de navegacao", "Open navigation menu"],
    mobileMenu: ["Menu de navegacao", "Navigation menu"],
  };

  function applyLabels(en) {
    Object.keys(labels).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute("aria-label", labels[id][en ? 1 : 0]);
    });
  }

  function apply(lang) {
    var en = lang === "en";
    document.documentElement.lang = en ? "en" : "pt-BR";
    document.body.classList.toggle("en", en);
    translate(en ? "en" : "pt");
    applyLabels(en);
    document.title = en ? titleEn : titlePt;
  }

  // Idioma inicial: escolha salva, senao detecta o navegador (PT por padrao)
  var saved = null;
  try {
    saved = localStorage.getItem(STORE);
  } catch (e) {}
  var initial =
    saved ||
    (navigator.language && navigator.language.toLowerCase().indexOf("pt") === 0
      ? "pt"
      : "en");
  apply(initial === "en" ? "en" : "pt");

  function toggleLang() {
    var next = document.documentElement.lang === "en" ? "pt" : "en";
    apply(next);
    try {
      localStorage.setItem(STORE, next);
    } catch (e) {}
  }

  toggles.forEach(function (btn) {
    if (btn) btn.addEventListener("click", toggleLang);
  });
})();
