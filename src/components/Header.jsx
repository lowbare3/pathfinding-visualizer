import { useState, useEffect, useRef } from 'react';
import { ALGORITHMS, CELL_SIZES, LEGEND_ITEMS } from '../utils/constants.js';
import './Header.css';

const Header = ({
  selectedAlgorithm,
  onAlgorithmChange,
  onVisualize,
  onClearPath,
  onClearBoard,
  onGenerateMaze,
  cellSize,
  onCellSizeChange,
  animationSpeed,
  onSpeedChange,
  isAnimating,
  onShowTutorial
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const headerRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdown, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const handleAlgorithmSelect = (algorithm) => {
    onAlgorithmChange(algorithm);
    closeDropdowns();
  };

  const handleCellSizeSelect = (size) => {
    onCellSizeChange(size);
    closeDropdowns();
  };

  const handleSpeedSelect = (speed) => {
    onSpeedChange(speed);
    closeDropdowns();
  };

  const getSpeedLabel = (speed) => {
    switch (speed) {
      case 'SLOW': return 'Slow';
      case 'NORMAL': return 'Normal';
      case 'FAST': return 'Fast';
      default: return 'Normal';
    }
  };

  return (
    <header className="header" ref={headerRef}>
      {/* Navigation Bar */}
      <nav className="nav">
        <div className="nav-left">
          <h1 className="logo">PathFinding Visualizer</h1>
        </div>

        <div className="nav-center">
          <button 
            className="btn btn-primary visualize-btn"
            onClick={onVisualize}
            disabled={isAnimating}
          >
            <span>✨ Visualize {selectedAlgorithm}</span>
          </button>
        </div>

        <div className="nav-right">
          <ul className="nav-menu">
            <li>
              <button 
                className="nav-link"
                onClick={onClearPath}
                disabled={isAnimating}
              >
                Clear Path
              </button>
            </li>
            <li>
              <button 
                className="nav-link"
                onClick={onClearBoard}
                disabled={isAnimating}
              >
                Clear Board
              </button>
            </li>
            <li>
              <button 
                className="nav-link"
                onClick={onGenerateMaze}
                disabled={isAnimating}
              >
                Generate Maze
              </button>
            </li>

            {/* Pixel Size Dropdown */}
            <li className="dropdown">
              <button
                className={`nav-link dropdown-toggle ${activeDropdown === 'pixel' ? 'active' : ''}`}
                onClick={(e) => toggleDropdown('pixel', e)}
              >
                Pixel <span className="caret">▼</span>
              </button>
              {activeDropdown === 'pixel' && (
                <ul className="dropdown-menu">
                  {CELL_SIZES.map(size => (
                    <li key={size}>
                      <button
                        className={`dropdown-item ${cellSize === size ? 'active' : ''}`}
                        onClick={() => handleCellSizeSelect(size)}
                      >
                        {size}px
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Speed Dropdown */}
            <li className="dropdown">
              <button
                className={`nav-link dropdown-toggle ${activeDropdown === 'speed' ? 'active' : ''}`}
                onClick={(e) => toggleDropdown('speed', e)}
              >
                Speed <span className="caret">▼</span>
              </button>
              {activeDropdown === 'speed' && (
                <ul className="dropdown-menu">
                  {['SLOW', 'NORMAL', 'FAST'].map(speed => (
                    <li key={speed}>
                      <button
                        className={`dropdown-item ${animationSpeed === speed ? 'active' : ''}`}
                        onClick={() => handleSpeedSelect(speed)}
                      >
                        {getSpeedLabel(speed)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Algorithm Dropdown */}
            <li className="dropdown">
              <button
                className={`nav-link dropdown-toggle ${activeDropdown === 'algorithm' ? 'active' : ''}`}
                onClick={(e) => toggleDropdown('algorithm', e)}
              >
                Algorithms <span className="caret">▼</span>
              </button>
              {activeDropdown === 'algorithm' && (
                <ul className="dropdown-menu">
                  {Object.values(ALGORITHMS).map(algorithm => (
                    <li key={algorithm}>
                      <button
                        className={`dropdown-item ${selectedAlgorithm === algorithm ? 'active' : ''}`}
                        onClick={() => handleAlgorithmSelect(algorithm)}
                      >
                        {algorithm}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Legend */}
      <div className="legend">
        {LEGEND_ITEMS.map(item => (
          <div key={item.type} className="legend-item">
            <div className={`legend-symbol node-${item.type}`}>
              {item.type === 'source' && '🎯'}
              {item.type === 'target' && '🏁'}
            </div>
            <span className="legend-text">{item.label}</span>
          </div>
        ))}
        
        <button 
          className="tutorial-toggle"
          onClick={onShowTutorial}
          title="Show Tutorial"
        >
          ?
        </button>
      </div>

    </header>
  );
};

export default Header;
