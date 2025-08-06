"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context"; // ✅ Ensure you have an Auth context to get user info
import { toast } from "sonner";

interface Script {
  id: string;
  scriptId: string; // ✅ Added scriptId from backend
  title: string;
  filename: string;
  originalName: string; // ✅ Added original filename
  type: string;
  lastModified: string;
  uploadedAt: string; // ✅ Added ISO timestamp
  status: "In Progress" | "Completed" | "Analyzing" | "Uploaded";
  improvement: string;
  content?: string;
  fileUrl?: string;
  textUrl?: string; // ✅ Added text file URL
  size: number; // ✅ Added file size
  hasTextExtraction: boolean; // ✅ Added text extraction status
  extractedLength?: number; // ✅ Added extracted text length
}

interface ScriptsContextType {
  scripts: Script[];
  loading: boolean; // ✅ Added loading state
  addScript: (script: Omit<Script, "id" | "lastModified" | "scriptId">) => void;
  updateScript: (id: string, updates: Partial<Script>) => void;
  deleteScript: (scriptId: string) => Promise<boolean>; // ✅ Now async and uses scriptId
  refreshScripts: () => Promise<void>;
  getScriptText: (scriptId: string) => Promise<string | null>; // ✅ Added function to get extracted text
}

const ScriptsContext = createContext<ScriptsContextType | undefined>(undefined);

export function ScriptsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // ✅ Get logged-in user
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch scripts from local backend when user logs in
  const fetchScripts = async () => {
    if (!user) {
      setScripts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/files/${user.uid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch scripts: ${response.status}`);
      }

      const json_res = await response.json();
      
      if (!json_res.success) {
        throw new Error(json_res.message || "Failed to fetch scripts");
      }

      const data = json_res.files;

      if (!Array.isArray(data)) {
        setScripts([]); // ✅ Safe fallback
        return;
      }

      const formattedScripts: Script[] = data.map((file: any) => ({
        id: file.scriptId, // ✅ Use scriptId as the primary ID
        scriptId: file.scriptId,
        title: removeFileExtension(file.originalName),
        filename: file.fileName,
        originalName: file.originalName,
        type: getScriptType(file.originalName),
        lastModified: formatDate(file.uploadedAt),
        uploadedAt: file.uploadedAt,
        status: file.hasTextExtraction ? "Uploaded" : "Analyzing",
        improvement: "+0%",
        fileUrl: file.filePath,
        textUrl: file.textFilePath,
        size: file.size,
        hasTextExtraction: file.hasTextExtraction,
        extractedLength: file.extractedLength
      }));

      setScripts(formattedScripts);
    } catch (error) {
      console.error("Error fetching scripts:", error);
      toast.error("Failed to load scripts");
      setScripts([]); // ✅ Clear scripts on error
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get extracted text content for a script
  const getScriptText = async (scriptId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const response = await fetch(`http://localhost:5000/text/${user.uid}/${scriptId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Text not found for this script");
        } else if (response.status === 403) {
          toast.error("Unauthorized access");
        } else {
          toast.error("Failed to load script text");
        }
        return null;
      }

      const json_res = await response.json();
      
      if (!json_res.success) {
        toast.error(json_res.message || "Failed to load script text");
        return null;
      }

      return json_res.content;
    } catch (error) {
      console.error("Error fetching script text:", error);
      toast.error("Failed to load script text");
      return null;
    }
  };

  // ✅ Delete script using scriptId
  const deleteScript = async (scriptId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await fetch(`http://localhost:5000/files/${user.uid}/${scriptId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Script not found");
        } else if (response.status === 403) {
          toast.error("Unauthorized to delete this script");
        } else {
          toast.error("Failed to delete script");
        }
        return false;
      }

      const json_res = await response.json();
      
      if (!json_res.success) {
        toast.error(json_res.message || "Failed to delete script");
        return false;
      }

      // ✅ Remove from local state
      setScripts((prev) => prev.filter((script) => script.scriptId !== scriptId));
      toast.success("Script deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting script:", error);
      toast.error("Failed to delete script");
      return false;
    }
  };

  // ✅ Helper to remove file extension from filename
  const removeFileExtension = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  };

  // ✅ Helper to determine script type based on extension
  const getScriptType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "PDF Script";
      case "fountain":
        return "Fountain Script";
      case "fdx":
        return "Final Draft";
      case "docx":
        return "Word Document";
      case "txt":
        return "Text File";
      default:
        return "Unknown";
    }
  };

  // ✅ Helper to format date for display
  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 5) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      if (diffInDays < 7) return `${diffInDays} days ago`;
      
      return date.toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  // ✅ Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (user) {
      fetchScripts();
    } else {
      setScripts([]); // Clear scripts when user logs out
      setLoading(false);
    }
  }, [user]);

  // ✅ Local operations (for optimistic updates or offline functionality)
  const addScript = (script: Omit<Script, "id" | "lastModified" | "scriptId">) => {
    const newScript: Script = {
      ...script,
      id: Date.now().toString(), // Temporary ID until backend provides scriptId
      scriptId: Date.now().toString(), // Will be replaced when uploaded
      lastModified: "Just now"
    };
    setScripts((prev) => [newScript, ...prev]);
  };

  const updateScript = (id: string, updates: Partial<Script>) => {
    setScripts((prev) =>
      prev.map((script) => 
        script.id === id || script.scriptId === id 
          ? { ...script, ...updates, lastModified: "Just now" } 
          : script
      )
    );
  };

  // ✅ Add helper function to get script by scriptId
  const getScriptByScriptId = (scriptId: string): Script | undefined => {
    return scripts.find(script => script.scriptId === scriptId);
  };

  return (
    <ScriptsContext.Provider 
      value={{ 
        scripts, 
        loading,
        addScript, 
        updateScript, 
        deleteScript, 
        refreshScripts: fetchScripts,
        getScriptText
      }}
    >
      {children}
    </ScriptsContext.Provider>
  );
}

export function useScripts() {
  const context = useContext(ScriptsContext);
  if (context === undefined) {
    throw new Error("useScripts must be used within a ScriptsProvider");
  }
  return context;
}

// ✅ Additional hooks for convenience
export function useScript(scriptId: string) {
  const { scripts } = useScripts();
  return scripts.find(script => script.scriptId === scriptId);
}

export function useScriptText(scriptId: string) {
  const { getScriptText } = useScripts();
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadText = async () => {
    if (!scriptId) return;
    
    setLoading(true);
    try {
      const content = await getScriptText(scriptId);
      setText(content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadText();
  }, [scriptId]);

  return { text, loading, refetch: loadText };
}
