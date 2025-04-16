import { useState, useEffect, useRef } from 'react';

interface StreamTextOptions {
  text: string;
  speed?: number;
  autoPlay?: boolean;
  playOnce?: boolean;
  streamByWord?: boolean;
}

export function useStreamText({
  text,
  speed = 20,
  autoPlay = true,
  playOnce = true,
  streamByWord = false
}: StreamTextOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const hasPlayedRef = useRef(false);
  
  // Handle text change
  useEffect(() => {
    // Reset animation if text changes
    if (playOnce && hasPlayedRef.current) {
      // If we've already played this text once and playOnce is true,
      // just show the complete text
      setDisplayedText(text || '');
      setCharIndex(text ? text.length : 0);
      setIsComplete(true);
      return;
    }
    
    setDisplayedText('');
    setCharIndex(0);
    setIsComplete(false);
    setIsPaused(!autoPlay);
  }, [text, autoPlay, playOnce]);
  
  // Streaming effect
  useEffect(() => {
    if (!text || isPaused || charIndex >= text.length) {
      if (charIndex >= text.length && !isComplete) {
        setIsComplete(true);
        hasPlayedRef.current = true;
      }
      return;
    }
    
    const timer = setTimeout(() => {
      if (streamByWord) {
        // Find the next word boundary
        let nextIndex = charIndex;
        
        // If we're at the start of a word, find the end of it
        if (charIndex === 0 || text[charIndex - 1] === ' ' || text[charIndex - 1] === '\n') {
          // Find the end of this word
          while (nextIndex < text.length && text[nextIndex] !== ' ' && text[nextIndex] !== '\n') {
            nextIndex++;
          }
        }
        
        // Add one more character to include space/newline
        if (nextIndex < text.length) {
          nextIndex++;
        }
        
        setDisplayedText(text.substring(0, nextIndex));
        setCharIndex(nextIndex);
      } else {
        // Character-by-character streaming
        setDisplayedText(text.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }
    }, speed);
    
    return () => clearTimeout(timer);
  }, [text, charIndex, speed, isPaused, isComplete, streamByWord]);
  
  const play = () => setIsPaused(false);
  const pause = () => setIsPaused(true);
  const reset = () => {
    setDisplayedText('');
    setCharIndex(0);
    setIsComplete(false);
    hasPlayedRef.current = false;
  };
  const complete = () => {
    setDisplayedText(text);
    setCharIndex(text.length);
    setIsComplete(true);
    hasPlayedRef.current = true;
  };
  
  return {
    displayedText,
    remainingText: text.substring(charIndex),
    isComplete,
    isPaused,
    progress: text ? charIndex / text.length : 1,
    charIndex,
    play,
    pause,
    reset,
    complete
  };
} 