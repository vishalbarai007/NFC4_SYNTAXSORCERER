"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useScripts, useScript } from "@/contexts/scripts-context";
import { WorkspaceLayout } from "@/components/workspace/workspace-layout";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { ScriptEditor } from "@/components/workspace/script-editor";
import { AIPreview } from "@/components/workspace/ai-preview";
import { CompareView } from "@/components/workspace/compare-view";
import { toast } from "sonner";
import { Loader2, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WorkspacePage() {
  const [compareMode, setCompareMode] = useState(false);
  const [scriptContent, setScriptContent] = useState<string>("");
  const [originalContent, setOriginalContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [scenes, setScenes] = useState<string[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { scripts, loading: scriptsLoading, getScriptText } = useScripts();
  
  const scriptId = params.id as string;
  const script = useScript(scriptId);

  useEffect(() => {
    const fetchScriptContent = async () => {
      if (authLoading || scriptsLoading) return;

      if (!user) {
        setError("Please log in to view scripts");
        setLoading(false);
        return;
      }

      if (!scriptId) {
        setError("No script ID provided");
        setLoading(false);
        return;
      }

      if (!script) {
        setError("Script not found");
        setLoading(false);
        return;
      }

      if (!script.hasTextExtraction) {
        setError("Script text has not been extracted yet. Please wait for processing to complete.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const content = await getScriptText(scriptId);
        if (!content) throw new Error("No content received from server");

        setScriptContent(content);
        setOriginalContent(content);
        setHasUnsavedChanges(false);

        // Fetch sidebar data after content is set
        await fetchSidebarData(content);

      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load script content";
        console.error("Error fetching script content:", err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchScriptContent();
  }, [user, script, scriptId, authLoading, scriptsLoading, getScriptText]);

  // ✅ Fetch scenes and characters from API
  const fetchSidebarData = async (content: string) => {
    try {
      setSidebarLoading(true);
      const response = await fetch("http://localhost:8000/charnscenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: content }), 

      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      setScenes(data.scenes || []);
      setCharacters(data.characters || []);
      console.log("Sidebar data fetched:", data);

    } catch (err) {
      console.error("Error fetching scenes and characters:", err);
      toast.error("Failed to load sidebar data");
    } finally {
      setSidebarLoading(false);
    }
  };

  const handleContentChange = (newContent: string) => {
    setScriptContent(newContent);
    setHasUnsavedChanges(newContent !== originalContent);
  };

  const handleSave = async () => {
    try {
      toast.success("Script saved successfully");
      setOriginalContent(scriptContent);
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error("Failed to save script");
    }
  };

  if (loading || authLoading || scriptsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading workspace...</p>
            <p className="text-sm text-muted-foreground">
              {authLoading ? "Authenticating..." : 
               scriptsLoading ? "Loading scripts..." : 
               "Loading script content..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Unable to Load Script</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            {scriptId && (
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Script Not Found</h2>
            <p className="text-sm text-muted-foreground">
              The script you're looking for doesn't exist or has been deleted.
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button asChild>
              <Link href="/dashboard">View All Scripts</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceLayout>
      <WorkspaceHeader
        scriptId={script.scriptId}
        scriptTitle={script.title}
        originalName={script.originalName}
        fileType={script.type}
        uploadedAt={script.uploadedAt}
        onCompareToggle={() => setCompareMode(!compareMode)}
        compareMode={compareMode}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block">
          <WorkspaceSidebar 
            scriptId={script.scriptId}
            scriptTitle={script.title}
            scriptContent={scriptContent}
            scenes={scenes}
            characters={characters}
            loading={sidebarLoading}
          />
        </div>
        {compareMode ? (
          <CompareView 
            originalContent={originalContent} 
            modifiedContent={scriptContent}
            scriptTitle={script.title}
            onAcceptChanges={() => {
              setOriginalContent(scriptContent);
              setHasUnsavedChanges(false);
              setCompareMode(false);
              toast.success("Changes accepted");
            }}
            onRejectChanges={() => {
              setScriptContent(originalContent);
              setHasUnsavedChanges(false);
              setCompareMode(false);
              toast.success("Changes reverted");
            }}
          />
        ) : (
          <div className="flex flex-1 flex-col lg:flex-row">
            <div className="flex-1 border-b lg:border-b-0 lg:border-r">
              <ScriptEditor 
                content={scriptContent} 
                onContentChange={handleContentChange}
                scriptId={script.scriptId}
                scriptTitle={script.title}
                readonly={script.status === "Analyzing"}
              />
            </div>
            <div className="flex-1">
              <AIPreview 
                scriptContent={scriptContent}
                scriptId={script.scriptId}
                scriptTitle={script.title}
                originalContent={originalContent}
              />
            </div>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}
