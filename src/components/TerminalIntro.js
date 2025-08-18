import React from 'react';
import TerminalOverlay from './TerminalOverlay';

export const INTRO_TEXT = `> Welcome to Lab Up

> We help businesses grow online using AI.

> We'll redesign your website free - just enter your email:`;

function TerminalIntro({ terminalText, showCursor, typingComplete, email, onEmailChange, onSubmit }) {
	return (
		<TerminalOverlay>
			<pre className="terminal-text">
				{terminalText}
				{!typingComplete && (
					<span className={`terminal-cursor ${showCursor ? 'visible' : ''}`}>|</span>
				)}
			</pre>
			{typingComplete && (
				<form onSubmit={onSubmit} className="terminal-input-form">
					<div className="terminal-input-line">
						<span className="terminal-prompt">{'> '}</span>
						<input
							type="email"
							value={email}
							onChange={onEmailChange}
							className="terminal-email-input"
							placeholder="enter email here"
							autoFocus
							required
						/>
					</div>
				</form>
			)}
		</TerminalOverlay>
	);
}

export default TerminalIntro; 