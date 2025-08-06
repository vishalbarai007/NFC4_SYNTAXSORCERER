"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useSettings } from "@/contexts/settings-context"
import { toast } from "sonner"

export default function SettingsPage() {
  const settings = useSettings()

  const handleSave = () => {
    toast.success("⚙️ Settings saved successfully!")
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("🗑️ Account deletion is not implemented in this demo")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <Navigation />

      <div className="container py-6 md:py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">⚙️ Settings</h1>
            <p className="text-lg md:text-xl text-muted-foreground">Customize your ScriptCraft experience ✨</p>
          </div>

          <div className="space-y-6">
            {/* AI Preferences */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">🤖 AI Preferences</CardTitle>
                <CardDescription>Configure how AI assists with your writing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <Label>✨ Auto-suggestions</Label>
                    <p className="text-sm text-muted-foreground">Automatically show AI suggestions while writing</p>
                  </div>
                  <Switch
                    checked={settings.autoSuggestions}
                    onCheckedChange={(checked) => settings.updateSettings({ autoSuggestions: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>🎯 Suggestion Frequency: {settings.suggestionFrequency}%</Label>
                  <Slider
                    value={[settings.suggestionFrequency]}
                    onValueChange={(value) => settings.updateSettings({ suggestionFrequency: value[0] })}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Higher values = more frequent suggestions</p>
                </div>

                <div className="space-y-2">
                  <Label>🎭 Preferred Writing Style</Label>
                  <Select
                    value={settings.writingStyle}
                    onValueChange={(value: "conservative" | "balanced" | "creative") =>
                      settings.updateSettings({ writingStyle: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">🛡️ Conservative (fewer changes)</SelectItem>
                      <SelectItem value="balanced">⚖️ Balanced (recommended)</SelectItem>
                      <SelectItem value="creative">🎨 Creative (more suggestions)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Editor Preferences */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">📝 Editor Preferences</CardTitle>
                <CardDescription>Customize your writing environment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>🔤 Font Size</Label>
                  <Select
                    value={settings.fontSize}
                    onValueChange={(value: "small" | "medium" | "large" | "xlarge") =>
                      settings.updateSettings({ fontSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (12px)</SelectItem>
                      <SelectItem value="medium">Medium (14px)</SelectItem>
                      <SelectItem value="large">Large (16px)</SelectItem>
                      <SelectItem value="xlarge">Extra Large (18px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <Label>💾 Auto-save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save changes every 30 seconds</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => settings.updateSettings({ autoSave: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <Label>📏 Show line numbers</Label>
                    <p className="text-sm text-muted-foreground">Display line numbers in the editor</p>
                  </div>
                  <Switch
                    checked={settings.showLineNumbers}
                    onCheckedChange={(checked) => settings.updateSettings({ showLineNumbers: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Export Settings */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">📤 Export Settings</CardTitle>
                <CardDescription>Default export preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>📄 Default Export Format</Label>
                  <Select
                    value={settings.defaultExportFormat}
                    onValueChange={(value: "pdf" | "fountain" | "finaldraft" | "docx") =>
                      settings.updateSettings({ defaultExportFormat: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">📄 PDF</SelectItem>
                      <SelectItem value="fountain">⛲ Fountain</SelectItem>
                      <SelectItem value="finaldraft">🎬 Final Draft</SelectItem>
                      <SelectItem value="docx">📋 Word Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <Label>🔒 Include watermark</Label>
                    <p className="text-sm text-muted-foreground">Add ScriptCraft watermark to exports</p>
                  </div>
                  <Switch
                    checked={settings.includeWatermark}
                    onCheckedChange={(checked) => settings.updateSettings({ includeWatermark: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">🔐 Privacy & Security</CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <Label>📊 Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve ScriptCraft by sharing usage data</p>
                  </div>
                  <Switch
                    checked={settings.analytics}
                    onCheckedChange={(checked) => settings.updateSettings({ analytics: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <Label>📧 Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => settings.updateSettings({ emailNotifications: checked })}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="hover-lift w-full md:w-auto" onClick={handleDeleteAccount}>
                    🗑️ Delete Account
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    This action cannot be undone. All your scripts and data will be permanently deleted.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-center md:justify-end">
              <Button
                onClick={handleSave}
                className="hover-lift bg-gradient-to-r from-primary to-purple-600 w-full md:w-auto"
              >
                💾 Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
