"use client"

import { Button } from "@/components/ui/button"
import { Plus, Upload, BarChart3, MessageSquare, Users, Brain } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Writer! 👋</h1>
          <p className="text-muted-foreground">Continue crafting your stories with AI-enhanced insights ✨</p>
        </div>

        <div className="flex gap-2">
          <Button className="hover-lift bg-gradient-to-r from-primary to-purple-600" asChild>
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" /> Upload New Script
            </Link>
          </Button>
          <Button variant="outline" className="hover-lift bg-transparent" asChild>
            <Link href="/workspace/new">
              <Plus className="mr-2 h-4 w-4" />
              ✍️ Start Writing
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid gap-4 md:grid-cols-4">
        <Button
          variant="outline"
          className="hover-lift bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200"
          asChild
        >
          <Link href="/workspace/demo?tab=tone">
            <BarChart3 className="mr-2 h-4 w-4" /> Tone Analysis
          </Link>
        </Button>
        <Button
          variant="outline"
          className="hover-lift bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200"
          asChild
        >
          <Link href="/workspace/demo?tab=dialogue">
            <MessageSquare className="mr-2 h-4 w-4" /> Dialogue Tools
          </Link>
        </Button>
        <Button
          variant="outline"
          className="hover-lift bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200"
          asChild
        >
          <Link href="/workspace/demo?tab=characters">
            <Users className="mr-2 h-4 w-4" /> Characters
          </Link>
        </Button>
        <Button
          variant="outline"
          className="hover-lift bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200"
          asChild
        >
          <Link href="/workspace/demo?tab=ai">
            <Brain className="mr-2 h-4 w-4" /> AI Insights
          </Link>
        </Button>
      </div>
    </div>
  )
}
