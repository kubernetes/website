// Bottom Bar Component - Main Controller
(function() {
  'use strict';
  
  // Initialize component
  function init() {
    // Get main container
    const bottomBar = document.getElementById('bottom-bar');
    if (!bottomBar) return;
    
    // Initialize state manager
    window.BottomBar = window.BottomBar || {};
    window.BottomBar.StateManager.init();
    
    // Get DOM elements
    const elements = {
      bottomBar,
      topBar: bottomBar.querySelector('.bottom-bar__top'),
      scrollTopBtn: bottomBar.querySelector('.bottom-bar__scroll-top'),
      tocBtn: bottomBar.querySelector('.bottom-bar__toc-btn'),
      searchBtn: bottomBar.querySelector('.bottom-bar__search-btn'),
      tocContent: bottomBar.querySelector('.bottom-bar__content--toc'),
      searchContent: bottomBar.querySelector('.bottom-bar__content--search'),
      drawer: bottomBar.querySelector('.bottom-bar__drawer')
    };
    
    // Store elements globally for other modules
    window.BottomBar.elements = elements;
    
    // Initialize modules
    window.BottomBar.DrawerController.init(elements);
    window.BottomBar.TocHandler.init(elements);
    window.BottomBar.SearchHandler.init(elements);
    window.BottomBar.ScrollHandler.init(elements);
    window.BottomBar.MobileHandler.init(elements);
    
    // Setup main event listeners
    setupEventListeners(elements);
  }
  
  function setupEventListeners(elements) {
    const { tocBtn, searchBtn, scrollTopBtn } = elements;
    
    // Wire JS-driven hover (replaces :hover visuals)
    wireHoverClass(tocBtn);
    wireHoverClass(searchBtn);

    // Button clicks
    tocBtn.addEventListener('click', handleTocClick);
    searchBtn.addEventListener('click', handleSearchClick);
    scrollTopBtn.addEventListener('click', () => {
      window.BottomBar.ScrollHandler.scrollToTop();
    });
    
    // Click outside to close
    document.addEventListener('click', handleClickOutside);

    // Global Escape -> trigger the Exit (X) button when drawer is open.
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (e.defaultPrevented) return;
      const state = window.BottomBar.StateManager.getState();
      if (!state.isOpen) return;
      if (window.BottomBar.DrawerController) {
        window.BottomBar.DrawerController.close();
      }
    });
  }

  function wireHoverClass(btn) {
    // Clear any accidental hover on init
    btn.classList.remove('is-hover');
    btn.addEventListener('pointerenter', () => btn.classList.add('is-hover'));
    btn.addEventListener('pointerleave', () => btn.classList.remove('is-hover'));
    btn.addEventListener('pointercancel', () => btn.classList.remove('is-hover'));
  }
  
  function handleTocClick() {
    const state = window.BottomBar.StateManager.getState();
    const DrawerStates = window.BottomBar.StateManager.DrawerStates;
    
    if (state.isOpen && state.activeMode === DrawerStates.TOC) {
      // Clicking active button closes the drawer; reset visual state to default
      window.BottomBar.DrawerController.close();
    } else if (state.isOpen && state.activeMode !== DrawerStates.TOC) {
      window.BottomBar.DrawerController.switchMode(DrawerStates.TOC);
    } else {
      window.BottomBar.DrawerController.open(DrawerStates.TOC);
    }
  }
  
  function handleSearchClick() {
    const state = window.BottomBar.StateManager.getState();
    const DrawerStates = window.BottomBar.StateManager.DrawerStates;
    
    if (state.isOpen && state.activeMode === DrawerStates.SEARCH) {
      // Clicking active button closes the drawer; reset visual state to default
      window.BottomBar.DrawerController.close();
    } else if (state.isOpen && state.activeMode !== DrawerStates.SEARCH) {
      window.BottomBar.DrawerController.switchMode(DrawerStates.SEARCH);
    } else {
      window.BottomBar.DrawerController.open(DrawerStates.SEARCH);
    }
  }
  
  function handleClickOutside(e) {
    const state = window.BottomBar.StateManager.getState();
    if (!state.isOpen) return;
    
    const { bottomBar } = window.BottomBar.elements;
    if (!bottomBar.contains(e.target)) {
      window.BottomBar.DrawerController.close();
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
