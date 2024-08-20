import type { Metadata } from "next";
import { Patrick_Hand } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/button";
import Logo from "../images /logo.png";
import Image from "next/image";

const inter = Patrick_Hand({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SignedOut>
            <div className="flex flex-col items-center justify-between p-8 h-[100dvh]">
              <div className="relative w-full">
                <div
                  className="w-full relative h-[40dvh]"
                  style={{ aspectRatio: "auto" }}
                >
                  <Image src={Logo} alt="" layout="fill" objectFit="contain" />
                </div>
              </div>
              <SignInButton>
                <Button className="w-full">Sign In</Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <header className="flex justify-between items-center p-4">
              <div className="ml-auto">
                <UserButton />
              </div>
            </header>
            {children}
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
