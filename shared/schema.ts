import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const encryptionJobs = pgTable("encryption_jobs", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  createdAt: text("created_at").notNull(),
});

export const insertEncryptionJobSchema = createInsertSchema(encryptionJobs).omit({
  id: true,
  createdAt: true,
});

export type InsertEncryptionJob = z.infer<typeof insertEncryptionJobSchema>;
export type EncryptionJob = typeof encryptionJobs.$inferSelect;

// Validation schemas
export const uploadFileSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileSize: z.number().positive().max(50 * 1024 * 1024), // 50MB max
  fileType: z.literal("application/pdf"),
});

export const rsaKeySchema = z.object({
  fileName: z.string().min(1).max(255),
  fileSize: z.number().positive().max(10 * 1024), // 10KB max for keys
  fileType: z.string().regex(/^(application\/x-pem-file|text\/plain)$/),
});

export const encryptionRequestSchema = z.object({
  pdfFileName: z.string().min(1),
  keyFileName: z.string().min(1),
});

export type UploadFile = z.infer<typeof uploadFileSchema>;
export type RsaKey = z.infer<typeof rsaKeySchema>;
export type EncryptionRequest = z.infer<typeof encryptionRequestSchema>;
