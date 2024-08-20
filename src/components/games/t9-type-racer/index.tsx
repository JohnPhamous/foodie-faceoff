import { useDeviceRotation } from "@/app/hooks/use-device-rotation";
import { useShakeCounter } from "@/app/hooks/use-device-shake";
import { useStopwatch } from "@/app/hooks/use-stopwatch";
import { Button } from "@/components/button";
import { useMyPresence } from "@liveblocks/react/suspense";
import { clsx } from "clsx";
import { useScroll } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const PROMPT = "hello portland me eat food";

export const T9Racer = () => {
  const { elapsedTime, isRunning, start, stop, reset } = useStopwatch();
  const [input, setInput] = useState("");
  const [inputIndex, setInputIndex] = useState(0);

  const [myPresence, setMyPresence] = useMyPresence();

  useEffect(() => {
    start();
  }, [start]);

  const totalChars = PROMPT.length;
  const correctChars = input
    .split("")
    .filter((char, i) => char === PROMPT.at(i)).length;

  console.log(correctChars, totalChars);
  const progress = correctChars / totalChars;
  const gameDone = progress === 1;

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

  return (
    <div className="h-full w-full">
      {!gameDone && (
        <div className="flex flex-col justify-between items-center h-full text-center">
          <h2 className="bg-[#FFC530] px-2 w-fit">Start Typing!!!</h2>

          <h3>
            {PROMPT.split("").map((char, i) => {
              const isCurrent = i === inputIndex;
              const isFuture = i > inputIndex && !isCurrent;
              const isWrong = char !== input.at(i) && !isFuture && !isCurrent;

              return (
                <span
                  key={i}
                  className={clsx({
                    "opacity-50": isFuture,
                    "text-red-600": isWrong,
                    underline: isCurrent,
                  })}
                >
                  {char}
                </span>
              );
            })}
          </h3>
          <h3>{((correctChars / totalChars) * 100).toFixed(0)}%</h3>
          <Keyboard
            input={input}
            setInput={setInput}
            inputIndex={inputIndex}
            setInputIndex={setInputIndex}
          />

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

const Keyboard = ({
  input,
  setInput,
  inputIndex,
  setInputIndex,
}: {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  inputIndex: number;
  setInputIndex: Dispatch<SetStateAction<number>>;
}) => {
  const keys = [
    {
      name: 1,
      content: ["."],
    },
    {
      name: 2,
      content: ["a", "b", "c"],
    },
    {
      name: 3,
      content: ["d", "e", "f"],
    },
    {
      name: 4,
      content: ["g", "h", "i"],
    },
    {
      name: 5,
      content: ["j", "k", "l"],
    },
    {
      name: 6,
      content: ["m", "n", "o"],
    },
    {
      name: 7,
      content: ["p", "q", "r", "s"],
    },
    {
      name: 8,
      content: ["t", "u", "v", "w"],
    },
    {
      name: 9,
      content: ["x", "y", "z"],
    },
    {
      name: "*",
    },
    {
      name: 0,
      content: [" "],
    },
  ];
  return (
    <div className="App touch-manipulation select-none">
      <input type="text" value={input} disabled />

      <div className="grid grid-cols-3 pt-4">
        {keys.map((key) => (
          <Key
            key={key.name}
            inputIndex={inputIndex}
            setInputIndex={setInputIndex}
            input={input}
            keyValue={key}
            setInput={setInput}
          />
        ))}
      </div>
    </div>
  );
};

interface KeyProps {
  keyValue: {
    name: number | string;
    content?: string[];
  };
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  inputIndex: number;
  setInputIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Key: React.FC<KeyProps> = ({
  keyValue: keyValue,
  input,
  setInput,
  inputIndex,
  setInputIndex,
}) => {
  const [state, setState] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef<number>();

  const mouseDown = (e: React.MouseEvent) => {
    startRef.current = e.timeStamp;
  };

  const mouseUp = (
    e: React.MouseEvent,
    key: { name: string; content?: string[] }
  ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (key.content === undefined) {
      setInput((input) => input + key.name);
      setInputIndex((i) => i + 1);
      return;
    }
    setInput((input) => {
      let updatedValue = input.split("");
      if (e.timeStamp - (startRef.current ?? 0) > 1000) {
        updatedValue[inputIndex] = key.name;
      } else {
        if (key.content) {
          updatedValue[inputIndex] = key.content[state];
        }
      }
      return updatedValue.join("");
    });
    setState((state) => {
      if (key.content) {
        if (state + 1 === key.content.length) return 0;
      }
      return state + 1;
    });

    if (key.content) {
      if (key.content.at(0) === "<") {
        const tokenLength = key.content.at(0)?.length ?? 0;
        setInput((input) => input.slice(0, input.length - 1 - 1));
      }
    }
    timerRef.current = setTimeout(() => {
      if (key.content?.at(0) !== "<") {
        setInputIndex((i) => i + 1);
      }
      setState(0);
    }, 500);
  };

  return (
    <button
      // @ts-expect-error
      onMouseUp={(e) => mouseUp(e, keyValue)}
      onMouseDown={(e) => mouseDown(e)}
      className="bg-black text-white flex flex-col gap-1 items-center justify-center touch-manipulation select-none"
    >
      {keyValue.name}

      <span className="text-sm opacity-60">{keyValue.content}</span>
    </button>
  );
};
