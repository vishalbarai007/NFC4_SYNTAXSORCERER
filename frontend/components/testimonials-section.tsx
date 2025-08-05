"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Screenwriter",
    avatar: "/i1.svg?height=40&width=40",
    content: "ScriptCraft transformed my writing process! The AI suggestions are incredibly insightful. 🎬✨",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Film Director",
    avatar: "/i2.svg?height=40&width=40",
    content: "The dialogue enhancement feature is a game-changer. My scripts feel more authentic now! 🎭",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "TV Writer",
    avatar: "/i3.svg?height=40&width=40",
    content: "Love the character consistency checker. It's like having a writing mentor 24/7! 📝💡",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Writers Are Saying 💬</h2>
        <p className="text-lg text-muted-foreground">
          Join thousands of satisfied screenwriters who've elevated their craft
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="hover-lift hover-glow bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-purple-900/20"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm mb-4 italic">"{testimonial.content}"</p>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar || "/i1.svg"} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
