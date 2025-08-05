"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useScripts } from "@/contexts/scripts-context"
import { toast } from "sonner"

export function UploadDropzone() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const router = useRouter()
  const { addScript } = useScripts()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setProgress(0)
      setUploadStatus("idle")

      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Extract filename without extension for title
        const title = file.name.replace(/\.[^/.]+$/, "")

        // Determine script type based on file extension or content
        const extension = file.name.split(".").pop()?.toLowerCase()
        let type = "Screenplay"

        if (extension === "pdf") type = "PDF Script"
        else if (extension === "fountain") type = "Fountain Script"
        else if (extension === "fdx") type = "Final Draft"
        else if (extension === "docx") type = "Word Document"

        // Add script to context
        addScript({
          title,
          type,
          status: "Analyzing",
          improvement: "+0%",
        })

        setProgress(100)
        setUploadStatus("success")

        toast.success(`📄 "${title}" uploaded successfully!`)

        // Redirect to dashboard after successful upload
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } catch (error) {
        setUploadStatus("error")
        toast.error("❌ Upload failed. Please try again.")
      } finally {
        setUploading(false)
        clearInterval(interval)
      }
    },
    [router, addScript],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/fountain": [".fountain"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 md:p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${uploading ? "cursor-not-allowed opacity-50" : "hover:border-primary hover:bg-primary/5"}
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {uploadStatus === "success" ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : uploadStatus === "error" ? (
              <AlertCircle className="h-6 w-6 text-red-500" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>

          {uploading ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploading and analyzing...</p>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground">{progress}% complete</p>
            </div>
          ) : uploadStatus === "success" ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600">Upload successful!</p>
              <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          ) : uploadStatus === "error" ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600">Upload failed</p>
              <p className="text-xs text-muted-foreground">Please try again</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragActive ? "Drop your script here" : "Drag & drop your script here"}
              </p>
              <p className="text-xs text-muted-foreground">Supports PDF, TXT, Fountain, and DOCX files</p>
            </div>
          )}
        </div>
      </div>

      {!uploading && uploadStatus !== "success" && (
        <div className="text-center">
          <Button variant="outline" onClick={() => document.querySelector("input")?.click()}>
            <FileText className="mr-2 h-4 w-4" />
            Choose File
          </Button>
        </div>
      )}
    </div>
  )
}
