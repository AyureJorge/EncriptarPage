# PDF Encryption Web Application

## Overview

This is a full-stack web application designed for securely encrypting PDF files using AES-256 encryption with RSA-2048 public key cryptography. The application is built for MALLAMAS EPS-I and provides a modern, user-friendly interface for file encryption operations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **File Handling**: React Dropzone for drag-and-drop file uploads
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Processing**: Multer for multipart form handling
- **Encryption**: Native Node.js crypto module for RSA and AES operations
- **Database**: Placeholder schema using Drizzle ORM (PostgreSQL ready)
- **Development**: Vite for development server and hot module replacement

### Data Storage
- **In-Memory Storage**: Temporary storage for encryption jobs (development)
- **Database Ready**: Drizzle ORM configured for PostgreSQL with migrations
- **File Storage**: Memory-based with configurable size limits (50MB for PDFs, 10KB for keys)

## Key Components

### Encryption Service
- **RSA Key Generation**: 2048-bit RSA key pair generation for testing
- **Hybrid Encryption**: AES-256-CBC for file content, RSA for key encryption
- **File Processing**: Supports PDF files up to 50MB with proper validation
- **Security**: PKCS7 padding and secure random IV generation

### Frontend Components
- **PdfUploadCard**: Drag-and-drop PDF file upload with validation
- **RsaKeyCard**: RSA public key file upload (.pem format)
- **EncryptionPanel**: Main encryption interface with progress tracking
- **Modal System**: Loading and success modals for user feedback

### API Endpoints
- `POST /api/generate-test-keys`: Generate RSA key pairs for testing
- `POST /api/encrypt`: Encrypt PDF files using uploaded RSA keys
- File validation and size restrictions enforced at API level

## Data Flow

1. **File Upload**: Users upload PDF files and RSA public keys via drag-and-drop interface
2. **Validation**: Client and server-side validation for file types and sizes
3. **Encryption Process**: 
   - Generate AES-256 key and IV
   - Encrypt PDF content with AES
   - Encrypt AES key with RSA public key
   - Combine encrypted data and key
4. **Download**: Provide encrypted files (.enc) and key files (.key) for download
5. **Job Tracking**: Store encryption job status in database (ready for implementation)

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection (PostgreSQL)
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-dropzone**: File upload handling
- **multer**: Server-side file processing
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Vite Development Server**: Hot module replacement and fast builds
- **PostgreSQL Module**: Database provisioning ready
- **Port Configuration**: Development on port 5000, production on port 80

### Production Build
- **Frontend**: Vite build process outputs to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Assets**: Served from built frontend directory
- **Environment Variables**: DATABASE_URL required for production

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Deployment**: Autoscale deployment target
- **Workflows**: Automated development workflow with port forwarding

## Changelog

```
Changelog:
- June 22, 2025: Fixed local development issues
  - Added environment variables for API URL configuration
  - Fixed TypeScript errors in backend routes and storage
  - Added proper CORS and routing configuration
  - Created development and production environment files
  - Added comprehensive README for local setup
- June 21, 2025: Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```