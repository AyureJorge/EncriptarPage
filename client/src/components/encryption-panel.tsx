import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, FileText, Shield, Clock, Download } from 'lucide-react';

interface EncryptionPanelProps {
  pdfFile: File | null;
  rsaKeyFile: File | null;
  encryptionResult: any;
  onEncrypt: () => void;
  onDownload: () => void;
  isEncrypting: boolean;
}

export function EncryptionPanel({ 
  pdfFile, 
  rsaKeyFile, 
  encryptionResult, 
  onEncrypt, 
  onDownload, 
  isEncrypting 
}: EncryptionPanelProps) {
  const canEncrypt = pdfFile && rsaKeyFile && !isEncrypting;
  const canDownload = encryptionResult && !isEncrypting;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Lock className="h-5 w-5 text-green-500 mr-2" />
          Proceso de Encriptación
        </h2>

        {/* Encryption Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Estado</span>
            <span className="text-sm text-gray-500">
              {isEncrypting ? 'Encriptando...' : 
               encryptionResult ? 'Completado' : 
               'Listo para encriptar'}
            </span>
          </div>
          <Progress 
            value={isEncrypting ? 50 : encryptionResult ? 100 : 0} 
            className="w-full"
          />
        </div>

        {/* Encryption Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Archivo</span>
            </div>
            <p className="text-sm text-gray-600">
              {pdfFile ? `${pdfFile.name} (${formatFileSize(pdfFile.size)})` : 'No seleccionado'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Cifrado</span>
            </div>
            <p className="text-sm text-gray-600">AES-256 + RSA-2048</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Estado</span>
            </div>
            <p className="text-sm text-gray-600">
              {rsaKeyFile ? 'Clave cargada' : 'Falta clave RSA'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onEncrypt}
            disabled={!canEncrypt}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
          >
            <Lock className="h-4 w-4 mr-2" />
            {isEncrypting ? 'Encriptando...' : 'Encriptar Archivo'}
          </Button>
          <Button
            onClick={onDownload}
            disabled={!canDownload}
            className="flex-1 bg-primary hover:bg-primary/90 py-3"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar Archivos Cifrados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
