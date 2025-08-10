/**
 * Recursive Division Maze Generation Algorithm
 * Creates a maze by recursively dividing the grid with walls
 */

export const generateMaze = (rows, cols) => {
  const walls = [];
  
  const recursiveDivision = (rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) => {
    if (rowEnd < rowStart || colEnd < colStart) {
      return;
    }

    if (!surroundingWalls) {
      // Add surrounding walls
      for (let i = 0; i < rows; i++) {
        if (i === 0 || i === rows - 1) {
          for (let j = 0; j < cols; j++) {
            walls.push({ x: i, y: j });
          }
        } else {
          walls.push({ x: i, y: 0 });
          walls.push({ x: i, y: cols - 1 });
        }
      }
      recursiveDivision(1, rows - 2, 1, cols - 2, orientation, true);
      return;
    }

    if (orientation === 'horizontal') {
      const possibleRows = [];
      for (let number = rowStart; number <= rowEnd; number += 2) {
        possibleRows.push(number);
      }
      const currentRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
      
      const possibleCols = [];
      for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
        possibleCols.push(number);
      }
      const randomCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
      
      for (let i = colStart - 1; i <= colEnd + 1; i++) {
        if (i !== randomCol) {
          walls.push({ x: currentRow, y: i });
        }
      }
      
      if (currentRow - 2 - rowStart > colEnd - colStart) {
        recursiveDivision(rowStart, currentRow - 2, colStart, colEnd, orientation, true);
      } else {
        recursiveDivision(rowStart, currentRow - 2, colStart, colEnd, 'vertical', true);
      }
      
      if (rowEnd - (currentRow + 2) > colEnd - colStart) {
        recursiveDivision(currentRow + 2, rowEnd, colStart, colEnd, orientation, true);
      } else {
        recursiveDivision(currentRow + 2, rowEnd, colStart, colEnd, 'vertical', true);
      }
    } else {
      const possibleCols = [];
      for (let number = colStart; number <= colEnd; number += 2) {
        possibleCols.push(number);
      }
      const currentCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
      
      const possibleRows = [];
      for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
        possibleRows.push(number);
      }
      const randomRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
      
      for (let i = rowStart - 1; i <= rowEnd + 1; i++) {
        if (i !== randomRow) {
          walls.push({ x: i, y: currentCol });
        }
      }
      
      if (rowEnd - rowStart > currentCol - 2 - colStart) {
        recursiveDivision(rowStart, rowEnd, colStart, currentCol - 2, 'horizontal', true);
      } else {
        recursiveDivision(rowStart, rowEnd, colStart, currentCol - 2, orientation, true);
      }
      
      if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
        recursiveDivision(rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', true);
      } else {
        recursiveDivision(rowStart, rowEnd, currentCol + 2, colEnd, orientation, true);
      }
    }
  };

  // Start the recursive division
  const orientation = rows > cols ? 'horizontal' : 'vertical';
  recursiveDivision(0, rows - 1, 0, cols - 1, orientation, false);
  
  return walls;
};

/**
 * Simple random maze generation
 * Randomly places walls throughout the grid
 */
export const generateRandomMaze = (rows, cols, density = 0.3) => {
  const walls = [];
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.random() < density) {
        walls.push({ x: i, y: j });
      }
    }
  }
  
  return walls;
};
