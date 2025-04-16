import React, { useState, useEffect } from 'react';

interface TextRevealProps {
  text: string;
  speed?: number; // milliseconds per character
  className?: string;
}

export function TextReveal({ text, speed = 30, className = '' }: TextRevealProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text.charAt(index));
        setIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return (
    <div className={className}>
      {displayedText}
      {index < text.length && (
        <span className="animate-pulse opacity-40">{text.substring(index, index + 1)}</span>
      )}
    </div>
  );
} 