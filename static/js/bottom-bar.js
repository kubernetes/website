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
    
    // Close drawer when ToC link is clicked
    if (tocContent) {
      tocContent.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
          closeDrawer();
        }
      });
    }
  }
  
  // Check if page has ToC
  function checkForToc() {
    // Check for the actual ToC section
    const tocSection = document.querySelector('.td-toc');
    const tocLinks = tocSection ? tocSection.querySelectorAll('a') : [];
    
    state.hasToc = tocLinks.length > 0;
    
    if (state.hasToc) {
      populateTocFromExisting(tocLinks);
    }
  }
  
  // Populate ToC from existing ToC section
  function populateTocFromExisting(tocLinks) {
    const tocHtml = [];
    
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent;
      
      // Determine indentation level based on link structure
      let className = 'toc-h2';
      const targetId = href ? href.replace('#', '') : '';
      const targetElement = targetId ? document.getElementById(targetId) : null;
      
      if (targetElement) {
        const tagName = targetElement.tagName.toLowerCase();
        className = `toc-${tagName}`;
      }
      
      if (href && text) {
        tocHtml.push(`<a href="${href}" class="${className}">${text}</a>`);
      }
    });
    
    // Append to existing placeholder content
    const placeholder = tocContent.querySelector('.toc-placeholder');
    if (placeholder && tocHtml.length > 0) {
      placeholder.innerHTML += '<div class="toc-links">' + tocHtml.join('') + '</div>';
    }
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
    
    // Show bottom bar
    bottomBar.classList.add('is-open');
    
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
    } else if (mode === DrawerStates.SEARCH) {
      searchContent.classList.add('is-active');
      tocContent.classList.remove('is-active');
      searchBtn.classList.add('is-active');
      tocBtn.classList.remove('is-active');
      drawer.scrollTop = 0;
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
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();