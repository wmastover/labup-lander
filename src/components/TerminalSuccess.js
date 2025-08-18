import React from 'react';
import TerminalOverlay from './TerminalOverlay';

function TerminalSuccess({ successText }) {
	return (
		<TerminalOverlay>
			<pre className="terminal-text">{successText}</pre>
		</TerminalOverlay>
	);
}

export default TerminalSuccess; 