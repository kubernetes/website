/**
 * Kubernetes Website Theme Toggle
 * Handles light/dark mode switching with localStorage persistence
 * and system preference detection.
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'k8s-theme';
  var THEME_ATTR = 'data-theme';
  var THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  };

  /**
   * Get the system preference for color scheme
   * @returns {string} 'dark' or 'light'
   */
  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }
    return THEMES.LIGHT;
  }

  /**
   * Get the stored theme preference from localStorage
   * @returns {string|null} Stored theme or null
   */
  function getStoredPreference() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage not available (private browsing, etc.)
      return null;
    }
  }

  /**
   * Store the theme preference in localStorage
   * @param {string} theme - Theme to store
   */
  function setStoredPreference(theme) {
    try {
      if (theme === THEMES.AUTO) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Get the effective theme (resolves 'auto' to actual theme)
   * @param {string} theme - Theme preference
   * @returns {string} Effective theme ('light' or 'dark')
   */
  function getEffectiveTheme(theme) {
    if (theme === THEMES.AUTO || !theme) {
      return getSystemPreference();
    }
    return theme;
  }

  /**
   * Apply the theme to the document
   * @param {string} theme - Theme to apply ('light', 'dark', or 'auto')
   */
  function applyTheme(theme) {
    var effectiveTheme = getEffectiveTheme(theme);
    document.documentElement.setAttribute(THEME_ATTR, effectiveTheme);

    // Mark that theme has been loaded (enables CSS transitions)
    document.documentElement.setAttribute('data-theme-loaded', 'true');

    // Update toggle button state
    updateToggleButton(effectiveTheme);

    // Update Mermaid diagrams if present
    updateMermaidTheme(effectiveTheme);

    // Dispatch custom event for other components
    if (typeof CustomEvent === 'function') {
      document.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme: effectiveTheme, preference: theme }
      }));
    }
  }

  /**
   * Update the toggle button appearance and aria attributes
   * @param {string} theme - Current effective theme
   */
  function updateToggleButton(theme) {
    var toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;

    var sunIcon = toggleBtn.querySelector('.theme-icon-light');
    var moonIcon = toggleBtn.querySelector('.theme-icon-dark');

    if (theme === THEMES.DARK) {
      if (sunIcon) sunIcon.classList.add('d-none');
      if (moonIcon) moonIcon.classList.remove('d-none');
      toggleBtn.setAttribute('aria-label', toggleBtn.getAttribute('data-label-light') || 'Switch to light mode');
      toggleBtn.setAttribute('title', toggleBtn.getAttribute('data-label-light') || 'Switch to light mode');
    } else {
      if (sunIcon) sunIcon.classList.remove('d-none');
      if (moonIcon) moonIcon.classList.add('d-none');
      toggleBtn.setAttribute('aria-label', toggleBtn.getAttribute('data-label-dark') || 'Switch to dark mode');
      toggleBtn.setAttribute('title', toggleBtn.getAttribute('data-label-dark') || 'Switch to dark mode');
    }
  }

  /**
   * Update Mermaid diagrams theme if Mermaid is loaded
   * @param {string} theme - Current theme
   */
  function updateMermaidTheme(theme) {
    if (typeof mermaid !== 'undefined' && mermaid.initialize) {
      try {
        mermaid.initialize({
          theme: theme === THEMES.DARK ? 'dark' : 'default',
          startOnLoad: false
        });
        // Re-render existing diagrams if needed
        var diagrams = document.querySelectorAll('.mermaid[data-processed="true"]');
        if (diagrams.length > 0 && mermaid.contentLoaded) {
          mermaid.contentLoaded();
        }
      } catch (e) {
        // Mermaid initialization error, ignore
      }
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    var current = document.documentElement.getAttribute(THEME_ATTR);
    var newTheme = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setStoredPreference(newTheme);
    applyTheme(newTheme);
  }

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    var stored = getStoredPreference();
    var theme = stored || THEMES.AUTO;
    applyTheme(theme);
  }

  /**
   * Set up event listeners for theme toggle and system preference changes
   */
  function setupEventListeners() {
    // Theme toggle button click
    document.addEventListener('click', function(e) {
      var toggleBtn = e.target.closest('.theme-toggle');
      if (toggleBtn) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Theme toggle keyboard support
    document.addEventListener('keydown', function(e) {
      var toggleBtn = e.target.closest('.theme-toggle');
      if (toggleBtn && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // System preference change listener
    if (window.matchMedia) {
      var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Use the appropriate method based on browser support
      var handler = function() {
        var stored = getStoredPreference();
        if (!stored) {
          // Only auto-update if user hasn't set a preference
          applyTheme(THEMES.AUTO);
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
      } else if (mediaQuery.addListener) {
        // Fallback for older browsers
        mediaQuery.addListener(handler);
      }
    }
  }

  /**
   * Initialize theme immediately to prevent flash of wrong theme
   * This runs before DOM is ready
   */
  initTheme();

  /**
   * Set up event listeners when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEventListeners);
  } else {
    setupEventListeners();
  }

  /**
   * Expose public API for external use
   */
  window.k8sTheme = {
    /**
     * Toggle between light and dark themes
     */
    toggle: toggleTheme,

    /**
     * Set a specific theme
     * @param {string} theme - 'light', 'dark', or 'auto'
     */
    set: function(theme) {
      if (theme === THEMES.LIGHT || theme === THEMES.DARK || theme === THEMES.AUTO) {
        setStoredPreference(theme);
        applyTheme(theme);
      }
    },

    /**
     * Get the current effective theme
     * @returns {string} Current theme ('light' or 'dark')
     */
    get: function() {
      return document.documentElement.getAttribute(THEME_ATTR) || THEMES.LIGHT;
    },

    /**
     * Get the user's stored preference
     * @returns {string|null} Stored preference or null if using auto
     */
    getPreference: function() {
      return getStoredPreference();
    }
  };
})();
