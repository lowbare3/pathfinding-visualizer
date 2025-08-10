import { PriorityQueue } from './PriorityQueue.js';
import { isValid, getNeighbours, heuristicValue, backtrack } from './utils.js';

/**
 * Breadth-First Search Algorithm
 */
export const BFS = (grid, source, target) => {
  const queue = [];
  const visited = new Set();
  const parent = new Map();
  const searchOrder = [];
  
  queue.push(source);
  visited.add(`${source.x}-${source.y}`);

  while (queue.length > 0) {
    const current = queue.shift();
    searchOrder.push(current);

    if (current.x === target.x && current.y === target.y) {
      const path = backtrack(parent, target, source).reverse();
      return { searchOrder, path };
    }

    const neighbours = getNeighbours(current);

    for (const neighbour of neighbours) {
      const key = `${neighbour.x}-${neighbour.y}`;
      if (
        isValid(neighbour.x, neighbour.y, grid.length, grid[0].length) &&
        !grid[neighbour.x][neighbour.y].isWall &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push(neighbour);
        parent.set(key, current);
      }
    }
  }

  return { searchOrder, path: [] };
};

/**
 * Depth-First Search Algorithm
 */
export const DFS = (grid, source, target) => {
  const searchOrder = [];
  const path = [];
  const visited = new Set();

  const dfsRecursive = (current) => {
    if (current.x === target.x && current.y === target.y) {
      return true;
    }

    searchOrder.push(current);
    visited.add(`${current.x}-${current.y}`);

    const neighbours = getNeighbours(current);

    for (const neighbour of neighbours) {
      if (
        isValid(neighbour.x, neighbour.y, grid.length, grid[0].length) &&
        !visited.has(`${neighbour.x}-${neighbour.y}`) &&
        !grid[neighbour.x][neighbour.y].isWall
      ) {
        if (dfsRecursive(neighbour)) {
          path.push(neighbour);
          return true;
        }
      }
    }

    return false;
  };

  if (dfsRecursive(source)) {
    path.push(source);
  }

  return { searchOrder, path: path.reverse() };
};

/**
 * Dijkstra's Algorithm
 */
export const Dijkstra = (grid, source, target) => {
  const pq = new PriorityQueue();
  const parent = new Map();
  const distance = [];
  const searchOrder = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Initialize distance array
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(Infinity);
    }
    distance.push(row);
  }

  distance[source.x][source.y] = 0;
  pq.push({ coordinate: source, cost: 0 });

  while (!pq.isEmpty()) {
    const { coordinate: current, cost: distanceSoFar } = pq.pop();
    searchOrder.push(current);

    if (current.x === target.x && current.y === target.y) {
      const path = backtrack(parent, target, source).reverse();
      return { searchOrder, path };
    }

    const neighbours = getNeighbours(current);

    for (const neighbour of neighbours) {
      const key = `${neighbour.x}-${neighbour.y}`;

      if (
        isValid(neighbour.x, neighbour.y, rows, cols) &&
        !grid[neighbour.x][neighbour.y].isWall
      ) {
        const edgeWeight = 1;
        const distanceToNeighbour = distanceSoFar + edgeWeight;

        if (distanceToNeighbour < distance[neighbour.x][neighbour.y]) {
          distance[neighbour.x][neighbour.y] = distanceToNeighbour;
          pq.push({ coordinate: neighbour, cost: distanceToNeighbour });
          parent.set(key, current);
        }
      }
    }
  }

  return { searchOrder, path: [] };
};

/**
 * A* Algorithm
 */
export const AStar = (grid, source, target) => {
  const queue = new PriorityQueue();
  const visited = new Set(); // closed set
  const queued = new Set(); // open set
  const parent = new Map();
  const gScore = [];
  const searchOrder = [];
  const rows = grid.length;
  const cols = grid[0].length;

  // Initialize gScore array
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(Infinity);
    }
    gScore.push(row);
  }

  gScore[source.x][source.y] = 0;
  queue.push({ coordinate: source, cost: heuristicValue(source, target) });
  visited.add(`${source.x}-${source.y}`);

  while (!queue.isEmpty()) {
    const { coordinate: current } = queue.pop();
    searchOrder.push(current);

    if (current.x === target.x && current.y === target.y) {
      const path = backtrack(parent, target, source).reverse();
      return { searchOrder, path };
    }

    visited.add(`${current.x}-${current.y}`);

    const neighbours = getNeighbours(current);

    for (const neighbour of neighbours) {
      const key = `${neighbour.x}-${neighbour.y}`;

      if (
        isValid(neighbour.x, neighbour.y, rows, cols) &&
        !visited.has(key) &&
        !queued.has(key) &&
        !grid[neighbour.x][neighbour.y].isWall
      ) {
        const edgeWeight = 1;
        const gScoreToNeighbour = gScore[current.x][current.y] + edgeWeight;
        const fScore = gScoreToNeighbour + heuristicValue(neighbour, target);

        if (gScoreToNeighbour < gScore[neighbour.x][neighbour.y]) {
          gScore[neighbour.x][neighbour.y] = gScoreToNeighbour;
          queue.push({ coordinate: neighbour, cost: fScore });
          queued.add(key);
          parent.set(key, current);
        }
      }
    }
  }

  return { searchOrder, path: [] };
};

/**
 * Greedy Best-First Search Algorithm
 */
export const Greedy = (grid, source, target) => {
  const queue = new PriorityQueue();
  const visited = new Set();
  const parent = new Map();
  const searchOrder = [];

  queue.push({ coordinate: source, cost: heuristicValue(source, target) });
  visited.add(`${source.x}-${source.y}`);

  while (!queue.isEmpty()) {
    const { coordinate: current } = queue.pop();
    searchOrder.push(current);

    if (current.x === target.x && current.y === target.y) {
      const path = backtrack(parent, target, source).reverse();
      return { searchOrder, path };
    }

    const neighbours = getNeighbours(current);

    for (const neighbour of neighbours) {
      const key = `${neighbour.x}-${neighbour.y}`;

      if (
        isValid(neighbour.x, neighbour.y, grid.length, grid[0].length) &&
        !visited.has(key) &&
        !grid[neighbour.x][neighbour.y].isWall
      ) {
        queue.push({ coordinate: neighbour, cost: heuristicValue(neighbour, target) });
        visited.add(key);
        parent.set(key, current);
      }
    }
  }

  return { searchOrder, path: [] };
};

/**
 * Bi-Directional BFS Algorithm
 */
export const BiDirectional = (grid, source, target) => {
  const queue1 = [];
  const queue2 = [];
  const visited1 = new Set();
  const visited2 = new Set();
  const parent1 = new Map();
  const parent2 = new Map();
  const searchOrder = [];

  queue1.push(source);
  queue2.push(target);
  visited1.add(`${source.x}-${source.y}`);
  visited2.add(`${target.x}-${target.y}`);

  while (queue1.length > 0 && queue2.length > 0) {
    const current1 = queue1.shift();
    const current2 = queue2.shift();

    searchOrder.push(current1);
    searchOrder.push(current2);

    // Check for intersection
    if (visited1.has(`${current2.x}-${current2.y}`)) {
      const path1 = backtrack(parent1, current2, source).reverse();
      const path2 = backtrack(parent2, current2, target);
      return { searchOrder, path: [...path1, ...path2] };
    }
    if (visited2.has(`${current1.x}-${current1.y}`)) {
      const path1 = backtrack(parent1, current1, source).reverse();
      const path2 = backtrack(parent2, current1, target);
      return { searchOrder, path: [...path1, ...path2] };
    }

    const neighbours1 = getNeighbours(current1);
    const neighbours2 = getNeighbours(current2);

    visitNeighbours(current1, neighbours1, visited1, parent1, queue1, grid);
    visitNeighbours(current2, neighbours2, visited2, parent2, queue2, grid);
  }

  return { searchOrder, path: [] };
};

// Helper function for BiDirectional BFS
const visitNeighbours = (current, neighbours, visited, parent, queue, grid) => {
  for (const neighbour of neighbours) {
    const key = `${neighbour.x}-${neighbour.y}`;
    if (
      isValid(neighbour.x, neighbour.y, grid.length, grid[0].length) &&
      !grid[neighbour.x][neighbour.y].isWall &&
      !visited.has(key)
    ) {
      visited.add(key);
      queue.push(neighbour);
      parent.set(key, current);
    }
  }
};
