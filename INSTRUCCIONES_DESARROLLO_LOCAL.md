# Instrucciones para Desarrollo Local

## Configuración Rápida

1. **Descargar e instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Crear archivo de configuración local
echo "VITE_API_URL=http://localhost:5000" > client/.env.local
```

3. **Ejecutar la aplicación:**

### Opción A: Todo junto (recomendado)
```bash
npm run dev
```
La aplicación estará disponible en:
- Frontend: http://localhost:5173  
- Backend: http://localhost:5000

### Opción B: Por separado (para desarrollo avanzado)
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev:client
```

## Estructura de Archivos Importantes

```
├── client/
│   ├── .env.local          # Variables de entorno locales
│   ├── .env.development    # Variables para desarrollo
│   └── .env.production     # Variables para producción
├── server/
│   ├── routes.ts           # Rutas de la API
│   └── index.ts            # Servidor principal
└── README.md               # Documentación completa
```

## Solución de Problemas Comunes

### Error: "Cannot connect to backend"
- Verificar que el backend esté corriendo en puerto 5000
- Comprobar que existe el archivo `client/.env.local` con `VITE_API_URL=http://localhost:5000`

### Error: "CORS policy"
- El CORS está configurado automáticamente para desarrollo local
- Verificar que NODE_ENV esté en "development"

### Rutas API no funcionan
Las siguientes rutas están disponibles:
- `POST /api/generate-test-keys` - Generar claves de prueba
- `POST /api/encrypt` - Encriptar archivo PDF
- `GET /api/jobs/:id` - Estado del trabajo

## Diferencias entre Replit y Local

| Aspecto | Replit | Local |
|---------|---------|--------|
| API URL | Automática | Requiere VITE_API_URL |
| CORS | Configurado | Automático en desarrollo |
| Puerto | 5000 | 5000 (configurable) |
| Hot Reload | Integrado | Vite + nodemon |

## Variables de Entorno

### Frontend (`client/.env.local`)
```
VITE_API_URL=http://localhost:5000
```

### Backend
```
NODE_ENV=development
PORT=5000
```

Para más detalles, consulta el README.md principal.