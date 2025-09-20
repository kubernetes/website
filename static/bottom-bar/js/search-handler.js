// Bottom Bar Component - Search Handler
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;
  let searchInput = null;
  
  window.BottomBar.SearchHandler = {
    init(els) {
      elements = els;
      this.setupSearch();
      return this;
    },
    
    setupSearch() {
      const { bottomBar } = elements;
      searchInput = bottomBar.querySelector('.bottom-bar-search-input');
      
      if (searchInput) {
        // Setup search input event listeners
        searchInput.addEventListener('keydown', this.handleSearchKeydown.bind(this));
        
        // Setup focus/blur for mobile keyboard handling
        searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
        searchInput.addEventListener('blur', this.handleSearchBlur.bind(this));
      }
    },
    
    handleSearchKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        searchInput.blur();
        window.BottomBar.DrawerController.close();
      } else if (e.key === 'Enter') {
        // Handle search submission
        this.submitSearch();
      }
    },
    
    handleSearchFocus(e) {
      // Notify mobile handler about focus
      if (window.BottomBar.MobileHandler) {
        window.BottomBar.MobileHandler.handleSearchInputFocus();
      }
    },
    
    handleSearchBlur(e) {
      // Notify mobile handler about blur
      if (window.BottomBar.MobileHandler) {
        window.BottomBar.MobileHandler.handleSearchInputBlur();
      }
    },
    
    onDrawerOpen() {
      // Focus search input when drawer opens in search mode
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    
    submitSearch() {
      const query = searchInput.value.trim();
      if (!query) return;
      
      // Get search page URL from data attribute
      const searchPageUrl = searchInput.getAttribute('data-search-page');
      
      if (searchPageUrl) {
        // Navigate to search page with query
        const searchUrl = `${searchPageUrl}?q=${encodeURIComponent(query)}`;
        window.location.href = searchUrl;
      }
    },
    
    clearSearch() {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
    },
    
    getSearchQuery() {
      return searchInput ? searchInput.value.trim() : '';
    },
    
    setSearchQuery(query) {
      if (searchInput) {
        searchInput.value = query;
      }
    }
  };
})();