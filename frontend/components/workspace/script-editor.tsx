"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, Mic, FileText, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { VoiceModal } from "./voice-modal"
import { useSettings } from "@/contexts/settings-context"

interface ScriptEditorProps {
  content: string
  onContentChange: (content: string) => void
  scriptId?: string
  scriptTitle?: string
  readonly?: boolean
  onSave?: () => Promise<void>
}

export function ScriptEditor({ 
  content, 
  onContentChange, 
  scriptId, 
  scriptTitle,
  readonly = false,
  onSave 
}: ScriptEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localContent, setLocalContent] = useState(content)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const settings = useSettings()

  // ✅ Update local content when prop content changes
  useEffect(() => {
    setLocalContent(content)
    setHasChanges(false)
  }, [content])

  // ✅ Track changes
  useEffect(() => {
    setHasChanges(localContent !== content)
  }, [localContent, content])

  const handleEdit = () => {
    if (readonly) {
      toast.error("Script is currently being processed and cannot be edited")
      return
    }
    setIsEditing(true)
    toast.info("✏️ Edit mode activated! Make your changes.")
  }

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info("No changes to save")
      return
    }

    setIsSaving(true)
    try {
      // ✅ Update parent component with new content
      onContentChange(localContent)
      
      // ✅ Call custom save handler if provided
      if (onSave) {
        await onSave()
      }
      
      setIsEditing(false)
      setLastSaved(new Date())
      setHasChanges(false)
      toast.success("💾 Script saved successfully!")
    } catch (error) {
      console.error("Error saving script:", error)
      toast.error("Failed to save script")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setLocalContent(content) // Reset to original
    setHasChanges(false)
    toast.info("❌ Changes cancelled")
  }

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent)
  }

  // ✅ Handle voice input
  const handleVoiceInput = (voiceText: string) => {
    if (readonly) {
      toast.error("Script is currently being processed")
      return
    }
    
    // Add voice input to current content
    const newContent = localContent + '\n\n' + voiceText
    setLocalContent(newContent)
    if (!isEditing) {
      setIsEditing(true)
    }
    toast.success("🎤 Voice input added to script")
  }

  // ✅ Get font size class based on settings
  const getFontSizeClass = () => {
    switch (settings?.fontSize) {
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

  // ✅ Generate line numbers
  const generateLineNumbers = (content: string) => {
    const lines = content.split("\n")
    return lines.map((_, index) => (
      <div key={index} className="text-xs text-muted-foreground pr-2 select-none leading-relaxed">
        {index + 1}
      </div>
    ))
  }

  // ✅ Calculate script statistics
  const getScriptStats = () => {
    const lines = localContent.split('\n').length
    const words = localContent.split(/\s+/).filter(word => word.length > 0).length
    const characters = localContent.length
    const pages = Math.ceil(lines / 25) // Rough estimate: 25 lines per page
    
    return { lines, words, characters, pages }
  }

  // ✅ Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return "Never saved"
    
    const now = new Date()
    const diffMs = now.getTime() - lastSaved.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    
    if (diffMinutes < 1) return "Just saved"
    if (diffMinutes < 60) return `Saved ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `Saved ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    
    return `Saved on ${lastSaved.toLocaleDateString()}`
  }

  // ✅ Detect script scenes (basic detection)
  const detectScenes = () => {
    const sceneHeaders = localContent.match(/^(INT\.|EXT\.|FADE IN:|FADE OUT)/gm) || []
    return sceneHeaders.length
  }

  const stats = getScriptStats()
  const currentScene = Math.max(1, detectScenes())
  const totalScenes = Math.max(currentScene, detectScenes())

  return (
    <>
      <div className="flex flex-col h-full workspace-container">
        {/* ✅ Dynamic header */}
        <div className="border-b p-2 md:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <h2 className="text-base md:text-lg font-semibold">
                {scriptTitle || "Script Editor"}
              </h2>
              {readonly && (
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Processing
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {totalScenes > 0 && (
                <Badge variant="outline" className="text-xs">
                  Scene {Math.min(currentScene, totalScenes)} of {totalScenes}
                </Badge>
              )}

              <Badge variant="outline" className="text-xs">
                {stats.words} words
              </Badge>

              {hasChanges && (
                <Badge variant="destructive" className="text-xs">
                  Unsaved
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="hover-lift"
                onClick={() => setIsVoiceModalOpen(true)}
                title="Speak your idea"
                disabled={readonly}
              >
                <Mic className="h-4 w-4" />
              </Button>

              {!isEditing ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover-lift" 
                  onClick={handleEdit}
                  disabled={readonly}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  ✏️ Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover-lift" 
                    onClick={handleSave} 
                    disabled={isSaving || !hasChanges}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "💾 Saving..." : "💾 Save"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover-lift bg-transparent" 
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    ❌ Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Main editor area */}
        <ScrollArea className="flex-1 p-2 md:p-4">
          {localContent ? (
            <div className="flex">
              {settings?.showLineNumbers && (
                <div className="flex flex-col mr-2 pt-3">
                  {generateLineNumbers(localContent)}
                </div>
              )}
              
              {isEditing ? (
                <Textarea
                  value={localContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className={`screenplay-font ${getFontSizeClass()} leading-relaxed min-h-[400px] md:min-h-[600px] resize-none border-2 border-primary/20 focus:border-primary/40 flex-1`}
                  placeholder="Write your screenplay here..."
                  disabled={readonly}
                />
              ) : (
                <div
                  className={`screenplay-font ${getFontSizeClass()} leading-relaxed whitespace-pre-wrap hover:bg-muted/20 p-2 md:p-4 rounded-lg transition-colors flex-1 cursor-pointer`}
                  onClick={readonly ? undefined : handleEdit}
                  title={readonly ? "Script is being processed" : "Click to edit"}
                >
                  {localContent}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-4">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-muted-foreground">No script content</p>
                  <p className="text-sm text-muted-foreground">
                    {readonly ? "Script is being processed..." : "Start writing your screenplay"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* ✅ Dynamic footer with stats */}
        <div className="border-t p-2 md:p-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm text-muted-foreground gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Page {stats.pages}
              </span>
              <span>{stats.characters.toLocaleString()} characters</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {isEditing && hasChanges ? "Editing..." : formatLastSaved()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <VoiceModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)}
        onVoiceInput={handleVoiceInput}
      />
    </>
  )
}
