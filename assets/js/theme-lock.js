// theme_lock front-matter: pin a page to "light" or "dark" regardless of user preference.
// Reads window.themeLock set by the inline init in head-end.html, then forces data-bs-theme
// and reverts any later writes (Docsy's dark-mode.js, cross-tab updates, etc.).
(() => {
  const lock = window.themeLock;
  if (lock !== 'light' && lock !== 'dark') return;
  const root = document.documentElement;
  root.setAttribute('data-bs-theme', lock);
  root.classList.add('theme-locked');
  new MutationObserver(() => {
    if (root.getAttribute('data-bs-theme') !== lock) {
      root.setAttribute('data-bs-theme', lock);
    }
  }).observe(root, { attributes: true, attributeFilter: ['data-bs-theme'] });
})();
