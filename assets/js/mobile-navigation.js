;(() => {
  'use strict'

  const setupGlobalNavBreakpointGuard = () => {
    const offcanvasElement = document.getElementById('k8s-mobile-main-nav')

    if (!offcanvasElement || !window.matchMedia || !window.bootstrap || !window.bootstrap.Offcanvas) {
      return
    }

    // Bootstrap closes responsive offcanvases at their static breakpoint, but the
    // global drawer uses the base `.offcanvas` class and needs an explicit guard.
    // Read Bootstrap's emitted `lg` value to stay aligned with `d-lg-none`.
    const bootstrapLgBreakpoint = getComputedStyle(document.documentElement)
      .getPropertyValue('--bs-breakpoint-lg')
      .trim()

    if (!bootstrapLgBreakpoint) {
      return
    }

    const breakpointQuery = window.matchMedia(`(min-width: ${bootstrapLgBreakpoint})`)

    const hideOffcanvas = () => {
      if (!breakpointQuery.matches) {
        return
      }

      const offcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement)
      if (offcanvas) {
        offcanvas.hide()
      }
    }

    hideOffcanvas()

    if (breakpointQuery.addEventListener) {
      breakpointQuery.addEventListener('change', hideOffcanvas)
    } else {
      breakpointQuery.addListener(hideOffcanvas)
    }
  }

  window.addEventListener('DOMContentLoaded', setupGlobalNavBreakpointGuard)
})()
