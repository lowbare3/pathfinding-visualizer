import React, { useState, useEffect } from 'react';
import { TUTORIAL_SLIDES } from '../utils/constants.js';
import './Tutorial.css';

const Tutorial = ({ isVisible, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reset to first slide when tutorial opens
  useEffect(() => {
    if (isVisible) {
      setCurrentSlide(0);
    }
  }, [isVisible]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'j') {
        handlePrevious();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentSlide]);

  const handleNext = () => {
    if (currentSlide < TUTORIAL_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isVisible) return null;

  const slide = TUTORIAL_SLIDES[currentSlide];
  const isLastSlide = currentSlide === TUTORIAL_SLIDES.length - 1;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card">
        <div className="tutorial-content">
          <div className="slides-container">
            {TUTORIAL_SLIDES.map((slideData, index) => (
              <div
                key={slideData.id}
                className={`slide ${index === currentSlide ? 'active' : ''} ${slideData.background ? `bg-${slideData.background}` : 'default-bg'}`}
                style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
              >
                <h4>{slideData.title}</h4>
                
                {slideData.hasImage ? (
                  <div className="img-box shadow">
                    <img src={slideData.image} alt={slideData.title} />
                  </div>
                ) : (
                  <div className="img-box"></div>
                )}
                
                <p dangerouslySetInnerHTML={{ 
                  __html: slideData.content.replace(/\b(algorithms?|route|shortest path|source\/target|click|drag|Generate Maze|brainstorm!|speed|mobile phone|pathfinding algorithms|visualize)\b/gi, 
                    '<span class="blue">$1</span>'
                  )
                }}></p>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="dots">
            {TUTORIAL_SLIDES.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="tutorial-nav">
            <div className="nav-left">
              <button className="btn" onClick={handleSkip}>
                Skip Tutorial
              </button>
            </div>
            <div className="nav-right">
              <button 
                className={`btn ${currentSlide === 0 ? 'disabled' : ''}`}
                onClick={handlePrevious}
                disabled={currentSlide === 0}
              >
                Previous
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleNext}
              >
                {isLastSlide ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Backdrop */}
      <div className="tutorial-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default Tutorial;
