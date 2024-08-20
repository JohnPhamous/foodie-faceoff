import { useTimer } from "@/app/hooks/use-timer";
import { Button } from "@/components/button";
import { GyroPaint } from "@/components/games/gyro-paint";
import { Scrolling } from "@/components/games/scrolling-race";
import { ShakeIt } from "@/components/games/shake-it";
import { SpinToWin } from "@/components/games/spin-to-win";
import { T9Racer } from "@/components/games/t9-type-racer";
import { Scoreboard } from "@/components/scoreboard";
import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Countdown = () => {
  const others = useOthers();
  const [myPresence, updateMyPresence] = useMyPresence();
  const [game, setGame] = useState<string | null>(null);

  const gameVotes = others.reduce((mostVoted, other) => {
    // @ts-expect-error
    if (mostVoted[other.presence.gameVote]) {
      // @ts-expect-error
      mostVoted[other.presence.gameVote] += 1;
    } else {
      // @ts-expect-error
      mostVoted[other.presence.gameVote] = 1;
    }

    return mostVoted;
  }, {});

  if (myPresence.gameVote) {
    // @ts-expect-error
    if (gameVotes[myPresence.gameVote]) {
      // @ts-expect-error
      gameVotes[myPresence.gameVote] += 1;
    } else {
      // @ts-expect-error
      gameVotes[myPresence.gameVote] = 1;
    }
  }

  const mostVotedGame = Object.entries(gameVotes).reduce(
    // @ts-expect-error
    (mostVoted, [game, votes]) => {
      // @ts-expect-error
      return votes > mostVoted.votes ? { game, votes } : mostVoted;
    },
    { game: null, votes: 0 }
  );

  const { timeLeft, isRunning, startTimer, pauseTimer, resetTimer } = useTimer({
    initialTime: 3,
    onTimeUp() {
      // @ts-expect-error
      setGame(mostVotedGame.game);
    },
  });

  useEffect(() => {
    // @ts-expect-error
    if (mostVotedGame.game) {
      startTimer();
    }
    // @ts-expect-error
  }, [mostVotedGame.game, startTimer]);

  switch (game) {
    case "Gyro Paint":
      return (
        <GameContainer>
          <GyroPaint />
        </GameContainer>
      );
    case "Protein Shake Panic":
      return (
        <GameContainer>
          <ShakeIt />
        </GameContainer>
      );
    case "Blender Blitz":
      return (
        <GameContainer>
          <SpinToWin />
        </GameContainer>
      );
    case "Pasta Prix":
      return (
        <GameContainer>
          <Scrolling />
        </GameContainer>
      );
    case "Diner Dash Texting":
      return (
        <GameContainer>
          <T9Racer />
        </GameContainer>
      );
  }

  return (
    <div className="absolute inset-0 bg-red-400 flex p-16 items-center text-3xl flex-col">
      {/* @ts-expect-error */}
      <h2 className="bg-[#FFC530] h-fit px-9 py-2">{mostVotedGame.game}</h2>

      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={timeLeft}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1.3 }}
            exit={{ opacity: 0 }}
            className="text-[500px]"
          >
            {timeLeft}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

const GameContainer = ({ children }: { children: React.ReactNode }) => {
  const others = useOthers();
  const [myPresence, setMyPresence] = useMyPresence();

  const isGameOver =
    others.every((other) => other.presence.score) && myPresence.score;

  let winner = others.reduce((winner, other) => {
    return (other.presence?.score ?? 0) < (winner.presence?.score ?? 0)
      ? other
      : winner;
  }, others[0]);

  if ((winner?.presence?.score ?? 0) < (myPresence?.score ?? 0)) {
    // @ts-expect-error
    winner = { presence: myPresence };
  }

  return (
    <div className="absolute inset-0 w-full flex pt-0 items-center text-3xl flex-col bg-white">
      <Scoreboard />
      {children}
      {isGameOver && (
        <div className="pb-4 w-full px-4">
          <div className="text-center pb-8">
            <h2>The winner is...</h2>
            <p>
              {winner.presence.displayName} who picked{" "}
              {winner.presence.restaurantId}
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              setMyPresence({
                score: undefined,
                isReady: false,
                gameVote: undefined,
                restaurantId: undefined,
                progress: undefined,
              });
            }}
          >
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};
