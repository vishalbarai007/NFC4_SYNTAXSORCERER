// Updated Dashboard Header Component
"use client"

import { Button } from "@/components/ui/button"
import { Plus, Upload, BarChart3, MessageSquare, Users, Brain } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function DashboardHeader() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1E3A8A' }}>
            Welcome back, {user ? user.displayName || "User" : "Guest"}! 
          </h1>
          <p className="text-muted-foreground" style={{ color: '#21001f' }}>
            Continue crafting your stories with AI-enhanced insights ✨
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            className="hover-lift text-white" 
            style={{ 
              background: 'linear-gradient(to right, #1E3A8A, #21001f)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, rgba(30, 58, 138, 0.9), rgba(33, 0, 31, 0.9))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #21001f)';
            }}
            asChild
          >
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" /> Upload New Script
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="hover-lift"
            style={{ 
              backgroundColor: 'transparent',
              borderColor: '#1E3A8A',
              color: '#1E3A8A'
            }}
            asChild
          >
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
          className="hover-lift"
          style={{ 
            background: 'linear-gradient(to bottom right, #dbe9f4, rgba(219, 233, 244, 0.8))',
            borderColor: '#1E3A8A',
            color: '#1E3A8A'
          }}
          asChild
        >
          <Link href="/workspace/demo?tab=tone">
            <BarChart3 className="mr-2 h-4 w-4" /> Tone Analysis
          </Link>
        </Button>
        <Button
          variant="outline"
          className="hover-lift"
          style={{ 
            background: 'linear-gradient(to bottom right, #dbe9f4, rgba(219, 233, 244, 0.8))',
            borderColor: '#1E3A8A',
            color: '#1E3A8A'
          }}
          asChild
        >
          <Link href="/workspace/demo?tab=dialogue">
            <MessageSquare className="mr-2 h-4 w-4" /> Dialogue Tools
          </Link>
        </Button>
        <Button
          variant="outline"
          className="hover-lift"
          style={{ 
            background: 'linear-gradient(to bottom right, #dbe9f4, rgba(219, 233, 244, 0.8))',
            borderColor: '#1E3A8A',
            color: '#1E3A8A'
          }}
          asChild
        >
          <Link href="/workspace/demo?tab=characters">
            <Users className="mr-2 h-4 w-4" /> Characters
          </Link>
        </Button>
        <Button
          variant="outline"
          className="hover-lift"
          style={{ 
            background: 'linear-gradient(to bottom right, #dbe9f4, rgba(219, 233, 244, 0.8))',
            borderColor: '#1E3A8A',
            color: '#1E3A8A'
          }}
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