// Bottom Bar Component - State Manager
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  // Drawer states enum
  const DrawerStates = {
    CLOSED: 'closed',
    TOC: 'toc',
    SEARCH: 'search'
  };
  
  // State object
  const state = {
    isOpen: false,
    activeMode: DrawerStates.CLOSED,
    hasToc: false,
    isScrolledDown: false
  };
  
  // State change listeners
  const listeners = [];
  
  window.BottomBar.StateManager = {
    DrawerStates,
    
    init() {
      this.checkForToc();
      return this;
    },
    
    getState() {
      return { ...state };
    },
    
    setState(updates) {
      const oldState = { ...state };
      Object.assign(state, updates);
      this.notifyListeners(oldState, state);
    },
    
    setDrawerOpen(isOpen, mode = null) {
      const updates = { isOpen };
      if (mode !== null) {
        updates.activeMode = mode;
      }
      this.setState(updates);
    },
    
    setActiveMode(mode) {
      this.setState({ activeMode: mode });
    },
    
    setScrolledDown(isScrolledDown) {
      this.setState({ isScrolledDown });
    },
    
    checkForToc() {
      const bottomBar = document.getElementById('bottom-bar');
      if (!bottomBar) return;
      
      const tocList = bottomBar.querySelector('.bottom-bar-toc__list');
      const tocLinks = tocList ? tocList.querySelectorAll('a') : [];
      state.hasToc = tocLinks.length > 0;
    },
    
    subscribe(listener) {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    
    notifyListeners(oldState, newState) {
      listeners.forEach(listener => {
        listener(oldState, newState);
      });
    }
  };
})();