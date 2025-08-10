# PathFinder Visualizer (React Version)

A pathfinding algorithm visualizer built with React. You can watch different algorithms find the shortest path between two points on a grid.

## What it does

- Visualizes 6 different pathfinding algorithms
- Interactive grid where you can draw walls and move start/end points
- Generate random mazes
- Adjust speed and grid size
- Built-in tutorial

## Algorithms included

- **BFS** - finds shortest path, explores level by level
- **DFS** - goes deep first, doesn't guarantee shortest path
- **Dijkstra** - classic shortest path algorithm
- **A*** - smart algorithm that uses heuristics
- **Greedy** - fast but not always optimal
- **Bi-Directional BFS** - searches from both ends

## How to run

```bash
cd Path_Visualizer
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## How to use

1. Drag the green start point and red end point where you want
2. Click and drag to draw walls (obstacles)
3. Pick an algorithm from the dropdown
4. Click "Visualize" and watch it work
5. Use "Generate Maze" for random obstacles
6. Click the "?" button for a tutorial

## Built with

- React + Vite
- Vanilla CSS
- Custom hooks for state management

## Author

Harsh Bhanushali
