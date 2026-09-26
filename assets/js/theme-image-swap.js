// Swap img src on Docsy theme toggle.
// <picture media="prefers-color-scheme: dark"> only reads the OS-level signal; it cannot read the
// data-bs-theme DOM attribute that Docsy's toggle writes, so we mirror that attribute into img.src here.
(() => {
  'use strict';

  const apply = () => {
    const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    document.querySelectorAll('img[data-theme-src-dark]').forEach(img => {
      const next = dark
        ? img.getAttribute('data-theme-src-dark')
        : img.getAttribute('data-theme-src-light');
      if (next && img.getAttribute('src') !== next) {
        img.setAttribute('src', next);
      }
    });
  };

  apply();

  new MutationObserver(apply).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-bs-theme'],
  });
})();
