import React, { useState } from 'react';
import './App.css';
import backgroundImage from './background.png';

function App() {
  const [currentStage, setCurrentStage] = useState('initial');
  const [showAnimation, setShowAnimation] = useState(false);

  const handleLogoClick = () => {
    if (currentStage === 'initial') {
      setShowAnimation(true);
      setCurrentStage('animating');
      
      // After animation duration (adjust based on your GIF duration), start fade sequence
      setTimeout(() => {
        setCurrentStage('fadeToBlack');
        setTimeout(() => {
          setCurrentStage('backgroundReveal');
        }, 1000); // 1 second fade to black
      }, 3000); // Adjust this based on your animation GIF duration
    }
  };

  return (
    <div className={`app ${currentStage}`}>
      {/* Initial and Animation Stage */}
      {(currentStage === 'initial' || currentStage === 'animating') && (
        <div className="logo-container">
          <img
            src={showAnimation ? "./Lab Up Logo Animation.gif" : "./Lab Up Logo.png"}
            alt="Lab Up Logo"
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: currentStage === 'initial' ? 'pointer' : 'default' }}
          />
        </div>
      )}

      {/* Fade to Black Stage */}
      {currentStage === 'fadeToBlack' && (
        <div className="fade-overlay"></div>
      )}

      {/* Background Reveal Stage */}
      {currentStage === 'backgroundReveal' && (
        <div className="background-stage" style={{backgroundImage: `url(${backgroundImage})`}}>
          <div className="content-overlay">
            <h1 className="main-title">Welcome to Lab Up</h1>
            <h2 className="subtitle">Elevating Innovation Through Experimentation</h2>
            <button className="cta-button">
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 