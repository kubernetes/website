// Mobile Search Component - Standalone functionality
(function() {
  'use strict';
  
  // Initialize when DOM is ready
  function init() {
    const mobileSearchWrapper = document.querySelector('.mobile-search-wrapper');
    if (!mobileSearchWrapper) return;
    
    const searchInput = mobileSearchWrapper.querySelector('.mobile-search-input');
    const searchButton = mobileSearchWrapper.querySelector('.mobile-search-submit');
    
    if (!searchInput || !searchButton) return;
    
    // Setup event listeners
    setupEventListeners(searchInput, searchButton);
    
    // Set initial button state
    updateButtonState(searchInput, searchButton);
  }
  
  function setupEventListeners(input, button) {
    // Handle input changes
    input.addEventListener('input', function() {
      updateButtonState(input, button);
    });
    
    // Handle Enter key
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        submitSearch(input);
      }
    });
    
    // Handle button click
    button.addEventListener('click', function(e) {
      e.preventDefault();
      submitSearch(input);
    });
  }
  
  function updateButtonState(input, button) {
    const hasText = input.value.trim().length > 0;
    button.disabled = !hasText;
    
    // Update button color based on state
    if (hasText) {
      button.classList.add('has-text');
    } else {
      button.classList.remove('has-text');
    }
  }
  
  function submitSearch(input) {
    const query = input.value.trim();
    if (!query) return;
    
    // Get search page URL from data attribute
    const searchPageUrl = input.getAttribute('data-search-page');
    
    if (searchPageUrl) {
      // Navigate to search page with query
      const searchUrl = `${searchPageUrl}?q=${encodeURIComponent(query)}`;
      window.location.href = searchUrl;
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();