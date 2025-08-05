"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, BookOpen, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle>⚡ Quick Actions</CardTitle>
        <CardDescription>Common tasks and helpful resources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start hover-lift bg-transparent" asChild>
          <Link href="/upload">
            <Upload className="mr-2 h-4 w-4" />📄 Upload New Script
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start hover-lift bg-transparent" asChild>
          <Link href="/templates">
            <BookOpen className="mr-2 h-4 w-4" />📋 Browse Templates
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start hover-lift bg-transparent" asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            ⚙️ Settings
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start hover-lift bg-transparent" asChild>
          <Link href="/help">
            <HelpCircle className="mr-2 h-4 w-4" />❓ Help & Tutorials
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
