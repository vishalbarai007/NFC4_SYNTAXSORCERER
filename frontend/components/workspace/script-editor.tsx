"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, Mic } from "lucide-react"
import { toast } from "sonner"
import { VoiceModal } from "./voice-modal"
import { useSettings } from "@/contexts/settings-context"

const initialScript = `FADE IN:

INT. COFFEE SHOP - DAY

The morning rush is in full swing. SARAH (28), sharp-eyed and perpetually caffeinated, sits at a corner table with her laptop. She types furiously, occasionally glancing at the door.

MIKE (30), earnest and slightly disheveled, enters. He scans the room and spots Sarah.

MIKE
(approaching)
Sarah? I'm Mike. From the dating app?

SARAH
(not looking up)
You're late.

MIKE
Traffic was—

SARAH
(finally looking up)
I don't actually care. Sit.

Mike sits, taken aback by her directness.

SARAH (CONT'D)
So, Mike. Tell me something interesting about yourself. And please don't say you love long walks on the beach.

MIKE
(nervous laugh)
Well, I collect vintage typewriters.

SARAH
(pausing her typing)
That's... actually not terrible.

MIKE
I have a 1952 Royal Quiet De Luxe. Hemingway used the same model.

SARAH
(closing laptop)
Okay, you have my attention.

The barista calls out an order. Sarah gets up to collect her drink.

SARAH (CONT'D)
(over her shoulder)
Don't go anywhere, typewriter boy.

Mike smiles, relaxing for the first time.

FADE OUT.`

export function ScriptEditor() {
  const [isEditing, setIsEditing] = useState(false)
  const [scriptContent, setScriptContent] = useState(initialScript)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const settings = useSettings()

  const handleEdit = () => {
    setIsEditing(true)
    toast.info("✏️ Edit mode activated! Make your changes.")
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save operation
    setTimeout(() => {
      setIsEditing(false)
      setIsSaving(false)
      toast.success("💾 Script saved successfully!")
    }, 1000)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setScriptContent(initialScript) // Reset to original
    toast.info("❌ Changes cancelled")
  }

  // Get font size class based on settings
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-xs"
      case "medium":
        return "text-sm"
      case "large":
        return "text-base"
      case "xlarge":
        return "text-lg"
      default:
        return "text-sm"
    }
  }

  // Generate line numbers
  const generateLineNumbers = (content: string) => {
    const lines = content.split("\n")
    return lines.map((_, index) => (
      <div key={index} className="text-xs text-muted-foreground pr-2 select-none">
        {index + 1}
      </div>
    ))
  }

  return (
    <>
      <div className="flex flex-col h-full workspace-container">
        <div className="border-b p-2 md:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base md:text-lg font-semibold">📝 Original Script</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                Scene 1 of 12
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                className="hover-lift"
                onClick={() => setIsVoiceModalOpen(true)}
                title="Speak your idea"
              >
                <Mic className="h-4 w-4" />
              </Button>

              {!isEditing ? (
                <Button variant="ghost" size="sm" className="hover-lift" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  ✏️ Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="hover-lift" onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "💾 Saving..." : "💾 Save"}
                  </Button>
                  <Button variant="outline" size="sm" className="hover-lift bg-transparent" onClick={handleCancel}>
                    ❌ Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-2 md:p-4">
          {isEditing ? (
            <div className="flex">
              {settings.showLineNumbers && (
                <div className="flex flex-col mr-2 pt-3">{generateLineNumbers(scriptContent)}</div>
              )}
              <Textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className={`screenplay-font ${getFontSizeClass()} leading-relaxed min-h-[400px] md:min-h-[600px] resize-none border-2 border-primary/20 focus:border-primary/40 flex-1`}
                placeholder="Write your screenplay here..."
              />
            </div>
          ) : (
            <div className="flex">
              {settings.showLineNumbers && (
                <div className="flex flex-col mr-2 pt-1">{generateLineNumbers(scriptContent)}</div>
              )}
              <div
                className={`screenplay-font ${getFontSizeClass()} leading-relaxed whitespace-pre-wrap hover:bg-muted/20 p-2 md:p-4 rounded-lg transition-colors flex-1`}
              >
                {scriptContent}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-2 md:p-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm text-muted-foreground gap-2">
            <span>📄 Page 1 of 45</span>
            <span>💾 Last saved: {isEditing ? "Editing..." : "2 minutes ago"}</span>
          </div>
        </div>
      </div>

      <VoiceModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
    </>
  )
}
