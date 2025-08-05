"use client"

import { Navigation } from "@/components/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ScriptHistory } from "@/components/dashboard/script-history"
import { ProgressMetrics } from "@/components/dashboard/progress-metrics"
import { RecentFeedback } from "@/components/dashboard/recent-feedback"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <Navigation />
      <div className="container py-4 md:py-8 px-4">
        <DashboardHeader />
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3 mt-6 md:mt-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <ScriptHistory />
          </div>
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            <ProgressMetrics />
            <QuickActions />
          </div>
        </div>
        <div className="mt-6 md:mt-8">
          <RecentFeedback />
        </div>
      </div>
    </div>
  )
}
