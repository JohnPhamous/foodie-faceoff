import { useDeviceRotation } from "@/app/hooks/use-device-rotation";
import { useDeviceRotationCount } from "@/app/hooks/use-device-rotation-count";
import { useTimer } from "@/app/hooks/use-timer";

export const SpinToWin = () => {
  const { rotation, requestPermission, permissionState, rotationCount } =
    useDeviceRotationCount();
  const { timeLeft, isRunning, startTimer } = useTimer({
    initialTime: 3,
    onTimeUp: () => {
      console.log("time up");
    },
  });

  return (
    <div>
      {permissionState !== "granted" && (
        <button onClick={requestPermission}>Request Permission</button>
      )}
      {rotation && (
        <>
          <div
            className="w-64 h-96 bg-white rounded-lg shadow-lg p-6 flex flex-col justify-center items-center"
            style={{
              transform: `rotateX(${rotation.beta ?? 0}deg) rotateY(${
                rotation.gamma ?? 0
              }deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {!isRunning && (
              <button
                onClick={() => {
                  startTimer();
                }}
              >
                Start Timer
              </button>
            )}
            <p>{timeLeft}s</p>
            {rotationCount}
            <h2 className="text-2xl font-bold mb-4">Rotating Card</h2>
            <p className="text-lg mb-2">Alpha: {rotation.alpha?.toFixed(2)}°</p>
            <p className="text-lg mb-2">Beta: {rotation.beta?.toFixed(2)}°</p>
            <p className="text-lg">Gamma: {rotation.gamma?.toFixed(2)}°</p>
          </div>
        </>
      )}
    </div>
  );
};
