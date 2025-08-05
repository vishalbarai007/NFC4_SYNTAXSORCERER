"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SettingsContextType {
  // Editor settings
  fontSize: "small" | "medium" | "large" | "xlarge"
  showLineNumbers: boolean
  autoSave: boolean

  // AI settings
  autoSuggestions: boolean
  suggestionFrequency: number
  writingStyle: "conservative" | "balanced" | "creative"

  // Export settings
  defaultExportFormat: "pdf" | "fountain" | "finaldraft" | "docx"
  includeWatermark: boolean

  // Privacy settings
  analytics: boolean
  emailNotifications: boolean

  // Update functions
  updateSettings: (settings: Partial<Omit<SettingsContextType, "updateSettings">>) => void
}

const defaultSettings: Omit<SettingsContextType, "updateSettings"> = {
  fontSize: "medium",
  showLineNumbers: false,
  autoSave: true,
  autoSuggestions: true,
  suggestionFrequency: 70,
  writingStyle: "balanced",
  defaultExportFormat: "pdf",
  includeWatermark: false,
  analytics: true,
  emailNotifications: true,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Omit<SettingsContextType, "updateSettings">>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("scriptcraft-settings")
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings({ ...defaultSettings, ...parsed })
        } catch (error) {
          console.warn("Failed to parse saved settings:", error)
        }
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<Omit<SettingsContextType, "updateSettings">>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("scriptcraft-settings", JSON.stringify(updatedSettings))
    }
  }

  return <SettingsContext.Provider value={{ ...settings, updateSettings }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
