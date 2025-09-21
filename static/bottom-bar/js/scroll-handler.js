// Bottom Bar Component - Scroll Handler
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;
  let scrollThreshold = 10;
  let isScrolling = false;
  let scrollTimeout = null;

  // Tracks whether the scroll-top button was hidden on the last visibility check.
  // Used to detect a "reappear" transition and reset its visual state.
  let wasHidden = true;

  // NEW: page-bottom occlusion
  const BOTTOM_TOLERANCE_PX = 2; // tiny fudge for fractional pixels
  let rafQueued = false;

  function isAtPageBottom() {
    const doc = document.documentElement;
    // account for rounding issues on some mobile browsers
    const viewportBottom = Math.ceil(window.scrollY + window.innerHeight);
    return viewportBottom >= (doc.scrollHeight - BOTTOM_TOLERANCE_PX);
  }

  function updateOcclusionBottom() {
    const bar = elements && elements.bottomBar ? elements.bottomBar : null;
    if (!bar) return;

    // Respect CSS visibility (e.g., min-width:768px => display:none)
    const displayStyle = getComputedStyle(bar).display;
    const cssHidden = displayStyle === 'none';
    if (cssHidden) {
      // ensure we don't leave the class stuck when resizing across breakpoints
      bar.classList.remove('is-occluded-bottom');
      return;
    }

    if (isAtPageBottom()) {
      bar.classList.add('is-occluded-bottom');
    } else {
      bar.classList.remove('is-occluded-bottom');
    }
  }

  // rAF coalescer so we do both updates in one paint
  function queueRafUpdate() {
    if (rafQueued) return;
    rafQueued = true;
    window.requestAnimationFrame(() => {
      rafQueued = false;
      BottomBar.ScrollHandler.updateScrollTopVisibility();
      updateOcclusionBottom();
      isScrolling = false;
    });
  }
  
  window.BottomBar.ScrollHandler = {
    init(els) {
      elements = els;
      this.setupScrollHandling();
      this.updateScrollTopVisibility();
      updateOcclusionBottom(); // initial pass
      return this;
    },
    
    setupScrollHandling() {
      const { scrollTopBtn } = elements;
      
      // Initial state: hidden and definitely not hovered/active
      scrollTopBtn.classList.add('is-hidden');
      scrollTopBtn.classList.remove('is-active', 'is-hover');
      wasHidden = true;
      
      // Throttled scroll handler -> coalesced with rAF
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      window.addEventListener('resize', () => {
        queueRafUpdate();
      }, { passive: true });
      window.addEventListener('orientationchange', () => {
        setTimeout(() => queueRafUpdate(), 0);
      });

      // Scroll top button click
      scrollTopBtn.addEventListener('click', this.scrollToTop.bind(this));

      // Pointer-driven hover (replaces CSS :hover for this button)
      scrollTopBtn.addEventListener('pointerenter', () => {
        scrollTopBtn.classList.add('is-hover');
      });
      scrollTopBtn.addEventListener('pointerleave', () => {
        scrollTopBtn.classList.remove('is-hover');
      });
      // Safety: when pointer is canceled (e.g., touch), clear hover
      scrollTopBtn.addEventListener('pointercancel', () => {
        scrollTopBtn.classList.remove('is-hover');
      });
    },
    
    handleScroll() {
      if (!isScrolling) {
        queueRafUpdate();
        isScrolling = true;
      }
      
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set new timeout for scroll end detection
      scrollTimeout = setTimeout(() => {
        this.onScrollEnd();
      }, 150);
    },
    
    updateScrollTopVisibility() {
      const { scrollTopBtn } = elements;
      const isAtTop = window.scrollY <= scrollThreshold;
      
      if (isAtTop) {
        // At top: hide and clear all visual states
        scrollTopBtn.classList.add('is-hidden');
        scrollTopBtn.classList.remove('is-active', 'is-hover');
      } else {
        // Not at top: show the button
        if (wasHidden) {
          // On reappear, ensure default (non-active, non-hover) visuals
          scrollTopBtn.classList.remove('is-active', 'is-hover');
        }
        scrollTopBtn.classList.remove('is-hidden');
      }

      // Remember for next tick whether the button is hidden.
      wasHidden = isAtTop;

      // Update shared state
      window.BottomBar.StateManager.setScrolledDown(!isAtTop);
    },
    
    scrollToTop() {
      const { scrollTopBtn } = elements;
      const state = window.BottomBar.StateManager.getState();
      
      // Add active state during the user-initiated scroll
      scrollTopBtn.classList.add('is-active');
      
      // Close drawer if open
      if (state.isOpen) {
        window.BottomBar.DrawerController.close();
      }
      
      // Smooth scroll to top
      this.smoothScrollTo(0);
      
      // Remove active state after animation (fallback).
      // When we actually reach the top, updateScrollTopVisibility() also clears it.
      setTimeout(() => {
        scrollTopBtn.classList.remove('is-active');
        scrollTopBtn.classList.add('is-hidden');
        // Since we just hid it, mark hidden so the next time it reappears
        // it will be reset to the default state as well.
        wasHidden = true;
      }, 1000);
    },
    
    smoothScrollTo(position) {
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    },
    
    onScrollEnd() {
      // Can be used for any scroll-end specific logic
      isScrolling = false;
      // Make one last pass to avoid edge jitter when momentum scrolling stops
      queueRafUpdate();
    },
    
    getScrollPosition() {
      return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
      };
    },
    
    getDocumentHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
    },
    
    getScrollPercentage() {
      const scrollPos = this.getScrollPosition();
      const docHeight = this.getDocumentHeight();
      const winHeight = window.innerHeight;
      const scrollableHeight = docHeight - winHeight;
      
      if (scrollableHeight <= 0) return 0;
      
      return Math.min(100, Math.round((scrollPos.y / scrollableHeight) * 100));
    }
  };
})();
