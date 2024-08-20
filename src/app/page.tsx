import { Room } from "@/components/Room";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <SignedIn>
        <Room />
      </SignedIn>
    </main>
  );
}
