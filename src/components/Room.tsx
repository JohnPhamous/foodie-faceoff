"use client";

import { Button } from "@/components/button";
import { GyroPaint } from "@/components/games/gyro-paint";
import { ShakeIt } from "@/components/games/shake-it";
import { SpinToWin } from "@/components/games/spin-to-win";
import { MOCK_RESTAURANTS_DATA } from "@/data";
import { useUser } from "@clerk/nextjs";
import { LiveMap } from "@liveblocks/client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useOthers,
  useMyPresence,
} from "@liveblocks/react/suspense";
import { useEffect } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Countdown } from "@/components/countdown";

const getRandomColor = () => {
  const colors = [
    "#F76B15",
    "#0491FF",
    "#8347B9",
    "#DC3C5E",
    "#DD4525",
    "#3E9A50",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

export function Room() {
  const user = useUser();
  const displayName = user.user?.username || user.user?.firstName || "Unknown";

  if (!user.isLoaded) return null;

  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}
    >
      <RoomProvider
        id="my-room"
        initialPresence={{
          displayName,
          avatarUrl: user.user?.imageUrl || "",
          color: getRandomColor(),
        }}
        initialStorage={{ scores: new LiveMap([]) }}
      >
        <ClientSideSuspense fallback={null}>
          <GameApp displayName={displayName} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function GameApp({ displayName }: { displayName: string }) {
  const user = useUser();
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const isEveryoneReady =
    others.every((other) => other.presence.isReady) && myPresence.isReady;

  const hasEveryoneVoted =
    others.every((other) => other.presence.gameVote) && myPresence.gameVote;

  useEffect(() => {
    if (myPresence.displayName !== displayName) {
      updateMyPresence({ displayName });
    }
    if (myPresence.avatarUrl !== user.user?.imageUrl) {
      updateMyPresence({ avatarUrl: user.user?.imageUrl || "" });
    }
  }, [
    displayName,
    myPresence.avatarUrl,
    myPresence.displayName,
    updateMyPresence,
    user.user?.imageUrl,
  ]);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center gap-8">
        {!isEveryoneReady && (
          <>
            <h2 className="text-2xl font-bold bg-[#FFC530] px-4 py-2 -mt-12">
              Choose your character
            </h2>
            <div className="grid grid-cols-3 gap-4 p-2">
              {MOCK_RESTAURANTS_DATA.slice(0, 9).map((restaurant) => {
                return (
                  <motion.button
                    key={restaurant.name}
                    className={clsx(
                      "bg-black text-white p-4 text-sm",
                      myPresence.restaurantId === restaurant.name &&
                        "bg-red-500"
                    )}
                    animate={{
                      opacity:
                        myPresence.restaurantId !== undefined &&
                        myPresence.restaurantId !== restaurant.name
                          ? 0.5
                          : 1,
                    }}
                    onClick={() => {
                      updateMyPresence({ restaurantId: restaurant.name });
                    }}
                  >
                    <span>{restaurant.name}</span>
                  </motion.button>
                );
              })}
            </div>
            {myPresence.restaurantId === undefined ? (
              <Button
                onClick={() => {
                  const randomRestaurant =
                    MOCK_RESTAURANTS_DATA[Math.floor(Math.random() * 9)];
                  updateMyPresence({ restaurantId: randomRestaurant.name });
                }}
              >
                Feeling Lucky
              </Button>
            ) : (
              <Button
                onClick={() => {
                  updateMyPresence({ isReady: !myPresence.isReady });
                }}
                className={clsx({
                  "opacity-50": myPresence.isReady,
                })}
              >
                Ready
              </Button>
            )}
            <div className="pt-4 flex flex-col items-center justify-center gap-8">
              <p>Waiting on everyone else...</p>
              <ul>
                {others.map((other) => {
                  return (
                    <li key={other.id} className="flex items-center gap-2">
                      {other.presence.isReady ? "🔥" : "😴"}
                      {other.presence.displayName}
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>

      {isEveryoneReady && (
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold bg-[#FFC530] px-4 py-2">
            Pick Game
          </h2>

          <ul className="flex flex-col gap-4 w-full pt-4 justify-center items-center">
            {GAMES.map((game) => {
              return (
                <li key={game.name}>
                  <motion.button
                    onClick={() => {
                      updateMyPresence({ gameVote: game.name });
                    }}
                    className={clsx(" px-28 py-8 w-fit text-white relative")}
                    animate={{
                      backgroundColor:
                        myPresence.gameVote === game.name ? "black" : "white",
                      color:
                        myPresence.gameVote === game.name ? "white" : "black",
                      border:
                        myPresence.gameVote !== game.name
                          ? "1px solid black"
                          : "1px solid white",
                    }}
                  >
                    {game.name}

                    <div className="flex gap-1">
                      {others
                        .filter(
                          (other) => other.presence.gameVote === game.name
                        )
                        .map((other) => {
                          return (
                            <img
                              key={other.id}
                              src={other.presence.avatarUrl}
                              className="size-8 rounded-full"
                            />
                          );
                        })}
                    </div>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {hasEveryoneVoted && <Countdown />}

      {/* <GyroPaint /> */}
      {/* <SpinToWin /> */}
      {/* <ShakeIt /> */}
    </div>
  );
}

const GAMES = [
  //   {
  //     name: "Gyro Paint",
  //   },
  {
    name: "Protein Shake Panic",
  },
  {
    name: "Blender Blitz",
  },
  {
    name: "T9 Racer",
  },
  {
    name: "Pasta Prix",
  },
];
