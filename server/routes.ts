import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { EncryptionService } from "./services/encryption";
import { 
  uploadFileSchema, 
  rsaKeySchema, 
  encryptionRequestSchema 
} from "@shared/schema";

interface MulterRequest extends Request {
  files?: { [fieldname: string]: any[] };
}

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate test RSA key pair
  app.post("/api/generate-test-keys", async (req, res) => {
    try {
      const { publicKey, privateKey } = EncryptionService.generateTestKeyPair();
      
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        publicKey,
        privateKey,
        message: "Claves de prueba generadas exitosamente"
      });
    } catch (error) {
      console.error("Error generating test keys:", error);
      res.status(500).json({
        success: false,
        message: "Error al generar las claves de prueba"
      });
    }
  });

  // Encrypt file endpoint
  app.post("/api/encrypt", upload.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'rsaKey', maxCount: 1 }
  ]), async (req: MulterRequest, res) => {
    try {
      const files = req.files;
      
      if (!files || !files.pdfFile || !files.rsaKey) {
        return res.status(400).json({
          success: false,
          message: "Se requieren tanto el archivo PDF como la clave RSA"
        });
      }

      const pdfFile = files.pdfFile[0];
      const rsaKeyFile = files.rsaKey[0];

      // Validate PDF file
      if (!EncryptionService.validatePdfFile(pdfFile.buffer)) {
        return res.status(400).json({
          success: false,
          message: "El archivo seleccionado no es un PDF válido"
        });
      }

      // Validate RSA key
      const publicKeyPem = rsaKeyFile.buffer.toString('utf-8');
      if (!EncryptionService.validatePublicKey(publicKeyPem)) {
        return res.status(400).json({
          success: false,
          message: "La clave RSA proporcionada no es válida"
        });
      }

      // Create encryption job record
      const job = await storage.createEncryptionJob({
        fileName: pdfFile.originalname,
        fileSize: pdfFile.size,
        status: "processing"
      });

      // Perform encryption
      const { encryptedData, encryptedKey } = EncryptionService.encryptFile(
        pdfFile.buffer,
        publicKeyPem
      );

      // Update job status
      await storage.updateEncryptionJobStatus(job.id, "completed");

      // Return encrypted files as base64 for download
      res.json({
        success: true,
        jobId: job.id,
        encryptedFile: {
          name: `${pdfFile.originalname}.enc`,
          data: encryptedData.toString('base64'),
          size: encryptedData.length
        },
        encryptedKey: {
          name: `${pdfFile.originalname}.key`,
          data: encryptedKey.toString('base64'),
          size: encryptedKey.length
        },
        message: "Archivo encriptado exitosamente"
      });

    } catch (error) {
      console.error("Encryption error:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Error al encriptar el archivo"
      });
    }
  });

  // Get encryption job status
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getEncryptionJob(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Trabajo de encriptación no encontrado"
        });
      }

      res.json({
        success: true,
        job
      });
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener el estado del trabajo"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
