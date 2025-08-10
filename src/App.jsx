import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header.jsx';
import Board from './components/Board.jsx';
import Tutorial from './components/Tutorial.jsx';
import Footer from './components/Footer.jsx';
import { useBoard } from './hooks/useBoard.js';
import { usePathfinding } from './hooks/usePathfinding.js';
import { useAnimation } from './hooks/useAnimation.js';
import { generateMaze } from './utils/mazeGeneration.js';
import { debounce } from './utils/utils.js';
import './App.css';

function App() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const boardContainerRef = useRef(null);

  // Custom hooks
  const {
    grid,
    rows,
    cols,
    cellSize,
    source,
    target,
    isDrawing,
    isDragging,
    dragType,
    setIsDrawing,
    setIsDragging,
    setDragType,
    initializeGrid,
    updateCellSize,
    toggleWall,
    setWalls,
    moveNode,
    clearPath,
    clearBoard,
    updateGridWithAnimation
  } = useBoard();

  const {
    selectedAlgorithm,
    isRunning,
    runAlgorithm,
    updateAlgorithm,
    stopAlgorithm
  } = usePathfinding();

  const {
    isAnimating,
    animationSpeed,
    runAlgorithmAnimation,
    animateMaze,
    stopAnimation,
    updateAnimationSpeed
  } = useAnimation();

  // Initialize grid when container dimensions change
  useEffect(() => {
    if (containerDimensions.width > 0 && containerDimensions.height > 0) {
      initializeGrid(containerDimensions.width, containerDimensions.height);
    }
  }, [containerDimensions, cellSize, initializeGrid]);

  // Measure container dimensions
  const measureContainer = useCallback(() => {
    if (boardContainerRef.current) {
      const rect = boardContainerRef.current.getBoundingClientRect();
      setContainerDimensions({
        width: rect.width - 40, // Account for padding
        height: rect.height - 40
      });
    }
  }, []);

  // Debounced resize handler
  const debouncedMeasure = useCallback(
    debounce(measureContainer, 250),
    [measureContainer]
  );

  // Set up resize observer
  useEffect(() => {
    measureContainer();

    const resizeObserver = new ResizeObserver(debouncedMeasure);
    if (boardContainerRef.current) {
      resizeObserver.observe(boardContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureContainer, debouncedMeasure]);

  // Global mouse up handler to stop dragging when mouse is released outside grid
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging || isDrawing) {
        setIsDrawing(false);
        setIsDragging(false);
        setDragType(null);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging, isDrawing, setIsDrawing, setIsDragging, setDragType]);

  // Board interaction handlers
  const handleCellMouseDown = useCallback((x, y) => {
    if (isAnimating) return; // Prevent interaction during animation

    const node = grid[x][y];

    if (node.isSource) {
      setIsDragging(true);
      setDragType('source');
    } else if (node.isTarget) {
      setIsDragging(true);
      setDragType('target');
    } else {
      setIsDrawing(true);
      toggleWall(x, y);
    }
  }, [grid, setIsDragging, setDragType, setIsDrawing, toggleWall, isAnimating]);

  const handleCellMouseEnter = useCallback((x, y) => {
    if (isAnimating) return; // Prevent interaction during animation

    if (isDragging && dragType) {
      // Only move if we're actually dragging and the position is different
      const currentPos = dragType === 'source' ? source : target;
      if (!currentPos || currentPos.x !== x || currentPos.y !== y) {
        moveNode(x, y, dragType);
      }
    } else if (isDrawing) {
      const node = grid[x][y];
      if (!node.isSource && !node.isTarget) {
        toggleWall(x, y);
      }
    }
  }, [isDragging, dragType, isDrawing, grid, moveNode, toggleWall, isAnimating, source, target]);

  const handleCellMouseUp = useCallback(() => {
    setIsDrawing(false);
    setIsDragging(false);
    setDragType(null);
  }, [setIsDrawing, setIsDragging, setDragType]);

  const handleCellClick = useCallback((x, y) => {
    if (!isDrawing && !isDragging) {
      toggleWall(x, y);
    }
  }, [isDrawing, isDragging, toggleWall]);

  // Clear visual path from DOM (like original vanilla JS version)
  const clearVisualPath = useCallback(() => {
    const cells = document.querySelectorAll('.board-cell');
    cells.forEach(cell => {
      cell.classList.remove('node-visited', 'node-path');
      if (!cell.classList.contains('node-source') &&
          !cell.classList.contains('node-target') &&
          !cell.classList.contains('node-wall')) {
        cell.classList.add('node-unvisited');
      }
    });
  }, []);

  // Algorithm visualization
  const handleVisualize = useCallback(() => {
    if (isAnimating || !source || !target) return;

    clearVisualPath(); // Clear visual path from DOM

    const result = runAlgorithm(grid, source, target);

    if (result.searchOrder.length > 0) {
      runAlgorithmAnimation(
        result.searchOrder,
        result.path,
        () => {
          // Animation complete
          stopAlgorithm();
        }
      );
    } else {
      stopAlgorithm();
    }
  }, [isAnimating, source, target, clearVisualPath, runAlgorithm, grid, runAlgorithmAnimation, stopAlgorithm]);

  // Maze generation
  const handleGenerateMaze = useCallback(() => {
    if (isAnimating) return;

    clearBoard();
    const walls = generateMaze(rows, cols);
    
    animateMaze(
      walls,
      (wall) => {
        setWalls([wall]);
      },
      () => {
        setWalls(walls);
      }
    );
  }, [isAnimating, clearBoard, rows, cols, animateMaze, setWalls]);

  // Cell size change
  const handleCellSizeChange = useCallback((newSize) => {
    updateCellSize(newSize, containerDimensions.width, containerDimensions.height);
  }, [updateCellSize, containerDimensions]);

  // Clear handlers
  const handleClearPath = useCallback(() => {
    if (!isAnimating) {
      stopAnimation();
      clearVisualPath(); // Clear visual path from DOM
      clearPath(); // Clear React state
    }
  }, [isAnimating, stopAnimation, clearVisualPath, clearPath]);

  const handleClearBoard = useCallback(() => {
    if (!isAnimating) {
      stopAnimation();
      clearVisualPath(); // Clear visual path from DOM
      clearBoard(); // Clear React state
    }
  }, [isAnimating, stopAnimation, clearVisualPath, clearBoard]);

  return (
    <div className="app">
      <Header
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={updateAlgorithm}
        onVisualize={handleVisualize}
        onClearPath={handleClearPath}
        onClearBoard={handleClearBoard}
        onGenerateMaze={handleGenerateMaze}
        cellSize={cellSize}
        onCellSizeChange={handleCellSizeChange}
        animationSpeed={animationSpeed}
        onSpeedChange={updateAnimationSpeed}
        isAnimating={isAnimating || isRunning}
        onShowTutorial={() => setShowTutorial(true)}
      />

      <main className="main-content" ref={boardContainerRef}>
        <Board
          grid={grid}
          cellSize={cellSize}
          onCellClick={handleCellClick}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseUp={handleCellMouseUp}
          isDrawing={isDrawing}
          isDragging={isDragging}
        />
      </main>

      <Footer />

      <Tutorial
        isVisible={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </div>
  );
}

export default App;
