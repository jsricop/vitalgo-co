# Development Context

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
- **Slice names**: Identical and descriptive name across backend/frontend (`auth`, not `authentication`)
- **Python**: snake_case
- **TypeScript**: camelCase
- **Files**: kebab-case
- **Playwright**: [slice]-[component]-[element], e.g., auth-login-submit, profile-avatar-image, dashboard-stats-card

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

---

**Critical**: Every piece of code must have a specific location and responsibility. When in doubt, ask: "Which slice?" and "Which layer?"
**Critical**: Ask to human to confirm each change, explain the scope of the action to made. This before made any change.
**Critical**: NEVER NEVER NEVER use hardcoding data. You dev enterprise systems, use the real DB System in all the development. Any shortcut, we develop step by step.