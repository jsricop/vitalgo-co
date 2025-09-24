# Development Context

## Reference Documentation System

**Goal**: These documents serve as the single source of truth for API contracts, database schema, type definitions, and test data registry across the full-stack application, ensuring architectural consistency, reducing development errors, and maintaining testing quality.

### Purpose of Each Document:

#### API_REFERENCE.md
- **Complete API endpoint documentation** including request/response schemas, status codes, authentication requirements, and error handling
- **Contract definition** between frontend and backend services
- **Security specifications** for authentication, rate limiting, and data validation
- **Status code mapping** and error response formats for consistent error handling

#### DB_FIELDS_REFERENCE.md
- **Comprehensive database schema reference** with field types, constraints, indexes, relationships, and cascade rules
- **Data integrity specifications** including nullable fields, default values, and validation constraints
- **Security considerations** for sensitive data handling, encryption, and audit trails
- **Performance optimization** through proper indexing and relationship definitions

#### TYPES_REFERENCE.md
- **TypeScript/Python type definitions** that ensure type safety across frontend-backend communication
- **DTO specifications** for consistent data transfer between application layers
- **Form validation types** and API response interfaces
- **Database model types** that mirror the actual schema structure

#### TEST_DB_DATA_REGISTER.md
- **Persistent test data registry** with user accounts, credentials, and validation scenarios for consistent testing quality
- **Test user management** including complete profiles, IDs, and authentication credentials
- **API testing scenarios** with JSON payloads for different testing workflows
- **Database connection information** for local development environment
- **Quality assurance checkpoints** ensuring test consistency across development processes

#### frontend/MANUAL_DE_MARCA.md
- **Official brand manual and design system** with comprehensive visual identity guidelines
- **Color palette and typography** including official VitalGo brand colors and implementation in Tailwind CSS
- **Component specifications** following Atomic Design principles with exact sizing, styling, and usage guidelines
- **Asset catalog** with complete logo library, icons, and routing paths for all brand resources
- **Implementation tracking** with current status, migration checklist, and technical configuration details

### Usage Guidelines:

#### Mandatory Reference Process
1. **Before Development**: Always consult relevant reference documents before implementing features
2. **During Implementation**: Use the documents to ensure proper type usage, API contracts, and test data consistency
3. **Testing Phase**: Reference TEST_DB_DATA_REGISTER.md for consistent test scenarios and user credentials
4. **After Changes**: Update the corresponding reference document immediately after any modifications

#### Update Requirements
- **API Changes**: Any endpoint modifications MUST update API_REFERENCE.md with new schemas, status codes, and examples
- **Database Schema**: All table/field changes MUST be reflected in DB_FIELDS_REFERENCE.md including constraints and relationships
- **Type Definitions**: New DTOs or interface changes MUST be documented in TYPES_REFERENCE.md with both frontend and backend versions
- **Test Data**: New test users, scenarios, or credential changes MUST be documented in TEST_DB_DATA_REGISTER.md with complete user profiles and validation checkpoints
- **Design Changes**: Any UI/UX modifications, color updates, or component changes MUST be reflected in frontend/MANUAL_DE_MARCA.md with updated specifications and implementation status

#### Consistency Enforcement
- **Frontend-Backend Alignment**: TypeScript interfaces must match Python DTOs exactly
- **Database-Application Sync**: Model types must reflect actual database schema constraints
- **API-Type Matching**: Request/response types must align with documented API schemas
- **Test Data Persistence**: Test data in local development MUST be persistent and never deleted, ensuring consistent testing environment across all development processes
- **Brand Consistency**: All UI components MUST follow the official VitalGo brand colors (`vitalgo-green`, `vitalgo-dark`) and design specifications from frontend/MANUAL_DE_MARCA.md

#### Development Flow
```
Reference Documents → Plan Implementation → Code Changes → Update Reference Documents → Test Data Validation → Validate Consistency
```

**Critical Rule**: Each development process that involves API endpoints, database modifications, type changes, test data management, or UI/design changes MUST consider and, if applicable, update these reference documents to maintain system integrity, developer experience, brand consistency, and testing quality consistency.

## Development Standards & Architecture

### Modular Monolith Architecture
- **Backend**: Vertical Slicing + Hexagonal Architecture (domain/application/infrastructure)
- **Frontend**: Vertical Slicing + Atomic Design
- **Critical Consistency**: Identical slice names across backend/frontend (e.g., `auth`)

### Stack
**Backend**: FastAPI, SQLAlchemy, AsyncPG, PostgreSQL, Redis, Pydantic, Poetry, PyJWT, Bcrypt  
**Frontend**: Next.js, React, TypeScript, Tailwind CSS, Radix UI, React Hook Form, Zustand, SWR, Lucide React  
**DevTools**: Docker, Pytest, Playwright, Prettier, Black, isort

## Directory Structure
```
[base_project_directory]/
├── .vscode/
├── .github/
├── backend/
│   ├── alembic/
│   ├── docker/
│   ├── slices/
│   │   ├── [slice]/
│   │   │   ├── application/
│   │   │   │   ├── ports/           # Interfaces/Contracts
│   │   │   │   └── use_cases/       # Business logic
│   │   │   ├── domain/
│   │   │   │   ├── models/          # SQLAlchemy models
│   │   │   │   └── entities/        # Domain entities
│   │   │   └── infrastructure/
│   │   │       ├── api/             # FastAPI endpoints
│   │   │       └── persistence/     # Repositories
│   │   └── home/
│   ├── shared/
│   │   ├── database/
│   │   ├── security/
│   │   └── utils/
│   ├── main.py
│   └── pyproject.toml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── slices/
│   │   │   ├── [slice]/
│   │   │   │   ├── components/
│   │   │   │   │   ├── atoms/      # Basic elements (buttons, inputs)
│   │   │   │   │   ├── molecules/  # Simple combinations (form fields)
│   │   │   │   │   ├── organisms/  # Complex components (forms, cards)
│   │   │   │   │   └── templates/  # Page layouts
│   │   │   │   ├── pages/          # Complete pages
│   │   │   │   └── services/       # API calls
│   │   │   └── home/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── styles/
│   │   └── app/
│   └── package.json
├── docker-compose.yaml
└── README.md
```

## Development Rules

### 🎯 Code Location (STRICT)
- **Domain models**: `backend/slices/[slice]/domain/models/`
- **Use cases**: `backend/slices/[slice]/application/use_cases/`
- **API endpoints**: `backend/slices/[slice]/infrastructure/api/`
- **React components**: `frontend/src/slices/[slice]/components/`
- **Shared services**: `frontend/src/shared/services/`

### 🏗️ Architecture Layers
**Backend (Hexagonal)**:
- `domain/`: Business entities, domain rules (no external dependencies)
- `application/`: Use cases, ports/interfaces
- `infrastructure/`: Adapters (API, DB, external services)

**Frontend (Atomic + Slicing + App Router)**:
- `services/`: API communication logic
- `components/`: Reusable UI elements. Use atomic design principles (internal atoms, molecules, organisms, and templates folders).
- Atoms (components/atoms/): No dependencies
- Molecules (components/molecules/): Depend only on atoms
- Organisms (components/organisms/): Depend on molecules and atoms
- Templates (components/templates/): Layout structure for pages
- `pages/`: Page-specific components. Compose everything together
- **App Router Exception**: `src/app/` for Next.js routing only. Maps to slice pages: `src/app/page.tsx` → `export { default } from '@/slices/home/pages/HomePage'`

### Sharing Components
- Slice-specific: `/slices/[slice]/components/`
- Shared across slices: `/shared/components/`
- Rule: If used in 2+ slices, move to shared

### Navigation Component Strategy
**PatientNavbar**: Single consolidated navigation component for authenticated patients
- **Location**: `/shared/components/organisms/PatientNavbar.tsx`
- **Self-contained**: Internal `useAuthUser` hook eliminates prop drilling
- **Features**: Authentication states, navigation items, user menu, mobile responsive
- **Usage**: Replace both `AuthenticatedNavbar` + `DashboardNavigation` complexity
- **Benefits**: 50% reduction in navigation complexity, no prop drilling, unified authentication

### Authentication Architecture
**AuthContext Pattern**: Single source of truth for authentication state
- **Core Provider**: `/shared/contexts/AuthContext.tsx` - Centralized authentication state management
- **Implementation**: React Context with `useAuth()` hook for accessing authentication state
- **Benefits**: Eliminates race conditions, prevents multiple authentication sources, centralizes login/logout logic
- **Integration**: All components use `useAuth()` instead of direct API calls or localStorage access
- **State Management**: `{ user, isAuthenticated, isLoading, login, logout, error }`
- **Route Protection**: `AuthGuard` component uses AuthContext for route-level authentication
- **UI Components**: Navigation and user components consume authentication state through `useAuthUser` hook
- **Security**: Token validation, storage management, and session handling centralized in AuthContext

### Static Assets Organization
**CRITICAL**: Framework constraints override organizational preferences:
```
public/
├── assets/
│   ├── images/
│   │   ├── logos/        # Logos shared across slices
│   │   └── icons/        # Icons shared across slices
│   └── fonts/            # Typography assets
```
**Rule**: Static assets (images, fonts, favicons) MUST go in `public/assets/` due to Next.js serving requirements.
**Code assets** (components, hooks, utils) follow slice organization in `src/`.

### Tailwind CSS Configuration
**CRITICAL**: Tailwind content paths must align with slice architecture:
```typescript
content: [
  './src/slices/**/*.{js,ts,jsx,tsx,mdx}',  // All slice components and pages
  './src/shared/**/*.{js,ts,jsx,tsx,mdx}',  // Shared components across slices
]
```
**Never include:**
- `./src/app/**/*` - App Router files are routing only, no styled content
- `./src/pages/**/*` - We don't use Pages Router
- `./src/components/**/*` - Components live in slices, not root

**Tailwind CSS 4 Requirements:**
```css
/* src/styles/globals.css - Use new import syntax */
@import "tailwindcss";
```
```typescript
/* tailwind.config.ts - Explicit color definitions required */
theme: {
  extend: {
    colors: {
      'green-500': '#10b981',
      'green-600': '#059669',
      // Define all colors explicitly for CSS 4 compatibility
    }
  }
}
```

## Testing Standards

### Testing Architecture (Hybrid Approach)
Follow slice-first principle but centralize shared testing infrastructure:

```
frontend/
├── src/slices/
│   └── [slice]/
│       └── tests/
│           ├── e2e/          # Slice-specific E2E tests
│           └── unit/         # Slice-specific unit tests
├── tests/
│   ├── e2e/
│   │   ├── flows/           # Cross-slice user flows
│   │   └── integration/     # Integration tests
│   ├── fixtures/            # Test data
│   ├── helpers/             # Test utilities
│   └── pages/               # Page Object Models
└── playwright.config.ts
```

### Testing Rules & Location
- **Slice-specific tests**: `src/slices/[slice]/tests/`
- **Cross-slice flows**: `tests/e2e/flows/`
- **Shared utilities**: `tests/helpers/`
- **Page Object Models**: `tests/pages/` (centralized for reuse)
- **Test data**: `tests/fixtures/` (reusable across tests)

### Frontend Testing Strategy
- **Unit/Integration**: Jest + Testing Library for components
- **E2E**: Playwright for critical user flows only (signup, login, core features)
- **Coverage**: 80% minimum

### Playwright Selectors (MANDATORY)
- **All interactive elements MUST have `data-testid`**: e.g <button data-testid="auth-login-submit">Login</button>,  <input data-testid="auth-email-input" type="email" />, <form data-testid="auth-login-form">...</form>
- **Always use data-testid selectors**: Never use: classes, css selectors, or text content. E.g. await page.getByTestId('auth-login-submit').click();
- **When to Create Tests**: Components: Unit test for organisms and critical molecules. E2E Playwright: Only for complete user journeys (1-2 per slice). Skip tests for: Atoms, simple molecules, styling-only components


### 📝 Naming Conventions

#### General Principles
- **Slice names**: Identical and descriptive name across backend/frontend (`auth`, not `authentication`)
- **Consistency**: Same naming pattern within each technology stack
- **Clarity**: Names should be self-documenting and unambiguous

#### Language-Specific Conventions

**Python (Backend)**:
- **Variables/Functions**: snake_case (`user_id`, `get_user_data`)
- **Classes**: PascalCase (`UserRepository`, `PatientModel`)
- **Constants**: UPPER_SNAKE_CASE (`JWT_SECRET_KEY`, `DEFAULT_TIMEOUT`)
- **Files**: snake_case.py (`user_repository.py`, `auth_endpoints.py`)
- **Database fields**: snake_case (`created_at`, `user_type`, `access_token`)

**TypeScript/JavaScript (Frontend)**:
- **Variables/Functions**: camelCase (`userId`, `getUserData`)
- **Components**: PascalCase (`LoginForm`, `DashboardPage`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Files**: kebab-case (`user-repository.ts`, `auth-endpoints.ts`)
- **Interface/Types**: PascalCase (`UserData`, `ApiResponse`)

**File Naming**:
- **All files**: kebab-case
- **React components**: PascalCase.tsx (`LoginForm.tsx`, `UserProfile.tsx`)
- **Utilities/Services**: kebab-case.ts (`api-client.ts`, `auth-utils.ts`)

#### Application-Specific Standards

**localStorage Keys** (Frontend):
- **Format**: camelCase
- **Standard keys**: `accessToken`, `refreshToken`, `user`, `preferredLanguage`
- **Never use**: snake_case in localStorage (`access_token`, `user_info`, `user_data`)

**API Response Fields** (Backend):
- **Format**: snake_case (REST API standard)
- **Examples**: `access_token`, `refresh_token`, `user_type`, `created_at`
- **Reason**: Follows JSON API conventions and Python standards

**User Object Properties**:
- **Backend API responses**: snake_case (`user_type`, `first_name`, `last_name`)
- **Frontend TypeScript interfaces**: camelCase (`userType`, `firstName`, `lastName`)
- **Database columns**: snake_case (`user_type`, `first_name`, `last_name`)

**Component Data Attributes**:
- **Test IDs**: [slice]-[component]-[element] format
- **Examples**: `auth-login-submit`, `profile-avatar-image`, `dashboard-stats-card`
- **Pattern**: kebab-case with logical hierarchy

#### Cross-Stack Consistency Rules

**Token Management**:
```typescript
// ✅ Frontend (camelCase)
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(userData));

// ✅ Backend API Response (snake_case)
{
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "user": { "user_type": "patient" }
}
```

**User Data Handling**:
```typescript
// ✅ Frontend TypeScript Interface
interface UserData {
  userId: string;
  email: string;
  userType: string;
  firstName?: string;
  lastName?: string;
}

// ✅ Backend Python Model
class User(BaseModel):
    user_id: str
    email: str
    user_type: str
    first_name: Optional[str]
    last_name: Optional[str]
```

#### Validation Checklist

Before committing code, verify:
- [ ] Frontend variables use camelCase
- [ ] Backend variables use snake_case
- [ ] localStorage keys use camelCase
- [ ] API responses use snake_case
- [ ] Component names use PascalCase
- [ ] File names use kebab-case
- [ ] Test IDs follow [slice]-[component]-[element] pattern
- [ ] No mixing of naming conventions within same technology stack

#### Common Anti-Patterns to Avoid

❌ **Mixed conventions in frontend**:
```typescript
// Wrong
localStorage.setItem('access_token', token);  // snake_case
const userId = user.user_id;  // mixed case
```

✅ **Consistent frontend conventions**:
```typescript
// Correct
localStorage.setItem('accessToken', token);  // camelCase
const userId = user.userId;  // camelCase
```

❌ **Inconsistent user object access**:
```typescript
// Wrong - mixing user_type and userType
if (userData.user_type === 'patient') { }  // snake_case
const role = userData.userType;  // camelCase
```

✅ **Consistent property mapping**:
```typescript
// Correct - map API response to frontend format
const frontendUser = {
  userId: apiResponse.user_id,  // map snake to camel
  userType: apiResponse.user_type,  // map snake to camel
  firstName: apiResponse.first_name
};
```

## Development Commands

```bash
# Full stack
docker-compose up -d

# Backend development
cd backend && poetry install && poetry run uvicorn main:app --reload

# Frontend development
cd frontend && npm install && npm run dev

# Testing
cd backend && poetry run pytest
cd frontend && npm run test
npx playwright test
```

## Code Quality Standards

- **Formatting**: Black + isort (Python), Prettier (TypeScript)
- **Testing**: 80% minimum coverage
- **Security**: Bcrypt passwords, JWT auth, Pydantic validation
- **Environment**: All secrets in env vars

## AI Development Checklist

Before generating any code:
1. ✅ Identify the correct slice
2. ✅ Determine the architecture layer
3. ✅ Verify directory structure compliance
4. ✅ Check slice name consistency (backend ↔ frontend)
5. ✅ Ensure proper separation of concerns
6. ✅ Validate import dependencies (no domain → infrastructure)
7. ✅ **Testing requirements**:
   - Add `data-testid="[slice]-[component]-[element]"` to ALL buttons, inputs, forms
   - Create E2E test ONLY for critical user flows (not individual components)
   - Unit tests for complex logic only
7. ✅ **CRITICAL**: Explain and validate each change. Don't advance until explicit confirmation.

## Dependencies Flow
```
Infrastructure → Application → Domain
     ↑              ↑
Components → Services → Shared
```

**Domain layer**: Zero external dependencies
**Application layer**: Can import domain only
**Infrastructure layer**: Can import application and domain

## Production Database Management

### Database Initialization and Lifecycle
```bash
# Initial Production Setup - Clean Start
1. Create fresh database instance (empty schema)
2. Run initial migrations to create schema structure
3. Seed with essential system data only (configurations, admin users)
4. Verify database connectivity and structure

# Post-Deployment - Data Persistence Guarantee
CRITICAL: Production data is PERMANENT and PROTECTED
- NO destructive operations allowed in production
- Data modifications only through controlled application logic
- All schema changes must be additive and backwards compatible
- Mandatory backups before any database changes
```

### Production Database Protection Rules
```sql
-- ❌ NEVER ALLOWED in production:
DROP TABLE users;                    -- Data loss
TRUNCATE TABLE orders;               -- Data loss
DELETE FROM patients;                -- Bulk data loss
ALTER TABLE users DROP COLUMN;      -- Potential data loss

-- ✅ SAFE operations in production:
ALTER TABLE users ADD COLUMN created_at TIMESTAMP;     -- Additive change
CREATE INDEX idx_user_email ON users(email);           -- Performance improvement
UPDATE users SET status = 'active' WHERE id = 123;     -- Controlled single update
```

### Migration Strategy - Zero Downtime
```python
# Safe migration pattern for production
def upgrade():
    # Phase 1: Add new column (nullable first)
    op.add_column('users', sa.Column('new_field', sa.String(50), nullable=True))

    # Phase 2: Populate data (separate deployment after verification)
    # UPDATE users SET new_field = 'default_value' WHERE new_field IS NULL;

    # Phase 3: Make constraints (third deployment, after data verification)
    # op.alter_column('users', 'new_field', nullable=False)

def downgrade():
    # Only remove additive changes, never existing data
    op.drop_column('users', 'new_field')
```

### Backup and Recovery Strategy
```bash
# Automated backup schedule
- Daily full backups with 30-day retention
- Point-in-time recovery capability
- Pre-change manual snapshots
- Cross-region backup replication for disaster recovery

# Recovery testing
- Monthly restore tests to verify backup integrity
- Documented recovery procedures with time estimates
- Database restore time objectives defined
```

## AWS Free Tier Deployment Strategy

### Free Tier Architecture (Test Environment)
- **Compute**: t2.micro EC2 instance (750 hrs/month free)
- **Database**: RDS t3.micro PostgreSQL (750 hrs/month free, 20GB storage)
- **Load Balancer**: Application Load Balancer (750 hrs/month free)
- **Storage**: S3 (5GB free)
- **Monitoring**: CloudWatch (basic metrics free)

### Deployment Flow: Local → DockerHub → AWS

```
infrastructure/
├── aws-free-tier/
│   ├── main.tf              # EC2 + RDS + ALB setup for TEST
│   ├── variables.tf
│   ├── user-data.sh         # Docker installation script
│   └── outputs.tf
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.aws.yml
└── scripts/
    ├── build-and-push.sh
    └── deploy-to-test.sh
```

### Docker Strategy (DockerHub Registry)
```yaml
# docker-compose.aws.yml
version: '3.8'
services:
  backend:
    image: your-dockerhub/template-backend:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${RDS_ENDPOINT}
      - JWT_SECRET_KEY=${JWT_SECRET}
    restart: unless-stopped
  
  frontend:
    image: your-dockerhub/template-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://${EC2_PUBLIC_IP}:8000
    restart: unless-stopped
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
```

### Terraform Configuration (Free Tier)
```hcl
# infrastructure/aws-free-tier/main.tf

# Security Group for web traffic
resource "aws_security_group" "web_sg" {
  name_prefix = "template-web-"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Restrict to your IP in production
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Elastic IP for consistent public access
resource "aws_eip" "app_eip" {
  instance = aws_instance.app_server.id
  domain   = "vpc"
  
  tags = {
    Name = "template-project-test-eip"
  }
}

# EC2 Instance with public IP
resource "aws_instance" "app_server" {
  ami                    = "ami-0c02fb55956c7d316" # Amazon Linux 2
  instance_type          = "t2.micro"              # Free tier eligible
  key_name              = var.key_pair_name        # Your SSH key
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  
  associate_public_ip_address = true
  
  user_data = file("user-data.sh")
  
  tags = {
    Name = "template-project-test"
  }
}

# RDS Subnet Group (required for RDS)
resource "aws_db_subnet_group" "postgres_subnet" {
  name       = "template-postgres-subnet"
  subnet_ids = data.aws_subnets.default.ids
  
  tags = {
    Name = "Template PostgreSQL subnet group"
  }
}

# Security Group for RDS
resource "aws_security_group" "rds_sg" {
  name_prefix = "template-rds-"
  
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  engine                 = "postgres"
  instance_class         = "db.t3.micro"         # Free tier eligible
  allocated_storage      = 20                    # Free tier eligible
  identifier             = "template-db"
  db_name               = "template"
  username              = var.db_username
  password              = var.db_password
  
  db_subnet_group_name   = aws_db_subnet_group.postgres_subnet.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  
  skip_final_snapshot = true
  publicly_accessible = false  # Only accessible from EC2
  
  tags = {
    Name = "template-postgres-test"
  }
}

# Data sources for default VPC/subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
```

### Deployment Scripts

```bash
# scripts/build-and-push.sh
#!/bin/bash
echo "Building and pushing to DockerHub..."

# Build images
docker build -f docker/Dockerfile.backend -t your-dockerhub/template-backend:latest ./backend
docker build -f docker/Dockerfile.frontend -t your-dockerhub/template-frontend:latest ./frontend

# Push to DockerHub
docker push your-dockerhub/template-backend:latest
docker push your-dockerhub/template-frontend:latest

echo "Images pushed successfully!"
```

```bash
# scripts/deploy-to-test.sh
#!/bin/bash
echo "Deploying to AWS EC2 Test Environment..."

# SSH into EC2 and pull latest images
ssh -i your-key.pem ec2-user@${EC2_PUBLIC_IP} << 'EOF'
  cd /app
  docker-compose -f docker-compose.aws.yml pull
  docker-compose -f docker-compose.aws.yml up -d
  docker system prune -f
EOF

echo "Test deployment completed!"
```

### 3-Step Deployment Process

```bash
# 1. Setup AWS Infrastructure (one time)
cd infrastructure/aws-free-tier

# Create terraform.tfvars
cat > terraform.tfvars << EOF
key_pair_name = "your-key-pair"
db_password   = "your-secure-password"
EOF

terraform init
terraform apply

# Get the public IP
export PUBLIC_IP=$(terraform output -raw public_ip)
echo "Application will be available at: http://$PUBLIC_IP"

# 2. Build & Push to DockerHub
./scripts/build-and-push.sh

# 3. Deploy to Test Environment
export EC2_PUBLIC_IP=$PUBLIC_IP
./scripts/deploy-to-test.sh
```

### Access Your Application
After deployment completes:
- **Frontend**: `http://YOUR_PUBLIC_IP` (port 80)
- **Backend API**: `http://YOUR_PUBLIC_IP/api` (proxied through nginx)
- **SSH Access**: `ssh -i your-key.pem ec2-user@YOUR_PUBLIC_IP`

### DNS (Optional)
For a custom domain:
```bash
# Point your domain to the Elastic IP
# Example: template-dev.yourdomain.com → YOUR_PUBLIC_IP

# Update nginx.conf with your domain
server_name template-dev.yourdomain.com;
```

### GitHub Actions Pipeline
```yaml
# .github/workflows/deploy-test.yml
name: Deploy Test to AWS Free Tier
on:
  push:
    branches: [test]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to DockerHub
        run: echo ${{ secrets.DOCKERHUB_TOKEN }} | docker login -u ${{ secrets.DOCKERHUB_USERNAME }} --password-stdin
      
      - name: Build and Push
        run: ./scripts/build-and-push.sh
      
      - name: Deploy to Test Environment
        env:
          EC2_PUBLIC_IP: ${{ secrets.EC2_PUBLIC_IP }}
        run: ./scripts/deploy-to-test.sh
```

### Free Tier Limits & Monitoring
- **EC2**: 750 hours/month (1 t2.micro instance 24/7)
- **RDS**: 750 hours/month + 20GB storage
- **Data Transfer**: 15GB/month outbound
- **Load Balancer**: 750 hours/month

### Cost Breakdown (Test Environment)
- **EC2 t2.micro**: $0 (free tier)
- **RDS t3.micro**: $0 (free tier) 
- **ALB**: $0 (free tier)
- **S3 storage**: $0 (under 5GB)
- **Data transfer**: $0 (under 15GB)
- **Total monthly cost**: ~$0-5 (only if exceeding limits)

### Environment Variables
```bash
# .env.test
DATABASE_URL=postgresql://username:password@rds-endpoint:5432/template
JWT_SECRET_KEY=your-secret-key
DOCKERHUB_USERNAME=your-username
EC2_PUBLIC_IP=your-ec2-ip
```

### Development Environments Summary
- **Local (Dev)**: `docker-compose up -d` - Full stack locally
- **Test (AWS)**: Public accessible instance for testing/demos
- **Production**: Scalable AWS services (ECS, RDS Multi-AZ, etc.)

## Production Environment Configuration Guidelines

### Container Configuration Best Practices

#### Docker Multi-Platform Builds
```bash
# CRITICAL: Always build for target platform (EC2 = AMD64)
docker buildx build --platform linux/amd64 -f docker/Dockerfile.backend -t your-registry/app:latest . --push

# Verify platform compatibility
docker inspect your-registry/app:latest | grep Architecture
```

#### Poetry Virtual Environment in Containers
```dockerfile
# Correct Poetry configuration in Docker
USER app  # Switch to non-root BEFORE installing dependencies

# Install dependencies as the application user
RUN poetry install --only=main --no-root
# DON'T remove cache if using virtualenvs

# Poetry finds virtualenv correctly when user matches installation
WORKDIR /app
USER app
```

#### Environment Variable Management
```bash
# Production environment variables checklist:
DATABASE_URL=postgresql://user:pass@rds-endpoint/dbname  # Full connection string
DATABASE_NAME=prod_db_name                               # Individual components
DATABASE_USER=prod_user                                  # for application settings
DATABASE_PASSWORD=secure_password                       # validation
ENVIRONMENT=production                                   # Environment identification
SKIP_DB_INIT=true                                       # Skip init on existing data
```

#### Database Initialization Intelligence
```bash
# Smart production initialization in entrypoint.sh
if [[ "$SKIP_DB_INIT" == "true" ]]; then
    echo "Skipping database initialization (SKIP_DB_INIT=true)"
else
    ./scripts/init-database.sh
fi

# Alternative: Auto-detect existing data
if poetry run python -c "import psycopg2; conn=psycopg2.connect('$DATABASE_URL'); cur=conn.cursor(); cur.execute('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=\\'public\\''); print(cur.fetchone()[0])" | grep -q "^[1-9]"; then
    echo "Database has existing schema - skipping initialization"
else
    echo "Empty database detected - running initialization"
    ./scripts/init-database.sh
fi
```

### Security Configuration Standards

#### Network Security
```hcl
# Security Group - Restrict SSH to specific IPs
resource "aws_security_group" "app_sg" {
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["YOUR_SPECIFIC_IP/32"]  # Never use 0.0.0.0/0 in production
  }

  # Application ports - public access
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# RDS Security - Only from application servers
resource "aws_security_group" "rds_sg" {
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]  # Reference, not CIDR
  }
}
```

#### Database Security
```hcl
# RDS Configuration with security features
resource "aws_db_instance" "prod_db" {
  storage_encrypted     = true              # Encrypt at rest
  publicly_accessible   = false             # Private subnet only
  deletion_protection   = true              # Prevent accidental deletion
  backup_retention_period = 7              # Automated backups

  # SSL enforcement via parameter group
  parameter_group_name = aws_db_parameter_group.ssl_required.name
}

resource "aws_db_parameter_group" "ssl_required" {
  family = "postgres15"

  parameter {
    name  = "log_statement"
    value = "all"                          # Audit logging
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"           # Performance monitoring
  }
}
```

### Deployment Workflow Excellence

#### Local → DockerHub → Production Flow
```bash
# 1. Local development and testing
docker-compose up -d
npm run test && poetry run pytest

# 2. Build and push to registry
docker buildx build --platform linux/amd64 -f docker/Dockerfile.backend -t registry/app:latest . --push

# 3. Production deployment via pull
ssh -i key.pem user@server "cd /app && docker-compose pull && docker-compose up -d"
```

#### Graceful Container Updates
```bash
# Zero-downtime deployment pattern
docker-compose pull service-name          # Download new image
docker-compose up -d service-name         # Graceful restart
docker system prune -f                    # Cleanup old images
```

#### Health Check Implementation
```dockerfile
# Container health checks
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:8000/health || exit 1
```

```bash
# Application health monitoring
# Verify both services are responding
curl -f http://server:8000/health  # Backend health
curl -f http://server:3000/api/health  # Frontend health
```

### Resource Management

#### Right-Sizing for Production
```hcl
# Start conservative, scale up as needed
resource "aws_instance" "app" {
  instance_type = "t3.small"  # Start larger for initial deployment

  # Scale down after successful deployment
  # instance_type = "t2.micro"  # Cost optimization
}
```

#### Memory and CPU Monitoring
```bash
# Monitor resource usage during deployment
docker stats --no-stream
free -h
top -b -n1 | head -20
```

### Error Recovery Procedures

#### Common Production Issues and Solutions
```bash
# Issue: SQLAlchemy ModuleNotFoundError
# Cause: Poetry virtualenv ownership mismatch
# Solution: Ensure user matches across Docker layers

# Issue: Database initialization fails with duplicate keys
# Cause: Existing production data
# Solution: SKIP_DB_INIT=true environment variable

# Issue: Container restart loops
# Cause: Application startup failures
# Solution: Check logs and health checks

# Troubleshooting commands
docker-compose logs service-name --tail=50
docker-compose exec service-name bash
docker-compose restart service-name
```

#### Backup and Recovery
```bash
# Pre-deployment backup
pg_dump -h rds-endpoint -U username dbname > backup_$(date +%Y%m%d_%H%M%S).sql

# Quick rollback procedure
docker-compose pull previous-image-tag
docker-compose up -d
```

### Production Monitoring Checklist

```bash
# Daily health checks
✅ Frontend accessible and responsive
✅ Backend API returning valid responses
✅ Database connections stable
✅ No error logs in application
✅ SSL certificates valid
✅ Resource usage within limits
✅ Backup systems functioning

# Weekly reviews
✅ Security patches applied
✅ Performance metrics reviewed
✅ Capacity planning assessment
✅ Disaster recovery testing
```

### Critical Production Rules

1. **Data Persistence**: Production data is PERMANENT - never run destructive operations
2. **Security First**: Restrict all access to minimum required (SSH, database, etc.)
3. **Graceful Updates**: Always use pull-and-restart, never direct builds on production
4. **Health Monitoring**: Implement and monitor health checks for all services
5. **Backup Strategy**: Automated backups + manual pre-change snapshots
6. **Documentation**: Document all configuration changes and deployment procedures
7. **Testing**: Test all changes in staging environment before production
8. **Rollback Plan**: Always have a verified rollback procedure ready

---

**Critical**: Every piece of code must have a specific location and responsibility. When in doubt, ask: "Which slice?" and "Which layer?"
**Critical**: Ask to human to confirm each change, explain the scope of the action to made. This before made any change.
**Critical**: NEVER NEVER NEVER use hardcoding data. You dev enterprise systems, use the real DB System in all the development. Any shortcut, we develop step by step.