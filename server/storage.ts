import { encryptionJobs, type EncryptionJob, type InsertEncryptionJob } from "@shared/schema";

export interface IStorage {
  createEncryptionJob(job: InsertEncryptionJob): Promise<EncryptionJob>;
  getEncryptionJob(id: number): Promise<EncryptionJob | undefined>;
  updateEncryptionJobStatus(id: number, status: string): Promise<EncryptionJob | undefined>;
  listEncryptionJobs(): Promise<EncryptionJob[]>;
}

export class MemStorage implements IStorage {
  private jobs: Map<number, EncryptionJob>;
  private currentId: number;

  constructor() {
    this.jobs = new Map();
    this.currentId = 1;
  }

  async createEncryptionJob(insertJob: InsertEncryptionJob): Promise<EncryptionJob> {
    const id = this.currentId++;
    const job: EncryptionJob = {
      id,
      fileName: insertJob.fileName,
      fileSize: insertJob.fileSize,
      status: insertJob.status || "pending",
      createdAt: new Date().toISOString(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async getEncryptionJob(id: number): Promise<EncryptionJob | undefined> {
    return this.jobs.get(id);
  }

  async updateEncryptionJobStatus(id: number, status: string): Promise<EncryptionJob | undefined> {
    const job = this.jobs.get(id);
    if (job) {
      job.status = status;
      this.jobs.set(id, job);
      return job;
    }
    return undefined;
  }

  async listEncryptionJobs(): Promise<EncryptionJob[]> {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
