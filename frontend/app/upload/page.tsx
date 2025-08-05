"use client"

import { Navigation } from "@/components/navigation"
import { UploadDropzone } from "@/components/upload-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-12">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Upload Your Script</h1>
            <p className="text-muted-foreground mt-2">Support for PDF, TXT, Fountain, and Final Draft formats</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Script Upload</CardTitle>
              <CardDescription>
                Upload your screenplay for AI-enhanced analysis and improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadDropzone />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
