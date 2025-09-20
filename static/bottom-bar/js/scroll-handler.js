// Bottom Bar Component - Scroll Handler
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;
  let scrollThreshold = 10;
  let isScrolling = false;
  let scrollTimeout = null;
  
  window.BottomBar.ScrollHandler = {
    init(els) {
      elements = els;
      this.setupScrollHandling();
      this.updateScrollTopVisibility();
      return this;
    },
    
    setupScrollHandling() {
      const { scrollTopBtn } = elements;
      
      // Initial state
      scrollTopBtn.classList.add('is-hidden');
      
      // Throttled scroll handler
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      
      // Scroll top button click
      scrollTopBtn.addEventListener('click', this.scrollToTop.bind(this));
    },
    
    handleScroll() {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          this.updateScrollTopVisibility();
          isScrolling = false;
        });
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
        scrollTopBtn.classList.add('is-hidden');
        scrollTopBtn.classList.remove('is-active');
      } else {
        scrollTopBtn.classList.remove('is-hidden');
      }
      
      // Update state
      window.BottomBar.StateManager.setScrolledDown(!isAtTop);
    },
    
    scrollToTop() {
      const { scrollTopBtn } = elements;
      const state = window.BottomBar.StateManager.getState();
      
      // Add active state
      scrollTopBtn.classList.add('is-active');
      
      // Close drawer if open
      if (state.isOpen) {
        window.BottomBar.DrawerController.close();
      }
      
      // Smooth scroll to top
      this.smoothScrollTo(0);
      
      // Remove active state after animation
      setTimeout(() => {
        scrollTopBtn.classList.remove('is-active');
        scrollTopBtn.classList.add('is-hidden');
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