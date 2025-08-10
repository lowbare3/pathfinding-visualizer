import { useState, useCallback } from 'react';
import { BFS, DFS, Dijkstra, AStar, Greedy, BiDirectional } from '../utils/algorithms.js';
import { ALGORITHMS } from '../utils/constants.js';

export const usePathfinding = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS.BFS);
  const [isRunning, setIsRunning] = useState(false);

  // Get algorithm function based on selection
  const getAlgorithmFunction = useCallback((algorithmName) => {
    switch (algorithmName) {
      case ALGORITHMS.BFS:
        return BFS;
      case ALGORITHMS.DFS:
        return DFS;
      case ALGORITHMS.DIJKSTRA:
        return Dijkstra;
      case ALGORITHMS.ASTAR:
        return AStar;
      case ALGORITHMS.GREEDY:
        return Greedy;
      case ALGORITHMS.BIDIRECTIONAL:
        return BiDirectional;
      default:
        return BFS;
    }
  }, []);

  // Run the selected algorithm
  const runAlgorithm = useCallback((grid, source, target) => {
    if (!source || !target || isRunning) {
      return { searchOrder: [], path: [] };
    }

    setIsRunning(true);
    
    const algorithmFunction = getAlgorithmFunction(selectedAlgorithm);
    const result = algorithmFunction(grid, source, target);
    
    return result;
  }, [selectedAlgorithm, isRunning, getAlgorithmFunction]);

  // Update selected algorithm
  const updateAlgorithm = useCallback((algorithm) => {
    if (!isRunning) {
      setSelectedAlgorithm(algorithm);
    }
  }, [isRunning]);

  // Stop current algorithm execution
  const stopAlgorithm = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Get algorithm display name
  const getAlgorithmDisplayName = useCallback((algorithm) => {
    switch (algorithm) {
      case ALGORITHMS.BFS:
        return 'Breadth-First Search';
      case ALGORITHMS.DFS:
        return 'Depth-First Search';
      case ALGORITHMS.DIJKSTRA:
        return "Dijkstra's Algorithm";
      case ALGORITHMS.ASTAR:
        return 'A* Algorithm';
      case ALGORITHMS.GREEDY:
        return 'Greedy Best-First Search';
      case ALGORITHMS.BIDIRECTIONAL:
        return 'Bi-Directional BFS';
      default:
        return algorithm;
    }
  }, []);

  // Get algorithm description
  const getAlgorithmDescription = useCallback((algorithm) => {
    switch (algorithm) {
      case ALGORITHMS.BFS:
        return 'Explores nodes level by level, guarantees shortest path in unweighted graphs.';
      case ALGORITHMS.DFS:
        return 'Explores as far as possible along each branch before backtracking.';
      case ALGORITHMS.DIJKSTRA:
        return 'Finds shortest path in weighted graphs, explores nodes in order of distance.';
      case ALGORITHMS.ASTAR:
        return 'Uses heuristic to guide search toward target, optimal and efficient.';
      case ALGORITHMS.GREEDY:
        return 'Always moves toward target using heuristic, fast but not always optimal.';
      case ALGORITHMS.BIDIRECTIONAL:
        return 'Searches from both start and end simultaneously, can be faster than BFS.';
      default:
        return 'Pathfinding algorithm';
    }
  }, []);

  return {
    selectedAlgorithm,
    isRunning,
    runAlgorithm,
    updateAlgorithm,
    stopAlgorithm,
    getAlgorithmDisplayName,
    getAlgorithmDescription
  };
};
