"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, File, Printer, FileDown } from "lucide-react"
import { toast } from "sonner"

export function ExportMenu() {
  const handleExport = (format: string) => {
    toast.loading(`📤 Preparing ${format.toUpperCase()} export...`)

    // Simulate export process
    setTimeout(() => {
      // Create a mock file download
      const element = document.createElement("a")
      const file = new Blob([`Mock ${format.toUpperCase()} content for "The Last Stand" screenplay...`], {
        type: format === "pdf" ? "application/pdf" : "text/plain",
      })
      element.href = URL.createObjectURL(file)
      element.download = `the-last-stand.${format === "finaldraft" ? "fdx" : format}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast.success(`✅ ${format.toUpperCase()} exported successfully!`)
    }, 2000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hover-lift">
          <Download className="h-4 w-4 mr-2" />📤 Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport("pdf")} className="hover:bg-red-50 dark:hover:bg-red-900/20">
          <FileText className="h-4 w-4 mr-2 text-red-500" />📄 Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("fountain")}
          className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <File className="h-4 w-4 mr-2 text-blue-500" />⛲ Export as Fountain
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("finaldraft")}
          className="hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <Printer className="h-4 w-4 mr-2 text-green-500" />🎬 Export to Final Draft
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("txt")} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
          <FileDown className="h-4 w-4 mr-2 text-gray-500" />📝 Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("docx")}
          className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <FileText className="h-4 w-4 mr-2 text-purple-500" />📋 Export as Word
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
