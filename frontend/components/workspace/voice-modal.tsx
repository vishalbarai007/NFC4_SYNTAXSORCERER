"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import VoiceChat to avoid SSR issues
const VoiceChat = dynamic(() => import("../voice-chat/voice-chat"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] w-[500px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Voice Assistant...</p>
      </div>
    </div>
  ),
})

interface VoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceModal({ isOpen, onClose }: VoiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[520px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Voice Assistant</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10 hover:bg-white/20"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>

          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[500px] w-[500px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading Voice Assistant...</p>
                </div>
              </div>
            }
          >
            <VoiceChat />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  )
}
