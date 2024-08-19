"use client";

import { useUser } from "@clerk/nextjs";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useOthers,
  useMyPresence,
} from "@liveblocks/react/suspense";
import { useEffect } from "react";

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
        initialPresence={{ displayName, avatarUrl: user.user?.imageUrl || "" }}
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
  const userCount = others.length;

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
    <div>
      There are {userCount} other user(s) online
      <ul>
        {others.map((other) => (
          <li key={other.id} className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={other.presence.avatarUrl}
              alt=""
              className="size-8 rounded-full"
            />
            {other.presence.displayName}
          </li>
        ))}
      </ul>
    </div>
  );
}
