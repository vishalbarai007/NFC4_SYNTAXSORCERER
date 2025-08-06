import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import path from "path";
import { exec } from "child_process";
import mammoth from "mammoth";

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

// Helper: Parse filename to get components
function parseFilename(filename) {
  // Format: userId-timestamp-originalname
  const parts = filename.split('-');
  if (parts.length < 3) {
    return null;
  }
  
  const userId = parts[0];
  const timestamp = parts[1];
  const originalName = parts.slice(2).join('-'); // Rejoin in case original name had dashes
  
  return {
    userId,
    timestamp: parseInt(timestamp),
    originalName,
    uploadedAt: new Date(parseInt(timestamp))
  };
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

    // Get the temporary filename and create proper filename
    const tempFilePath = req.file.path;
    const tempFileName = req.file.filename;
    
    // Create proper filename: userId-timestamp-originalname
    const timestamp = Date.now();
    const properFileName = `${userId}-${timestamp}-${req.file.originalname}`;
    const properFilePath = path.join(uploadDir, properFileName);
    
    // Rename the temp file to proper name
    fs.renameSync(tempFilePath, properFilePath);
    
    const ext = path.extname(req.file.originalname).toLowerCase().substring(1);

    console.log(`Processing file: ${properFileName}, type: ${ext}`);

    // Extract text content
    const extractedText = await extractTextFromFile(properFilePath, ext);

    // Create text file with consistent naming
    const textFileName = `${properFileName}.txt`;
    const textFilePath = path.join(uploadDir, textFileName);
    
    fs.writeFileSync(textFilePath, extractedText);

    console.log(`✅ File processed successfully: ${properFileName}`);
    console.log(`✅ Text extracted and saved: ${textFileName}`);

    return res.status(200).json({
      success: true,
      message: "File uploaded and converted successfully",
      data: {
        originalFile: {
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

// Fetch all user files with consistent parsing
app.get("/files/:userId", (req, res) => {
  const { userId } = req.params;

  try {
    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json({
        success: true,
        files: []
      });
    }

    const allFiles = fs.readdirSync(uploadDir);
    
    // Filter files that belong to this user and are not text files
    const userFiles = allFiles
      .filter(file => {
        // Must start with userId- and not end with .txt
        return file.startsWith(`${userId}-`) && !file.endsWith('.txt');
      })
      .map(file => {
        const parsed = parseFilename(file);
        if (!parsed) {
          return null; // Skip malformed filenames
        }

        // Check if corresponding text file exists
        const textFileName = `${file}.txt`;
        const textFilePath = path.join(uploadDir, textFileName);
        const hasTextFile = fs.existsSync(textFilePath);

        // Get file stats
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);

        return {
          id: file, // Use filename as ID
          fileName: file,
          originalName: parsed.originalName,
          filePath: `/uploads/${file}`,
          textFilePath: hasTextFile ? `/uploads/${textFileName}` : null,
          uploadedAt: parsed.uploadedAt.toISOString(),
          size: stats.size,
          hasTextExtraction: hasTextFile
        };
      })
      .filter(file => file !== null) // Remove malformed entries
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)); // Sort by newest first

    console.log(`📂 Found ${userFiles.length} files for user ${userId}`);

    return res.status(200).json({
      success: true,
      count: userFiles.length,
      files: userFiles
    });

  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch files" 
    });
  }
});

// Get extracted text content
app.get("/text/:userId/:filename", (req, res) => {
  const { userId, filename } = req.params;
  
  try {
    // Security check: ensure the file belongs to the user
    if (!filename.startsWith(`${userId}-`)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const textFileName = `${filename}.txt`;
    const textFilePath = path.join(uploadDir, textFileName);
    
    if (!fs.existsSync(textFilePath)) {
      return res.status(404).json({
        success: false,
        message: "Text file not found"
      });
    }

    const textContent = fs.readFileSync(textFilePath, 'utf-8');
    
    return res.status(200).json({
      success: true,
      filename: textFileName,
      content: textContent,
      length: textContent.length
    });

  } catch (error) {
    console.error("Error reading text file:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to read text file"
    });
  }
});

// Delete file endpoint
app.delete("/files/:userId/:filename", (req, res) => {
  const { userId, filename } = req.params;
  
  try {
    // Security check: ensure the file belongs to the user
    if (!filename.startsWith(`${userId}-`)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const filePath = path.join(uploadDir, filename);
    const textFileName = `${filename}.txt`;
    const textFilePath = path.join(uploadDir, textFileName);
    
    let deletedFiles = [];
    
    // Delete original file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deletedFiles.push(filename);
    }
    
    // Delete text file
    if (fs.existsSync(textFilePath)) {
      fs.unlinkSync(textFilePath);
      deletedFiles.push(textFileName);
    }
    
    if (deletedFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Files deleted successfully",
      deletedFiles
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

// Cleanup malformed files (files with undefined userId)
app.delete("/cleanup", (req, res) => {
  try {
    const allFiles = fs.readdirSync(uploadDir);
    const malformedFiles = allFiles.filter(file => 
      file.startsWith('undefined-') || file.startsWith('temp-')
    );
    
    let deletedCount = 0;
    
    malformedFiles.forEach(file => {
      const filePath = path.join(uploadDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`🗑️ Deleted malformed file: ${file}`);
      }
    });
    
    return res.status(200).json({
      success: true,
      message: `Cleaned up ${deletedCount} malformed files`,
      deletedFiles: malformedFiles
    });
    
  } catch (error) {
    console.error("Cleanup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cleanup files"
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
});
