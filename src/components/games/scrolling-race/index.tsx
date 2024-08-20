import { useDeviceRotation } from "@/app/hooks/use-device-rotation";
import { useShakeCounter } from "@/app/hooks/use-device-shake";
import { useStopwatch } from "@/app/hooks/use-stopwatch";
import { Button } from "@/components/button";
import { useMyPresence } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";

const NUMBER_OF_SHAKES = 8;

export const Scrolling = () => {
  const { shakeCount, resetCount, requestPermission, isListening } =
    useShakeCounter();
  const [startTime, setStartTime] = useState(0);
  const { elapsedTime, isRunning, start, stop, reset } = useStopwatch();

  const [myPresence, setMyPresence] = useMyPresence();

  useEffect(() => {
    if (isListening) {
      setStartTime(Date.now());
      start();
    }
  }, [isListening, start]);

  const gameDone = shakeCount >= NUMBER_OF_SHAKES;

  useEffect(() => {
    if (shakeCount === NUMBER_OF_SHAKES) {
      setMyPresence({
        score: elapsedTime,
      });
      stop();
    }
    if (shakeCount <= NUMBER_OF_SHAKES) {
      setMyPresence({
        progress: shakeCount / NUMBER_OF_SHAKES,
      });
    }
  }, [elapsedTime, setMyPresence, shakeCount, startTime, stop]);

  return (
    <div className="h-full">
      {!isListening && (
        <Button onClick={requestPermission}>Request Permission</Button>
      )}
      {isListening && !gameDone && (
        <div className="flex flex-col justify-between h-full text-center">
          <h2 className="bg-[#FFC530] px-2">SHAKE YOUR PHONE!!</h2>
          <h3 className="text-[300px]">
            {NUMBER_OF_SHAKES - shakeCount > 0 ? (
              <>{NUMBER_OF_SHAKES - shakeCount}</>
            ) : (
              <>0</>
            )}
          </h3>
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
