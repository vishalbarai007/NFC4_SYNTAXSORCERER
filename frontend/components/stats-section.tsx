"use client"

import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { number: "10K+", label: "Scripts Analyzed", emoji: "📄" },
  { number: "95%", label: "Improvement Rate", emoji: "📈" },
  { number: "500+", label: "Happy Writers", emoji: "😊" },
  { number: "24/7", label: "AI Assistance", emoji: "🤖" },
]

export function StatsSection() {
  return (
    <section className="container py-16">
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover-lift text-center bg-gradient-to-br from-primary/5 to-purple-100/50 dark:from-primary/10 dark:to-purple-900/20"
          >
            <CardContent className="p-6">
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
