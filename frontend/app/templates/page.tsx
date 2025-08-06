"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Download, Heart, Laugh, Drama, Zap, Crown } from "lucide-react"
import { toast } from "sonner"

const emotions = [
  {
    id: "happy",
    label: "😊 Happy",
    icon: Laugh,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
  },
  { id: "angry", label: "😠 Angry", icon: Zap, color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300" },
  {
    id: "romantic",
    label: "💕 Romance",
    icon: Heart,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
  },
  {
    id: "comedy",
    label: "😂 Comedy",
    icon: Laugh,
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  },
  {
    id: "drama",
    label: "🎭 Drama",
    icon: Drama,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
  },
  {
    id: "thriller",
    label: "😰 Thriller",
    icon: Zap,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300",
  },
]

const templates = [
  {
    id: "rom-com",
    title: "Romantic Comedy",
    description: "Light-hearted romance with comedic elements",
    emotions: ["romantic", "comedy"],
    preview: "Two unlikely characters meet in a coffee shop...",
    genre: "Romance",
    length: "Feature",
  },
  {
    id: "action-thriller",
    title: "Action Thriller",
    description: "High-stakes action with suspenseful moments",
    emotions: ["angry", "thriller"],
    preview: "The clock is ticking as our hero races against time...",
    genre: "Action",
    length: "Feature",
  },
  {
    id: "family-drama",
    title: "Family Drama",
    description: "Emotional family conflicts and resolutions",
    emotions: ["drama", "happy"],
    preview: "Three generations gather for a family reunion...",
    genre: "Drama",
    length: "Feature",
  },
  {
    id: "dark-comedy",
    title: "Dark Comedy",
    description: "Comedy with darker, satirical undertones",
    emotions: ["comedy", "angry"],
    preview: "A funeral director discovers an unusual talent...",
    genre: "Comedy",
    length: "Short",
  },
]

const writerStyles = [
  { id: "shakespeare", name: "🎭 Shakespeare", style: "Elizabethan drama with poetic dialogue" },
  { id: "dickens", name: "📚 Charles Dickens", style: "Victorian social commentary with rich characters" },
  { id: "rowling", name: "⚡ J.K. Rowling", style: "Fantasy adventure with coming-of-age themes" },
  { id: "king", name: "👻 Stephen King", style: "Psychological horror with supernatural elements" },
]

export default function TemplatesPage() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedWriter, setSelectedWriter] = useState<string>("")
  const [filteredTemplates, setFilteredTemplates] = useState(templates)

  const handleEmotionChange = (emotionId: string, checked: boolean) => {
    const newSelected = checked ? [...selectedEmotions, emotionId] : selectedEmotions.filter((id) => id !== emotionId)

    setSelectedEmotions(newSelected)

    // Filter templates based on selected emotions
    if (newSelected.length === 0) {
      setFilteredTemplates(templates)
    } else {
      const filtered = templates.filter((template) =>
        newSelected.some((emotion) => template.emotions.includes(emotion)),
      )
      setFilteredTemplates(filtered)
    }
  }

  const handleUseTemplate = (template: any) => {
    toast.success(
      `🎬 "${template.title}" template loaded! ${selectedWriter ? `Writing in ${writerStyles.find((w) => w.id === selectedWriter)?.name} style` : ""}`,
    )
  }

  const handlePreview = (template: any) => {
    toast.info(`👁️ Previewing "${template.title}"`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <Navigation />

      <div className="container py-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">📋 Script Templates</h1>
            <p className="text-xl text-muted-foreground">
              Choose from professional templates tailored to different genres and emotions ✨
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Emotion Filters */}
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle className="text-lg">🎭 Filter by Emotion</CardTitle>
                    <CardDescription>Select multiple emotions to find perfect templates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {emotions.map((emotion) => (
                      <div key={emotion.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={emotion.id}
                          checked={selectedEmotions.includes(emotion.id)}
                          onCheckedChange={(checked) => handleEmotionChange(emotion.id, checked as boolean)}
                        />
                        <label
                          htmlFor={emotion.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {emotion.label}
                        </label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Writer Inspiration */}
                <Card className="hover-lift">
                  <CardHeader>
                    <CardTitle className="text-lg">✍️ Writer Inspiration</CardTitle>
                    <CardDescription>Choose a writing style to emulate</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {writerStyles.map((writer) => (
                      <Button
                        key={writer.id}
                        variant={selectedWriter === writer.id ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start hover-lift bg-transparent"
                        onClick={() => setSelectedWriter(selectedWriter === writer.id ? "" : writer.id)}
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        {writer.name}
                      </Button>
                    ))}
                    {selectedWriter && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          {writerStyles.find((w) => w.id === selectedWriter)?.style}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">📚 Available Templates ({filteredTemplates.length})</h2>
                {selectedEmotions.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEmotions([])
                      setFilteredTemplates(templates)
                    }}
                    className="hover-lift bg-transparent"
                  >
                    🔄 Clear Filters
                  </Button>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover-lift hover-glow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <CardDescription className="mt-1">{template.description}</CardDescription>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="text-xs">
                            {template.genre}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {template.length}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Emotion Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.emotions.map((emotionId) => {
                          const emotion = emotions.find((e) => e.id === emotionId)
                          return emotion ? (
                            <Badge key={emotionId} variant="outline" className={`text-xs ${emotion.color}`}>
                              {emotion.label}
                            </Badge>
                          ) : null
                        })}
                      </div>

                      {/* Preview */}
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm italic screenplay-font">"{template.preview}"</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 hover-lift bg-gradient-to-r from-primary to-purple-600"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <Download className="h-4 w-4 mr-2" />🎬 Use Template
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover-lift bg-transparent"
                          onClick={() => handlePreview(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your emotion filters to see more templates
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedEmotions([])
                        setFilteredTemplates(templates)
                      }}
                      className="hover-lift bg-transparent"
                    >
                      🔄 Show All Templates
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
