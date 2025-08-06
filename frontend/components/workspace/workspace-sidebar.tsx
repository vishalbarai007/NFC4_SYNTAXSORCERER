"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navigation, Users, BarChart3, MessageSquare, CheckCircle, Shield, Download } from "lucide-react"
import { toast } from "sonner"

// Mock data
const scenes = [
  { id: "1", title: "INT. COFFEE SHOP - DAY", characters: ["SARAH", "MIKE"], tone: "neutral" },
  { id: "2", title: "EXT. PARK - AFTERNOON", characters: ["SARAH"], tone: "melancholy" },
  { id: "3", title: "INT. APARTMENT - NIGHT", characters: ["SARAH", "MIKE", "JENNY"], tone: "tense" },
]

const characters = [
  { name: "SARAH", voice: "Witty, sarcastic", traits: ["Intelligent", "Guarded", "Ambitious"] },
  { name: "MIKE", voice: "Earnest, optimistic", traits: ["Loyal", "Naive", "Caring"] },
  { name: "JENNY", voice: "Direct, no-nonsense", traits: ["Practical", "Honest", "Supportive"] },
]

export function WorkspaceSidebar() {
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
            <TabsTrigger value="navigation" className="text-xs">
              🧭 Nav
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">
              📊 Analysis
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">
              🛠️ Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="navigation" className="space-y-4 mt-4">
            {/* Scene Navigator */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Navigation className="h-4 w-4" />🎬 Scene Navigator
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Accordion type="single" collapsible>
                  {scenes.map((scene) => (
                    <AccordionItem key={scene.id} value={scene.id}>
                      <AccordionTrigger className="text-xs py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              scene.tone === "tense"
                                ? "bg-red-400"
                                : scene.tone === "melancholy"
                                  ? "bg-blue-400"
                                  : "bg-green-400"
                            }`}
                          />
                          <span className="truncate">{scene.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground">
                        👥 Characters: {scene.characters.join(", ")}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Character Profiles */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />👥 Characters
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {characters.map((character) => (
                  <div key={character.name} className="p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                    <h4 className="font-medium text-sm">🎭 {character.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">🗣️ Voice: {character.voice}</p>
                    <div className="flex flex-wrap gap-1">
                      {character.traits.map((trait) => (
                        <Badge key={trait} variant="outline" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 mt-4">
            {/* Tone Analysis */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />📊 Tone Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>🔥 Tension</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>😄 Humor</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>💕 Romance</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Character Consistency */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />✅ Consistency Check
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">🎭 SARAH's Voice</span>
                    <Badge
                      variant="default"
                      className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    >
                      ✅ Consistent
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">🎭 MIKE's Voice</span>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                    >
                      ⚠️ Minor Issues
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">🎭 JENNY's Voice</span>
                    <Badge
                      variant="default"
                      className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    >
                      ✅ Consistent
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4 mt-4">
            {/* Dialogue Enhancer */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />💬 Dialogue Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs hover-lift bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleDialogueTool("Dialogue Enhancer")}
                >
                  ✨ Enhance Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs hover-lift bg-transparent hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                  onClick={() => handleDialogueTool("Punchline Generator")}
                >
                  😄 Add Punchlines
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs hover-lift bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => handleDialogueTool("Subtext Checker")}
                >
                  🔍 Check Subtext
                </Button>
              </CardContent>
            </Card>

            {/* Plagiarism Defense */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  🛡️ Plagiarism Defense
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="plagiarism-check"
                    checked={plagiarismCheck}
                    onCheckedChange={(checked) => {
                      setPlagiarismCheck(checked)
                      toast.info(checked ? "🛡️ Plagiarism checking enabled" : "🛡️ Plagiarism checking disabled")
                    }}
                  />
                  <Label htmlFor="plagiarism-check" className="text-xs">
                    🔍 Enable checking
                  </Label>
                </div>
                {plagiarismCheck && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">✅ No issues detected</div>
                )}
              </CardContent>
            </Card>

            {/* Quick Export */}
            <Card className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Download className="h-4 w-4" />📤 Quick Export
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs hover-lift bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleQuickExport("pdf")}
                >
                  📄 Export PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs hover-lift bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleQuickExport("fountain")}
                >
                  ⛲ Export Fountain
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs hover-lift bg-transparent hover:bg-green-50 dark:hover:bg-green-900/20"
                  onClick={() => handleQuickExport("docx")}
                >
                  📋 Export Word
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
