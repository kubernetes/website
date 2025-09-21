// Bottom Bar Component - Mobile Handler (scoped var + anti-jitter + keyboard-only inset)
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;
  let isTouchDevice = false;

  // rAF-coalesced updater
  let queued = false;
  let lastPx = -1;

  // Keyboard detection with hysteresis to avoid flapping
  let keyboardOpen = false;
  const KEYBOARD_OPEN_THRESHOLD = 140;  // px delta to consider "open"
  const KEYBOARD_CLOSE_THRESHOLD = 100; // px delta to consider "closed"

  // micro-change ignore threshold (you reverted to 0.5)
  const MICRO_DELTA = 0.5;

  function roundToDevicePixel(px) {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(px * dpr) / dpr;
  }

  function computeViewportDelta() {
    const vv = window.visualViewport;
    if (!vv) return { delta: 0, offsetTop: 0, height: window.innerHeight };
    const delta = window.innerHeight - vv.height; // how much shorter the visual viewport is
    return { delta, offsetTop: vv.offsetTop || 0, height: vv.height };
  }

  function updateKeyboardState(delta) {
    if (!keyboardOpen && delta > KEYBOARD_OPEN_THRESHOLD) {
      keyboardOpen = true;
    } else if (keyboardOpen && delta < KEYBOARD_CLOSE_THRESHOLD) {
      keyboardOpen = false;
    }
  }

  function computeKeyboardInsetPx() {
    const vv = window.visualViewport;
    if (!vv) return 0;

    // Decide if the keyboard is open (hysteresis)
    const { delta } = computeViewportDelta();
    updateKeyboardState(delta);

    if (!keyboardOpen) {
      // Keyboard closed: ignore toolbar/URL bar shifts; pin to 0
      return 0;
    }

    // Keyboard open: compute occlusion including offsetTop
    // occlusion = innerHeight - (vv.height + vv.offsetTop)
    const occluded = window.innerHeight - (vv.height + vv.offsetTop);
    return Math.max(0, occluded);
  }

  function scheduleUpdate(bottomBarEl) {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;

      let px = 0;
      if (window.visualViewport) {
        // First update keyboard state off the raw delta (not rounded)
        const { delta } = computeViewportDelta();
        updateKeyboardState(delta);

        // Then compute inset only if keyboard is open
        px = keyboardOpen ? computeKeyboardInsetPx() : 0;
      }

      // round to device pixels to avoid sub-pixel jitter
      px = roundToDevicePixel(px);

      // ignore micro-changes to avoid "breathing"
      if (Math.abs(px - lastPx) < MICRO_DELTA) return;

      lastPx = px;
      // set element-scoped CSS var
      if (bottomBarEl) {
        bottomBarEl.style.setProperty('--kb', px + 'px');
      }
    });
  }
  
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

      const bottomBarEl = elements && elements.bottomBar ? elements.bottomBar : null;

      // Initialize once
      scheduleUpdate(bottomBarEl);

      // Keep --kb in sync whenever the keyboard animates or you scroll the visual viewport
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => scheduleUpdate(bottomBarEl), { passive: true });
        window.visualViewport.addEventListener('scroll', () => scheduleUpdate(bottomBarEl), { passive: true });
      }

      // Window-level changes that can influence layout viewport math
      window.addEventListener('resize', () => scheduleUpdate(bottomBarEl), { passive: true });
      window.addEventListener('orientationchange', () => {
        // let visual viewport settle a frame
        setTimeout(() => scheduleUpdate(bottomBarEl), 0);
      });
    },
    
    handleSearchInputFocus() {
      // Give the keyboard one frame to start animating, then refresh --kb.
      requestAnimationFrame(() => {
        const bb = elements && elements.bottomBar ? elements.bottomBar : null;
        scheduleUpdate(bb);
      });
    },
    
    handleSearchInputBlur() {
      // No-op: listeners will bring --kb back to ~0 when keyboard closes via hysteresis.
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