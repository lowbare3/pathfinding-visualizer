// Grid configuration
export const DEFAULT_CELL_SIZE = 22;
export const CELL_SIZES = [14, 16, 18, 20, 22, 24, 26];

// Animation speeds
export const ANIMATION_SPEEDS = {
  SLOW: 50,
  NORMAL: 25,
  FAST: 10
};

// Node types
export const NODE_TYPES = {
  UNVISITED: 'unvisited',
  VISITED: 'visited',
  WALL: 'wall',
  SOURCE: 'source',
  TARGET: 'target',
  PATH: 'path'
};

// Algorithms
export const ALGORITHMS = {
  BFS: 'BFS',
  DFS: 'DFS',
  DIJKSTRA: "Dijkstra's",
  ASTAR: 'A*',
  GREEDY: 'Greedy',
  BIDIRECTIONAL: 'Bi-Directional'
};

// Tutorial slides data
export const TUTORIAL_SLIDES = [
  {
    id: 1,
    title: "what is path finder visualizer",
    content: "It helps you see how path finding algorithms find the most efficient route between source to target on a grid.",
    background: "man-thinking"
  },
  {
    id: 2,
    title: "How does it work",
    content: "You can set start and end points, create mazes, choose algorithms, and watch the process in action. It's a fun and visual way to understand how different strategies navigate through obstacles to find the shortest path.",
    background: "man-with-maze"
  },
  {
    id: 3,
    title: "Adjust source/target",
    content: "Click and drag the source/target marker to where you want it on the grid.",
    image: "/tutorial/drag-source-target.gif",
    hasImage: true
  },
  {
    id: 4,
    title: "Draw walls/obstacles",
    content: "Use the 'Draw Wall' option to mark obstacles on the grid. Simply click and drag to create walls and define the layout.",
    image: "/tutorial/draw-wall.gif",
    hasImage: true
  },
  {
    id: 5,
    title: "generate maze",
    content: "It's time to give your pathfinding algorithm a brainstorm! Just click Generate Maze and watch the algorithm's creativity.",
    image: "/tutorial/generate-maze.gif",
    hasImage: true
  },
  {
    id: 6,
    title: "Select Pixel Size",
    content: "It allow you to increase or decrease the cells in the grid helps you to get wider range in small devices, like mobile phone",
    image: "/tutorial/pixel_tutorial.png",
    hasImage: true
  },
  {
    id: 7,
    title: "Adjust the speed",
    content: "Adjust the speed of the searching to follow the algorithm's progress closely.",
    image: "/tutorial/speed_tutorial.png",
    hasImage: true
  },
  {
    id: 8,
    title: "Select Algorithm",
    content: "Pick one... from various pathfinding algorithms. Each has its unique way of finding the shortest path.",
    image: "/tutorial/algorithm_tutorial.png",
    hasImage: true
  },
  {
    id: 9,
    title: "click on visualize btn",
    content: "click the visualize btn and boom ! enjoy the process",
    background: "man-clicking-visualize"
  }
];

// Legend items
export const LEGEND_ITEMS = [
  { type: NODE_TYPES.SOURCE, label: "Start Node" },
  { type: NODE_TYPES.TARGET, label: "Target Node" },
  { type: NODE_TYPES.UNVISITED, label: "Unvisited node" },
  { type: NODE_TYPES.VISITED, label: "visited node" },
  { type: NODE_TYPES.WALL, label: "wall node" },
  { type: NODE_TYPES.PATH, label: "Shortest-Path Node" }
];
