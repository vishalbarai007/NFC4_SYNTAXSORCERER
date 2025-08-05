"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, MessageCircle, Search } from "lucide-react"

const faqs = [
  {
    question: "How do I edit a script? ✏️",
    answer:
      "Click the 'Edit' button next to the 'Original Script' title in the workspace. This will enable edit mode where you can modify your screenplay directly. Click 'Save' when you're done editing.",
  },
  {
    question: "How do I use templates? 📋",
    answer:
      "Visit the Templates page from the dashboard or navigation menu. Choose from various genres and emotions like Comedy, Romance, Drama, etc. You can also mix emotions for unique templates.",
  },
  {
    question: "How to generate scripts with voice? 🎙️",
    answer:
      "Click the microphone icon in the script editor to open the voice assistant. Speak your ideas and the AI will help you develop them into screenplay format.",
  },
  {
    question: "What export formats are supported? 📤",
    answer:
      "ScriptCraft supports PDF, Fountain, Final Draft (.fdx), Word (.docx), and plain text formats. Use the Export menu in the workspace or Quick Export in the sidebar.",
  },
  {
    question: "How does the AI analysis work? 🤖",
    answer:
      "Our AI analyzes your script for tone, character consistency, dialogue quality, and pacing. It provides suggestions for improvements and can enhance specific lines or scenes.",
  },
  {
    question: "Can I collaborate with other writers? 👥",
    answer: "Collaboration features are coming soon! You'll be able to share scripts and work together in real-time.",
  },
]

const tutorials = [
  {
    title: "Getting Started with ScriptCraft",
    description: "Learn the basics of uploading and editing your first screenplay",
    duration: "5 min",
    level: "Beginner",
  },
  {
    title: "Using AI Suggestions",
    description: "Master the art of applying AI recommendations to improve your script",
    duration: "8 min",
    level: "Intermediate",
  },
  {
    title: "Voice-to-Script Workflow",
    description: "Transform your spoken ideas into professional screenplay format",
    duration: "6 min",
    level: "Beginner",
  },
  {
    title: "Advanced Formatting Techniques",
    description: "Professional screenplay formatting and industry standards",
    duration: "12 min",
    level: "Advanced",
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <Navigation />

      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">📚 Help & Support</h1>
            <p className="text-xl text-muted-foreground">Everything you need to master ScriptCraft ✨</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <Card className="hover-lift hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />🔍 Quick Search
                </CardTitle>
                <CardDescription>Find answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                    Script Editing
                  </Badge>
                  <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                    AI Features
                  </Badge>
                  <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                    Export Options
                  </Badge>
                  <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
                    Voice Commands
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />💬 Contact Support
                </CardTitle>
                <CardDescription>Get personalized help from our team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full hover-lift bg-gradient-to-r from-primary to-purple-600">📧 Contact Us</Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <Card className="mb-12 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />❓ Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions and solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Tutorials */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />🎥 Video Tutorials
              </CardTitle>
              <CardDescription>Step-by-step guides to master ScriptCraft</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {tutorials.map((tutorial, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors hover-lift">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{tutorial.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {tutorial.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{tutorial.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">⏱️ {tutorial.duration}</span>
                      <Button size="sm" variant="outline" className="hover-lift bg-transparent">
                        ▶️ Watch
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
