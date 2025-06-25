import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Lock } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  progress: number;
  onClose: () => void;
}

export function LoadingModal({ isOpen, progress, onClose }: LoadingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Proceso de encriptación</DialogTitle>
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Lock className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Encriptando archivo...</h3>
          <p className="text-sm text-gray-600 mb-4">Por favor espera mientras se procesa tu archivo</p>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-gray-500">{progress}% completado</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
