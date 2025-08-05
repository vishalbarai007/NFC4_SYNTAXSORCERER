"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"

const stats = [
  { number: "10K+", label: "Scripts Analyzed", emoji: "📜", value: 10000, suffix: "K+" },
  { number: "95%", label: "Improvement Rate", emoji: "🚀", value: 95, suffix: "%" },
  { number: "500+", label: "Happy Writers", emoji: "😊", value: 500, suffix: "+" },
  { number: "24/7", label: "AI Assistance", emoji: "🤖", value: 24, suffix: "/7" },
]

type Stat = {
  number: string;
  label: string;
  emoji: string;
  value: number;
  suffix: string;
};

function CounterCard({ stat, index }: { stat: Stat; index: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (isVisible) {
      const duration = 3000 // 3 seconds
      const startTime = Date.now()
      const startValue = 0
      const endValue = stat.value

      const updateCount = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart)

        setCount(currentValue)

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        }
      }

      requestAnimationFrame(updateCount)
    }
  }, [isVisible, stat.value])

  interface FormatCountProps {
    value: number;
  }

  const formatCount = (value: number): string => {
    if (stat.suffix === "K+") {
      return value >= 1000 ? `${Math.floor(value / 1000)}K+` : value.toString()
    }
    return value.toString()
  }

  return (
    <Card
      ref={cardRef}
      className="hover-lift text-center bg-gradient-to-br from-primary/5 to-purple-100/50 dark:from-primary/10 dark:to-purple-900/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      <CardContent className="p-6">
        <div className="text-4xl mb-3 animate-bounce">{stat.emoji}</div>
        <div className="text-4xl font-bold text-primary mb-2 font-mono tracking-wider">
          {formatCount(count)}{stat.suffix !== "K+" ? stat.suffix : ""}
        </div>
        <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
      </CardContent>
    </Card>
  )
}

export function StatsSection() {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Our Impact in Numbers
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of writers who have transformed their scripts with our AI-powered assistance
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <CounterCard key={index} stat={stat} index={index} />
        ))}
      </div>
    </section>
  )
}