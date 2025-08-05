"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, MessageSquare, Lightbulb, Shield, Users, TrendingUp } from "lucide-react"

const features = [
  {
    // icon: BarChart3,
    emoji: "📊",
    title: "Tone Analysis",
    description:
      "Analyze emotional tone and pacing throughout your screenplay with detailed scene-by-scene breakdowns.",
  },
  {
    // icon: MessageSquare,
    emoji: "💬",
    title: "Dialogue Enhancement",
    description: "AI-powered suggestions to make your dialogue more impactful, natural, and character-specific.",
  },
  {
    // icon: Lightbulb,
    emoji: "💡",
    title: "Punchline Suggestions",
    description: "Enhance comedic timing and dramatic impact with intelligent line suggestions.",
  },
  {
    // icon: Shield,
    emoji: "🛡️",
    title: "Plagiarism Defense",
    description: "Protect your work with comprehensive plagiarism checking and originality verification.",
  },
  {
    // icon: Users,
    emoji: "👥",
    title: "Character Consistency",
    description: "Ensure character voices remain authentic and consistent throughout your script.",
  },
  {
    // icon: TrendingUp,
    emoji: "📈",
    title: "Progress Tracking",
    description: "Monitor your writing improvement with detailed analytics and feedback metrics.",
  },
]

export function FeatureGrid() {
  return (
    <section className="container py-24 mt-[100px]">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Professional Tools for Screenwriters 🛠️</h2>
        <p className="text-lg text-muted-foreground">
          Everything you need to craft compelling screenplays with AI assistance ✨
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="fade-in hover-lift hover-glow bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-purple-900/20"
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{feature.emoji}</div>
                {/* <feature.icon className="h-6 w-6 text-primary" /> */}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
