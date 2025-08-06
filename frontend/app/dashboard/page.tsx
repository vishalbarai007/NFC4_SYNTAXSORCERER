"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ScriptHistory } from "@/components/dashboard/script-history";
import { ProgressMetrics } from "@/components/dashboard/progress-metrics";
import { RecentFeedback } from "@/components/dashboard/recent-feedback";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Navigation2 } from "@/components/navigation2";

export default function DashboardPage() {
  return (
    <div
      className="min-h-screen dark:br-[#21001f]"
      style={{
        // background: `linear-gradient(to bottom right, rgba(30, 58, 138, 0.1), rgba(33, 0, 31, 0.1))`
        background: `linear-gradient(
  to bottom right,
  rgba(59, 88, 163, 0.2),   /* lighter indigo */
  rgba(70, 20, 60, 0.2)   /* soft indigo-violet with more visibility */
)`

      }}
    >
      <Navigation2 />
      <div className="container py-4 md:py-8 px-4">
        <DashboardHeader />
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3 mt-6 md:mt-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <ScriptHistory />
          </div>
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            {/* <ProgressMetrics /> */}
            <QuickActions />
          </div>
        </div>
        <div className="mt-6 md:mt-8">
          <RecentFeedback />
        </div>
      </div>
    </div>
  );
}