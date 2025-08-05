"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="container py-24 md:py-32 center-content">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center rounded-full border px-4 py-2 text-sm bg-gradient-to-r from-primary/10 to-purple-100/50 border-primary/20 hover-lift">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />AI-Powered Script Enhancement
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          Write Better.{" "}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Speak Louder.
          </span>{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Feel Deeper.
          </span>{" "}
          🎬
        </h1>

        <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
          Transform your screenplays with AI-enhanced analysis, dialogue improvement, and character development tools
          designed for professional writers 📝
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="text-lg hover-lift bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            asChild
          >
            <Link href="/auth">
              <Upload className="mr-2 h-5 w-5" /> Upload Your Script
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg hover-lift bg-transparent hover:bg-primary/5" asChild>
            <Link href="/dashboard">
              📊 View Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
