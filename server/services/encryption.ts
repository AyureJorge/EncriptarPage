import crypto from 'crypto';
import { Buffer } from 'buffer';

export class EncryptionService {
  
  // Generate RSA key pair for testing
  static generateTestKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    return { publicKey, privateKey };
  }

  // Encrypt file using AES + RSA
  static encryptFile(fileBuffer: Buffer, publicKeyPem: string): {
    encryptedData: Buffer;
    encryptedKey: Buffer;
    extension: string;
  } {
    try {
      // Generate AES key and IV
      const aesKey = crypto.randomBytes(32); // 256-bit key
      const iv = crypto.randomBytes(16); // 128-bit IV

      // Pad the file data (PKCS7 padding)
      const blockSize = 16;
      const padLength = blockSize - (fileBuffer.length % blockSize);
      const paddedData = Buffer.concat([
        fileBuffer,
        Buffer.alloc(padLength, padLength)
      ]);

      // Create cipher with explicit IV
      const aesCipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
      const encryptedFile = Buffer.concat([
        aesCipher.update(paddedData),
        aesCipher.final()
      ]);

      // Prepare extension info
      const extension = '.pdf';
      const extBytes = Buffer.from(extension, 'utf-8');
      const extLength = Buffer.alloc(4);
      extLength.writeUInt32BE(extBytes.length, 0);

      // Combine extension info + IV + encrypted file
      const encryptedData = Buffer.concat([
        extLength,
        extBytes,
        iv,
        encryptedFile
      ]);

      // Encrypt AES key with RSA public key
      const encryptedKey = crypto.publicEncrypt(
        {
          key: publicKeyPem,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256'
        },
        aesKey
      );

      return {
        encryptedData,
        encryptedKey,
        extension
      };

    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate RSA public key
  static validatePublicKey(publicKeyPem: string): boolean {
    try {
      // Try to create a key object to validate format
      crypto.createPublicKey(publicKeyPem);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Validate PDF file
  static validatePdfFile(fileBuffer: Buffer): boolean {
    try {
      // Check PDF magic number
      const pdfHeader = fileBuffer.subarray(0, 4).toString();
      return pdfHeader === '%PDF';
    } catch (error) {
      return false;
    }
  }
}
