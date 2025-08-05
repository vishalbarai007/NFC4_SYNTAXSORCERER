"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, TrendingUp, Trash2 } from "lucide-react"
import Link from "next/link"
import { useScripts } from "@/contexts/scripts-context"
import { toast } from "sonner"

export function ScriptHistory() {
  const { scripts, deleteScript } = useScripts()

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteScript(id)
      toast.success(`🗑️ "${title}" deleted successfully`)
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
          {scripts.length === 0 ? (
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
                key={script.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
              >
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium">{script.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground">
                    <span>{script.type}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {script.lastModified}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {script.improvement}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={script.status === "Completed" ? "default" : "secondary"} className="text-xs">
                    {script.status}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/workspace/${script.id}`}>Open</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(script.id, script.title)}
                    className="hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
