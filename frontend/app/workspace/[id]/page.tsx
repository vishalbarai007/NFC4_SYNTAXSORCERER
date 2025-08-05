"use client"

import { useState } from "react"
import { WorkspaceLayout } from "@/components/workspace/workspace-layout"
import { ScriptEditor } from "@/components/workspace/script-editor"
import { AIPreview } from "@/components/workspace/ai-preview"
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar"
import { WorkspaceHeader } from "@/components/workspace/workspace-header"
import { CompareView } from "@/components/workspace/compare-view"

export default function WorkspacePage({ params }: { params: { id: string } }) {
  const [compareMode, setCompareMode] = useState(false)

  return (
    <WorkspaceLayout>
      <WorkspaceHeader
        scriptId={params.id}
        onCompareToggle={() => setCompareMode(!compareMode)}
        compareMode={compareMode}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block">
          <WorkspaceSidebar />
        </div>
        {compareMode ? (
          <CompareView />
        ) : (
          <div className="flex flex-1 flex-col lg:flex-row">
            <div className="flex-1 border-b lg:border-b-0 lg:border-r">
              <ScriptEditor />
            </div>
            <div className="flex-1">
              <AIPreview />
            </div>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  )
}
