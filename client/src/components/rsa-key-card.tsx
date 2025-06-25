import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, Shield, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RsaKeyCardProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export function RsaKeyCard({ file, onFileSelect, onFileRemove }: RsaKeyCardProps) {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      // Validate file extension
      if (!selectedFile.name.toLowerCase().endsWith('.pem')) {
        toast({
          title: "Tipo de archivo incorrecto",
          description: "Solo se permiten archivos .pem.",
          variant: "destructive",
        });
        return;
      }
      onFileSelect(selectedFile);
    }
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-pem-file': ['.pem'],
      'text/plain': ['.pem']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Key className="h-5 w-5 text-yellow-500 mr-2" />
            Llave Pública RSA
          </h2>
          <span className="text-sm text-gray-500">Requerido</span>
        </div>

        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-primary/60'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-primary">Seleccionar clave pública</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Archivos .pem únicamente</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Key className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">Clave RSA 2048 bits</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFileRemove}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Key className="h-4 w-4 mr-2" />
              Seleccionar Llave Pública
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
