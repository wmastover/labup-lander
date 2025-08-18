import React, { useEffect, useRef, useState } from 'react';

function TerminalOverlay({ title = 'lab-up-terminal', children }) {
	const [terminalPos, setTerminalPos] = useState({ top: null, left: null });
	const [isDragging, setIsDragging] = useState(false);
	const [userMoved, setUserMoved] = useState(false);
	const dragOffsetRef = useRef({ x: 0, y: 0 });
	const terminalRef = useRef(null);

	const recenter = () => {
		if (!terminalRef.current) return;
		const rect = terminalRef.current.getBoundingClientRect();
		const top = Math.max((window.innerHeight - rect.height) / 2, 10);
		const left = Math.max((window.innerWidth - rect.width) / 2, 10);
		setTerminalPos({ top, left });
	};

	useEffect(() => {
		// Center terminal on mount
		requestAnimationFrame(() => recenter());
		// Recenter on viewport changes if user hasn't moved it
		const onResize = () => { if (!userMoved && !isDragging) recenter(); };
		window.addEventListener('resize', onResize);
		window.addEventListener('orientationchange', onResize);
		// Observe size changes of terminal (typing grows content)
		let ro;
		if (window.ResizeObserver && terminalRef.current) {
			ro = new ResizeObserver(() => { if (!userMoved && !isDragging) recenter(); });
			ro.observe(terminalRef.current);
		}
		return () => {
			window.removeEventListener('resize', onResize);
			window.removeEventListener('orientationchange', onResize);
			if (ro) ro.disconnect();
		};
	}, [userMoved, isDragging]);

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
		const onUp = () => { setIsDragging(false); setUserMoved(true); };
		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
		window.addEventListener('pointercancel', onUp);
		return () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
			window.removeEventListener('pointercancel', onUp);
		};
	}, [isDragging]);

	return (
		<div
			ref={terminalRef}
			className={`terminal-overlay${isDragging ? ' dragging' : ''}`}
			style={{
				top: terminalPos.top ?? '50%',
				left: terminalPos.left ?? '50%',
				transform: terminalPos.top != null ? 'none' : undefined,
			}}
		>
			<div className="terminal-header" onPointerDown={handleHeaderPointerDown}>
				<div className="terminal-buttons">
					<span className="terminal-button red"></span>
					<span className="terminal-button yellow"></span>
					<span className="terminal-button green"></span>
				</div>
				<div className="terminal-title">{title}</div>
			</div>
			<div className="terminal-content">{children}</div>
		</div>
	);
}

export default TerminalOverlay; 