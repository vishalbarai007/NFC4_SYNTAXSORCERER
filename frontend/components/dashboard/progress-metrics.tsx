"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Target, Award } from "lucide-react"

export function ProgressMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Writing Progress
        </CardTitle>
        <CardDescription>Your improvement metrics this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Scripts Analyzed
            </span>
            <span className="font-medium">12/15</span>
          </div>
          <Progress value={80} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Quality Score
            </span>
            <span className="font-medium">8.4/10</span>
          </div>
          <Progress value={84} className="h-2" />
        </div>

        <div className="pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">+18%</div>
            <div className="text-sm text-muted-foreground">Overall Improvement</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
