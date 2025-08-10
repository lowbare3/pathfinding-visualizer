import React, { useRef, useEffect, useCallback } from 'react';
import './Board.css';

const Board = ({ 
  grid, 
  cellSize, 
  onCellClick, 
  onCellMouseDown, 
  onCellMouseEnter, 
  onCellMouseUp,
  isDrawing,
  isDragging 
}) => {
  const boardRef = useRef(null);

  // Update CSS custom property for cell size
  useEffect(() => {
    document.documentElement.style.setProperty('--cell-width', `${cellSize}px`);
  }, [cellSize]);

  // Get node class based on node type
  const getNodeClass = useCallback((node) => {
    const baseClass = 'board-cell';
    const typeClass = `node-${node.type}`;
    
    let classes = [baseClass, typeClass];
    
    if (node.isSource) classes.push('node-source');
    if (node.isTarget) classes.push('node-target');
    if (node.isWall) classes.push('node-wall');
    if (node.isVisited && !node.isSource && !node.isTarget) classes.push('node-visited');
    if (node.isPath && !node.isSource && !node.isTarget) classes.push('node-path');
    
    return classes.join(' ');
  }, []);

  // Handle mouse events
  const handleMouseDown = useCallback((e, x, y) => {
    e.preventDefault();
    onCellMouseDown(x, y);
  }, [onCellMouseDown]);

  const handleMouseEnter = useCallback((e, x, y) => {
    if (isDrawing || isDragging) {
      onCellMouseEnter(x, y);
    }
  }, [isDrawing, isDragging, onCellMouseEnter]);

  const handleMouseUp = useCallback((e, x, y) => {
    e.preventDefault();
    onCellMouseUp(x, y);
  }, [onCellMouseUp]);

  const handleClick = useCallback((e, x, y) => {
    e.preventDefault();
    onCellClick(x, y);
  }, [onCellClick]);

  // Render individual cell
  const renderCell = useCallback((node, rowIndex, colIndex) => {
    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={getNodeClass(node)}
        onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
        onMouseEnter={(e) => handleMouseEnter(e, rowIndex, colIndex)}
        onMouseUp={(e) => handleMouseUp(e, rowIndex, colIndex)}
        onClick={(e) => handleClick(e, rowIndex, colIndex)}
        data-row={rowIndex}
        data-col={colIndex}
      >
        {node.isSource && (
          <div className="node-icon source-icon">🎯</div>
        )}
        {node.isTarget && (
          <div className="node-icon target-icon">🏁</div>
        )}
      </div>
    );
  }, [getNodeClass, handleMouseDown, handleMouseEnter, handleMouseUp, handleClick]);

  // Render grid row
  const renderRow = useCallback((row, rowIndex) => {
    return (
      <div key={rowIndex} className="board-row">
        {row.map((node, colIndex) => renderCell(node, rowIndex, colIndex))}
      </div>
    );
  }, [renderCell]);

  if (!grid || grid.length === 0) {
    return (
      <div className="board-container">
        <div className="board-loading">
          <div className="loading-spinner"></div>
          <p>Initializing grid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="board-container">
      <div 
        ref={boardRef}
        className="board"
        onContextMenu={(e) => e.preventDefault()}
        onSelectStart={(e) => e.preventDefault()}
      >
        {grid.map((row, rowIndex) => renderRow(row, rowIndex))}
      </div>
    </div>
  );
};

export default Board;
