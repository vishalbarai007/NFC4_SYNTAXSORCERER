"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, AlertCircle } from "lucide-react"

const feedback = [
  {
    id: "1",
    script: "The Last Stand",
    type: "positive",
    message: "Excellent character development in Act II. The dialogue feels natural and engaging.",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    script: "Coffee Shop Chronicles",
    type: "suggestion",
    message: "Consider adding more subtext to the conversation between Sarah and Mike in Scene 12.",
    timestamp: "1 day ago",
  },
  {
    id: "3",
    script: "Midnight Conversations",
    type: "warning",
    message: "Potential pacing issue detected in the third act. Consider tightening the resolution.",
    timestamp: "3 days ago",
  },
]

export function RecentFeedback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent AI Feedback
        </CardTitle>
        <CardDescription>Latest insights and suggestions from your script analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="flex gap-3 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                {item.type === "positive" && <ThumbsUp className="h-5 w-5 text-green-500" />}
                {item.type === "suggestion" && <MessageSquare className="h-5 w-5 text-blue-500" />}
                {item.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.script}</Badge>
                  <span className="text-sm text-muted-foreground">{item.timestamp}</span>
                </div>
                <p className="text-sm">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
