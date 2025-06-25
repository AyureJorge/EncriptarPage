import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

export function SecurityInfo() {
  return (
    <Card className="mt-8 bg-blue-50 border border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Información de Seguridad</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los archivos se procesan de forma segura en el servidor</li>
              <li>• Se utiliza cifrado AES-256 con claves RSA-2048</li>
              <li>• Los datos no se almacenan permanentemente</li>
              <li>• Guarda tanto el archivo .enc como el .key para el descifrado</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
