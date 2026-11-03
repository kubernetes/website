;(() => {
  'use strict'

  // Docsy manages the desktop theme selector as the source of truth. The mobile
  // drawer delegates changes to it and mirrors its active and pressed state.
  const setupMobileThemeSelector = () => {
    const mobileThemeControls = document.querySelectorAll('[data-k8s-theme-value]')

    if (!mobileThemeControls.length) {
      return
    }

    // Read Docsy's stored preference so `auto` remains distinct from the resolved
    // light or dark value in `data-bs-theme`.
    const getCurrentTheme = () => {
      try {
        const storedTheme = window.localStorage.getItem('td-color-theme')
        if (storedTheme) {
          return storedTheme
        }
      } catch (error) {
        // Fall back to the system preference when storage cannot be read.
      }

      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    const syncMobileThemeControls = theme => {
      for (const control of mobileThemeControls) {
        const isActive = control.getAttribute('data-k8s-theme-value') === theme
        control.classList.toggle('active', isActive)
        control.setAttribute('aria-pressed', isActive ? 'true' : 'false')
      }
    }

    const mobileNav = document.getElementById('k8s-mobile-main-nav')
    if (mobileNav) {
      mobileNav.addEventListener('show.bs.offcanvas', () => {
        syncMobileThemeControls(getCurrentTheme())
      })
    }

    for (const control of mobileThemeControls) {
      control.addEventListener('click', () => {
        const theme = control.getAttribute('data-k8s-theme-value')
        const docsyThemeControl = document.querySelector(`[data-bs-theme-value="${theme}"]`)

        if (!docsyThemeControl) {
          return
        }

        // Delegate persistence and theme changes to Docsy, then restore focus because
        // Docsy moves it to the desktop theme trigger.
        docsyThemeControl.click()
        syncMobileThemeControls(theme)
        window.setTimeout(() => control.focus(), 0)
      })
    }

    syncMobileThemeControls(getCurrentTheme())
  }

  window.addEventListener('DOMContentLoaded', setupMobileThemeSelector)
})()
