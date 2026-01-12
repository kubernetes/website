// Bottom Bar Component - Utilities
(function() {
  'use strict';
  
  window.BottomBar = window.BottomBar || {};
  
  window.BottomBar.Utils = {
    // Debounce function for performance
    debounce(func, wait, immediate) {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        const later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    
    // Throttle function for performance
    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    
    // Check if element is visible in viewport
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    
    // Get element's offset from document top
    getOffsetTop(element) {
      let offsetTop = 0;
      while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
      }
      return offsetTop;
    },
    
    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
      const elementTop = this.getOffsetTop(element) - offset;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    },
    
    // Add class with optional delay
    addClass(element, className, delay = 0) {
      if (delay > 0) {
        setTimeout(() => {
          element.classList.add(className);
        }, delay);
      } else {
        element.classList.add(className);
      }
    },
    
    // Remove class with optional delay
    removeClass(element, className, delay = 0) {
      if (delay > 0) {
        setTimeout(() => {
          element.classList.remove(className);
        }, delay);
      } else {
        element.classList.remove(className);
      }
    },
    
    // Toggle class
    toggleClass(element, className) {
      element.classList.toggle(className);
    },
    
    // Check if element has class
    hasClass(element, className) {
      return element.classList.contains(className);
    },
    
    // Get closest parent with selector
    getClosest(element, selector) {
      return element.closest(selector);
    },
    
    // Query selector with error handling
    querySelector(selector, context = document) {
      try {
        return context.querySelector(selector);
      } catch (e) {
        console.error('Invalid selector:', selector);
        return null;
      }
    },
    
    // Query selector all with error handling
    querySelectorAll(selector, context = document) {
      try {
        return Array.from(context.querySelectorAll(selector));
      } catch (e) {
        console.error('Invalid selector:', selector);
        return [];
      }
    },
    
    // Create element with attributes and content
    createElement(tag, attributes = {}, content = '') {
      const element = document.createElement(tag);
      
      Object.keys(attributes).forEach(key => {
        if (key === 'className') {
          element.className = attributes[key];
        } else if (key === 'dataset') {
          Object.keys(attributes[key]).forEach(dataKey => {
            element.dataset[dataKey] = attributes[key][dataKey];
          });
        } else {
          element.setAttribute(key, attributes[key]);
        }
      });
      
      if (content) {
        element.innerHTML = content;
      }
      
      return element;
    },
    
    // Deep merge objects
    deepMerge(target, ...sources) {
      if (!sources.length) return target;
      const source = sources.shift();
      
      if (this.isObject(target) && this.isObject(source)) {
        for (const key in source) {
          if (this.isObject(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            this.deepMerge(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      }
      
      return this.deepMerge(target, ...sources);
    },
    
    // Check if value is object
    isObject(item) {
      return (item && typeof item === 'object' && !Array.isArray(item));
    },
    
    // Generate unique ID
    generateId(prefix = 'bb') {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Store data in sessionStorage with fallback
    setStorageItem(key, value) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('SessionStorage not available:', e);
      }
    },
    
    // Get data from sessionStorage with fallback
    getStorageItem(key) {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn('SessionStorage not available:', e);
        return null;
      }
    },
    
    // Remove item from sessionStorage
    removeStorageItem(key) {
      try {
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn('SessionStorage not available:', e);
      }
    }
  };
})();