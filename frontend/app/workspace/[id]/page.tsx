"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // ✅ Import hook
import { WorkspaceLayout } from "@/components/workspace/workspace-layout";
import { ScriptEditor } from "@/components/workspace/script-editor";
import { AIPreview } from "@/components/workspace/ai-preview";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { CompareView } from "@/components/workspace/compare-view";

export default function WorkspacePage() {
  const [compareMode, setCompareMode] = useState(false);
  const params = useParams(); // ✅ Get params from router
  const scriptId = params.id as string; // ✅ Ensure it's a string

  return (
    <WorkspaceLayout>
      <WorkspaceHeader
        scriptId={scriptId}
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
  );
}
