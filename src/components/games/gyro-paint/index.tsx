import { useDeviceRotation } from "@/app/hooks/use-device-rotation";

export const GyroPaint = () => {
  const { rotation, requestPermission, permissionState } = useDeviceRotation();

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
