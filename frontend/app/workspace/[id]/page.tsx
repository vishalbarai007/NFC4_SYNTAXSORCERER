"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useScripts, useScript, useScriptText } from "@/contexts/scripts-context";
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

  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { scripts, loading: scriptsLoading, getScriptText } = useScripts();
  
  const scriptId = params.id as string;
  
  // ✅ Find script by scriptId instead of id
  const script = useScript(scriptId);
  
  // ✅ Alternative: Use the custom hook for script text
  // const { text: scriptText, loading: textLoading } = useScriptText(scriptId);

  console.log("Current script:", script);
  console.log("Script ID from params:", scriptId);

  useEffect(() => {
    const fetchScriptContent = async () => {
      // ✅ Wait for auth and scripts to load
      if (authLoading || scriptsLoading) {
        return;
      }

      // ✅ Check if user is authenticated
      if (!user) {
        setError("Please log in to view scripts");
        setLoading(false);
        return;
      }

      // ✅ Check if scriptId is provided
      if (!scriptId) {
        setError("No script ID provided");
        setLoading(false);
        return;
      }

      // ✅ Check if script exists
      if (!script) {
        setError("Script not found");
        setLoading(false);
        return;
      }

      // ✅ Check if script has text extraction
      if (!script.hasTextExtraction) {
        setError("Script text has not been extracted yet. Please wait for processing to complete.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching text for script ID: ${scriptId}`);
        
        // ✅ Use the context method to get script text
        const content = await getScriptText(scriptId);
        
        if (!content) {
          throw new Error("No content received from server");
        }

        setScriptContent(content);
        setOriginalContent(content);
        setHasUnsavedChanges(false);

        console.log(`✅ Successfully loaded script content (${content.length} characters)`);
        
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

  // ✅ Handle content changes
  const handleContentChange = (newContent: string) => {
    setScriptContent(newContent);
    setHasUnsavedChanges(newContent !== originalContent);
  };

  // ✅ Save script changes (you might want to implement this)
  const handleSave = async () => {
    try {
      // Implement save functionality here
      // This would typically save to your backend
      toast.success("Script saved successfully");
      setOriginalContent(scriptContent);
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error("Failed to save script");
    }
  };

  // ✅ Loading state
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

  // ✅ Error state with better UX
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

  // ✅ Script not found state
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
        scriptId={script.scriptId} // ✅ Use scriptId
        scriptTitle={script.title}
        originalName={script.originalName} // ✅ Pass original name
        fileType={script.type} // ✅ Pass file type
        uploadedAt={script.uploadedAt} // ✅ Pass upload date
        onCompareToggle={() => setCompareMode(!compareMode)}
        compareMode={compareMode}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave} // ✅ Pass save handler
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block">
          <WorkspaceSidebar 
            scriptId={script.scriptId}
            scriptTitle={script.title}
            scriptContent={scriptContent}
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
                readonly={script.status === "Analyzing"} // ✅ Make readonly if analyzing
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
