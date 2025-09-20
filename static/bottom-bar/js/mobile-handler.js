// Bottom Bar Component - Mobile Handler
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;
  let isTouchDevice = false;
  let viewportHandler = null;
  
  window.BottomBar.MobileHandler = {
    init(els) {
      elements = els;
      this.detectTouchDevice();
      this.setupMobileHandling();
      return this;
    },
    
    detectTouchDevice() {
      isTouchDevice = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 || 
                      navigator.msMaxTouchPoints > 0;
    },
    
    setupMobileHandling() {
      if (!isTouchDevice) return;
      
      // Setup viewport resize handling if Visual Viewport API is available
      if (window.visualViewport) {
        this.setupVisualViewportHandling();
      }
      
      // Setup orientation change handling
      window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    },
    
    setupVisualViewportHandling() {
      // Store handler for cleanup
      viewportHandler = this.handleViewportResize.bind(this);
    },
    
    handleSearchInputFocus() {
      // Small delay to ensure keyboard is starting to open
      setTimeout(() => {
        if (window.innerWidth <= 768) {
          if (window.visualViewport) {
            const keyboardHeight = this.getKeyboardHeight();
            if (keyboardHeight > 0) {
              this.adjustForKeyboard(keyboardHeight);
            }
            
            // Add viewport resize listener
            window.visualViewport.addEventListener('resize', viewportHandler);
          }
        }
      }, 100);
    },
    
    handleSearchInputBlur() {
      // Reset position when keyboard closes
      setTimeout(() => {
        this.resetPosition();
        
        // Remove viewport listener
        if (window.visualViewport && viewportHandler) {
          window.visualViewport.removeEventListener('resize', viewportHandler);
        }
      }, 100);
    },
    
    handleViewportResize() {
      if (window.innerWidth <= 768 && window.visualViewport) {
        const keyboardHeight = this.getKeyboardHeight();
        
        // Only adjust if keyboard is actually open (more than 50px difference)
        if (keyboardHeight > 50) {
          this.adjustForKeyboard(keyboardHeight);
        } else {
          this.resetPosition();
        }
      }
    },
    
    handleOrientationChange() {
      // Reset drawer position on orientation change
      setTimeout(() => {
        const state = window.BottomBar.StateManager.getState();
        if (state.isOpen) {
          window.BottomBar.DrawerController.adjustForKeyboard();
        }
      }, 300);
    },
    
    getKeyboardHeight() {
      if (!window.visualViewport) return 0;
      return window.innerHeight - window.visualViewport.height;
    },
    
    adjustForKeyboard(keyboardHeight) {
      const { bottomBar } = elements;
      const state = window.BottomBar.StateManager.getState();
      
      if (keyboardHeight > 50) {
        // Use transform to shift up by keyboard height
        if (state.isOpen) {
          bottomBar.style.transform = `translateY(-${keyboardHeight}px)`;
        } else {
          bottomBar.style.transform = `translateY(calc(100% - 60px - ${keyboardHeight}px))`;
        }
      }
    },
    
    resetPosition() {
      const { bottomBar } = elements;
      const state = window.BottomBar.StateManager.getState();
      
      // Reset transform based on drawer state
      if (state.isOpen) {
        bottomBar.style.transform = 'translateY(0)';
      } else {
        bottomBar.style.transform = 'translateY(calc(100% - 60px))';
      }
    },
    
    isMobile() {
      return window.innerWidth <= 768;
    },
    
    isTablet() {
      return window.innerWidth > 768 && window.innerWidth <= 991;
    },
    
    isDesktop() {
      return window.innerWidth > 991;
    },
    
    isTouchDevice() {
      return isTouchDevice;
    },
    
    getViewportDimensions() {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        visualWidth: window.visualViewport ? window.visualViewport.width : window.innerWidth,
        visualHeight: window.visualViewport ? window.visualViewport.height : window.innerHeight
      };
    }
  };
})();