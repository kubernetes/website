// Bottom Bar Component - TOC Handler
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;

  // We only want the "start at bottom" behavior on the very first open.
  let firstOpenHandled = false;
  // Used to skip the post-open scroll-on-active on that first open.
  let skipNextOnDrawerOpen = false;
  
  // Track animations in progress to prevent conflicts
  const animationsInProgress = new Map();
  
  window.BottomBar.TocHandler = {
    init(els) {
      elements = els;
      this.setupTocInteractions();
      return this;
    },
    
    setupTocInteractions() {
      const { tocContent } = elements;
      if (!tocContent) return;
      
      // Handle toggle buttons for expanding/collapsing sections
      const toggleButtons = tocContent.querySelectorAll('.bottom-bar-toc__toggle');
      toggleButtons.forEach(btn => {
        btn.addEventListener('click', this.handleToggleClick.bind(this));
      });
      
      // Close drawer when TOC link is clicked
      const tocLinks = tocContent.querySelectorAll('.bottom-bar-toc__link');
      tocLinks.forEach(link => {
        link.addEventListener('click', this.handleLinkClick.bind(this));
      });
      
      // Initialize collapsed sections (ensure they start with height: 0)
      const allChildren = tocContent.querySelectorAll('.bottom-bar-toc__children:not(.expanded)');
      allChildren.forEach(childList => {
        childList.style.height = '0px';
        childList.style.opacity = '0';
        childList.style.overflow = 'hidden';
      });
      
      // Initialize expanded sections with their natural height
      const expandedChildren = tocContent.querySelectorAll('.bottom-bar-toc__children.expanded');
      expandedChildren.forEach(childList => {
        childList.style.height = 'auto';
        childList.style.opacity = '1';
        childList.style.overflow = 'hidden';
      });
    },

    /**
     * Prepare TOC before the drawer becomes visible/painted.
     * On the very first open, force the TOC scroll position to the bottom
     * (even while the drawer's height is still animating from 0).
     * This runs synchronously so the user never sees a jump.
     */
    prepareForOpen() {
      if (firstOpenHandled) return false;

      const { tocContent } = elements;
      if (!tocContent) {
        firstOpenHandled = true;
        return false;
      }

      // Put the scroll position at the bottom up-front.
      // Doing this before the first paint ensures no visible jump.
      tocContent.scrollTop = tocContent.scrollHeight;

      firstOpenHandled = true;
      skipNextOnDrawerOpen = true; // don't override this with the "scroll to active" pass
      return true;
    },
    
    handleToggleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const button = e.currentTarget;
      const listItem = button.closest('.bottom-bar-toc__item');
      const childrenList = listItem.querySelector('.bottom-bar-toc__children');
      
      if (childrenList) {
        // Check if animation is already in progress for this element
        const elementId = childrenList.id || this.generateId(childrenList);
        if (animationsInProgress.has(elementId)) {
          return; // Don't start new animation if one is in progress
        }
        
        const isExpanded = childrenList.classList.contains('expanded');
        
        if (isExpanded) {
          this.animateCollapse(childrenList, button);
        } else {
          this.animateExpand(childrenList, button);
        }
      }
    },
    
    animateExpand(childrenList, button) {
      const elementId = childrenList.id || this.generateId(childrenList);
      animationsInProgress.set(elementId, true);
      
      // First, get the target height by temporarily showing the element
      childrenList.style.display = 'block';
      childrenList.style.height = 'auto';
      childrenList.style.opacity = '0';
      const targetHeight = childrenList.scrollHeight;
      
      // Reset to collapsed state for animation
      childrenList.style.height = '0px';
      childrenList.style.overflow = 'hidden';
      
      // Add expanded class immediately
      childrenList.classList.add('expanded');
      button.setAttribute('aria-expanded', 'true');
      
      // Force reflow
      void childrenList.offsetHeight;
      
      // Start the animation
      childrenList.style.transition = 'height 0.3s ease, opacity 0.3s ease';
      childrenList.style.height = targetHeight + 'px';
      childrenList.style.opacity = '1';
      
      // After animation completes, set height to auto for content flexibility
      setTimeout(() => {
        childrenList.style.height = 'auto';
        childrenList.style.transition = '';
        animationsInProgress.delete(elementId);
      }, 300);
    },
    
    animateCollapse(childrenList, button) {
      const elementId = childrenList.id || this.generateId(childrenList);
      animationsInProgress.set(elementId, true);
      
      // Get current height
      const currentHeight = childrenList.scrollHeight;
      
      // Set explicit height to start animation from
      childrenList.style.height = currentHeight + 'px';
      childrenList.style.overflow = 'hidden';
      
      // Force reflow
      void childrenList.offsetHeight;
      
      // Start the animation
      childrenList.style.transition = 'height 0.3s ease, opacity 0.3s ease';
      childrenList.style.height = '0px';
      childrenList.style.opacity = '0';
      
      // Remove expanded class after animation starts
      setTimeout(() => {
        childrenList.classList.remove('expanded');
        button.setAttribute('aria-expanded', 'false');
      }, 10);
      
      // Clean up after animation
      setTimeout(() => {
        childrenList.style.transition = '';
        animationsInProgress.delete(elementId);
      }, 300);
    },
    
    expandSection(childrenList, button) {
      // This method is now used for immediate expansion (no animation)
      // Used when expanding parent items to show active item
      childrenList.classList.add('expanded');
      childrenList.style.height = 'auto';
      childrenList.style.opacity = '1';
      button.setAttribute('aria-expanded', 'true');
    },
    
    collapseSection(childrenList, button) {
      // This method is now used for immediate collapse (no animation)
      childrenList.classList.remove('expanded');
      childrenList.style.height = '0px';
      childrenList.style.opacity = '0';
      button.setAttribute('aria-expanded', 'false');
    },
    
    generateId(element) {
      const id = 'toc-children-' + Math.random().toString(36).substr(2, 9);
      element.id = id;
      return id;
    },
    
    handleLinkClick(e) {
      // Allow default navigation but close the drawer
      setTimeout(() => {
        window.BottomBar.DrawerController.close();
      }, 100);
    },
    
    onDrawerOpen() {
      // Skip the "scroll-to-active" once if we just pre-scrolled to bottom.
      if (skipNextOnDrawerOpen) {
        skipNextOnDrawerOpen = false;
        return;
      }
      this.scrollToActiveItem();
    },
    
    scrollToActiveItem() {
      const { tocContent, drawer } = elements;
      const activeItem = tocContent.querySelector('.bottom-bar-toc__item.active');
      if (!activeItem) return;
      
      // Ensure parent items are expanded (without animation for immediate visibility)
      this.expandParentItems(activeItem);
      
      // Scroll the active item into view
      setTimeout(() => {
        const drawerRect = drawer.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        
        // Calculate position to center the active item
        const scrollTop = drawer.scrollTop;
        const itemTop = itemRect.top - drawerRect.top + scrollTop;
        const drawerHeight = drawerRect.height;
        
        // Scroll to position the item at 1/3 from the top of the drawer
        const targetScroll = itemTop - (drawerHeight / 3);
        
        drawer.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      }, 100);
    },
    
    expandParentItems(activeItem) {
      const { tocContent } = elements;
      let parent = activeItem.parentElement;
      
      while (parent && parent !== tocContent) {
        if (parent.classList.contains('bottom-bar-toc__children')) {
          // Use immediate expansion for parent items
          parent.classList.add('expanded');
          parent.style.height = 'auto';
          parent.style.opacity = '1';
          
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
    },
    
    // Utility method to get current active item
    getActiveItem() {
      const { tocContent } = elements;
      return tocContent ? tocContent.querySelector('.bottom-bar-toc__item.active') : null;
    },
    
    // Utility method to check if TOC has content
    hasTocContent() {
      const { tocContent } = elements;
      const tocList = tocContent ? tocContent.querySelector('.bottom-bar-toc__list') : null;
      const tocLinks = tocList ? tocList.querySelectorAll('a') : [];
      return tocLinks.length > 0;
    }
  };
})();