// Bottom Bar Component - Search Handler
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;
  let searchInput = null;
  let searchButton = null;
  
  window.BottomBar.SearchHandler = {
    init(els) {
      elements = els;
      this.setupSearch();
      return this;
    },
    
    setupSearch() {
      const { bottomBar } = elements;
      searchInput = bottomBar.querySelector('.bottom-bar-search-input');
      searchButton = bottomBar.querySelector('.bottom-bar-search-submit');
      
      if (searchInput) {
        // Setup search input event listeners
        searchInput.addEventListener('keydown', this.handleSearchKeydown.bind(this));
        searchInput.addEventListener('input', this.handleSearchInput.bind(this));
        
        // Setup focus/blur for mobile keyboard handling
        searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
        searchInput.addEventListener('blur', this.handleSearchBlur.bind(this));
      }
      
      if (searchButton) {
        // Setup search button click listener
        searchButton.addEventListener('click', this.handleSearchButtonClick.bind(this));
        
        // Set initial disabled state
        this.updateSearchButtonState();
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
    
    handleSearchInput(e) {
      // Update button state when input changes
      this.updateSearchButtonState();
    },
    
    handleSearchButtonClick(e) {
      e.preventDefault();
      this.submitSearch();
    },
    
    updateSearchButtonState() {
      if (searchButton && searchInput) {
        const hasText = searchInput.value.trim().length > 0;
        searchButton.disabled = !hasText;
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
        // Update button state when drawer opens
        this.updateSearchButtonState();
        // Force an immediate refresh of --kb right after focus (helps on first-frame)
        if (window.BottomBar.MobileHandler && typeof window.BottomBar.MobileHandler.handleSearchInputFocus === 'function') {
          requestAnimationFrame(() => window.BottomBar.MobileHandler.handleSearchInputFocus());
        }
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
        this.updateSearchButtonState();
      }
    },
    
    getSearchQuery() {
      return searchInput ? searchInput.value.trim() : '';
    },
    
    setSearchQuery(query) {
      if (searchInput) {
        searchInput.value = query;
        this.updateSearchButtonState();
      }
    }
  };
})();