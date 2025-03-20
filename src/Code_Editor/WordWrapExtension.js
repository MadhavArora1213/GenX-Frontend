import { useState, useEffect } from 'react';

/**
 * Custom hook to manage word wrap functionality in code editor
 * @returns {Object} Word wrap state and utilities
 */
export const useWordWrap = () => {
  const [isWordWrapped, setIsWordWrapped] = useState(false);

  // Add keyboard event listener for Alt+Z
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Alt+Z key combination
      if (e.altKey && e.key === 'z') {
        e.preventDefault(); // Prevent default behavior
        toggleWordWrap();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Function to toggle word wrap
  const toggleWordWrap = () => {
    setIsWordWrapped((prev) => !prev);
    // Show notification (optional)
    const message = !isWordWrapped ? "Word wrap enabled" : "Word wrap disabled";
    console.log(message);
  };

  return {
    isWordWrapped,
    setIsWordWrapped,
    toggleWordWrap
  };
};

/**
 * Generate CSS styles for word wrap
 * @param {boolean} isWordWrapped Word wrap state
 * @returns {string} CSS styles for word wrap
 */
export const getWordWrapStyles = (isWordWrapped) => {
  return `
    .cm-editor {
      height: 100% !important;
      width: 100% !important;
      max-width: 100%;
    }
    .cm-scroller {
      overflow: auto !important;
    }
    .cm-content {
      width: 100%;
      max-width: 100%;
      word-break: break-word;
    }
    .cm-line {
      max-width: 100%;
      ${isWordWrapped ? 'white-space: pre-wrap !important;' : ''}
    }
    .cm-gutters {
      height: auto !important;
    }
  `;
};

/**
 * Get CodeMirror configuration for word wrap
 * @param {boolean} isWordWrapped Word wrap state
 * @returns {Object} Configuration object for CodeMirror
 */
export const getWordWrapConfig = (isWordWrapped) => {
  return {
    options: {
      lineNumbers: true,
      lineWrapping: isWordWrapped,
      readOnly: false,
    },
    basicSetup: {
      lineWrapping: isWordWrapped,
      foldGutter: true,
    }
  };
};
