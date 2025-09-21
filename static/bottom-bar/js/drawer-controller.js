// Bottom Bar Component - Drawer Controller
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;
  
  window.BottomBar.DrawerController = {
    init(els) {
      elements = els;
      return this;
    },
    
    open(mode) {
      const { StateManager } = window.BottomBar;
      const { bottomBar, exitBtn, drawer, tocContent, searchContent, tocBtn, searchBtn } = elements;
      
      // Update state
      StateManager.setDrawerOpen(true, mode);
      
      // Show bottom bar (CSS handles transform via .is-open)
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
      if (mode === StateManager.DrawerStates.TOC) {
        tocContent.classList.add('is-active');
        searchContent.classList.remove('is-active');
        tocBtn.classList.add('is-active');
        searchBtn.classList.remove('is-active');
        // Opening shouldn't force hover; ensure default unless pointer enters later
        tocBtn.classList.remove('is-hover');
        searchBtn.classList.remove('is-hover');

        // IMPORTANT: pre-position TOC before first paint so there's no visible jump.
        if (window.BottomBar.TocHandler && window.BottomBar.TocHandler.prepareForOpen) {
          window.BottomBar.TocHandler.prepareForOpen();
        }

        drawer.scrollTop = 0;
        
        // Let TOC handler do any post-open work (e.g., scroll-to-active on subsequent opens)
        setTimeout(() => {
          window.BottomBar.TocHandler.onDrawerOpen();
        }, 300);
      } else if (mode === StateManager.DrawerStates.SEARCH) {
        searchContent.classList.add('is-active');
        tocContent.classList.remove('is-active');
        searchBtn.classList.add('is-active');
        tocBtn.classList.remove('is-active');
        // Opening shouldn't force hover
        tocBtn.classList.remove('is-hover');
        searchBtn.classList.remove('is-hover');

        drawer.scrollTop = 0;
        
        // Let search handler know drawer opened
        setTimeout(() => {
          window.BottomBar.SearchHandler.onDrawerOpen();
        }, 300);
      }
    },
    
    close() {
      const { StateManager } = window.BottomBar;
      const { bottomBar, exitBtn, drawer, tocContent, searchContent, tocBtn, searchBtn } = elements;
      
      // Update state
      StateManager.setDrawerOpen(false, StateManager.DrawerStates.CLOSED);
      
      // Hide drawer with animation
      drawer.style.height = '0';
      
      // Hide exit button
      exitBtn.classList.remove('is-visible');
      
      // Remove active & hover states from buttons so they snap to default even under the cursor
      tocBtn.classList.remove('is-active', 'is-hover');
      searchBtn.classList.remove('is-active', 'is-hover');
      
      // Return to closed visual state immediately; content will be cleaned after animation
      bottomBar.classList.remove('is-open');
      
      // After animation completes, hide content
      setTimeout(() => {
        tocContent.classList.remove('is-active');
        searchContent.classList.remove('is-active');
        drawer.className = 'bottom-bar__drawer';
      }, 300);
    },
    
    switchMode(newMode) {
      const { StateManager } = window.BottomBar;
      const state = StateManager.getState();
      const { drawer, tocContent, searchContent, tocBtn, searchBtn } = elements;
      
      const oldContent = state.activeMode === StateManager.DrawerStates.TOC ? tocContent : searchContent;
      const newContent = newMode === StateManager.DrawerStates.TOC ? tocContent : searchContent;
      
      // Update button states
      if (newMode === StateManager.DrawerStates.TOC) {
        tocBtn.classList.add('is-active');
        searchBtn.classList.remove('is-active', 'is-hover'); // ensure search resets when switching away
      } else {
        searchBtn.classList.add('is-active');
        tocBtn.classList.remove('is-active', 'is-hover'); // ensure toc resets when switching away
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

        // If we are switching into TOC for the first time, pre-position to bottom before paint.
        if (newMode === StateManager.DrawerStates.TOC) {
          if (window.BottomBar.TocHandler && window.BottomBar.TocHandler.prepareForOpen) {
            window.BottomBar.TocHandler.prepareForOpen();
          }
        }
        
        // Reset opacity
        newContent.style.opacity = '';
        
        // Reset scroll position on the drawer element itself (content has its own scroll)
        drawer.scrollTop = 0;
        
        // Fade in new content
        setTimeout(() => {
          newContent.style.opacity = '1';
          
          // Handle mode-specific actions
          if (newMode === StateManager.DrawerStates.TOC) {
            setTimeout(() => {
              window.BottomBar.TocHandler.onDrawerOpen();
            }, 100);
          } else if (newMode === StateManager.DrawerStates.SEARCH) {
            window.BottomBar.SearchHandler.onDrawerOpen();
          }
        }, 10);
      }, 200);
      
      StateManager.setActiveMode(newMode);
    }
  };
})();
