// Bottom Bar Component
(function() {
  'use strict';
  
  // Drawer states enum
  const DrawerStates = {
    CLOSED: 'closed',
    TOC: 'toc',
    SEARCH: 'search'
  };
  
  // State management
  const state = {
    isOpen: false,
    activeMode: DrawerStates.CLOSED,
    hasToc: false
  };
  
  // DOM elements
  let bottomBar, topBar, scrollTopBtn, tocBtn, searchBtn, exitBtn;
  let tocContent, searchContent, drawer;
  
  // Initialize component
  function init() {
    // Get DOM elements
    bottomBar = document.getElementById('bottom-bar');
    if (!bottomBar) return;
    
    topBar = bottomBar.querySelector('.bottom-bar__top');
    scrollTopBtn = bottomBar.querySelector('.bottom-bar__scroll-top');
    tocBtn = bottomBar.querySelector('.bottom-bar__toc-btn');
    searchBtn = bottomBar.querySelector('.bottom-bar__search-btn');
    exitBtn = bottomBar.querySelector('.bottom-bar__exit-btn');
    tocContent = bottomBar.querySelector('.bottom-bar__content--toc');
    searchContent = bottomBar.querySelector('.bottom-bar__content--search');
    drawer = bottomBar.querySelector('.bottom-bar__drawer');
    
    // Check for ToC on page
    checkForToc();
    
    // Set initial states
    scrollTopBtn.classList.add('is-hidden');
    updateScrollTopVisibility();
    
    // Event listeners
    scrollTopBtn.addEventListener('click', handleScrollTop);
    tocBtn.addEventListener('click', handleTocClick);
    searchBtn.addEventListener('click', handleSearchClick);
    exitBtn.addEventListener('click', handleExitClick);
    window.addEventListener('scroll', updateScrollTopVisibility);
    
    // Click outside to close
    document.addEventListener('click', handleClickOutside);
    
    // Setup TOC interactions
    setupTocInteractions();
    
    // Setup keyboard handling for mobile
    setupMobileKeyboardHandling();
  }
  
  // Check if page has ToC
  function checkForToc() {
    // Check if the TOC list exists
    const tocList = bottomBar.querySelector('.bottom-bar-toc__list');
    const tocLinks = tocList ? tocList.querySelectorAll('a') : [];
    
    state.hasToc = tocLinks.length > 0;
  }
  
  // Setup TOC interactions
  function setupTocInteractions() {
    if (!tocContent) return;
    
    // Handle toggle buttons for expanding/collapsing sections
    const toggleButtons = tocContent.querySelectorAll('.bottom-bar-toc__toggle');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const listItem = this.closest('.bottom-bar-toc__item');
        const childrenList = listItem.querySelector('.bottom-bar-toc__children');
        
        if (childrenList) {
          const isExpanded = childrenList.classList.contains('expanded');
          
          if (isExpanded) {
            childrenList.classList.remove('expanded');
            this.setAttribute('aria-expanded', 'false');
          } else {
            childrenList.classList.add('expanded');
            this.setAttribute('aria-expanded', 'true');
          }
        }
      });
    });
    
    // Close drawer when TOC link is clicked
    const tocLinks = tocContent.querySelectorAll('.bottom-bar-toc__link');
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Allow default navigation but close the drawer
        setTimeout(() => {
          closeDrawer();
        }, 100);
      });
    });
  }
  
  // Scroll to active item in TOC
  function scrollToActiveItem() {
    const activeItem = tocContent.querySelector('.bottom-bar-toc__item.active');
    if (!activeItem) return;
    
    // Ensure parent items are expanded
    let parent = activeItem.parentElement;
    while (parent && parent !== tocContent) {
      if (parent.classList.contains('bottom-bar-toc__children')) {
        parent.classList.add('expanded');
        
        // Update toggle button state
        const listItem = parent.closest('.bottom-bar-toc__item');
        if (listItem) {
          const toggle = listItem.querySelector('.bottom-bar-toc__toggle');
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
          }
        }
      }
      parent = parent.parentElement;
    }
    
    // Scroll the active item into view
    setTimeout(() => {
      const drawerRect = drawer.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      
      // Calculate position to center the active item (or at least make it visible)
      const scrollTop = drawer.scrollTop;
      const itemTop = itemRect.top - drawerRect.top + scrollTop;
      const itemHeight = itemRect.height;
      const drawerHeight = drawerRect.height;
      
      // Scroll to position the item at 1/3 from the top of the drawer
      const targetScroll = itemTop - (drawerHeight / 3);
      
      drawer.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }, 100);
  }
  
  // Update scroll top button visibility
  function updateScrollTopVisibility() {
    const isAtTop = window.scrollY <= 10;
    
    if (isAtTop) {
      scrollTopBtn.classList.add('is-hidden');
      scrollTopBtn.classList.remove('is-active');
    } else {
      scrollTopBtn.classList.remove('is-hidden');
    }
  }
  
  // Handle scroll to top
  function handleScrollTop() {
    // Add active state
    scrollTopBtn.classList.add('is-active');
    
    // Close drawer if open
    if (state.isOpen) {
      closeDrawer();
    }
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Remove active state after animation
    setTimeout(() => {
      scrollTopBtn.classList.remove('is-active');
      scrollTopBtn.classList.add('is-hidden');
    }, 1000);
  }
  
  // Handle ToC button click
  function handleTocClick() {
    if (state.isOpen && state.activeMode === DrawerStates.TOC) {
      closeDrawer();
    } else if (state.isOpen && state.activeMode !== DrawerStates.TOC) {
      switchMode(DrawerStates.TOC);
    } else {
      openDrawer(DrawerStates.TOC);
    }
  }
  
  // Handle search button click
  function handleSearchClick() {
    if (state.isOpen && state.activeMode === DrawerStates.SEARCH) {
      closeDrawer();
    } else if (state.isOpen && state.activeMode !== DrawerStates.SEARCH) {
      switchMode(DrawerStates.SEARCH);
    } else {
      openDrawer(DrawerStates.SEARCH);
    }
  }
  
  // Handle exit button click
  function handleExitClick() {
    closeDrawer();
  }
  
  // Open drawer
  function openDrawer(mode) {
    state.isOpen = true;
    state.activeMode = mode;
    
    // Show bottom bar with appropriate transform
    bottomBar.classList.add('is-open');
    
    // Check if keyboard is open and adjust accordingly
    if (window.innerWidth <= 768 && window.visualViewport) {
      const keyboardHeight = window.innerHeight - window.visualViewport.height;
      if (keyboardHeight > 50) {
        // Keyboard is open, shift up by keyboard height
        bottomBar.style.transform = `translateY(-${keyboardHeight}px)`;
      } else {
        // No keyboard, just show drawer normally
        bottomBar.style.transform = 'translateY(0)';
      }
    } else {
      // Desktop or no visual viewport API
      bottomBar.style.transform = 'translateY(0)';
    }
    
    // Show exit button
    exitBtn.classList.add('is-visible');
    
    // Set drawer height based on mode
    drawer.className = 'bottom-bar__drawer state-' + mode;
    
    // Remove inline height style that might be set from closing
    drawer.style.height = '';
    
    // Reset opacity for both contents
    tocContent.style.opacity = '';
    searchContent.style.opacity = '';
    
    // Show appropriate content
    if (mode === DrawerStates.TOC) {
      tocContent.classList.add('is-active');
      searchContent.classList.remove('is-active');
      tocBtn.classList.add('is-active');
      searchBtn.classList.remove('is-active');
      drawer.scrollTop = 0;
      
      // Scroll to active item after drawer opens
      setTimeout(() => {
        scrollToActiveItem();
      }, 300);
    } else if (mode === DrawerStates.SEARCH) {
      searchContent.classList.add('is-active');
      tocContent.classList.remove('is-active');
      searchBtn.classList.add('is-active');
      tocBtn.classList.remove('is-active');
      drawer.scrollTop = 0;
      
      // Focus search input when opening search drawer
      setTimeout(() => {
        const searchInput = bottomBar.querySelector('.bottom-bar-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 300);
    }
  }
  
  // Close drawer
  function closeDrawer() {
    state.isOpen = false;
    state.activeMode = DrawerStates.CLOSED;
    
    // Hide drawer with animation
    drawer.style.height = '0';
    
    // Hide exit button
    exitBtn.classList.remove('is-visible');
    
    // Remove active states from buttons
    tocBtn.classList.remove('is-active');
    searchBtn.classList.remove('is-active');
    
    // Reset transform to show only the top bar
    bottomBar.style.transform = 'translateY(calc(100% - 60px))';
    
    // After animation completes, hide content
    setTimeout(() => {
      bottomBar.classList.remove('is-open');
      tocContent.classList.remove('is-active');
      searchContent.classList.remove('is-active');
      drawer.className = 'bottom-bar__drawer';
    }, 300);
  }
  
  // Switch between modes
  function switchMode(newMode) {
    const oldContent = state.activeMode === DrawerStates.TOC ? tocContent : searchContent;
    const newContent = newMode === DrawerStates.TOC ? tocContent : searchContent;
    
    // Update button states
    if (newMode === DrawerStates.TOC) {
      tocBtn.classList.add('is-active');
      searchBtn.classList.remove('is-active');
    } else {
      searchBtn.classList.add('is-active');
      tocBtn.classList.remove('is-active');
    }
    
    // Update drawer height for new mode
    drawer.className = 'bottom-bar__drawer state-' + newMode;
    
    // Remove any inline height style
    drawer.style.height = '';
    
    // Check if keyboard is open and maintain proper transform
    if (window.innerWidth <= 768 && window.visualViewport) {
      const keyboardHeight = window.innerHeight - window.visualViewport.height;
      if (keyboardHeight > 50) {
        // Keyboard is open, maintain shift up
        bottomBar.style.transform = `translateY(-${keyboardHeight}px)`;
      }
    }
    
    // Fade out old content
    oldContent.style.opacity = '0';
    
    setTimeout(() => {
      oldContent.classList.remove('is-active');
      newContent.classList.add('is-active');
      
      // Reset opacity
      newContent.style.opacity = '';
      
      // Reset scroll position
      drawer.scrollTop = 0;
      
      // Fade in new content
      setTimeout(() => {
        newContent.style.opacity = '1';
        
        // Handle mode-specific actions
        if (newMode === DrawerStates.TOC) {
          // Scroll to active item after switching
          setTimeout(() => {
            scrollToActiveItem();
          }, 100);
        } else if (newMode === DrawerStates.SEARCH) {
          // Focus search input if switching to search mode
          const searchInput = bottomBar.querySelector('.bottom-bar-search-input');
          if (searchInput) {
            searchInput.focus();
          }
        }
      }, 10);
    }, 200);
    
    state.activeMode = newMode;
  }
  
  // Handle click outside
  function handleClickOutside(e) {
    if (!state.isOpen) return;
    
    // Check if click was outside the bottom bar
    if (!bottomBar.contains(e.target)) {
      closeDrawer();
    }
  }
  
  // Setup mobile keyboard handling
  function setupMobileKeyboardHandling() {
    // Check if we're on a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) return;
    
    // Add event listeners for search input
    document.addEventListener('focusin', function(e) {
      if (e.target && e.target.classList && e.target.classList.contains('bottom-bar-search-input')) {
        handleSearchInputFocus();
      }
    });
    
    document.addEventListener('focusout', function(e) {
      if (e.target && e.target.classList && e.target.classList.contains('bottom-bar-search-input')) {
        handleSearchInputBlur();
      }
    });
  }
  
  // Handle search input focus (keyboard opening)
  function handleSearchInputFocus() {
    // Small delay to ensure keyboard is starting to open
    setTimeout(() => {
      // Check viewport width for mobile
      if (window.innerWidth <= 768) {
        // Use Visual Viewport API if available (most modern mobile browsers)
        if (window.visualViewport) {
          const keyboardHeight = window.innerHeight - window.visualViewport.height;
          if (keyboardHeight > 0) {
            // Use transform to shift up by keyboard height
            if (state.isOpen) {
              bottomBar.style.transform = `translateY(-${keyboardHeight}px)`;
            } else {
              bottomBar.style.transform = `translateY(calc(100% - 60px - ${keyboardHeight}px))`;
            }
          }
          
          // Listen for viewport resize only (not scroll)
          window.visualViewport.addEventListener('resize', handleViewportResize);
        }
      }
    }, 100);
  }
  
  // Handle search input blur (keyboard closing)
  function handleSearchInputBlur() {
    // Reset position when keyboard closes
    setTimeout(() => {
      // Reset transform based on drawer state
      if (state.isOpen) {
        bottomBar.style.transform = 'translateY(0)';
      } else {
        bottomBar.style.transform = 'translateY(calc(100% - 60px))';
      }
      
      // Remove viewport listener if it exists
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
    }, 100);
  }
  
  // Handle viewport resize (for Visual Viewport API)
  function handleViewportResize() {
    if (window.innerWidth <= 768 && window.visualViewport) {
      const keyboardHeight = window.innerHeight - window.visualViewport.height;
      // Only adjust if keyboard is actually open (more than 50px difference)
      if (keyboardHeight > 50) {
        // Use transform to shift up by keyboard height
        if (state.isOpen) {
          bottomBar.style.transform = `translateY(-${keyboardHeight}px)`;
        } else {
          bottomBar.style.transform = `translateY(calc(100% - 60px - ${keyboardHeight}px))`;
        }
      } else {
        // Reset transform based on drawer state
        if (state.isOpen) {
          bottomBar.style.transform = 'translateY(0)';
        } else {
          bottomBar.style.transform = 'translateY(calc(100% - 60px))';
        }
      }
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();