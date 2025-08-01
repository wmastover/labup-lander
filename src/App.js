import React, { useState, useEffect } from 'react';
import './App.css';
import backgroundImage from './background.png';
import Terminal from './Terminal';

function App() {
  const [currentStage, setCurrentStage] = useState('initial');
  const [showAnimation, setShowAnimation] = useState(false);
  const [startFade, setStartFade] = useState(false);

  // Auto-start animation on component mount
  useEffect(() => {
    const startAnimation = () => {
      setShowAnimation(true);
      setCurrentStage('animating');
      
      // Start gradual fade halfway through animation
      setTimeout(() => {
        setStartFade(true);
      }, 1500); // Start fade at 1.5 seconds
      
      // Complete fade and reveal background
      setTimeout(() => {
        setCurrentStage('backgroundReveal');
      }, 4000); // Total sequence takes 4 seconds
    };

    // Start animation after a brief delay to ensure component is mounted
    const timer = setTimeout(startAnimation, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`app ${currentStage}`}>
      {/* Initial and Animation Stage */}
      {(currentStage === 'initial' || currentStage === 'animating') && (
        <div className="logo-container">
          {showAnimation ? (
            <video
              src="./lab up logo animation.mp4"
              className="logo"
              autoPlay
              muted
              playsInline
              style={{ cursor: 'default' }}
            />
          ) : (
            <img
              src="./Lab Up Logo.png"
              alt="Lab Up Logo"
              className="logo"
              style={{ cursor: 'default' }}
            />
          )}
          {/* Gradual fade overlay */}
          {startFade && (
            <div className="gradual-fade-overlay"></div>
          )}
        </div>
      )}

      {/* Background Reveal Stage */}
      {currentStage === 'backgroundReveal' && (
        <div className="background-stage" style={{backgroundImage: `url(${backgroundImage})`}}>
          <div className="white-overlay"></div>
          <div className="content-overlay">
            <img 
              src="./Lab Up Logo.png" 
              alt="Lab Up Logo" 
              className="content-logo"
            />
            <p className="tagline">
              grow your business like a startup
            </p>
          </div>
          {/* Add the draggable terminal */}
          <Terminal />
        </div>
      )}
    </div>
  );
}

export default App; 