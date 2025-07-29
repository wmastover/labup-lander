import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';

const Terminal = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Default position
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'info', text: 'Welcome to Lab Up Terminal v1.0.0' },
    { type: 'info', text: 'Type "help" for available commands.' },
    { type: 'prompt', text: '' }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Handle mouse down on terminal header for dragging
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('terminal-button')) return; // Don't drag when clicking buttons
    
    setIsDragging(true);
    const rect = terminalRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep terminal within viewport bounds
    const maxX = window.innerWidth - 600; // Terminal width
    const maxY = window.innerHeight - 400; // Terminal height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global event listeners for drag functionality
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    if (inputRef.current && !isMinimized) {
      inputRef.current.focus();
    }
  };

  // Handle command execution
  const executeCommand = (command) => {
    const cmd = command.trim().toLowerCase();
    let response = '';

    switch (cmd) {
      case 'help':
        response = `Available commands:
  help    - Show this help message
  clear   - Clear terminal output
  about   - About Lab Up
  date    - Show current date and time
  whoami  - Display current user info
  echo    - Echo back your message (usage: echo <message>)`;
        break;
      case 'clear':
        setTerminalOutput([{ type: 'prompt', text: '' }]);
        return;
      case 'about':
        response = 'Lab Up - Grow your business like a startup!\nBuilding innovative solutions for modern businesses.';
        break;
      case 'date':
        response = new Date().toString();
        break;
      case 'whoami':
        response = 'labup-user@terminal:~$ You are a visionary entrepreneur!';
        break;
      default:
        if (cmd.startsWith('echo ')) {
          response = command.slice(5);
        } else if (cmd === '') {
          response = '';
        } else {
          response = `Command not found: ${command}. Type 'help' for available commands.`;
        }
    }

    // Add command and response to output
    setTerminalOutput(prev => [
      ...prev.slice(0, -1), // Remove the current prompt
      { type: 'command', text: `$ ${command}` },
      ...(response ? [{ type: 'output', text: response }] : []),
      { type: 'prompt', text: '' }
    ]);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setCurrentCommand(e.target.value);
  };

  // Handle enter key press
  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  // Terminal control buttons
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    // For now, just minimize instead of actually closing
    setIsMinimized(true);
  };

  return (
    <div
      ref={terminalRef}
      className={`terminal ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handleTerminalClick}
    >
      <div className="terminal-header" onMouseDown={handleMouseDown}>
        <div className="terminal-title">
          <span className="terminal-icon">⚡</span>
          Lab Up Terminal
        </div>
        <div className="terminal-controls">
          <button 
            className="terminal-button minimize" 
            onClick={handleMinimize}
            title={isMinimized ? "Restore" : "Minimize"}
          >
            {isMinimized ? '□' : '−'}
          </button>
          <button 
            className="terminal-button close" 
            onClick={handleClose}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="terminal-body">
          <div className="terminal-output">
            {terminalOutput.map((line, index) => (
              <div key={index} className={`terminal-line ${line.type}`}>
                {line.type === 'prompt' ? (
                  <div className="terminal-input-line">
                    <span className="terminal-prompt">labup@terminal:~$ </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentCommand}
                      onChange={handleInputChange}
                      onKeyPress={handleInputKeyPress}
                      className="terminal-input"
                      autoFocus
                      spellCheck={false}
                    />
                  </div>
                ) : (
                  <pre>{line.text}</pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Terminal;