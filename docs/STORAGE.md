# Storage System Documentation

VitalGo implements a dual storage system for profile photos that seamlessly switches between local development and AWS S3 production environments.

## Architecture Overview

### Storage Backends

The storage system uses a strategy pattern with two backend implementations:

1. **Local Storage Backend** - For development
2. **S3 Storage Backend** - For production

### Automatic Selection

Storage backend is automatically selected based on the `STORAGE_BACKEND` environment variable:

```python
# In storage_service.py
backend_type = os.getenv("STORAGE_BACKEND", "local").lower()
if backend_type == "s3":
    self.backend = S3StorageBackend()
else:
    self.backend = LocalStorageBackend()
```

## Local Development Configuration

### Environment Setup
```bash
# In backend/.env
STORAGE_BACKEND=local
UPLOADS_BASE_PATH=/tmp/claude/uploads
BACKEND_URL=http://localhost:8000
```

### File Storage Structure
```
/tmp/claude/uploads/
└── profile_photos/
    └── {user_id}/
        └── avatar.{ext}
```

### Static File Serving
Static files are served by FastAPI in development:

```python
# In main.py
if os.getenv("STORAGE_BACKEND", "local") == "local":
    uploads_path = os.getenv("UPLOADS_BASE_PATH", "/tmp/claude/uploads")
    app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")
```

### URL Format (Local)
- **Returned URL**: `http://localhost:8000/uploads/profile_photos/{user_id}/avatar.{ext}`
- **File Path**: `/tmp/claude/uploads/profile_photos/{user_id}/avatar.{ext}`

## Production (AWS S3) Configuration

### Environment Setup
```bash
# In deployment.env
STORAGE_BACKEND=s3
AWS_S3_BUCKET=vitalgo-profile-photos
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
```

### S3 Bucket Structure
```
vitalgo-profile-photos/
└── profile_photos/
    └── {user_id}/
        └── avatar.{ext}
```

### URL Format (S3)
- **Returned URL**: `https://vitalgo-profile-photos.s3.us-east-1.amazonaws.com/profile_photos/{user_id}/avatar.{ext}`
- **S3 Object Key**: `profile_photos/{user_id}/avatar.{ext}`

## File Upload Process

### 1. Client Upload
```typescript
// Frontend - FormData creation
const formData = new FormData();
formData.append('photo', file);

// API call
const response = await apiClient.post('/profile/photo', formData);
```

### 2. Backend Processing
```python
# Backend - File validation and storage
async def upload_profile_photo(photo: UploadFile, current_user: User):
    # 1. Validate file (format, size, content-type)
    # 2. Generate file path: profile_photos/{user_id}/avatar.{ext}
    # 3. Save via storage service
    storage = StorageService()
    photo_url = storage.save_profile_photo(str(user_id), contents, filename)
    # 4. Update database with returned URL
    # 5. Return success response with photo_url
```

### 3. Storage Service
```python
def save_profile_photo(self, user_id: str, file_data: bytes, filename: str) -> str:
    file_path = f"profile_photos/{user_id}/{filename}"
    return self.backend.save_file(file_data, file_path)
```

## File Validation Rules

### Supported Formats
- `.jpg` / `.jpeg`
- `.png`
- `.webp`

### Size Limits
- **Maximum**: 5MB per file
- **Validation**: Server-side before storage

### Content-Type Validation
- Must start with `image/`
- Checked via `photo.content_type`

### Security Features
- **Unique filenames**: Always saved as `avatar.{ext}` (overwrites previous)
- **Path sanitization**: User ID in path prevents directory traversal
- **Content validation**: File headers checked, not just extension

## Environment Configuration

### Local Development
```env
# backend/.env
STORAGE_BACKEND=local
UPLOADS_BASE_PATH=/tmp/claude/uploads
BACKEND_URL=http://localhost:8000
```

### Production Deployment
```env
# deployment.env (passed to containers)
STORAGE_BACKEND=s3
AWS_S3_BUCKET=vitalgo-profile-photos
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_REGION=us-east-1
```

### Docker Configuration
The deployment script automatically configures storage environment variables:

```yaml
# Generated docker-compose.prod.yml
environment:
  STORAGE_BACKEND: ${STORAGE_BACKEND}
  AWS_S3_BUCKET: ${AWS_S3_BUCKET}
  AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
  AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
  AWS_REGION: ${AWS_REGION}
```

## Troubleshooting

### Common Issues

#### 1. "Failed to load profile photo"
- **Symptom**: Image doesn't display after upload
- **Cause**: URL format mismatch (relative vs full URLs)
- **Solution**: Ensure storage service returns full URLs with protocol and domain

#### 2. "Field required" during upload
- **Symptom**: FastAPI validation error on photo upload
- **Cause**: FormData not properly handled by API client
- **Solution**: Ensure `Content-Type` is not set for FormData requests

#### 3. S3 connection failures
- **Symptom**: Upload succeeds but files not in S3
- **Cause**: Invalid AWS credentials or bucket permissions
- **Solution**: Verify AWS credentials and bucket exists with proper permissions

#### 4. Storage backend not switching
- **Symptom**: Using wrong storage in production/development
- **Cause**: `STORAGE_BACKEND` environment variable not set correctly
- **Solution**: Check environment configuration and container env vars

### Debugging Commands

#### Test Local Storage
```bash
# Check uploads directory
ls -la /tmp/claude/uploads/profile_photos/

# Test static file serving
curl -I http://localhost:8000/uploads/profile_photos/{user_id}/avatar.jpg

# Check server logs for storage backend initialization
grep -i "storage" server.log
```

#### Test S3 Storage
```bash
# List S3 bucket contents
aws s3 ls s3://vitalgo-profile-photos/profile_photos/

# Check S3 object permissions
aws s3api get-object-acl --bucket vitalgo-profile-photos --key profile_photos/{user_id}/avatar.jpg

# Test S3 object accessibility
curl -I https://vitalgo-profile-photos.s3.us-east-1.amazonaws.com/profile_photos/{user_id}/avatar.jpg
```

#### Debug Environment Configuration
```bash
# Check current storage backend
echo $STORAGE_BACKEND

# Verify AWS credentials (in container)
docker exec container_name env | grep AWS

# Check storage service logs
docker logs container_name | grep -i storage
```

## Security Considerations

### File Upload Security
- **Extension validation**: Server-side file extension checking
- **Content-Type validation**: MIME type verification
- **Size limits**: 5MB maximum to prevent DoS
- **Filename sanitization**: Standardized naming prevents path traversal

### S3 Security
- **Bucket permissions**: Configure minimal required permissions
- **Access keys**: Use IAM roles with least privilege principle
- **Public access**: Objects should be publicly readable for profile photos
- **Lifecycle policies**: Consider automatic cleanup of old files

### Local Development Security
- **Temporary storage**: Uses `/tmp/claude/` for isolation
- **Path restrictions**: User ID-based paths prevent cross-user access
- **Static serving**: Only serves files from designated upload directory

## Performance Considerations

### Local Storage
- **Disk I/O**: Fast for development, not scalable for production
- **Static serving**: FastAPI serves files directly
- **Cleanup**: Manual cleanup required for old files

### S3 Storage
- **Scalability**: Unlimited storage capacity
- **Global CDN**: Can be enhanced with CloudFront for better performance
- **Durability**: 99.999999999% (11 9's) durability
- **Cost**: Pay per usage model

### Optimization Recommendations
1. **Image compression**: Consider adding image optimization before storage
2. **CDN integration**: Use CloudFront for S3 objects in production
3. **Caching headers**: Set appropriate cache headers for static files
4. **Lazy loading**: Implement lazy loading for profile images in UI