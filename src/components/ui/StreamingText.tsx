import React from 'react';
import { useStreamText } from '../../hooks/useStreamText';

interface StreamingTextProps {
  text: string;
  speed?: number; // ms per character
  autoPlay?: boolean;
  playOnce?: boolean;
  wordsPerMinute?: number;
}

export function StreamingText({ 
  text, 
  speed = 20, 
  autoPlay = true,
  playOnce = true,
  wordsPerMinute = 80
}: StreamingTextProps) {
  // Convert words per minute to ms per character
  // Average English word length is ~5 characters + 1 space = 6 characters per word
  // So 80 WPM = 480 chars per minute = 8 chars per second
  // = ~125ms per character
  const msPerChar = Math.round(60000 / (wordsPerMinute * 6));

  const {
    displayedText,
    charIndex
  } = useStreamText({
    text,
    speed: speed || msPerChar,
    autoPlay,
    playOnce,
    streamByWord: true  // Enable word-based streaming
  });
  
  // Process the text directly without splitting into words
  // This ensures consistent left alignment
  return (
    <div className="whitespace-pre-wrap break-words text-slate-400 text-left">
      {displayedText}
      
      {/* Hidden text to maintain layout */}
      <span className="sr-only">{text.substring(charIndex)}</span>
    </div>
  );
} 