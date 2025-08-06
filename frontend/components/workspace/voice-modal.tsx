"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Mic } from "lucide-react"
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import VoiceChat to avoid SSR issues
const VoiceChat = dynamic(() => import("../voice-chat/voice-chat"), {
  ssr: false,
  loading: () => <LoadingState />,
})

const LoadingState = () => (
  <div className="flex items-center justify-center h-[600px] w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
    <div className="text-center space-y-6">
      {/* Animated microphone icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
        <div className="relative bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg border border-blue-200 dark:border-blue-800">
          <Mic className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
        </div>
      </div>
      
      {/* Loading text with animation */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Initializing Voice Assistant
        </h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Setting up your voice experience...
        </p>
      </div>
    </div>
  </div>
)

interface VoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceModal({ isOpen, onClose }: VoiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[640px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-0 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Voice Assistant</DialogTitle>
        </DialogHeader>

        {/* Header with close button and title */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Voice Assistant</h2>
                <p className="text-sm text-blue-100">Speak naturally to interact</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Decorative wave pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-60"></div>
        </div>

        {/* Main content area */}
        <div className="relative bg-white dark:bg-slate-900">
          <Suspense fallback={<LoadingState />}>
            <div className="min-h-[500px]">
              <VoiceChat />
            </div>
          </Suspense>
        </div>

        {/* Footer with subtle branding or status */}
        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Voice Assistant Active</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Ready to listen</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}