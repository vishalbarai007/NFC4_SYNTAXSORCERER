
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navigation, Users } from "lucide-react"
import { toast } from "sonner"

interface Scene {
  id?: string
  title: string
  characters?: string[] // optional for safety
  tone?: string
}

interface Character {
  name: string
  voice?: string
  traits?: string[]
}

interface WorkspaceSidebarProps {
  scenes: Scene[]
  characters: Character[]
  loading?: boolean
}

export function WorkspaceSidebar({ scenes, characters, loading = false }: WorkspaceSidebarProps) {
  const [plagiarismCheck, setPlagiarismCheck] = useState(false)

  const handleQuickExport = (format: string) => {
    toast.loading(`📤 Preparing ${format.toUpperCase()} export...`)

    setTimeout(() => {
      const element = document.createElement("a")
      const file = new Blob([`Mock ${format.toUpperCase()} content...`], {
        type: format === "pdf" ? "application/pdf" : "text/plain",
      })
      element.href = URL.createObjectURL(file)
      element.download = `script.${format}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast.success(`✅ ${format.toUpperCase()} exported successfully! 🎉`)
    }, 1500)
  }

  const handleDialogueTool = (tool: string) => {
    toast.info(`🤖 ${tool} activated! Processing your script...`)
  }

  return (
    <div className="w-full lg:w-80 border-r bg-gradient-to-b from-muted/30 to-muted/10 overflow-y-auto">
      <div className="p-2 md:p-4">
        <Tabs defaultValue="navigation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="navigation" className="text-xs">🧭 Nav</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">📊 Analysis</TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">🛠️ Tools</TabsTrigger>
          </TabsList>

          {/* ✅ Navigation Tab */}
          <TabsContent value="navigation" className="space-y-4 mt-4">
            {/* ✅ Scene Navigator */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Navigation className="h-4 w-4" />🎬 Scene Navigator
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <p className="text-xs text-muted-foreground">Loading scenes...</p>
                ) : scenes && scenes.length > 0 ? (
                  <Accordion type="single" collapsible>
                    {scenes.map((scene, index) => {
                      const toneColor =
                        scene.tone === "tense"
                          ? "bg-red-400"
                          : scene.tone === "melancholy"
                          ? "bg-blue-400"
                          : "bg-green-400"
                      const charactersList = Array.isArray(scene.characters)
                        ? scene.characters.join(", ")
                        : "No characters"
                      return (
                        <AccordionItem
                          key={scene.id || `scene-${index}`}
                          value={scene.id || `scene-${index}`}
                        >
                          <AccordionTrigger className="text-xs py-2 hover:no-underline">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${toneColor}`} />
  <span className="truncate">
    {scene && scene.trim() !== "" ? scene : `Scene ${index + 1}`}
  </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-xs text-muted-foreground">
                            👥 Characters: {charactersList}
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                ) : (
                  <p className="text-xs text-muted-foreground">No scenes available</p>
                )}
              </CardContent>
            </Card>

            {/* ✅ Character Profiles */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />👥 Characters
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {loading ? (
                  <p className="text-xs text-muted-foreground">Loading characters...</p>
                ) : characters && characters.length > 0 ? (
                  characters.map((character, charIndex) => (
                    <div
                      key={character.name || `char-${charIndex}`}
                      className="p-2 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <h4 className="font-medium text-sm">🎭 {character.name || "Unknown Character"}</h4>
                      {character.voice && (
                        <p className="text-xs text-muted-foreground mb-1">🗣️ Voice: {character.voice}</p>
                      )}
                      {Array.isArray(character.traits) && character.traits.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {character.traits.map((trait, traitIndex) => (
                            <Badge key={`${character.name}-${traitIndex}`} variant="outline" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No character data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ✅ Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4 mt-4">
            <p className="text-xs text-muted-foreground">Coming soon...</p>
          </TabsContent>

          {/* ✅ Tools Tab */}
          <TabsContent value="tools" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tools Placeholder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Existing tool buttons go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
