// contacts.js — small helper for the contact page.

(function () {
  'use strict';

  function init() {
    var btn = document.getElementById('mobileMenuBtn');
    var nav = document.getElementById('navLinks');
    if (!btn || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('active', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    }

    // Capture phase on document: we become the only handler for the menu button,
    // so header.js and this file can never cancel each other out.
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      if (t.closest('#mobileMenuBtn')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setOpen(!nav.classList.contains('active'));
        return;
      }

      if (nav.classList.contains('active') && (t.closest('#navLinks a') || !t.closest('#navLinks'))) {
        setOpen(false);
      }
    }, true);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
