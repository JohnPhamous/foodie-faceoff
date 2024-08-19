import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerProps {
  initialTime: number;
  onTimeUp: () => void;
}

interface UseTimerResult {
  timeLeft: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

export function useTimer({
  initialTime,
  onTimeUp,
}: UseTimerProps): UseTimerResult {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;

    const elapsedTime = Date.now() - startTimeRef.current;
    const newTimeLeft = Math.max(
      0,
      initialTime - Math.floor(elapsedTime / 1000)
    );

    setTimeLeft(newTimeLeft);

    if (newTimeLeft > 0) {
      rafIdRef.current = requestAnimationFrame(tick);
    } else {
      setIsRunning(false);
      startTimeRef.current = null;
      onTimeUpRef.current();
    }
  }, [initialTime]);

  const startTimer = useCallback(() => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - (initialTime - timeLeft) * 1000;
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [isRunning, timeLeft, initialTime, tick]);

  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (startTimeRef.current !== null) {
        const elapsedTime = Date.now() - startTimeRef.current;
        setTimeLeft(Math.max(0, initialTime - Math.floor(elapsedTime / 1000)));
        startTimeRef.current = null;
      }
    }
  }, [isRunning, initialTime]);

  const resetTimer = useCallback(() => {
    pauseTimer();
    setTimeLeft(initialTime);
  }, [initialTime, pauseTimer]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return { timeLeft, isRunning, startTimer, pauseTimer, resetTimer };
}
