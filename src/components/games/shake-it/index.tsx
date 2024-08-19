import { useDeviceRotation } from "@/app/hooks/use-device-rotation";
import { useShakeCounter } from "@/app/hooks/use-device-shake";

export const ShakeIt = () => {
  const { shakeCount, resetCount, requestPermission, isListening } =
    useShakeCounter();

  return (
    <div>
      {!isListening && (
        <button onClick={requestPermission}>Request Permission</button>
      )}
      {isListening && (
        <>
          <div>{shakeCount} shakes</div>
        </>
      )}
    </div>
  );
};
