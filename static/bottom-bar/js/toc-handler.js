// Bottom Bar Component - TOC Handler
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;
  
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
    },
    
    handleToggleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const button = e.currentTarget;
      const listItem = button.closest('.bottom-bar-toc__item');
      const childrenList = listItem.querySelector('.bottom-bar-toc__children');
      
      if (childrenList) {
        const isExpanded = childrenList.classList.contains('expanded');
        
        if (isExpanded) {
          this.collapseSection(childrenList, button);
        } else {
          this.expandSection(childrenList, button);
        }
      }
    },
    
    expandSection(childrenList, button) {
      childrenList.classList.add('expanded');
      button.setAttribute('aria-expanded', 'true');
    },
    
    collapseSection(childrenList, button) {
      childrenList.classList.remove('expanded');
      button.setAttribute('aria-expanded', 'false');
    },
    
    handleLinkClick(e) {
      // Allow default navigation but close the drawer
      setTimeout(() => {
        window.BottomBar.DrawerController.close();
      }, 100);
    },
    
    onDrawerOpen() {
      this.scrollToActiveItem();
    },
    
    scrollToActiveItem() {
      const { tocContent, drawer } = elements;
      const activeItem = tocContent.querySelector('.bottom-bar-toc__item.active');
      if (!activeItem) return;
      
      // Ensure parent items are expanded
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