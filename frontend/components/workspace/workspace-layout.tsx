"use client"

import type { ReactNode } from "react"

interface WorkspaceLayoutProps {
  children: ReactNode
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <style jsx global>{`
        .workspace-container {
          overflow-y: auto;
          max-height: 100vh;
          position: relative;
        }
        
        .workspace-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .workspace-container::-webkit-scrollbar-track {
          background: hsl(var(--muted));
        }
        
        .workspace-container::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground));
          border-radius: 3px;
        }
        
        .workspace-container::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary));
        }
      `}</style>
      {children}
    </div>
  )
}
