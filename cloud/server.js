import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import path from "path";
import { exec } from "child_process";
import mammoth from "mammoth";
import crypto from "crypto";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Create metadata directory for storing script mappings
const metadataDir = path.join(process.cwd(), "metadata");
if (!fs.existsSync(metadataDir)) {
  fs.mkdirSync(metadataDir);
}

// Multer storage configuration with consistent naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // userId might not be available in multer callback, so we'll rename later
    const timestamp = Date.now();
    const tempName = `temp-${timestamp}-${file.originalname}`;
    cb(null, tempName);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.txt', '.fountain', '.fdx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Helper: Generate unique script ID
function generateScriptId() {
  return crypto.randomUUID();
}

// Helper: Save script metadata
function saveScriptMetadata(scriptId, metadata) {
  const metadataFile = path.join(metadataDir, `${scriptId}.json`);
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
}

// Helper: Load script metadata
function loadScriptMetadata(scriptId) {
  const metadataFile = path.join(metadataDir, `${scriptId}.json`);
  if (!fs.existsSync(metadataFile)) {
    return null;
  }
  try {
    const data = fs.readFileSync(metadataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading metadata:', error);
    return null;
  }
}

// Helper: Get user metadata files
function getUserScripts(userId) {
  if (!fs.existsSync(metadataDir)) {
    return [];
  }
  
  const metadataFiles = fs.readdirSync(metadataDir)
    .filter(file => file.endsWith('.json'));
  
  const userScripts = [];
  
  for (const file of metadataFiles) {
    try {
      const scriptId = path.basename(file, '.json');
      const metadata = loadScriptMetadata(scriptId);
      
      if (metadata && metadata.userId === userId) {
        userScripts.push({
          scriptId,
          ...metadata
        });
      }
    } catch (error) {
      console.error(`Error reading metadata file ${file}:`, error);
    }
  }
  
  return userScripts.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

// Helper: Extract text from PDF using system command (pdftotext)
async function extractTextFromPDF(filePath) {
  return new Promise((resolve, reject) => {
    exec(`pdftotext "${filePath}" -`, (error, stdout, stderr) => {
      if (error) {
        console.error('PDF extraction error:', error);
        // Don't reject, return partial content or empty string
        resolve("Could not extract text from PDF");
      } else {
        resolve(stdout.trim() || "No text content found");
      }
    });
  });
}

// Helper: Extract text from DOCX using mammoth
async function extractTextFromDOCX(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const { value } = await mammoth.extractRawText({ buffer });
    return value.trim() || "No text content found";
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return "Could not extract text from DOCX";
  }
}

// Helper: Extract text based on file type
async function extractTextFromFile(filePath, ext) {
  switch (ext.toLowerCase()) {
    case "pdf":
      return await extractTextFromPDF(filePath);
    case "docx":
      return await extractTextFromDOCX(filePath);
    case "txt":
    case "fountain":
      return fs.readFileSync(filePath, "utf-8").trim() || "No text content found";
    case "fdx":
      // Final Draft files are XML-based, could be parsed but for now treat as text
      return fs.readFileSync(filePath, "utf-8").trim() || "No text content found";
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

// Upload and convert file
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }

    // Generate unique script ID
    const scriptId = generateScriptId();
    
    // Get the temporary filename and create proper filename
    const tempFilePath = req.file.path;
    const timestamp = Date.now();
    const properFileName = `${userId}-${scriptId}-${req.file.originalname}`;
    const properFilePath = path.join(uploadDir, properFileName);
    
    // Rename the temp file to proper name
    fs.renameSync(tempFilePath, properFilePath);
    
    const ext = path.extname(req.file.originalname).toLowerCase().substring(1);

    console.log(`Processing file: ${properFileName}, script ID: ${scriptId}, type: ${ext}`);

    // Extract text content
    const extractedText = await extractTextFromFile(properFilePath, ext);

    // Create text file with script ID
    const textFileName = `${scriptId}.txt`;
    const textFilePath = path.join(uploadDir, textFileName);
    
    fs.writeFileSync(textFilePath, extractedText);

    // Save metadata
    const metadata = {
      userId,
      scriptId,
      originalName: req.file.originalname,
      fileName: properFileName,
      textFileName,
      filePath: properFilePath,
      textFilePath,
      uploadedAt: new Date(timestamp).toISOString(),
      size: req.file.size,
      fileType: ext,
      extractedLength: extractedText.length,
      hasTextExtraction: true
    };

    saveScriptMetadata(scriptId, metadata);

    console.log(`✅ File processed successfully: ${properFileName}`);
    console.log(`✅ Text extracted and saved: ${textFileName}`);
    console.log(`✅ Script ID generated: ${scriptId}`);

    return res.status(200).json({
      success: true,
      message: "File uploaded and converted successfully",
      data: {
        scriptId,
        originalFile: {
          scriptId,
          filename: properFileName,
          originalName: req.file.originalname,
          path: `/uploads/${properFileName}`,
          size: req.file.size
        },
        textFile: {
          filename: textFileName,
          path: `/uploads/${textFileName}`,
          extractedLength: extractedText.length
        }
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up uploaded file if processing failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    });
  }
});

// Fetch all user files using script metadata
app.get("/files/:userId", (req, res) => {
  const { userId } = req.params;

  try {
    const userScripts = getUserScripts(userId);
    
    // Format response to match expected structure
    const files = userScripts.map(script => {
      // Check if files still exist
      const originalExists = fs.existsSync(script.filePath);
      const textExists = fs.existsSync(script.textFilePath);
      
      return {
        id: script.scriptId,
        scriptId: script.scriptId,
        fileName: script.fileName,
        originalName: script.originalName,
        filePath: originalExists ? `/uploads/${script.fileName}` : null,
        textFilePath: textExists ? `/uploads/${script.textFileName}` : null,
        uploadedAt: script.uploadedAt,
        size: script.size,
        fileType: script.fileType,
        hasTextExtraction: textExists,
        extractedLength: script.extractedLength
      };
    });

    console.log(`📂 Found ${files.length} files for user ${userId}`);

    return res.status(200).json({
      success: true,
      count: files.length,
      files: files
    });

  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch files" 
    });
  }
});

// Get extracted text content by script ID
app.get("/text/:userId/:scriptId", (req, res) => {
  const { userId, scriptId } = req.params;
  
  try {
    // Load metadata to verify ownership and get file info
    const metadata = loadScriptMetadata(scriptId);
    
    if (!metadata) {
      return res.status(404).json({
        success: false,
        message: "Script not found"
      });
    }
    
    // Security check: ensure the script belongs to the user
    if (metadata.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const textFilePath = path.join(uploadDir, metadata.textFileName);
    
    if (!fs.existsSync(textFilePath)) {
      return res.status(404).json({
        success: false,
        message: "Text file not found"
      });
    }

    const textContent = fs.readFileSync(textFilePath, 'utf-8');
    
    return res.status(200).json({
      success: true,
      scriptId: scriptId,
      originalName: metadata.originalName,
      filename: metadata.textFileName,
      content: textContent,
      length: textContent.length,
      uploadedAt: metadata.uploadedAt
    });

  } catch (error) {
    console.error("Error reading text file:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to read text file"
    });
  }
});

// Delete file by script ID
app.delete("/files/:userId/:scriptId", (req, res) => {
  const { userId, scriptId } = req.params;
  
  try {
    // Load metadata to verify ownership and get file paths
    const metadata = loadScriptMetadata(scriptId);
    
    if (!metadata) {
      return res.status(404).json({
        success: false,
        message: "Script not found"
      });
    }
    
    // Security check: ensure the script belongs to the user
    if (metadata.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    let deletedFiles = [];
    
    // Delete original file
    if (fs.existsSync(metadata.filePath)) {
      fs.unlinkSync(metadata.filePath);
      deletedFiles.push(metadata.fileName);
    }
    
    // Delete text file
    if (fs.existsSync(metadata.textFilePath)) {
      fs.unlinkSync(metadata.textFilePath);
      deletedFiles.push(metadata.textFileName);
    }
    
    // Delete metadata file
    const metadataFile = path.join(metadataDir, `${scriptId}.json`);
    if (fs.existsSync(metadataFile)) {
      fs.unlinkSync(metadataFile);
      deletedFiles.push(`${scriptId}.json`);
    }
    
    console.log(`🗑️ Deleted script ${scriptId} and associated files`);
    
    return res.status(200).json({
      success: true,
      message: "Script and files deleted successfully",
      scriptId: scriptId,
      deletedFiles: deletedFiles
    });

  } catch (error) {
    console.error("Error deleting files:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete files"
    });
  }
});

// Serve static files from uploads folder
app.use("/uploads", express.static(uploadDir));

// Cleanup malformed files and orphaned metadata
app.delete("/cleanup", (req, res) => {
  try {
    let deletedCount = 0;
    const deletedFiles = [];
    
    // Clean up malformed upload files
    const allFiles = fs.readdirSync(uploadDir);
    const malformedFiles = allFiles.filter(file => 
      file.startsWith('undefined-') || file.startsWith('temp-')
    );
    
    malformedFiles.forEach(file => {
      const filePath = path.join(uploadDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deletedCount++;
        deletedFiles.push(file);
        console.log(`🗑️ Deleted malformed file: ${file}`);
      }
    });
    
    // Clean up orphaned metadata (metadata without corresponding files)
    if (fs.existsSync(metadataDir)) {
      const metadataFiles = fs.readdirSync(metadataDir);
      
      for (const metaFile of metadataFiles) {
        if (!metaFile.endsWith('.json')) continue;
        
        try {
          const scriptId = path.basename(metaFile, '.json');
          const metadata = loadScriptMetadata(scriptId);
          
          if (metadata && (!fs.existsSync(metadata.filePath) || !fs.existsSync(metadata.textFilePath))) {
            const metadataPath = path.join(metadataDir, metaFile);
            fs.unlinkSync(metadataPath);
            deletedCount++;
            deletedFiles.push(metaFile);
            console.log(`🗑️ Deleted orphaned metadata: ${metaFile}`);
          }
        } catch (error) {
          console.error(`Error processing metadata file ${metaFile}:`, error);
        }
      }
    }
    
    return res.status(200).json({
      success: true,
      message: `Cleaned up ${deletedCount} files`,
      deletedCount: deletedCount,
      deletedFiles: deletedFiles
    });
    
  } catch (error) {
    console.error("Cleanup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cleanup files"
    });
  }
});

// Get script metadata by script ID (for debugging)
app.get("/metadata/:scriptId", (req, res) => {
  const { scriptId } = req.params;
  
  try {
    const metadata = loadScriptMetadata(scriptId);
    
    if (!metadata) {
      return res.status(404).json({
        success: false,
        message: "Script metadata not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      metadata: metadata
    });
    
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch metadata"
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`📋 Metadata directory: ${metadataDir}`);
});
