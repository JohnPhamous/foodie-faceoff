"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useOthers,
} from "@liveblocks/react/suspense";

export function Room() {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}
    >
      <RoomProvider id="my-room">
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <GameApp />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function GameApp() {
  const others = useOthers();
  const userCount = others.length;
  return <div>There are {userCount} other user(s) online</div>;
}
