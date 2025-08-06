
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context"; // ✅ Ensure you have an Auth context to get user info
import { toast } from "sonner";

interface Script {
  id: string;
  title: string;
  type: string;
  lastModified: string;
  status: "In Progress" | "Completed" | "Analyzing" | "Uploaded";
  improvement: string;
  content?: string;
  fileUrl?: string;
}

interface ScriptsContextType {
  scripts: Script[];
  addScript: (script: Omit<Script, "id" | "lastModified">) => void;
  updateScript: (id: string, updates: Partial<Script>) => void;
  deleteScript: (id: string) => void;
  refreshScripts: () => Promise<void>; // ✅ Added function to refresh from backend
}

const ScriptsContext = createContext<ScriptsContextType | undefined>(undefined);

export function ScriptsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // ✅ Get logged-in user
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch scripts from local backend when user logs in
  const fetchScripts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/files/${user.uid}`);
      if (!response.ok) throw new Error("Failed to fetch scripts");

      const json_res = await response.json();
      const data = json_res.files;
      if (!Array.isArray(data)) {
        setScripts([]); // ✅ Safe fallback
        return;
      }
      console.log(data);

      const formattedScripts: Script[] = data.map((file: any, index: number) => ({
        id: index.toString(),
        title: file.originalName, // Remove extension
        type: getScriptType(file.fileName),
        lastModified: new Date(file.uploadedAt).toLocaleString(),
        status: "Uploaded",
        improvement: "+0%",
        fileUrl: file.url
      }));

      setScripts(formattedScripts);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load scripts");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper to determine script type based on extension
  const getScriptType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "PDF Script";
    if (ext === "fountain") return "Fountain Script";
    if (ext === "fdx") return "Final Draft";
    if (ext === "docx") return "Word Document";
    return "Unknown";
  };

  useEffect(() => {
    if (user) {
      fetchScripts();
    } else {
      setScripts([]); // Clear scripts when user logs out
    }
  }, [user]);

  // ✅ Local operations (optional if you want to keep them)
  const addScript = (script: Omit<Script, "id" | "lastModified">) => {
    const newScript: Script = {
      ...script,
      id: Date.now().toString(),
      lastModified: "Just now"
    };
    setScripts((prev) => [newScript, ...prev]);
  };

  const updateScript = (id: string, updates: Partial<Script>) => {
    setScripts((prev) =>
      prev.map((script) => (script.id === id ? { ...script, ...updates, lastModified: "Just now" } : script))
    );
  };

  const deleteScript = (id: string) => {
    setScripts((prev) => prev.filter((script) => script.id !== id));
  };

  return (
    <ScriptsContext.Provider value={{ scripts, addScript, updateScript, deleteScript, refreshScripts: fetchScripts }}>
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
