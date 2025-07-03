"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { ModeToggle } from "./ModeToogle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import Logo from "./Logo";

export function Navbar() {
  const { resolvedTheme } = useTheme();

  return (
    <header className="fixed top-2 left-[50%] translate-x-[-50%] w-[90%] rounded-lg z-[30] bg-transparent backdrop-blur-md border border-white/10 shadow-lg">
      <div className="w-full flex h-14 items-center justify-between px-8">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <SignedOut>
            <SignedOutNav />
          </SignedOut>
          <SignedIn>
            <SignedInNav resolvedTheme={resolvedTheme} />
          </SignedIn>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-10 w-10" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[240px] sm:w-[300px] px-4 py-2"
            >
              <div className="flex flex-col gap-4 mt-8">
                <SignedOut>
                  <SignedOutNav isMobile />
                </SignedOut>
                <SignedIn>
                  <SignedInNav isMobile resolvedTheme={resolvedTheme} />
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function SignedOutNav({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <Link href="/plans">
        <Button variant="link" size="sm">
          Plans
        </Button>
      </Link>
      <Link href="/sign-in">
        <Button variant="link" size="sm">
          Login
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button size="sm">Get Started</Button>
      </Link>
      <ModeToggle showLabel={isMobile} />
    </>
  );
}

function SignedInNav({
  isMobile = false,
  resolvedTheme,
}: {
  isMobile?: boolean;
  resolvedTheme?: string;
}) {
  return (
    <>
      <Link href="/dashboard">
        <Button variant="link" size="sm">
          Dashboard
        </Button>
      </Link>
      <Link href="/prompts">
        <Button variant="link" size="sm">
          Prompts
        </Button>
      </Link>
      <Link href="/plans">
        <Button variant="link" size="sm">
          Plans
        </Button>
      </Link>
      <ModeToggle showLabel={isMobile} />
      <UserButton
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
    </>
  );
}
