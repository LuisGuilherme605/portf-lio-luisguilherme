/* ========================================
   createDialog — base compartilhada de diálogo acessível
   usada pela command palette e pelo modal de projetos.
   cuida de: abrir/fechar sem flash, salvar e devolver o foco, travar o
   scroll do body, Esc pra fechar, clique no backdrop (data-close),
   foco preso no Tab, e o "hide" adiado à prova de reabertura rápida.
   ======================================== */
(function () {
  "use strict";

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  window.createDialog = function (root, opts) {
    opts = opts || {};
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lockClass = opts.lockClass || "scroll-lock";
    const animMs = typeof opts.animMs === "number" ? opts.animMs : 160;
    const getFocus = opts.focusTarget || (() => root);

    let isOpen = false;
    let lastFocus = null;

    function open() {
      if (isOpen) return;
      isOpen = true;
      lastFocus = document.activeElement;
      if (opts.onBeforeOpen) opts.onBeforeOpen();
      root.hidden = false;
      document.body.classList.add(lockClass);
      requestAnimationFrame(() => {
        root.classList.add("open");
        const f = getFocus();
        if (f && typeof f.focus === "function") f.focus();
      });
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      root.classList.remove("open");
      document.body.classList.remove(lockClass);
      // só esconde se continuar fechado (evita race no fechar/reabrir rápido)
      const hide = () => {
        if (!isOpen) root.hidden = true;
      };
      if (reduce) hide();
      else setTimeout(hide, animMs);
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      if (opts.onClose) opts.onClose();
    }

    function toggle() {
      if (isOpen) close();
      else open();
    }

    root.addEventListener("keydown", (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        const items = Array.prototype.slice.call(root.querySelectorAll(FOCUSABLE));
        if (!items.length) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const idx = items.indexOf(document.activeElement);
        // foco num container (ex.: painel com tabindex=-1): prende no primeiro/último
        if (idx === -1) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
          return;
        }
        if (items.length === 1) {
          e.preventDefault();
          first.focus();
          return;
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    root.addEventListener("click", (e) => {
      const tgt = e.target;
      if (tgt && tgt.hasAttribute && tgt.hasAttribute("data-close")) close();
    });

    return {
      open: open,
      close: close,
      toggle: toggle,
      get isOpen() {
        return isOpen;
      },
    };
  };
})();
