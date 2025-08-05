"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Script {
  id: string
  title: string
  type: string
  lastModified: string
  status: "In Progress" | "Completed" | "Analyzing"
  improvement: string
  content?: string
}

interface ScriptsContextType {
  scripts: Script[]
  addScript: (script: Omit<Script, "id" | "lastModified">) => void
  updateScript: (id: string, updates: Partial<Script>) => void
  deleteScript: (id: string) => void
}

const defaultScripts: Script[] = [
  {
    id: "1",
    title: "The Last Stand",
    type: "Feature Film",
    lastModified: "2 hours ago",
    status: "In Progress",
    improvement: "+15%",
  },
  {
    id: "2",
    title: "Coffee Shop Chronicles",
    type: "Short Film",
    lastModified: "1 day ago",
    status: "Completed",
    improvement: "+23%",
  },
  {
    id: "3",
    title: "Midnight Conversations",
    type: "Drama",
    lastModified: "3 days ago",
    status: "Analyzing",
    improvement: "+8%",
  },
]

const ScriptsContext = createContext<ScriptsContextType | undefined>(undefined)

export function ScriptsProvider({ children }: { children: ReactNode }) {
  const [scripts, setScripts] = useState<Script[]>(defaultScripts)

  // Load scripts from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScripts = localStorage.getItem("scriptcraft-scripts")
      if (savedScripts) {
        try {
          const parsed = JSON.parse(savedScripts)
          setScripts(parsed)
        } catch (error) {
          console.warn("Failed to parse saved scripts:", error)
          setScripts(defaultScripts)
        }
      }
    }
  }, [])

  // Save scripts to localStorage whenever scripts change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("scriptcraft-scripts", JSON.stringify(scripts))
    }
  }, [scripts])

  const addScript = (script: Omit<Script, "id" | "lastModified">) => {
    const newScript: Script = {
      ...script,
      id: Date.now().toString(),
      lastModified: "Just now",
    }
    setScripts((prev) => [newScript, ...prev])
  }

  const updateScript = (id: string, updates: Partial<Script>) => {
    setScripts((prev) =>
      prev.map((script) => (script.id === id ? { ...script, ...updates, lastModified: "Just now" } : script)),
    )
  }

  const deleteScript = (id: string) => {
    setScripts((prev) => prev.filter((script) => script.id !== id))
  }

  return (
    <ScriptsContext.Provider value={{ scripts, addScript, updateScript, deleteScript }}>
      {children}
    </ScriptsContext.Provider>
  )
}

export function useScripts() {
  const context = useContext(ScriptsContext)
  if (context === undefined) {
    throw new Error("useScripts must be used within a ScriptsProvider")
  }
  return context
}
