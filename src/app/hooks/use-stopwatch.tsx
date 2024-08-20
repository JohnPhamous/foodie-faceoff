import { useState, useEffect, useCallback, useRef } from "react";

interface UseStopwatchResult {
  elapsedTime: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useStopwatch(): UseStopwatchResult {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const updateElapsedTime = useCallback(() => {
    if (startTimeRef.current !== null) {
      const currentTime = Date.now();
      const delta = currentTime - startTimeRef.current;
      setElapsedTime((prevTime) => prevTime + delta / 1000);
      startTimeRef.current = currentTime;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(updateElapsedTime, 100); // Update every 100ms for smoother display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      startTimeRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, updateElapsedTime]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    if (isRunning) {
      updateElapsedTime(); // Ensure we capture the final elapsed time
      setIsRunning(false);
    }
  }, [isRunning, updateElapsedTime]);

  const reset = useCallback(() => {
    stop();
    setElapsedTime(0);
  }, [stop]);

  return {
    elapsedTime,
    isRunning,
    start,
    stop,
    reset,
  };
}
