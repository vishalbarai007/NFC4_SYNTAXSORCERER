
// Updated Navigation2 Component
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { PenTool, Menu } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Dynamically import GoogleTranslate to avoid SSR issues
const GoogleTranslate = dynamic(() => import("./google-translate"), {
  ssr: false,
  loading: () => <div className="w-8 h-8 bg-muted rounded animate-pulse" />,
});

export function Navigation2() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <PenTool className="h-6 w-6" style={{ color: '#1E3A8A' }} />
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent" 
                style={{ backgroundImage: 'linear-gradient(to right, #1E3A8A, #21001f)' }}>
            ScriptCraft
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Suspense
            fallback={
              <div className="w-20 h-8 bg-muted rounded animate-pulse" />
            }
          >
            <GoogleTranslate />
          </Suspense>
          <ModeToggle />
          <Button variant="ghost" className="hover-lift" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            className="hover-lift text-white"
            style={{ 
              background: 'linear-gradient(to right, #1E3A8A, #21001f)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, rgba(30, 58, 138, 0.9), rgba(33, 0, 31, 0.9))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #21001f)';
            }}
            asChild
          >
            <Link href="/auth">🚀 Get Started</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold"> Language</h2>
                  <Suspense
                    fallback={
                      <div className="w-20 h-8 bg-muted rounded animate-pulse" />
                    }
                  >
                    <GoogleTranslate />
                  </Suspense>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/dashboard">📊 Dashboard</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/templates">📋 Templates</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/help">❓ Help</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/settings">⚙️ Settings</Link>
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <Button
                    className="w-full hover-lift text-white"
                    style={{ 
                      background: 'linear-gradient(to right, #1E3A8A, #21001f)',
                    }}
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/auth">🚀 Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
