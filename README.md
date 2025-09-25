# VitalGo - Digital Medical Records Platform

VitalGo es una plataforma de expedientes médicos digitales que permite a pacientes y profesionales de la salud acceder de forma segura a información médica completa.

## 🏗 Arquitectura

- **Backend**: FastAPI + PostgreSQL + Redis + SQLAlchemy (Vertical Slicing + Hexagonal Architecture)
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS (Vertical Slicing + Atomic Design)
- **Base de Datos**: PostgreSQL (`vitalgo_dev` local, AWS RDS producción)
- **Autenticación**: JWT con refresh tokens + bcrypt password hashing
- **Deployment**: Docker containers con CI/CD automatizado

## 📁 Estructura del Proyecto

```
vitalgo-co/
├── README.md                    # Documentación principal del proyecto
├── docs/                        # Documentación técnica de referencia
│   ├── DEV.md                  # Guía de desarrollo y patrones
│   ├── BRAND.md                # Manual de marca y estilos UI
│   ├── APIS.md                 # Referencia completa de endpoints API
│   ├── TYPES.md                # Definiciones TypeScript/Python
│   ├── DB.md                   # Esquema de base de datos
│   └── TEST_DATA.md            # Datos de prueba (credenciales sensibles)
├── scripts/                     # Scripts de automatización
│   ├── smart-commit.sh         # Commit inteligente con revisión de seguridad
│   ├── deploy.sh               # Despliegue a producción
│   └── local-deploy.sh         # Despliegue local
├── backend/                     # FastAPI backend
│   └── slices/                 # Arquitectura de slicing vertical
│       ├── auth/               # Autenticación y sesiones
│       ├── signup/             # Registro de usuarios
│       ├── dashboard/          # Panel principal del paciente
│       ├── medications/        # Gestión de medicamentos
│       ├── allergies/          # Gestión de alergias
│       ├── illnesses/          # Gestión de enfermedades
│       └── surgeries/          # Gestión de cirugías
├── frontend/                    # Next.js 15 frontend
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
# Smart commit con revisión automática
./scripts/smart-commit.sh                    # Proceso completo automatizado
./scripts/smart-commit.sh --auto             # Modo automático sin confirmaciones
./scripts/smart-commit.sh --message "msg"    # Mensaje personalizado

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

Documentación técnica completa disponible en el directorio `docs/`:

### 📋 Documentación de Desarrollo
- **[DEV.md](docs/DEV.md)** - Guía de desarrollo, patrones arquitectónicos y convenciones
- **[BRAND.md](docs/BRAND.md)** - Manual de marca, sistema de diseño y componentes UI

### 🔧 Referencias Técnicas
- **[APIS.md](docs/APIS.md)** - Documentación completa de endpoints API con ejemplos
- **[TYPES.md](docs/TYPES.md)** - Definiciones TypeScript/Python y contratos de datos
- **[DB.md](docs/DB.md)** - Esquema de base de datos con relaciones y constraints
- **[TEST_DATA.md](docs/TEST_DATA.md)** - Datos de prueba y credenciales de desarrollo

### 🚀 Scripts de Automatización
- **[smart-commit.sh](scripts/smart-commit.sh)** - Commit inteligente con revisión automática (`./scripts/smart-commit.sh --help`)
- **[local-deploy.sh](scripts/local-deploy.sh)** - Configuración de desarrollo local (`./scripts/local-deploy.sh --help`)
- **[deploy.sh](scripts/deploy.sh)** - Despliegue a producción AWS (`./scripts/deploy.sh --help`)

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

## 🚀 Smart Commit Script

El script `smart-commit.sh` automatiza el proceso completo de commit con revisiones de seguridad:

### Características

✅ **Revisión de Documentación**: Verifica automáticamente cambios en `/docs`
✅ **Escaneo de Seguridad**: Detecta información sensible (passwords, API keys, tokens)
✅ **Auto .gitignore**: Añade automáticamente archivos sensibles a .gitignore
✅ **Mensajes Inteligentes**: Genera mensajes de commit basados en los cambios
✅ **Integración GitHub**: Despliega cambios con confirmación

### Uso

```bash
# Modo interactivo (recomendado)
./scripts/smart-commit.sh

# Modo automático
./scripts/smart-commit.sh --auto

# Mensaje personalizado
./scripts/smart-commit.sh --message "feat(auth): implement OAuth2"
```

### Proceso

1. **Revisión de documentación** - Verifica estado de archivos en `/docs`
2. **Escaneo de seguridad** - Detecta patrones sensibles
3. **Actualización .gitignore** - Protege archivos sensibles
4. **Generación de mensaje** - Sugiere mensaje de commit inteligente
5. **Despliegue GitHub** - Crea commit y push automático

## 🤝 Contribución

1. Usa `./scripts/smart-commit.sh` para commits seguros y consistentes
2. Consulta `docs/DEV.md` para patrones de desarrollo
3. Revisa `docs/BRAND.md` para estándares de UI
4. Usa `scripts/local-deploy.sh` para configuración local

## 📝 Licencia

Propietario - VitalGo © 2024