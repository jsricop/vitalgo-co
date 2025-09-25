# VitalGo - Digital Medical Records Platform

VitalGo es una plataforma de expedientes médicos digitales que permite a pacientes y profesionales de la salud acceder de forma segura a información médica completa.

## 🏗 Arquitectura

- **Backend**: FastAPI + PostgreSQL + Redis (Arquitectura Hexagonal)
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS (Atomic Design)
- **Base de Datos**: PostgreSQL (`vitalgo_dev` local, AWS RDS producción)

## 📁 Estructura del Proyecto

```
vitalgo-co/
├── README.md                    # Documentación principal
├── docs/                        # Documentación completa
│   ├── DEV_CONTEXT.md          # Contexto del proyecto
│   ├── API_REFERENCE.md        # Diccionario de APIs
│   ├── TYPES_REFERENCE.md      # Elementos TypeScript
│   ├── DB_FIELDS_REFERENCE.md  # Esquema de base de datos
│   ├── TEST_DB_DATA_REGISTER.md # Registro de datos de prueba
│   ├── BRAND_MANUAL.md         # Manual de marca
│   └── DEPLOYMENT.md           # Guía de despliegue
├── scripts/                     # Scripts de automatización
│   ├── deploy.sh               # Despliegue a producción
│   └── local-deploy.sh         # Despliegue local
├── backend/                     # FastAPI backend
│   └── slices/                 # Vertical slicing
│       ├── auth/               # Autenticación
│       ├── signup/             # Registro de usuarios
│       ├── dashboard/          # Dashboard
│       ├── medications/        # Gestión de medicamentos
│       ├── allergies/          # Gestión de alergias
│       ├── illnesses/          # Gestión de enfermedades
│       └── surgeries/          # Gestión de cirugías
├── frontend/                    # Next.js frontend
└── docker-compose.local.yml    # Configuración Docker local
```

## 🚀 Inicio Rápido

### Desarrollo Local

1. **Configurar infraestructura y base de datos:**
   ```bash
   ./scripts/local-deploy.sh
   ```

2. **Iniciar backend:**
   ```bash
   cd backend
   poetry install
   poetry run uvicorn main:app --reload
   ```

3. **Iniciar frontend:**
   ```bash
   npm install
   npm run dev
   ```

4. **Acceder a la aplicación:**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs
   - API Health: http://localhost:8000/health

### Scripts Disponibles

```bash
# Despliegue local (desarrollo)
./scripts/local-deploy.sh                    # Configuración estándar
./scripts/local-deploy.sh --clean            # Inicio limpio
./scripts/local-deploy.sh --preserve-data    # Conservar datos
./scripts/local-deploy.sh --status           # Verificar estado

# Despliegue producción (AWS)
./scripts/deploy.sh                          # Despliegue automático
./scripts/deploy.sh --with-migrations        # Con migraciones DB
./scripts/deploy.sh --validate               # Solo validación
```

## 🗃 Base de Datos

- **Local**: PostgreSQL en Docker (`vitalgo_dev`)
- **Producción**: AWS RDS PostgreSQL
- **Migraciones**: Alembic (automáticas)
- **Cache**: Redis para sesiones y rate limiting

## 🔧 Configuración

### Variables de Entorno

**Backend** (`backend/.env`):
```bash
DATABASE_URL=postgresql://vitalgo_user:vitalgo_dev_password_2025@localhost:5432/vitalgo_dev
JWT_SECRET_KEY=your_jwt_secret_key
REDIS_URL=redis://localhost:6379/0
```

**Frontend** (variables de entorno Next.js):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📖 Documentación

Documentación completa en el directorio `docs/`:

- **[DEV.md](docs/DEV.md)** - Contexto completo del proyecto
- **[APIS.md](docs/APIS.md)** - Referencia completa de APIs
- **[TYPES.md](docs/TYPES.md)** - Diccionario TypeScript
- **[DB.md](docs/DB.md)** - Esquema de base de datos
- **[TEST_DATA.md](docs/TEST_DATA.md)** - Datos de prueba
- **[BRAND.md](docs/BRAND.md)** - Manual de marca
- **[scripts/deploy.sh](scripts/deploy.sh)** - Script de despliegue a producción (usar `./scripts/deploy.sh --help`)

## 🧪 Testing

```bash
# Tests backend
cd backend
poetry run pytest

# Tests frontend
npm run test

# Tests E2E
npm run test:e2e
```

## 🚢 Despliegue

### Local (Desarrollo)
El script `scripts/local-deploy.sh` configura automáticamente:
- PostgreSQL con base de datos `vitalgo_dev`
- Redis para cache y sesiones
- Migraciones de base de datos
- Verificaciones de conectividad

### Producción (AWS)
El script `scripts/deploy.sh` maneja:
- Build y push de imágenes Docker
- Despliegue en EC2 con RDS
- Migraciones automáticas
- Verificaciones de salud
- Rollback de emergencia

## 🔒 Seguridad

- Autenticación JWT con refresh tokens
- Rate limiting con Redis
- Validación de entrada con Pydantic
- Encriptación bcrypt para contraseñas
- CORS configurado para producción

## 🤝 Contribución

1. Consulta `docs/DEV_CONTEXT.md` para contexto completo
2. Revisa `docs/API_REFERENCE.md` para contratos de API
3. Sigue los patrones establecidos en `docs/TYPES_REFERENCE.md`
4. Usa `scripts/local-deploy.sh` para configuración consistente

## 📝 Licencia

Propietario - VitalGo © 2024