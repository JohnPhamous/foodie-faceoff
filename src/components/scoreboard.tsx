import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import { motion } from "framer-motion";

export const Scoreboard = () => {
  const others = useOthers();
  const [myPresence, setMyPresence] = useMyPresence();

  return (
    <div className="py-2 flex bg-white border-b border-gray-400 w-full mb-4">
      <ul className="flex flex-col w-full">
        {[...others, { presence: { ...myPresence, displayName: "You" } }].map(
          (other) => {
            return (
              <li
                key={other.presence.displayName}
                className="text-2xl flex items-center gap-2 w-full"
              >
                <span className="relative w-full">
                  <motion.span
                    className="absolute h-full top-0 left-0"
                    animate={{
                      width: `calc(${(other.presence.progress || 0) * 100}% - 32px - 8px)`,
                      background: other.presence.color,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={other.presence.avatarUrl}
                      alt=""
                      className="size-8 rounded-full absolute right-0 translate-x-[calc(100%+8px)]"
                    />
                  </motion.span>
                  <span className="relative pl-2">
                    {other.presence.displayName}
                  </span>
                  {other.presence.score && (
                    <span className="absolute right-12">
                      {other.presence.score?.toFixed(0)}s
                    </span>
                  )}
                </span>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};
