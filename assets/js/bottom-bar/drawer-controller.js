// Bottom Bar Component - Drawer Controller
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  let elements = null;

  function getTocMaxHeightPx(drawer) {
    if (!drawer) return null;
    const raw = getComputedStyle(drawer).getPropertyValue('--bb-toc-max-height').trim();
    if (!raw) return null;
    const value = parseFloat(raw);
    if (!Number.isFinite(value)) return null;
    if (raw.endsWith('vh')) return (window.innerHeight * value) / 100;
    if (raw.endsWith('rem')) {
      const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return value * (Number.isFinite(rootSize) ? rootSize : 16);
    }
    if (raw.endsWith('em')) {
      const elSize = parseFloat(getComputedStyle(drawer).fontSize);
      return value * (Number.isFinite(elSize) ? elSize : 16);
    }
    return value;
  }

  function getTocContentHeight(tocContent) {
    if (!tocContent) return null;
    const inner = tocContent.querySelector('.bottom-bar-toc-wrapper') || tocContent.firstElementChild;
    if (!inner) return null;
    const innerHeight = inner.getBoundingClientRect().height;
    if (!innerHeight) return null;
    const styles = getComputedStyle(tocContent);
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;
    return innerHeight + paddingTop + paddingBottom;
  }

  function getTocTargetHeight(drawer, tocContent) {
    if (!drawer || !tocContent) return null;
    const contentHeight = getTocContentHeight(tocContent);
    if (!contentHeight) return null;
    const maxHeight = getTocMaxHeightPx(drawer);
    return maxHeight ? Math.min(contentHeight, maxHeight) : contentHeight;
  }

  function syncTocHeightInternal(useRaf = true) {
    if (!elements) return;
    const { drawer, tocContent } = elements;
    const { StateManager } = window.BottomBar;
    if (!drawer || !tocContent || !StateManager) return;

    const state = StateManager.getState();
    if (!state.isOpen || state.activeMode !== StateManager.DrawerStates.TOC) return;

    const targetHeight = getTocTargetHeight(drawer, tocContent);
    if (!targetHeight) return;

    const applyHeight = () => {
      drawer.style.height = targetHeight + 'px';
    };

    if (useRaf) {
      requestAnimationFrame(applyHeight);
    } else {
      applyHeight();
    }
  }
  
  window.BottomBar.DrawerController = {
    init(els) {
      elements = els;

      // Ensure ARIA wiring for controller buttons (no dialog semantics)
      const { tocBtn, searchBtn } = elements;
      if (tocBtn) {
        tocBtn.setAttribute('aria-controls', 'bb-drawer');
        tocBtn.setAttribute('aria-expanded', 'false');
      }
      if (searchBtn) {
        searchBtn.setAttribute('aria-controls', 'bb-drawer');
        searchBtn.setAttribute('aria-expanded', 'false');
      }

      return this;
    },

    syncTocHeight(useRaf = true) {
      syncTocHeightInternal(useRaf);
      return this;
    },
    
    open(mode) {
      const { StateManager } = window.BottomBar;
      const { bottomBar, drawer, tocContent, searchContent, tocBtn, searchBtn } = elements;
      
      // Update state
      StateManager.setDrawerOpen(true, mode);
      
      // Show bottom bar (CSS handles transform via .is-open)
      bottomBar.classList.add('is-open');
      
      // Set drawer height based on mode
      drawer.className = 'bottom-bar__drawer state-' + mode;
      drawer.style.height = mode === StateManager.DrawerStates.TOC ? '0px' : '';
      
      // Reset opacity for both contents - start hidden for TOC
      if (mode === StateManager.DrawerStates.TOC) {
        tocContent.style.opacity = '0';  // Start hidden for TOC
        searchContent.style.opacity = '';
      } else {
        tocContent.style.opacity = '';
        searchContent.style.opacity = '';  // Search can show immediately
      }
      
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
        syncTocHeightInternal(true);

        drawer.scrollTop = 0;
        
        // Let TOC handler position content, then we'll fade it in
        requestAnimationFrame(() => {
          window.BottomBar.TocHandler.onDrawerOpen();
          // Fade in content after positioning is done
          setTimeout(() => {
            tocContent.style.transition = 'opacity 0.2s ease';
            tocContent.style.opacity = '1';
            // Clean up transition after fade
            setTimeout(() => {
              tocContent.style.transition = '';
            }, 200);
          }, 20);
        });
      } else if (mode === StateManager.DrawerStates.SEARCH) {
        searchContent.classList.add('is-active');
        tocContent.classList.remove('is-active');
        searchBtn.classList.add('is-active');
        tocBtn.classList.remove('is-active');
        // Opening shouldn't force hover
        tocBtn.classList.remove('is-hover');
        searchBtn.classList.remove('is-hover');

        drawer.scrollTop = 0;
        
        // Search shows immediately
        searchContent.style.opacity = '1';
        
        // Let search handler know drawer opened
        setTimeout(() => {
          window.BottomBar.SearchHandler.onDrawerOpen();
        }, 300);
      }

      // Sync ARIA expanded state
      if (tocBtn) tocBtn.setAttribute('aria-expanded', mode === StateManager.DrawerStates.TOC ? 'true' : 'false');
      if (searchBtn) searchBtn.setAttribute('aria-expanded', mode === StateManager.DrawerStates.SEARCH ? 'true' : 'false');
    },
    
    close() {
      const { StateManager } = window.BottomBar;
      const { bottomBar, drawer, tocContent, searchContent, tocBtn, searchBtn } = elements;
      const state = StateManager.getState();
      const activeElement = document.activeElement;
      
      // Update state
      StateManager.setDrawerOpen(false, StateManager.DrawerStates.CLOSED);
      
      // Hide drawer with animation
      drawer.style.height = '0';
      
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

      // Reset ARIA expanded state when closed
      if (tocBtn) tocBtn.setAttribute('aria-expanded', 'false');
      if (searchBtn) searchBtn.setAttribute('aria-expanded', 'false');

      // If focus was inside the drawer, return it to the last active trigger.
      if (drawer && activeElement && drawer.contains(activeElement)) {
        const fallbackBtn = state.activeMode === StateManager.DrawerStates.TOC ? tocBtn : searchBtn;
        if (fallbackBtn) {
          fallbackBtn.focus();
        }
      }
    },
    
    switchMode(newMode) {
      const { StateManager } = window.BottomBar;
      const state = StateManager.getState();
      const { drawer, tocContent, searchContent, tocBtn, searchBtn } = elements;
      
      const oldContent = state.activeMode === StateManager.DrawerStates.TOC ? tocContent : searchContent;
      const newContent = newMode === StateManager.DrawerStates.TOC ? tocContent : searchContent;
      const currentHeight = drawer.getBoundingClientRect().height;
      
      // Update button states
      if (newMode === StateManager.DrawerStates.TOC) {
        tocBtn.classList.add('is-active');
        searchBtn.classList.remove('is-active', 'is-hover'); // ensure search resets when switching away
      } else {
        searchBtn.classList.add('is-active');
        tocBtn.classList.remove('is-active', 'is-hover'); // ensure toc resets when switching away
      }
      
      // Lock current height so the switch doesn't collapse mid-transition
      drawer.style.height = currentHeight + 'px';
      
      // Update drawer height for new mode
      drawer.className = 'bottom-bar__drawer state-' + newMode;
      if (newMode === StateManager.DrawerStates.SEARCH) {
        requestAnimationFrame(() => {
          drawer.style.height = '';
        });
      }
      
      // Fade out old content
      oldContent.style.opacity = '0';
      
      setTimeout(() => {
        oldContent.classList.remove('is-active');
        newContent.classList.add('is-active');

        // If we are switching into TOC, hide it initially
        if (newMode === StateManager.DrawerStates.TOC) {
          newContent.style.opacity = '0';
          if (window.BottomBar.TocHandler && window.BottomBar.TocHandler.prepareForOpen) {
            window.BottomBar.TocHandler.prepareForOpen();
          }
          syncTocHeightInternal(true);
        } else {
          // Search can show immediately
          newContent.style.opacity = '';
        }
        
        // Reset scroll position on the drawer element itself
        drawer.scrollTop = 0;
        
        // Handle mode-specific actions
        if (newMode === StateManager.DrawerStates.TOC) {
          requestAnimationFrame(() => {
            window.BottomBar.TocHandler.onDrawerOpen();
            // Fade in TOC content after positioning
            setTimeout(() => {
              newContent.style.transition = 'opacity 0.2s ease';
              newContent.style.opacity = '1';
              setTimeout(() => {
                newContent.style.transition = '';
              }, 200);
            }, 20);
          });
        } else if (newMode === StateManager.DrawerStates.SEARCH) {
          // Fade in search content
          setTimeout(() => {
            newContent.style.opacity = '1';
            window.BottomBar.SearchHandler.onDrawerOpen();
          }, 10);
        }
      }, 200);
      
      StateManager.setActiveMode(newMode);

      // Sync ARIA expanded state after mode switch
      if (tocBtn) tocBtn.setAttribute('aria-expanded', newMode === StateManager.DrawerStates.TOC ? 'true' : 'false');
      if (searchBtn) searchBtn.setAttribute('aria-expanded', newMode === StateManager.DrawerStates.SEARCH ? 'true' : 'false');
    }
  };
})();
