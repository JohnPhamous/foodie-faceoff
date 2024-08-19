import { useState, useEffect, useCallback, useRef } from "react";

interface ShakeOptions {
  threshold: number;
  timeout: number;
}

interface UseShakeCounterResult {
  shakeCount: number;
  resetCount: () => void;
  requestPermission: () => Promise<boolean>;
  isListening: boolean;
}

export function useShakeCounter(
  options: ShakeOptions = { threshold: 15, timeout: 1000 }
): UseShakeCounterResult {
  const [shakeCount, setShakeCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const lastShake = useRef(0);
  const motionListenerRef = useRef<((event: DeviceMotionEvent) => void) | null>(
    null
  );

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const acceleration = Math.sqrt(
        (x ?? 0) ** 2 + (y ?? 0) ** 2 + (z ?? 0) ** 2
      );
      const now = Date.now();

      if (
        acceleration > options.threshold &&
        now - lastShake.current > options.timeout
      ) {
        setShakeCount((prevCount) => prevCount + 1);
        lastShake.current = now;
      }
    },
    [options.threshold, options.timeout]
  );

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      console.warn("Device motion not supported");
      return false;
    }

    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      try {
        const permissionState = await (
          DeviceMotionEvent as any
        ).requestPermission();
        if (permissionState === "granted") {
          setIsListening(true);
          return true;
        }
      } catch (error) {
        console.error("Error requesting device motion permission:", error);
      }
    } else {
      // For non-iOS devices or older versions, no permission is needed
      setIsListening(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (isListening && !motionListenerRef.current) {
      motionListenerRef.current = handleMotion;
      window.addEventListener("devicemotion", motionListenerRef.current);
    }

    return () => {
      if (motionListenerRef.current) {
        window.removeEventListener("devicemotion", motionListenerRef.current);
        motionListenerRef.current = null;
      }
    };
  }, [isListening, handleMotion]);

  const resetCount = useCallback(() => {
    setShakeCount(0);
  }, []);

  return { shakeCount, resetCount, requestPermission, isListening };
}
