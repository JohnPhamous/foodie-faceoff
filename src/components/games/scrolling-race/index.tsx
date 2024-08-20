import { useDeviceRotation } from "@/app/hooks/use-device-rotation";
import { useShakeCounter } from "@/app/hooks/use-device-shake";
import { useStopwatch } from "@/app/hooks/use-stopwatch";
import { Button } from "@/components/button";
import { useMyPresence } from "@liveblocks/react/suspense";
import { useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Scrolling = () => {
  const { elapsedTime, isRunning, start, stop, reset } = useStopwatch();

  const carouselRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: carouselRef,
  });

  const [myPresence, setMyPresence] = useMyPresence();

  useEffect(() => {
    start();
  }, [start]);

  const progress = scrollYProgress.get();
  useEffect(() => {
    if (progress <= 1) {
      setMyPresence({ progress });
    }

    if (progress === 1 && isRunning) {
      setMyPresence({
        score: elapsedTime,
      });
      stop();
    }
  }, [elapsedTime, isRunning, progress, setMyPresence, stop]);

  const gameDone = progress === 1;

  return (
    <div className="h-full w-full">
      {!gameDone && (
        <div className="flex flex-col justify-between items-center h-full text-center">
          <h2 className="bg-[#FFC530] px-2 w-fit">START SCROLLING!!</h2>
          <h3>{(progress * 100).toFixed(0)}%</h3>
          <div ref={carouselRef} className="w-full overflow-auto h-[400px]">
            {Array.from({ length: 250 }).map((_, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: `hsl(${(index * 18) % 360}, 100%, 50%)`,
                  height: "700px",
                  width: "100%",
                }}
              />
            ))}
          </div>
          {/* <h3 className="text-[300px]">
            {NUMBER_OF_SHAKES - shakeCount > 0 ? (
              <>{NUMBER_OF_SHAKES - shakeCount}</>
            ) : (
              <>0</>
            )}
          </h3> */}
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
