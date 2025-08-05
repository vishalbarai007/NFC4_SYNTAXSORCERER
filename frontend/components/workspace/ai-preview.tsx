"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Lightbulb, MessageSquare, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Suggestion {
  id: string
  type: "dialogue" | "punchline" | "tone"
  original: string
  suggestion: string
  reason: string
  applied: boolean
  rejected: boolean
}

const initialSuggestions: Suggestion[] = [
  {
    id: "dialogue-1",
    type: "dialogue",
    original: "You're late.",
    suggestion: "Fashionably late, or just regular late?",
    reason: "Adds wit and character voice",
    applied: false,
    rejected: false,
  },
  {
    id: "dialogue-2",
    type: "dialogue",
    original: "I don't actually care. Sit.",
    suggestion: "I stopped caring about punctuality around my third coffee. Sit.",
    reason: "More specific and character-driven",
    applied: false,
    rejected: false,
  },
  {
    id: "punchline-1",
    type: "punchline",
    original: "Don't go anywhere, typewriter boy.",
    suggestion: "Don't go anywhere, Hemingway.",
    reason: "Stronger callback to earlier reference",
    applied: false,
    rejected: false,
  },
]

export function AIPreview() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions)

  const applySuggestion = (id: string) => {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, applied: true, rejected: false } : s)))
    const suggestion = suggestions.find((s) => s.id === id)
    toast.success(`✅ Applied: "${suggestion?.suggestion}" 🎉`)
  }

  const rejectSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id))
    toast.info("🗑️ Suggestion removed")
  }

  const activeSuggestions = suggestions.filter((s) => !s.rejected)
  const appliedCount = suggestions.filter((s) => s.applied).length

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">🤖 AI Suggestions</h2>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20"
            >
              ✅ {appliedCount} Applied
            </Badge>
            <Badge variant="outline">💡 {activeSuggestions.length} Total</Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <Tabs defaultValue="dialogue" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dialogue">💬 Dialogue</TabsTrigger>
            <TabsTrigger value="punchlines">😄 Punchlines</TabsTrigger>
            <TabsTrigger value="tone">🎭 Tone</TabsTrigger>
          </TabsList>

          <TabsContent value="dialogue" className="space-y-4 mt-4">
            {activeSuggestions
              .filter((s) => s.type === "dialogue")
              .map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className={`hover-lift transition-all ${suggestion.applied ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200" : "hover-glow"}`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />💬 Dialogue Enhancement
                      {suggestion.applied && (
                        <Badge variant="default" className="text-xs">
                          ✅ Applied
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">📝 Original:</div>
                      <div className="p-2 bg-muted rounded text-sm screenplay-font">"{suggestion.original}"</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">🤖 AI Suggestion:</div>
                      <div className="p-2 bg-primary/5 border border-primary/20 rounded text-sm screenplay-font">
                        "{suggestion.suggestion}"
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <Lightbulb className="h-3 w-3 inline mr-1" />💡 {suggestion.reason}
                    </div>

                    {!suggestion.applied && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion.id)}
                          className="hover-lift bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />✅ Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectSuggestion(suggestion.id)}
                          className="hover-lift hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          🗑️ Remove
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="punchlines" className="space-y-4 mt-4">
            {activeSuggestions
              .filter((s) => s.type === "punchline")
              .map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className={`hover-lift transition-all ${suggestion.applied ? "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200" : "hover-glow"}`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />😄 Punchline Enhancement
                      {suggestion.applied && (
                        <Badge variant="default" className="text-xs">
                          ✅ Applied
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">📝 Current:</div>
                      <div className="p-2 bg-muted rounded text-sm screenplay-font">"{suggestion.original}"</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">🎭 Suggested:</div>
                      <div className="p-2 bg-primary/5 border border-primary/20 rounded text-sm screenplay-font">
                        "{suggestion.suggestion}"
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <Lightbulb className="h-3 w-3 inline mr-1" />💡 {suggestion.reason}
                    </div>

                    {!suggestion.applied && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion.id)}
                          className="hover-lift bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />✅ Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectSuggestion(suggestion.id)}
                          className="hover-lift hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          🗑️ Remove
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="tone" className="space-y-4 mt-4">
            <Card className="hover-lift hover-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">🎭 Current Tone Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-2">🎯 Detected Tone:</div>
                  <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300">
                    🎭 Casual romantic comedy
                  </Badge>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-2">💡 Suggestions:</div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start hover-lift bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      🔥 Add more tension
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start hover-lift bg-transparent hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      😄 Increase wit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start hover-lift bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      💙 Soften the edge
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}
