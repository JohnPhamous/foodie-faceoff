import { useState, useEffect, useCallback } from "react";

interface DeviceRotation {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

interface UseDeviceRotationResult {
  rotation: DeviceRotation;
  requestPermission: () => Promise<boolean>;
  permissionState: PermissionState | null;
}

export function useDeviceRotation(): UseDeviceRotationResult {
  const [rotation, setRotation] = useState<DeviceRotation>({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setRotation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (
      typeof window === "undefined" ||
      !("DeviceOrientationEvent" in window)
    ) {
      setPermissionState("denied");
      return false;
    }

    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        setPermissionState(permission);
        if (permission === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
          return true;
        }
      } catch (error) {
        alert(`Error requesting device orientation permission: ${error}`);
        setPermissionState("denied");
      }
    } else {
      // For non-iOS devices or older iOS versions
      setPermissionState("granted");
      window.addEventListener("deviceorientation", handleOrientation);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      if (
        typeof (DeviceOrientationEvent as any).requestPermission !== "function"
      ) {
        // For non-iOS devices or older iOS versions, set up the listener immediately
        window.addEventListener("deviceorientation", handleOrientation);
        setPermissionState("granted");
      }
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return { rotation, requestPermission, permissionState };
}
