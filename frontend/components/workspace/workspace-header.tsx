"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, RefreshCw, Eye, ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { ExportMenu } from "./export-menu"
import { toast } from "sonner"

interface WorkspaceHeaderProps {
  scriptId: string
  onCompareToggle?: () => void
  compareMode?: boolean
}

export function WorkspaceHeader({ scriptId, onCompareToggle, compareMode }: WorkspaceHeaderProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    setTimeout(() => {
      setIsSaving(false)
      toast.success("💾 Script saved successfully!")
    }, 1000)
  }

  const handleReAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate re-analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      toast.success("🤖 Re-analysis complete!")
    }, 3000)
  }

  const handleSettings = () => {
    toast.info("⚙️ Settings panel coming soon!")
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hover-lift" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />🏠 Back
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">🎬 The Last Stand</h1>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20"
            >
              Feature Film
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hover-lift" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "💾 Saving..." : "💾 Save"}
          </Button>

          <Button variant="ghost" size="sm" className="hover-lift" onClick={handleReAnalyze} disabled={isAnalyzing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
            {isAnalyzing ? "🔄 Analyzing..." : "🔄 Re-analyze"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`hover-lift ${compareMode ? "bg-primary/10 text-primary" : ""}`}
            onClick={onCompareToggle}
          >
            <Eye className="h-4 w-4 mr-2" />
            👁️ Compare View
          </Button>

          <ExportMenu />

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm" className="hover-lift" onClick={handleSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
