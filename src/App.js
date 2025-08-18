import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import backgroundImage from './background.png';
import TerminalIntro, { INTRO_TEXT } from './components/TerminalIntro';
import TerminalSuccess from './components/TerminalSuccess';

function App() {
  const [currentStage, setCurrentStage] = useState('initial');
  const [showAnimation, setShowAnimation] = useState(false);
  const [startFade, setStartFade] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [meteorColors, setMeteorColors] = useState({});
  const [meteorVelocities, setMeteorVelocities] = useState({});
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [meteorAngleDeg, setMeteorAngleDeg] = useState(45); // default
  const [terminalPos, setTerminalPos] = useState({ top: null, left: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const terminalRef = useRef(null);
  const videoRef = useRef(null);
  const [skipIntro, setSkipIntro] = useState(false);

  const meteorColorVariants = ['cyan', 'orange', 'yellow'];
  const meteorVelocityVariants = ['fast', 'medium', 'slow'];

  // Preload video and background image
  useEffect(() => {
    // Detect if we should skip the intro (returning visitor)
    const hasSeenIntro = localStorage.getItem('labup_seen_intro') === '1';
    setSkipIntro(hasSeenIntro);

    // Compute meteor angle based on viewport (atan(vh/vw)) so path matches animation vector
    const computeAngle = () => {
      const vw = Math.max(window.innerWidth, 1);
      const vh = Math.max(window.innerHeight, 1);
      const angle = Math.atan(vh / vw) * (180 / Math.PI);
      setMeteorAngleDeg(angle);
    };
    computeAngle();
    window.addEventListener('resize', computeAngle);
    window.addEventListener('orientationchange', computeAngle);

    // Preload the logo animation video
    const video = document.createElement('video');
    video.src = './Lab Up Logo Animation.mp4';
    video.preload = 'auto';
    video.oncanplaythrough = () => {
      setVideoLoaded(true);
    };
    video.load();

    // Preload background image
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setBackgroundLoaded(true);
    };

    return () => {
      video.oncanplaythrough = null;
      img.onload = null;
      window.removeEventListener('resize', computeAngle);
      window.removeEventListener('orientationchange', computeAngle);
    };
  }, []);

  // Generate random colors and velocities for meteors
  useEffect(() => {
    const generateRandomColors = () => {
      const colors = {};
      for (let i = 1; i <= 5; i++) {
        colors[i] = meteorColorVariants[Math.floor(Math.random() * meteorColorVariants.length)];
      }
      return colors;
    };

    const generateRandomVelocities = () => {
      const velocities = {};
      for (let i = 1; i <= 5; i++) {
        velocities[i] = meteorVelocityVariants[Math.floor(Math.random() * meteorVelocityVariants.length)];
      }
      return velocities;
    };

    setMeteorColors(generateRandomColors());
    setMeteorVelocities(generateRandomVelocities());
    
    // Regenerate colors every 16 seconds so meteors complete their journey before color changes
    const colorInterval = setInterval(() => {
      setMeteorColors(generateRandomColors());
    }, 16000);

    // Regenerate velocities every 16 seconds to sync with color changes
    const velocityInterval = setInterval(() => {
      setMeteorVelocities(generateRandomVelocities());
    }, 16000);
    
    return () => {
      clearInterval(colorInterval);
      clearInterval(velocityInterval);
    };
  }, []);

  const fullText = INTRO_TEXT;

  const successMessage = `> we'll be in touch

    ██╗      █████╗ ██████╗ 
    ██║     ██╔══██╗██╔══██╗
    ██║     ███████║██████╔╝
    ██║     ██╔══██║██╔══██╗
    ███████╗██║  ██║██████╔╝
    ╚══════╝╚═╝  ╚═╝╚═════╝ 
                            
    ██╗   ██╗██████╗        
    ██║   ██║██╔══██╗       
    ██║   ██║██████╔╝       
    ██║   ██║██╔═══╝        
    ╚██████╔╝██║            
     ╚═════╝ ╚═╝            

`;

  // Auto-start animation on component mount (play intro only on first visit)
  useEffect(() => {
    if (skipIntro) return; // handled by separate effect
    if (!videoLoaded) return;

    const startAnimation = () => {
      setShowAnimation(true);
      setCurrentStage('animating');
      // Mark intro as seen so we skip next time
      try { localStorage.setItem('labup_seen_intro', '1'); } catch (_) {}
      
      // Wait half a second before starting video playback
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            console.log('Video play failed:', error);
            // Fallback: proceed to background even if video fails
            setTimeout(() => {
              setCurrentStage('backgroundReveal');
              setTimeout(() => {
                startTypewriter();
              }, 1000);
            }, 2000);
          });
        }
      }, 500);
      
      // Start gradual fade halfway through animation (adjusted for the 0.5s delay)
      setTimeout(() => {
        setStartFade(true);
      }, 2000); // Start fade at 2 seconds (1.5s + 0.5s delay)
      
      // Complete fade and reveal background (adjusted for the 0.5s delay)
      setTimeout(() => {
        setCurrentStage('backgroundReveal');
        // Start terminal typing effect 1 second after background reveals
        setTimeout(() => {
          startTypewriter();
        }, 1000);
      }, 4500); // Total sequence takes 4.5 seconds (4s + 0.5s delay)
    };

    // Start animation after a brief delay to ensure component is mounted
    const timer = setTimeout(startAnimation, 100);
    
    return () => clearTimeout(timer);
  }, [videoLoaded, skipIntro]);

  // If skipping intro, reveal background as soon as the background is loaded
  useEffect(() => {
    if (!skipIntro) return;
    if (!backgroundLoaded) return;
    setCurrentStage('backgroundReveal');
    // Start terminal typing shortly after reveal
    const t = setTimeout(() => startTypewriter(), 500);
    return () => clearTimeout(t);
  }, [skipIntro, backgroundLoaded]);

  // Center terminal when background first reveals
  useEffect(() => {
    if (currentStage === 'backgroundReveal') {
      requestAnimationFrame(() => {
        if (terminalRef.current) {
          const rect = terminalRef.current.getBoundingClientRect();
          const top = Math.max((window.innerHeight - rect.height) / 2, 10);
          const left = Math.max((window.innerWidth - rect.width) / 2, 10);
          setTerminalPos({ top, left });
        }
      });
    }
  }, [currentStage]);

  // Drag handlers
  const handleHeaderPointerDown = (e) => {
    if (!terminalRef.current) return;
    const rect = terminalRef.current.getBoundingClientRect();
    dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      if (!terminalRef.current) return;
      const rect = terminalRef.current.getBoundingClientRect();
      const left = e.clientX - dragOffsetRef.current.x;
      const top = e.clientY - dragOffsetRef.current.y;
      const maxLeft = window.innerWidth - rect.width - 10;
      const maxTop = window.innerHeight - rect.height - 10;
      setTerminalPos({
        left: Math.min(Math.max(10, left), Math.max(10, maxLeft)),
        top: Math.min(Math.max(10, top), Math.max(10, maxTop)),
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [isDragging]);

  // Typewriter effect
  const startTypewriter = () => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTerminalText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setTypingComplete(true);
        setShowCursor(false);
      }
    }, 30); // 3x faster typing speed (was 50ms)
  };

  // Success message typewriter
  const startSuccessTypewriter = () => {
    setTerminalText('');
    setTypingComplete(false);
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= successMessage.length) {
        setTerminalText(successMessage.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30); // 3x faster typing for success message (was 30ms)
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(email)) {
      setEmailSubmitted(true);
      startSuccessTypewriter();
    } else {
      alert('Please enter a valid email address');
    }
  };

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  // Show loading state if assets aren't ready
  if ((!skipIntro && !videoLoaded) || !backgroundLoaded) {
    return (
      <div className="app loading">
        <div className="loading-container">
          <div className="loading-text">Loading Lab Up...</div>
          <div className="loading-bar">
            <div className="loading-progress" style={{
              width: `${(((skipIntro ? 100 : (videoLoaded ? 50 : 0)) + (backgroundLoaded ? 50 : 0)))}%`
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${currentStage}`}>
      {/* Initial and Animation Stage */}
      {(currentStage === 'initial' || currentStage === 'animating') && (
        <div className="logo-container">
          {showAnimation ? (
            <video
              ref={videoRef}
              src="./Lab Up Logo Animation.mp4"
              className="logo"
              muted
              playsInline
              preload="auto"
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
        <div className="background-stage" style={{backgroundImage: `url(${backgroundImage})`, ['--meteor-angle']: `${meteorAngleDeg}deg`}}>
          <div className="white-overlay"></div>
          {/* Meteor Effects */}
          <div className={`meteor meteor-1 ${meteorColors[1] || 'cyan'} meteor-left-${meteorVelocities[1] || 'fast'}`} style={{
            ['--tail-length']: (meteorVelocities[1] === 'fast' ? '350px' : meteorVelocities[1] === 'medium' ? '120px' : '40px')
          }}></div>
          <div className={`meteor meteor-2 ${meteorColors[2] || 'cyan'} meteor-top-${meteorVelocities[2] || 'medium'}`} style={{
            ['--tail-length']: (meteorVelocities[2] === 'fast' ? '350px' : meteorVelocities[2] === 'medium' ? '120px' : '40px')
          }}></div>
          <div className={`meteor meteor-3 ${meteorColors[3] || 'cyan'} meteor-left-${meteorVelocities[3] || 'slow'}`} style={{
            ['--tail-length']: (meteorVelocities[3] === 'fast' ? '350px' : meteorVelocities[3] === 'medium' ? '120px' : '40px')
          }}></div>
          <div className={`meteor meteor-4 ${meteorColors[4] || 'cyan'} meteor-top-${meteorVelocities[4] || 'fast'}`} style={{
            ['--tail-length']: (meteorVelocities[4] === 'fast' ? '350px' : meteorVelocities[4] === 'medium' ? '120px' : '40px')
          }}></div>
          <div className={`meteor meteor-5 ${meteorColors[5] || 'cyan'} meteor-left-${meteorVelocities[5] || 'medium'}`} style={{
            ['--tail-length']: (meteorVelocities[5] === 'fast' ? '350px' : meteorVelocities[5] === 'medium' ? '120px' : '40px')
          }}></div>
          
          {!emailSubmitted ? (
            <TerminalIntro
              terminalText={terminalText}
              showCursor={showCursor}
              typingComplete={typingComplete}
              email={email}
              onEmailChange={(e) => setEmail(e.target.value)}
              onSubmit={handleEmailSubmit}
            />
          ) : (
            <TerminalSuccess successText={terminalText} />
          )}
        </div>
      )}
    </div>
  );
}

export default App; 