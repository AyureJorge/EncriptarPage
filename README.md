# Encriptador de Soportes PDF - MALLAMAS EPS-I

Aplicación web para encriptar archivos PDF usando cifrado AES-256 con claves RSA-2048.

## Desarrollo Local

### Prerrequisitos
- Node.js 20 o superior
- npm o yarn

### Instalación

1. Clona el repositorio
```bash
git clone <tu-repositorio>
cd encriptador-pdf
```

2. Instala las dependencias
```bash
npm install
```

3. Configura las variables de entorno
```bash
# Para desarrollo local, crea un archivo .env.local en la carpeta client/
echo "VITE_API_URL=http://localhost:5000" > client/.env.local
```

### Ejecución en Desarrollo

1. Inicia el servidor backend:
```bash
npm run dev:server
```

2. En otra terminal, inicia el frontend:
```bash
npm run dev:client
```

3. Abre tu navegador en `http://localhost:5173`

### Ejecución Completa (Full-Stack)

```bash
npm run dev
```

Esto iniciará tanto el backend (puerto 5000) como el frontend (puerto 5173).

## Estructura del Proyecto

```
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/      # Páginas de la aplicación
│   │   └── lib/        # Utilidades y configuración
│   ├── .env.development   # Variables de entorno para desarrollo
│   └── .env.production    # Variables de entorno para producción
├── server/          # Backend Express
│   ├── services/    # Servicios de negocio
│   ├── routes.ts    # Rutas de la API
│   └── index.ts     # Servidor principal
└── shared/          # Esquemas y tipos compartidos
```

## API Endpoints

- `POST /api/generate-test-keys` - Genera un par de claves RSA de prueba
- `POST /api/encrypt` - Encripta un archivo PDF con una clave RSA
- `GET /api/jobs/:id` - Obtiene el estado de un trabajo de encriptación

## Variables de Entorno

### Frontend (client/)
- `VITE_API_URL` - URL base del backend (ejemplo: `http://localhost:5000`)

### Backend (server/)
- `NODE_ENV` - Entorno de ejecución (`development` o `production`)
- `PORT` - Puerto del servidor (por defecto: 5000)

## Funcionalidades

- ✅ Carga de archivos PDF mediante drag & drop
- ✅ Generación de claves RSA de prueba (2048 bits)
- ✅ Encriptación híbrida AES-256 + RSA-2048
- ✅ Descarga de archivos encriptados (.enc y .key)
- ✅ Interfaz moderna y responsiva
- ✅ Feedback visual del progreso de encriptación

## Seguridad

- Los archivos se procesan en memoria sin almacenamiento permanente
- Cifrado AES-256-CBC con claves RSA-2048
- Validación de tipos de archivo tanto en frontend como backend
- Límites de tamaño: PDFs hasta 50MB, claves RSA hasta 10KB

## Compatibilidad

- Navegadores modernos con soporte para ES6+
- Node.js 18+ (recomendado 20+)
- Compatible con desarrollo local y despliegue en Replit