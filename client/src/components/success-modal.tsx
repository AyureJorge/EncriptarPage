import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onDownload: () => void;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onDownload, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Encriptación completada</DialogTitle>
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Encriptación Exitosa!</h3>
          <p className="text-sm text-gray-600 mb-6">Tu archivo ha sido cifrado correctamente</p>
          <div className="flex space-x-3">
            <Button
              onClick={onDownload}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Descargar Archivos
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
