"use client";

import { Logo } from "@/components/icons/logo";
import { PropsWithChildren } from "react";
import { FloatingPaths } from "@/app/(auth)/_components/floating-paths";

export function AuthPage({ children }: PropsWithChildren) {
  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 sm:-mx-8">
      <div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
        <Logo />

        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              &ldquo;Welcoming guests is greater than receiving the Divine
              Presence.&rdquo;
            </p>
            <footer className="text-sm text-muted-foreground">
              Shabbat 127a
            </footer>

            {/*<LayoutTextFlip*/}
            {/*  text=""*/}
            {/*  words={[*/}
            {/*    "Welcoming guests is greater than receiving the Divine",*/}
            {/*    "— Shabbat 127a",*/}
            {/*    "How good and pleasant it is when brothers dwell together",*/}
            {/*    "— Tehillim 133:1",*/}
            {/*    "The world is built through kindness.",*/}
            {/*    "— Tehillim 89:3"*/}
            {/*  ]}*/}
            {/*/>*/}
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {children}
    </main>
  );
}
