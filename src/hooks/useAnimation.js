import { useState, useCallback, useRef } from 'react';
import { ANIMATION_SPEEDS } from '../utils/constants.js';

export const useAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState('NORMAL');
  const timeoutIds = useRef([]);

  // Clear all pending timeouts
  const clearTimeouts = useCallback(() => {
    timeoutIds.current.forEach(id => clearTimeout(id));
    timeoutIds.current = [];
  }, []);

  // Animate search process by directly manipulating DOM
  const animateSearch = useCallback((searchOrder, onComplete) => {
    clearTimeouts();
    setIsAnimating(true);

    const delay = ANIMATION_SPEEDS[animationSpeed];

    searchOrder.forEach((node, index) => {
      const timeoutId = setTimeout(() => {
        // Find the DOM element and animate it directly
        const cellElement = document.querySelector(`[data-row="${node.x}"][data-col="${node.y}"]`);
        if (cellElement && !cellElement.classList.contains('node-source') && !cellElement.classList.contains('node-target')) {
          cellElement.classList.remove('node-unvisited', 'node-path');
          cellElement.classList.add('node-visited');
        }

        // If this is the last node, call completion callback
        if (index === searchOrder.length - 1) {
          setTimeout(() => {
            onComplete();
          }, delay);
        }
      }, index * delay);

      timeoutIds.current.push(timeoutId);
    });
  }, [animationSpeed, clearTimeouts]);

  // Animate path reconstruction by directly manipulating DOM
  const animatePath = useCallback((path, onComplete) => {
    const delay = ANIMATION_SPEEDS[animationSpeed] + 20; // Slightly slower for path

    path.forEach((node, index) => {
      const timeoutId = setTimeout(() => {
        // Find the DOM element and animate it directly
        const cellElement = document.querySelector(`[data-row="${node.x}"][data-col="${node.y}"]`);
        if (cellElement && !cellElement.classList.contains('node-source') && !cellElement.classList.contains('node-target')) {
          cellElement.classList.remove('node-visited', 'node-unvisited');
          cellElement.classList.add('node-path');
        }

        // If this is the last node, call completion callback
        if (index === path.length - 1) {
          setTimeout(() => {
            setIsAnimating(false);
            onComplete();
          }, delay);
        }
      }, index * delay);

      timeoutIds.current.push(timeoutId);
    });
  }, [animationSpeed]);

  // Animate maze generation
  const animateMaze = useCallback((walls, onWallPlace, onComplete) => {
    clearTimeouts();
    setIsAnimating(true);
    
    const delay = ANIMATION_SPEEDS.FAST; // Fast animation for maze generation
    
    walls.forEach((wall, index) => {
      const timeoutId = setTimeout(() => {
        onWallPlace(wall);
        
        // If this is the last wall, call completion callback
        if (index === walls.length - 1) {
          setTimeout(() => {
            setIsAnimating(false);
            onComplete();
          }, delay);
        }
      }, index * delay);
      
      timeoutIds.current.push(timeoutId);
    });
  }, [clearTimeouts]);

  // Run complete algorithm animation
  const runAlgorithmAnimation = useCallback((searchOrder, path, onComplete) => {
    // First animate the search
    animateSearch(searchOrder, () => {
      // Then animate the path if one exists
      if (path.length > 0) {
        animatePath(path, () => {
          setIsAnimating(false);
          onComplete();
        });
      } else {
        setIsAnimating(false);
        onComplete();
      }
    });
  }, [animateSearch, animatePath]);

  // Stop current animation
  const stopAnimation = useCallback(() => {
    clearTimeouts();
    setIsAnimating(false);
  }, [clearTimeouts]);

  // Update animation speed
  const updateAnimationSpeed = useCallback((speed) => {
    setAnimationSpeed(speed);
  }, []);

  return {
    isAnimating,
    animationSpeed,
    animateSearch,
    animatePath,
    animateMaze,
    runAlgorithmAnimation,
    stopAnimation,
    updateAnimationSpeed
  };
};
