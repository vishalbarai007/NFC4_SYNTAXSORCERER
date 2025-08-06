"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, TrendingUp, Trash2, HardDrive, Download, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useScripts } from "@/contexts/scripts-context"
import { toast } from "sonner"
import { useState } from "react"

export function ScriptHistory() {
  const { scripts, loading, deleteScript, getScriptText } = useScripts()
  const [deletingScriptId, setDeletingScriptId] = useState<string | null>(null)
  const [viewingScriptId, setViewingScriptId] = useState<string | null>(null)

  // ✅ Handle delete with proper async handling
  const handleDelete = async (scriptId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    setDeletingScriptId(scriptId)
    try {
      const success = await deleteScript(scriptId)
      if (success) {
        // Toast is already shown in the context
      }
    } catch (error) {
      console.error("Error deleting script:", error)
      toast.error("Failed to delete script")
    } finally {
      setDeletingScriptId(null)
    }
  }

  // ✅ Handle viewing script text
  const handleViewScript = async (scriptId: string, title: string) => {
    setViewingScriptId(scriptId)
    try {
      const content = await getScriptText(scriptId)
      if (content) {
        // You could open a modal here or navigate to a viewer
        // For now, we'll just show a preview in console
        console.log(`Content for ${title}:`, content.substring(0, 200) + "...")
        toast.success(`📖 Loaded "${title}" successfully`)
        
        // Optional: You could implement a modal or navigate to a detailed view
        // Example: setSelectedScript({ scriptId, title, content })
      }
    } catch (error) {
      console.error("Error viewing script:", error)
    } finally {
      setViewingScriptId(null)
    }
  }

  // ✅ Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 B"
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  // ✅ Get status variant for badge
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Uploaded":
        return "secondary" 
      case "Analyzing":
        return "outline"
      case "In Progress":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // ✅ Get status color for better visual feedback
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 dark:text-green-400"
      case "Uploaded":
        return "text-blue-600 dark:text-blue-400"
      case "Analyzing":
        return "text-yellow-600 dark:text-yellow-400"
      case "In Progress":
        return "text-orange-600 dark:text-orange-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <FileText className="h-5 w-5" />
          Recent Scripts
        </CardTitle>
        <CardDescription>Your latest screenplay projects and their analysis status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* ✅ Loading state */}
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading your scripts...</p>
            </div>
          ) : scripts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No scripts uploaded yet</p>
              <Button className="mt-4" asChild>
                <Link href="/upload">📄 Upload Your First Script</Link>
              </Button>
            </div>
          ) : (
            scripts.map((script) => (
              <div
                key={script.scriptId} // ✅ Use scriptId as key
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{script.title}</h3>
                    {script.hasTextExtraction && (
                      <Badge variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Extracted
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {script.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {script.lastModified}
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {formatFileSize(script.size)}
                    </span>
                    {script.extractedLength && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {script.extractedLength.toLocaleString()} chars
                      </span>
                    )}
                  </div>

                  {/* ✅ Additional info row */}
                  <div className="text-xs text-muted-foreground">
                    Original: {script.originalName}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant={getStatusVariant(script.status)} 
                    className={`text-xs ${getStatusColor(script.status)}`}
                  >
                    {script.status}
                  </Badge>

                  {/* ✅ View/Preview button for extracted text */}
                  {script.hasTextExtraction && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewScript(script.scriptId, script.title)}
                      disabled={viewingScriptId === script.scriptId}
                      className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
                    >
                      {viewingScriptId === script.scriptId ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  )}

                  {/* ✅ Download button */}
                  {script.fileUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`http://localhost:5000${script.fileUrl}`} 
                        download={script.originalName}
                        className="hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20"
                      >
                        <Download className="h-3 w-3" />
                      </a>
                    </Button>
                  )}

                  {/* ✅ Open in workspace */}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/workspace/${script.scriptId}`}>Open</Link>
                  </Button>

                  {/* ✅ Delete button with loading state */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(script.scriptId, script.title)}
                    disabled={deletingScriptId === script.scriptId}
                    className="hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                  >
                    {deletingScriptId === script.scriptId ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Summary footer */}
        {!loading && scripts.length > 0 && (
          <div className="mt-6 pt-4 border-t text-sm text-muted-foreground text-center">
            {scripts.length} script{scripts.length === 1 ? '' : 's'} • {' '}
            {scripts.filter(s => s.hasTextExtraction).length} processed • {' '}
            {scripts.filter(s => s.status === 'Completed').length} completed
          </div>
        )}
      </CardContent>
    </Card>
  )
}
