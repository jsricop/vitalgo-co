# VitalGo Universal Deployment Guide

## 🚀 Quick Start

**One-command deployment to production:**

```bash
# First time setup
cp deployment.env.example deployment.env
# Edit deployment.env with your AWS credentials

# Deploy to production
./deploy.sh
```

## 📋 Requirements

- **Docker** installed and running
- **AWS credentials** configured
- **SSH access** to production EC2
- **deployment.env** file configured

## 🎯 Usage

### Standard Deployment (Auto-detect)
```bash
./deploy.sh
```
Automatically detects if migrations are needed and deploys accordingly.

### Migration Deployment (Force DB changes)
```bash
./deploy.sh --with-migrations
```
Forces migration mode - use when you have database schema changes.

### Configuration Validation
```bash
./deploy.sh --validate
```
Validates all configuration without deploying.

### Emergency Rollback
```bash
./deploy.sh --rollback
```
Instantly rolls back to the previous deployment.

## 🔧 Configuration

Edit `deployment.env` with your production values:

```bash
# AWS Configuration
EC2_PUBLIC_IP=your-ec2-ip
EC2_SSH_KEY=/path/to/your-key.pem
DOMAIN_NAME=vitalgo.co

# Database
RDS_ENDPOINT=your-rds-endpoint
DB_NAME=vitalgo_production
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# DockerHub
DOCKERHUB_USERNAME=your-username

# Secrets
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-key
```

## 🛡️ Safety Features

✅ **Auto-backup** - Creates RDS snapshots before changes
✅ **Zero-downtime** - Rolling deployment with health checks
✅ **Data preservation** - Never loses production data
✅ **Auto-detection** - Smart migration detection
✅ **Rollback ready** - Emergency restore capability

## 📊 Pipeline

The script follows this production-ready pipeline:

1. **Validation** - Environment and connectivity checks
2. **Auto-detection** - Determines deployment type needed
3. **Backup** - Creates safety snapshots
4. **Build** - Multi-platform Docker builds
5. **Push** - Publishes to DockerHub
6. **Deploy** - Zero-downtime AWS deployment
7. **Migrate** - Applies DB changes (if needed)
8. **Verify** - Health checks and validation

## 🆘 Troubleshooting

### Common Issues

**Docker login failed:**
```bash
docker login
```

**SSH connection failed:**
```bash
# Check SSH key permissions
chmod 600 /path/to/your-key.pem
```

**Migration failed:**
```bash
# Use rollback
./deploy.sh --rollback
```

### Logs

Deployment logs are saved to `/tmp/vitalgo_deploy_YYYYMMDD_HHMMSS.log`

## 📞 Support

For deployment issues:
1. Check the log file location shown during deployment
2. Verify `deployment.env` configuration
3. Use `./deploy.sh --validate` to test configuration
4. Use `./deploy.sh --rollback` for emergency restore

---

**Next:** [API Documentation](https://vitalgo.co/docs) | [Development Guide](DEV_CONTEXT.md)