import { useDeviceRotationCount } from "@/app/hooks/use-device-rotation-count";
import { useStopwatch } from "@/app/hooks/use-stopwatch";
import { Button } from "@/components/button";
import { useMyPresence } from "@liveblocks/react/suspense";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const NUMBER_OF_ROTATIONS = 3;

export const SpinToWin = () => {
  const { rotation, requestPermission, permissionState, rotationCount } =
    useDeviceRotationCount();
  const [startTime, setStartTime] = useState(0);
  const {
    elapsedTime,
    isRunning: isRunningStopwatch,
    start,
    stop,
    reset,
  } = useStopwatch();
  const [myPresence, setMyPresence] = useMyPresence();

  useEffect(() => {
    if (permissionState === "granted") {
      start();
      setStartTime(Date.now());
    }
  }, [permissionState, start]);

  const currentRotation = NUMBER_OF_ROTATIONS - rotationCount;

  useEffect(() => {
    if (rotationCount === NUMBER_OF_ROTATIONS) {
      setMyPresence({
        score: elapsedTime,
      });
      stop();
    }
    if (rotationCount <= NUMBER_OF_ROTATIONS) {
      setMyPresence({
        progress: rotationCount / NUMBER_OF_ROTATIONS,
      });
    }
  }, [elapsedTime, rotationCount, setMyPresence, stop]);

  const gameDone = rotationCount >= NUMBER_OF_ROTATIONS;

  return (
    <div className="h-full">
      {permissionState !== "granted" && (
        <Button onClick={requestPermission}>Request Permission</Button>
      )}
      {permissionState === "granted" && !gameDone && (
        <div className="flex flex-col justify-between h-full text-center">
          <h2 className="bg-[#FFC530] px-2">SPIN YOUR PHONE!!</h2>
          <AnimatePresence mode="popLayout">
            <motion.h3
              className="text-[300px]"
              initial={{ rotate: -360, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1.1 }}
              exit={{ rotate: 360, opacity: 0, scale: 0.9 }}
              key={currentRotation}
            >
              {currentRotation > 0 ? <>{currentRotation}</> : <>0</>}
            </motion.h3>
          </AnimatePresence>
          <p>{elapsedTime.toFixed(0)}s</p>
        </div>
      )}
      {gameDone && (
        <div className="flex flex-col h-full text-center gap-8">
          <h2 className="bg-[#FFC530] px-2">Your Score</h2>
          <h3 className="pb-8 text-3xl">
            It took you {myPresence.score?.toFixed(0)}s
          </h3>
        </div>
      )}
    </div>
  );
};
