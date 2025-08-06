"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, User, Bot, Activity, Volume2, Zap } from "lucide-react"

type ConversationEntry = { type: "user" | "bot"; text: string }

const VoiceChat = () => {
  const [conversation, setConversation] = useState<ConversationEntry[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isBotSpeaking, setIsBotSpeaking] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Voice recording is not supported in this browser")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)

      if (!window.MediaRecorder) {
        alert("MediaRecorder is not supported in this browser")
        return
      }

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          stream.getTracks().forEach((track) => track.stop())

          setTimeout(() => {
            const mockUserText = "I want to write a comedy scene"
            const mockBotResponse =
              "Great! I'll help you create a dialogue. Let me suggest some emotional beats and character interactions that will make your scene more compelling."

            setConversation((prev) => [
              ...prev,
              { type: "user", text: mockUserText },
              { type: "bot", text: mockBotResponse },
            ])

            setIsBotSpeaking(true)
            setTimeout(() => setIsBotSpeaking(false), 3000)
          }, 1000)
        } catch (error) {
          console.warn("Error processing recording:", error)
        }
      }

      mediaRecorderRef.current.onerror = (event) => {
        console.warn("MediaRecorder error:", event)
        setIsRecording(false)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.warn("Couldn't access microphone:", error)
      if (typeof error === "object" && error !== null && "name" in error) {
        const err = error as { name: string }
        if (err.name === "NotAllowedError") {
          alert("Please allow microphone access to use voice features")
        } else if (err.name === "NotFoundError") {
          alert("No microphone found. Please connect a microphone and try again.")
        } else {
          alert("Error accessing microphone. Please check your browser settings.")
        }
      } else {
        alert("Error accessing microphone. Please check your browser settings.")
      }
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    } catch (error) {
      console.warn("Error stopping recording:", error)
      setIsRecording(false)
    }
  }

  const [botPosition, setBotPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    try {
      intervalId = setInterval(() => {
        if (!isBotSpeaking) {
          setBotPosition({
            x: Math.sin(Date.now() / 2000) * 3,
            y: Math.cos(Date.now() / 2500) * 2,
          })
        }
      }, 50)
    } catch (error) {
      console.warn("Animation error:", error)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isBotSpeaking])

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex flex-col">
      {/* Header */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">ScriptCraft Voice</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">AI-powered writing assistant</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Conversation Area */}
        <div className="flex-1 flex flex-col p-6">
          <div className="flex-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            {conversation.length === 0 ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Mic className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Start Your Conversation
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                      Press the microphone to begin speaking
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-xs">
                      Your conversation will appear here
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto p-6 space-y-4">
                {conversation.map((entry, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.type === "bot" 
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500" 
                        : "bg-gradient-to-r from-emerald-500 to-teal-500"
                    }`}>
                      {entry.type === "bot" ? (
                        <Bot className="h-4 w-4 text-white" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 p-4 rounded-xl max-w-md ${
                      entry.type === "user"
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 text-slate-800 dark:text-slate-200"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700"
                    }`}>
                      <p className="text-sm leading-relaxed">{entry.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative w-16 h-16 rounded-full shadow-lg transition-all duration-200 ${
                isRecording
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 scale-105"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:scale-105"
              }`}
              type="button"
            >
              {isRecording ? (
                <>
                  <Square className="h-6 w-6 text-white mx-auto" />
                  <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"></div>
                </>
              ) : (
                <Mic className="h-6 w-6 text-white mx-auto" />
              )}
            </button>

            {isRecording && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-full px-4 py-2">
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Recording... Speak now</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bot Assistant Area */}
        <div className="w-64 p-6 flex flex-col">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 text-center">
            {/* Animated Bot */}
            <div className="relative mb-4">
              <div
                className="relative transition-transform duration-100"
                style={{
                  transform: `translate(${botPosition.x}px, ${botPosition.y}px)`,
                }}
              >
                {/* Bot Avatar */}
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
                  isBotSpeaking
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 scale-110"
                    : "bg-gradient-to-r from-slate-400 to-slate-500"
                }`}>
                  <Bot className="h-10 w-10 text-white" />
                </div>

                {/* Sound waves when speaking */}
                {isBotSpeaking && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-24 h-24 border-2 border-blue-300 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute w-28 h-28 border-2 border-blue-200 rounded-full animate-ping opacity-20 animation-delay-75"></div>
                  </div>
                )}
              </div>

              {/* Status Indicators */}
              <div className="mt-4 space-y-2">
                {isRecording && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-full px-3 py-1">
                    <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 text-xs">
                      <Activity className="h-3 w-3 animate-pulse" />
                      <span>Listening</span>
                    </div>
                  </div>
                )}

                {isBotSpeaking && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1">
                    <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 text-xs">
                      <Volume2 className="h-3 w-3 animate-pulse" />
                      <span>Speaking</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bot Info */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">ScriptBot</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your Writing Assistant</p>
              <div className="text-xs text-slate-500 dark:text-slate-500 space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Ready to help</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceChat