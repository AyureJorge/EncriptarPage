import { useState } from 'react';
import { PdfUploadCard } from '@/components/pdf-upload-card';
import { RsaKeyCard } from '@/components/rsa-key-card';
import { EncryptionPanel } from '@/components/encryption-panel';
import { SecurityInfo } from '@/components/security-info';
import { LoadingModal } from '@/components/loading-modal';
import { SuccessModal } from '@/components/success-modal';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [rsaKeyFile, setRsaKeyFile] = useState<File | null>(null);
  const [encryptionResult, setEncryptionResult] = useState<any>(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [encryptionProgress, setEncryptionProgress] = useState(0);

  const { toast } = useToast();

  const generateTestKeysMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/generate-test-keys');
      return response.json();
    },
    onSuccess: (data) => {
      // Create downloadable files
      const publicKeyBlob = new Blob([data.publicKey], { type: 'text/plain' });
      const privateKeyBlob = new Blob([data.privateKey], { type: 'text/plain' });
      
      // Download public key
      const publicKeyUrl = URL.createObjectURL(publicKeyBlob);
      const publicKeyLink = document.createElement('a');
      publicKeyLink.href = publicKeyUrl;
      publicKeyLink.download = 'clave_prueba.pem';
      publicKeyLink.click();
      URL.revokeObjectURL(publicKeyUrl);
      
      // Download private key
      const privateKeyUrl = URL.createObjectURL(privateKeyBlob);
      const privateKeyLink = document.createElement('a');
      privateKeyLink.href = privateKeyUrl;
      privateKeyLink.download = 'clave_prueba_privada.pem';
      privateKeyLink.click();
      URL.revokeObjectURL(privateKeyUrl);

      toast({
        title: "Claves generadas",
        description: "Se generaron las claves de prueba y se descargaron automáticamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudieron generar las claves de prueba.",
        variant: "destructive",
      });
    },
  });

  const encryptFileMutation = useMutation({
    mutationFn: async () => {
      if (!pdfFile || !rsaKeyFile) throw new Error('Faltan archivos');
      
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      formData.append('rsaKey', rsaKeyFile);
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE_URL}/api/encrypt`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al encriptar');
      }
      
      return response.json();
    },
    onMutate: () => {
      setShowLoadingModal(true);
      setEncryptionProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setEncryptionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
    },
    onSuccess: (data) => {
      setEncryptionProgress(100);
      setEncryptionResult(data);
      setTimeout(() => {
        setShowLoadingModal(false);
        setShowSuccessModal(true);
      }, 500);
    },
    onError: (error) => {
      setShowLoadingModal(false);
      toast({
        title: "Error de encriptación",
        description: error instanceof Error ? error.message : "No se pudo encriptar el archivo",
        variant: "destructive",
      });
    },
  });

  const handleDownloadFiles = () => {
    if (!encryptionResult) return;

    // Download encrypted file
    const encFileData = atob(encryptionResult.encryptedFile.data);
    const encFileArray = new Uint8Array(encFileData.length);
    for (let i = 0; i < encFileData.length; i++) {
      encFileArray[i] = encFileData.charCodeAt(i);
    }
    const encBlob = new Blob([encFileArray], { type: 'application/octet-stream' });
    const encUrl = URL.createObjectURL(encBlob);
    const encLink = document.createElement('a');
    encLink.href = encUrl;
    encLink.download = encryptionResult.encryptedFile.name;
    encLink.click();
    URL.revokeObjectURL(encUrl);

    // Download encrypted key
    const keyFileData = atob(encryptionResult.encryptedKey.data);
    const keyFileArray = new Uint8Array(keyFileData.length);
    for (let i = 0; i < keyFileData.length; i++) {
      keyFileArray[i] = keyFileData.charCodeAt(i);
    }
    const keyBlob = new Blob([keyFileArray], { type: 'application/octet-stream' });
    const keyUrl = URL.createObjectURL(keyBlob);
    const keyLink = document.createElement('a');
    keyLink.href = keyUrl;
    keyLink.download = encryptionResult.encryptedKey.name;
    keyLink.click();
    URL.revokeObjectURL(keyUrl);

    setShowSuccessModal(false);
    toast({
      title: "Descarga completada",
      description: "Los archivos cifrados se descargaron correctamente.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Encriptador de Soportes PDF</h1>
                <p className="text-sm text-gray-600">MALLAMAS EPS-I</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => generateTestKeysMutation.mutate()}
                disabled={generateTestKeysMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                <Shield className="h-4 w-4 mr-2" />
                {generateTestKeysMutation.isPending ? 'Generando...' : 'Generar Clave de Prueba'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PdfUploadCard 
            file={pdfFile} 
            onFileSelect={setPdfFile}
            onFileRemove={() => setPdfFile(null)}
          />
          <RsaKeyCard 
            file={rsaKeyFile} 
            onFileSelect={setRsaKeyFile}
            onFileRemove={() => setRsaKeyFile(null)}
          />
        </div>

        <EncryptionPanel
          pdfFile={pdfFile}
          rsaKeyFile={rsaKeyFile}
          encryptionResult={encryptionResult}
          onEncrypt={() => encryptFileMutation.mutate()}
          onDownload={handleDownloadFiles}
          isEncrypting={encryptFileMutation.isPending}
        />

        <SecurityInfo />
      </main>

      <LoadingModal
        isOpen={showLoadingModal}
        progress={encryptionProgress}
        onClose={() => setShowLoadingModal(false)}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onDownload={handleDownloadFiles}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
