import React, { useState } from 'react';
import './App.css';
import backgroundImage from './background.png';

function App() {
  const [currentStage, setCurrentStage] = useState('initial');
  const [showAnimation, setShowAnimation] = useState(false);
  const [startFade, setStartFade] = useState(false);

  const handleLogoClick = () => {
    if (currentStage === 'initial') {
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
    }
  };

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
              onClick={handleLogoClick}
              style={{ cursor: currentStage === 'initial' ? 'pointer' : 'default' }}
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
        </div>
      )}
    </div>
  );
}

export default App; 