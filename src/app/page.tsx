import { Room } from "@/components/Room";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <Room />
      </SignedIn>
    </main>
  );
}
