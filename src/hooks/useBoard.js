import { useState, useCallback, useEffect } from 'react';
import { createInitialGrid, cloneGrid, resetGridPath, clearWalls, getRandomPosition, calculateGridDimensions } from '../utils/utils.js';
import { DEFAULT_CELL_SIZE } from '../utils/constants.js';

export const useBoard = () => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);
  const [source, setSource] = useState(null);
  const [target, setTarget] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);

  // Initialize grid based on container dimensions
  const initializeGrid = useCallback((containerWidth, containerHeight) => {
    const { rows: newRows, cols: newCols } = calculateGridDimensions(
      containerWidth, 
      containerHeight, 
      cellSize
    );
    
    setRows(newRows);
    setCols(newCols);
    
    const newGrid = createInitialGrid(newRows, newCols);
    
    // Set random source and target positions
    const sourcePos = getRandomPosition(newRows, newCols);
    const targetPos = getRandomPosition(newRows, newCols);
    
    // Ensure source and target are different
    while (targetPos.x === sourcePos.x && targetPos.y === sourcePos.y) {
      targetPos.x = Math.floor(Math.random() * newRows);
      targetPos.y = Math.floor(Math.random() * newCols);
    }
    
    newGrid[sourcePos.x][sourcePos.y] = {
      ...newGrid[sourcePos.x][sourcePos.y],
      isSource: true,
      type: 'source'
    };
    
    newGrid[targetPos.x][targetPos.y] = {
      ...newGrid[targetPos.x][targetPos.y],
      isTarget: true,
      type: 'target'
    };
    
    setSource(sourcePos);
    setTarget(targetPos);
    setGrid(newGrid);
  }, [cellSize]);

  // Update cell size and reinitialize grid
  const updateCellSize = useCallback((newSize, containerWidth, containerHeight) => {
    setCellSize(newSize);
    // Grid will be reinitialized in useEffect when cellSize changes
  }, []);

  // Toggle wall at specific position
  const toggleWall = useCallback((x, y) => {
    setGrid(prevGrid => {
      const newGrid = cloneGrid(prevGrid);
      const node = newGrid[x][y];
      
      if (node.isSource || node.isTarget) return prevGrid;
      
      node.isWall = !node.isWall;
      node.type = node.isWall ? 'wall' : 'unvisited';
      
      return newGrid;
    });
  }, []);

  // Set walls from array (for maze generation)
  const setWalls = useCallback((wallPositions) => {
    setGrid(prevGrid => {
      const newGrid = cloneGrid(prevGrid);
      
      wallPositions.forEach(({ x, y }) => {
        if (x >= 0 && x < rows && y >= 0 && y < cols) {
          const node = newGrid[x][y];
          if (!node.isSource && !node.isTarget) {
            node.isWall = true;
            node.type = 'wall';
          }
        }
      });
      
      return newGrid;
    });
  }, [rows, cols]);

  // Move source or target
  const moveNode = useCallback((newX, newY, nodeType) => {
    if (newX < 0 || newX >= rows || newY < 0 || newY >= cols) return;

    // Get current position to avoid unnecessary updates
    const currentPos = nodeType === 'source' ? source : target;
    if (currentPos && currentPos.x === newX && currentPos.y === newY) {
      return; // Already at this position
    }

    setGrid(prevGrid => {
      const newGrid = cloneGrid(prevGrid);

      // Clear old position
      if (currentPos) {
        const oldNode = newGrid[currentPos.x][currentPos.y];
        newGrid[currentPos.x][currentPos.y] = {
          ...oldNode,
          isSource: false,
          isTarget: false,
          type: oldNode.isWall ? 'wall' : 'unvisited'
        };
      }

      // Clear any existing source/target at new position (prevent duplicates)
      const targetNode = newGrid[newX][newY];
      newGrid[newX][newY] = {
        ...targetNode,
        isSource: nodeType === 'source',
        isTarget: nodeType === 'target',
        isWall: false,
        type: nodeType
      };

      return newGrid;
    });

    const newPos = { x: newX, y: newY };
    if (nodeType === 'source') {
      setSource(newPos);
    } else {
      setTarget(newPos);
    }
  }, [rows, cols, source, target]);

  // Clear path (keep walls)
  const clearPath = useCallback(() => {
    setGrid(prevGrid => resetGridPath(prevGrid));
  }, []);

  // Clear entire board
  const clearBoard = useCallback(() => {
    setGrid(prevGrid => clearWalls(prevGrid));
  }, []);

  // Update grid with animation results
  const updateGridWithAnimation = useCallback((searchOrder, path) => {
    setGrid(prevGrid => {
      const newGrid = cloneGrid(prevGrid);
      
      // Mark visited nodes
      searchOrder.forEach(node => {
        if (!newGrid[node.x][node.y].isSource && !newGrid[node.x][node.y].isTarget) {
          newGrid[node.x][node.y].isVisited = true;
          newGrid[node.x][node.y].type = 'visited';
        }
      });
      
      // Mark path nodes
      path.forEach(node => {
        if (!newGrid[node.x][node.y].isSource && !newGrid[node.x][node.y].isTarget) {
          newGrid[node.x][node.y].isPath = true;
          newGrid[node.x][node.y].type = 'path';
        }
      });
      
      return newGrid;
    });
  }, []);

  return {
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
  };
};
