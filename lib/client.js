// Client-side branding plugin for DSH
// Changes "DeepSeek Harness" to "百图" and replaces the icon

export default function createPlugin() {
  // Self-executing plugin that manipulates DOM when loaded
  (function() {
    'use strict';
    
    let iconUrl = null;
    let originalTitle = null;
    let observer = null;
    let iconElement = null;
    
    // Load the custom icon from assets
    const loadIcon = async () => {
      try {
        // Try to load from plugin assets directory
        const iconPath = window.__DSH_PLUGIN_ASSETS__?.['dsh-plugin-baitu-branding']?.icon || 
                        './assets/icon.svg';
        const response = await fetch(iconPath);
        if (response.ok) {
          const blob = await response.blob();
          iconUrl = URL.createObjectURL(blob);
          applyBranding();
        }
      } catch (error) {
        console.warn('[baitu-branding] Could not load custom icon:', error);
        // Continue without icon, still apply other branding
        applyBranding();
      }
    };
    
    // Apply all branding changes
    const applyBranding = () => {
      // 1. Change page title
      if (!originalTitle) {
        originalTitle = document.title;
      }
      document.title = '百图';
      
      // 2. Replace favicon
      if (iconUrl) {
        // Remove existing favicons
        const existingIcons = document.querySelectorAll('link[rel*="icon"]');
        existingIcons.forEach(icon => {
          icon.parentElement.removeChild(icon);
        });
        
        // Add new favicon
        iconElement = document.createElement('link');
        iconElement.rel = 'icon';
        iconElement.type = 'image/svg+xml';
        iconElement.href = iconUrl;
        document.head.appendChild(iconElement);
        
        // Also add shortcut icon for older browsers
        const shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = iconUrl;
        document.head.appendChild(shortcutIcon);
      }
      
      // 3. Replace text content in DOM
      replaceText(document.body);
      
      // 4. Watch for DOM changes and replace new text
      if (!observer) {
        observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  replaceText(node);
                  // Also check children
                  const children = node.querySelectorAll('*');
                  children.forEach(child => replaceText(child));
                }
              });
            } else if (mutation.type === 'characterData') {
              replaceText(mutation.target.parentElement);
            }
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
      
      // Listen for title changes
      const titleObserver = new MutationObserver(() => {
        if (document.title !== '百图') {
          document.title = '百图';
        }
      });
      
      titleObserver.observe(document.querySelector('title') || document.head, {
        childList: true,
        characterData: true,
        subtree: true
      });
    };
    
    // Recursively replace text in DOM
    const replaceText = (element) => {
      if (!element) return;
      
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (node.nodeValue) {
          // Replace various forms of the name
          node.nodeValue = node.nodeValue
            .replace(/DeepSeek Harness/g, '百图')
            .replace(/deepseek harness/gi, '百图')
            .replace(/DSH/g, '百图');
        }
      }
    };
    
    // Initialize
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadIcon);
    } else {
      loadIcon();
    }
    
    // Cleanup on unload
    window.addEventListener('beforeunload', () => {
      if (observer) {
        observer.disconnect();
      }
      if (iconUrl) {
        URL.revokeObjectURL(iconUrl);
      }
    });
  })();
  
  // Return empty plugin object (work is done in IIFE)
  return {
    name: 'baituBranding',
    inject: [],
    apply() {}
  };
}
