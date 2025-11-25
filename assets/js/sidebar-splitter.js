/**
 * Custom Sidebar Splitter Implementation
 * Provides a resizable gutter between sidebar and main content
 */

class SidebarSplitter {
  constructor(sidebar, mainContent, initialPercentage = 0.2) {
    this.sidebar = sidebar;
    this.mainContent = mainContent;
    this.container = sidebar.parentElement;
    this.isResizing = false;
    this.startX = 0;
    this.sidebarWidth = 0;
    this.startWidth = 0; // Starting width when drag begins
    this.startContainerWidth = 0; // Container width when drag begins
    this.originalWidth = 0; // Store original width before any resizing
    this.originalPercentage = initialPercentage; // Use provided initial percentage
    this.boundStartResize = this.startResize.bind(this);
    this.boundResize = this.resize.bind(this);
    this.boundStopResize = this.stopResize.bind(this);
    
    try {
      // Ensure container has relative positioning
      if (getComputedStyle(this.container).position === 'static') {
        this.container.style.position = 'relative';
        this.containerWasStatic = true;
      }
      
      // Create splitter element
      this.splitter = document.createElement('div');
      this.splitter.className = 'sidebar-splitter';
      
      // Store original classes and styles
      this.originalSidebarClasses = this.sidebar.className;
      this.originalMainClasses = this.mainContent.className;
      this.originalSidebarStyle = this.sidebar.style.cssText;
      this.originalMainStyle = this.mainContent.style.cssText;
      
      // Get initial sidebar dimensions
      const sidebarRect = this.sidebar.getBoundingClientRect();
      
      // Add default layout class initially to both sidebar and main content
      this.sidebar.classList.add('default-layout');
      this.mainContent.classList.add('default-layout');
      
      // Set initial styles for resizable layout
      this.sidebar.style.flexBasis = `${sidebarRect.width}px`;
      this.sidebar.style.width = `${sidebarRect.width}px`; // Fallback
      
      this.mainContent.style.minWidth = '0';
      
      // Insert splitter after sidebar
      this.container.insertBefore(this.splitter, mainContent);
      
      // Make splitter visible using CSS class
      this.splitter.classList.add('visible');
      
      // Store initial dimensions
      this.sidebarWidth = sidebarRect.width;
      this.originalWidth = sidebarRect.width;
      
      // Position splitter after insertion and layout stabilization
      const positionSplitter = () => {
        const currentSidebarRect = this.sidebar.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        const splitterLeft = currentSidebarRect.left - containerRect.left + currentSidebarRect.width;
        this.splitter.style.left = `${splitterLeft}px`;
      };
      
      // Try immediately first, then with delay if needed
      positionSplitter();
      setTimeout(positionSplitter, 50);
      
      // Add event listeners
      this.splitter.addEventListener('mousedown', this.boundStartResize);
      document.addEventListener('mousemove', this.boundResize);
      document.addEventListener('mouseup', this.boundStopResize);
      
      // Also handle touch events for mobile
      this.splitter.addEventListener('touchstart', this.boundStartResize, {passive: false});
      document.addEventListener('touchmove', this.boundResize, {passive: false});
      document.addEventListener('touchend', this.boundStopResize);
      
      // Handle window resize
      this.boundHandleResize = this.handleWindowResize.bind(this);
      window.addEventListener('resize', this.boundHandleResize);
      
    } catch (error) {
      console.error('SidebarSplitter initialization failed:', error);
      this.destroy();
    }
  }
  
  startResize(e) {
    // Only handle primary mouse button or touch
    if (e.button === 2 || (e.touches && e.touches.length > 1)) return;
    
    this.isResizing = true;
    
    // Remove default layout class and add resized class
    this.sidebar.classList.remove('default-layout');
    this.sidebar.classList.add('sidebar-resized');
    this.mainContent.classList.add('sidebar-resized');
    
    // Get initial position (works for both mouse and touch)
    this.startX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
    this.sidebarWidth = this.sidebar.getBoundingClientRect().width;
    
    // Store the starting width and container width for proportional resizing
    this.startWidth = this.sidebarWidth;
    this.startContainerWidth = this.container.getBoundingClientRect().width;
    
    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    
    e.preventDefault();
  }
  
  resize(e) {
    if (!this.isResizing) return;
    
    // Get current position (works for both mouse and touch)
    const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
    const dx = clientX - this.startX;
    const newWidth = this.startWidth + dx;
    
    // Apply minimum width constraint
    const minWidth = 150;
    
    // Calculate maximum width based on TOC visibility
    const toc = document.querySelector('.td-sidebar-toc');
    const tocStyle = window.getComputedStyle(toc);
    const tocVisible = tocStyle.display !== 'none' && parseFloat(tocStyle.width) > 0;
    const tocWidth = tocVisible ? parseFloat(tocStyle.width) : 0;
    const availableSpace = window.innerWidth - tocWidth;
    const maxWidth = availableSpace * 0.5; // Don't use more than 50% of remaining space
    
    // Apply constraints
    const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
    
    // Update sidebar width using flex-basis (works with flexbox)
    this.sidebar.style.flexBasis = `${constrainedWidth}px`;
    this.sidebar.style.width = `${constrainedWidth}px`; // Fallback for older browsers
    
    // Update splitter position
    const sidebarRect = this.sidebar.getBoundingClientRect();
    this.splitter.style.left = `${sidebarRect.left + sidebarRect.width}px`;
    
    e.preventDefault();
  }
  
  stopResize() {
    if (!this.isResizing) return;
    
    this.isResizing = false;
    
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }
  
  handleWindowResize() {
    // Check if viewport is too narrow for sidebar
    const minViewportWidth = 768; // Bootstrap's md breakpoint
    if (window.innerWidth < minViewportWidth) {
      // Hide splitter and restore default layout for narrow viewports
      if (this.splitter) {
        this.splitter.style.display = 'none';
      }
      this.sidebar.style.flexBasis = '';
      this.sidebar.style.width = '';
      return;
    } else {
      // Show splitter for wider viewports
      if (this.splitter) {
        this.splitter.style.display = 'block';
      }
    }
    
    // Update splitter position when window is resized
    if (this.splitter && this.splitter.style.display !== 'none') {
      const sidebarRect = this.sidebar.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      const splitterLeft = sidebarRect.left - containerRect.left + sidebarRect.width;
      this.splitter.style.left = `${splitterLeft}px`;
    }
    
    if (this.sidebar.classList.contains('sidebar-resized')) {
      // Reserve space for right-hand (in LTR locales) nav
      const toc = document.querySelector('.td-sidebar-toc');
      const tocStyle = window.getComputedStyle(toc);
      const tocVisible = tocStyle.display !== 'none' && parseFloat(tocStyle.width) > 0;
      
      const containerRect = this.container.getBoundingClientRect();
      const tocWidth = tocVisible ? parseFloat(tocStyle.width) : 0;
      const availableSpace = containerRect.width - tocWidth;
      const maxSidebarWidth = availableSpace * 0.5; // Don't use more than 50% of remaining space
      
      // Get current sidebar width
      let currentWidth = parseFloat(this.sidebar.style.flexBasis) || this.originalWidth;
      
      // Constrain to available space if needed
      if (currentWidth > maxSidebarWidth) {
        currentWidth = maxSidebarWidth;
      }
      
      // Apply the constrained width
      if (currentWidth > 0) {
        this.sidebar.style.flexBasis = `${currentWidth}px`;
        this.sidebar.style.width = `${currentWidth}px`;
      }
    }
  }
  
  destroy() {
    try {
      // Remove splitter element
      if (this.splitter && this.splitter.parentNode) {
        this.splitter.parentNode.removeChild(this.splitter);
      }
      
      // Remove all event listeners
      if (this.splitter) {
        this.splitter.removeEventListener('mousedown', this.boundStartResize);
        this.splitter.removeEventListener('touchstart', this.boundStartResize);
      }
      
      document.removeEventListener('mousemove', this.boundResize);
      document.removeEventListener('mouseup', this.boundStopResize);
      document.removeEventListener('touchmove', this.boundResize);
      document.removeEventListener('touchend', this.boundStopResize);
      
      // Remove window resize listener
      window.removeEventListener('resize', this.boundHandleResize);
      
      // Restore original classes and styles only if we want to completely reset
      // For normal usage, we want to keep the resized state
      // this.sidebar.className = this.originalSidebarClasses;
      // this.mainContent.className = this.originalMainClasses;
      // this.sidebar.style.cssText = this.originalSidebarStyle;
      // this.mainContent.style.cssText = this.originalMainStyle;
      
      // Restore container positioning if we changed it
      if (this.containerWasStatic) {
        this.container.style.position = '';
      }
      
    } catch (error) {
      console.error('SidebarSplitter destruction failed:', error);
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SidebarSplitter;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
  window.SidebarSplitter = SidebarSplitter;
}
