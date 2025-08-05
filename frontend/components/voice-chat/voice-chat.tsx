"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, User, Bot, Activity, Volume2 } from "lucide-react"

const VoiceChat = () => {
  const [conversation, setConversation] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [isBotSpeaking, setIsBotSpeaking] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunks = useRef([])

  const startRecording = async () => {
    try {
      // Check if we're in the browser and have the necessary APIs
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
          // Stop all tracks to release the microphone
          stream.getTracks().forEach((track) => track.stop())

          // Simulate API call with mock data
          setTimeout(() => {
            const mockUserText = "I want to write a romantic scene"
            const mockBotResponse =
              "Great! I'll help you create a romantic dialogue. Let me suggest some emotional beats and character interactions that will make your scene more compelling."

            setConversation((prev) => [
              ...prev,
              { type: "user", text: mockUserText },
              { type: "bot", text: mockBotResponse },
            ])

            // Simulate bot speaking animation
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
      if (error.name === "NotAllowedError") {
        alert("Please allow microphone access to use voice features")
      } else if (error.name === "NotFoundError") {
        alert("No microphone found. Please connect a microphone and try again.")
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

  // Random gentle movement for bot when idle
  const [botPosition, setBotPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    try {
      intervalId = setInterval(() => {
        if (!isBotSpeaking) {
          setBotPosition({
            x: Math.sin(Date.now() / 1000) * 5,
            y: Math.cos(Date.now() / 1500) * 3,
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
    <div className="voice-chat-container">
      <div className="voice-chat-component">
        <div className="chat-section">
          <header className="header">
            <h1 className="app-title">
              <span className="title-icon">🎙</span>
              <span className="title-text">ScriptCraft Voice</span>
            </h1>
          </header>

          {/* Conversation */}
          <div className="conversation-container">
            {conversation.length === 0 ? (
              <div className="empty-chat">
                <div className="empty-icon">💬</div>
                <p className="empty-text">Your conversation will appear here</p>
                <p className="empty-subtext">Press the microphone button to start</p>
              </div>
            ) : (
              <div className="message-list">
                {conversation.map((entry, idx) => (
                  <div key={idx} className="message-item">
                    {entry.type === "bot" ? (
                      <div className="avatar bot-avatar">
                        <Bot size={20} className="avatar-icon" />
                      </div>
                    ) : (
                      <div className="avatar user-avatar">
                        <User size={20} className="avatar-icon" />
                      </div>
                    )}

                    <div className={`message-bubble ${entry.type === "user" ? "user-message" : "bot-message"}`}>
                      {entry.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recording button */}
          <div className="input-container">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`record-button ${isRecording ? "record-active" : "record-idle"}`}
              type="button"
            >
              {isRecording ? <Square size={24} color="white" /> : <Mic size={24} color="#1a1a1a" />}
            </button>

            {isRecording && (
              <div className="record-status">
                <div className="status-pill">Recording... Speak now</div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Animated Bot */}
        <div className="bot-section">
          <div
            className="bot-container"
            style={{
              transform: `translate(${botPosition.x}px, ${botPosition.y}px)`,
            }}
          >
            {/* Main bot body */}
            <div className="bot-body">
              <div className="bot-inner">
                {/* Bot face */}
                <div className="bot-face">
                  {/* Eyes */}
                  <div className="bot-eye left-eye">
                    <div
                      className="eye-pupil"
                      style={{
                        transform: isBotSpeaking
                          ? `translate(${Math.sin(Date.now() / 200) * 1}px, ${Math.cos(Date.now() / 300) * 1}px)`
                          : "translate(0, 0)",
                      }}
                    ></div>
                  </div>
                  <div className="bot-eye right-eye">
                    <div
                      className="eye-pupil"
                      style={{
                        transform: isBotSpeaking
                          ? `translate(${Math.sin((Date.now() + 300) / 200) * 1}px, ${Math.cos((Date.now() + 300) / 300) * 1}px)`
                          : "translate(0, 0)",
                      }}
                    ></div>
                  </div>

                  {/* Mouth */}
                  <div className="bot-mouth">
                    {isBotSpeaking ? (
                      <div className="mouth-speaking">
                        <div className="mouth-wave">
                          <div
                            className="wave-animation"
                            style={{
                              top: `${Math.sin(Date.now() / 100) * 2 + 2}px`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="mouth-idle"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sound waves when speaking */}
            {isBotSpeaking && (
              <div className="sound-waves">
                <div className="wave-outer"></div>
                <div className="wave-inner"></div>
              </div>
            )}

            {/* Status indicators */}
            <div className="status-indicators">
              {isRecording && (
                <div className="status-indicator">
                  <Activity size={16} className="status-icon-recording" />
                  <span className="status-text">Listening</span>
                </div>
              )}

              {isBotSpeaking && (
                <div className="status-indicator">
                  <Volume2 size={16} className="status-icon-speaking" />
                  <span className="status-text">Speaking</span>
                </div>
              )}
            </div>
          </div>

          {/* Bot name */}
          <div className="bot-info">
            <h2 className="bot-name">ScriptBot</h2>
            <p className="bot-description">Your Writing Assistant</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceChat
