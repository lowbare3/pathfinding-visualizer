// Utility functions for the pathfinder visualizer

/**
 * Check if coordinates are within grid bounds
 */
export const isValid = (x, y, rows, cols) => {
  return x >= 0 && y >= 0 && x < rows && y < cols;
};

/**
 * Get neighboring coordinates
 */
export const getNeighbours = (current) => {
  return [
    { x: current.x + 1, y: current.y },
    { x: current.x - 1, y: current.y },
    { x: current.x, y: current.y + 1 },
    { x: current.x, y: current.y - 1 }
  ];
};

/**
 * Manhattan distance heuristic for A* and Greedy algorithms
 */
export const heuristicValue = (node, target) => {
  return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
};

/**
 * Backtrack to reconstruct path
 */
export const backtrack = (parents, target, source) => {
  const path = [];
  let current = target;
  
  while (current) {
    path.push(current);
    if (current.x === source.x && current.y === source.y) break;
    current = parents.get(`${current.x}-${current.y}`);
  }
  
  return path;
};

/**
 * Generate random position within grid bounds
 */
export const getRandomPosition = (rows, cols) => {
  return {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
  };
};

/**
 * Create initial grid state
 */
export const createInitialGrid = (rows, cols) => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        x: i,
        y: j,
        type: 'unvisited',
        isWall: false,
        isSource: false,
        isTarget: false,
        isVisited: false,
        isPath: false
      });
    }
    grid.push(row);
  }
  return grid;
};

/**
 * Deep clone grid for state updates
 */
export const cloneGrid = (grid) => {
  return grid.map(row => 
    row.map(node => ({ ...node }))
  );
};

/**
 * Reset grid to initial state (keeping walls)
 */
export const resetGridPath = (grid) => {
  return grid.map(row =>
    row.map(node => ({
      ...node,
      isVisited: false,
      isPath: false,
      type: node.isWall ? 'wall' : 
             node.isSource ? 'source' :
             node.isTarget ? 'target' : 'unvisited'
    }))
  );
};

/**
 * Clear all walls from grid
 */
export const clearWalls = (grid) => {
  return grid.map(row =>
    row.map(node => ({
      ...node,
      isWall: false,
      isVisited: false,
      isPath: false,
      type: node.isSource ? 'source' :
             node.isTarget ? 'target' : 'unvisited'
    }))
  );
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate grid dimensions based on container size and cell size
 */
export const calculateGridDimensions = (containerWidth, containerHeight, cellSize) => {
  const cols = Math.floor(containerWidth / cellSize);
  const rows = Math.floor(containerHeight / cellSize);
  return { rows, cols };
};
