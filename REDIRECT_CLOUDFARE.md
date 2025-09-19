# Cloudflare Domain Redirect Setup for vitalgo.co

## Overview
Redirect GoDaddy domain `vitalgo.co` to AWS machine `http://23.21.33.96` using Cloudflare free tier.

## Cloudflare Free Tier Benefits
✅ **Free SSL Certificate** - Automatic HTTPS for vitalgo.co
✅ **CDN** - Faster global loading times
✅ **DDoS Protection** - Basic security layer
✅ **Analytics** - Traffic insights
✅ **Page Rules** - Can handle port redirection (3000 → 80/443)
✅ **Better DNS Management** - More reliable than GoDaddy DNS

## Setup Steps

### 1. Create Cloudflare Account
- Go to cloudflare.com → Sign up for free
- Add domain: `vitalgo.co`
- Cloudflare will scan existing DNS records

### 2. Update Nameservers in GoDaddy
- Cloudflare will provide 2 nameservers (like `ns1.cloudflare.com`, `ns2.cloudflare.com`)
- In GoDaddy: My Products → Domains → vitalgo.co → Manage DNS
- Change nameservers from GoDaddy to Cloudflare's

### 3. Configure DNS in Cloudflare
In Cloudflare dashboard → DNS → Records, add A records:

| Type | Name | IPv4 Address | Proxy Status |
|------|------|-------------|--------------|
| A | @ | 23.21.33.96 | ✅ Proxied |
| A | www | 23.21.33.96 | ✅ Proxied |

### 4. SSL/TLS Configuration
- SSL/TLS tab → Set encryption mode to "Full"
- Enable "Always Use HTTPS"
- Edge Certificates → Enable "Always Use HTTPS"

## Current AWS Deployment Status ✅

### Infrastructure Ready
- **EC2 Instance**: `23.21.33.96` (t3.small, Amazon Linux 2)
- **Security Groups**: HTTP (80) and HTTPS (443) ports open
- **Application**: Running on port 3000 via Docker Compose
- **Nginx**: Installed and configured as reverse proxy

### Nginx Configuration Status ✅
Nginx is already installed and configured:
- **Service**: Active and enabled
- **Configuration**: `/etc/nginx/conf.d/vitalgo.conf`
- **Reverse Proxy**: Port 80 → localhost:3000
- **Status**: HTTP requests working correctly

## Handling Port 3000 Issue ✅ COMPLETED

### Option A: Configure AWS Server ✅ DONE

Nginx reverse proxy is installed and configured:
```bash
# Status check (already completed)
sudo systemctl status nginx
curl -I http://23.21.33.96  # Returns HTTP 200
```

Add this nginx configuration:
```nginx
server {
    listen 80;
    server_name vitalgo.co www.vitalgo.co;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/vitalgo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option B: Change Your App Port
- Modify your application to run on port 80 instead of 3000

## Expected Result
- **https://vitalgo.co** with free SSL
- CDN for faster loading globally
- DDoS protection
- Professional setup vs. direct IP

## Verification Checkpoints

### Pre-Cloudflare Setup ✅
- [ ] **AWS Infrastructure**: EC2 instance running
- [ ] **Security Groups**: Ports 80 and 443 open
- [ ] **Nginx**: Reverse proxy configured and running
- [ ] **Application**: Accessible via `http://23.21.33.96`

### During Cloudflare Setup
- [ ] **Nameservers**: Updated in GoDaddy
- [ ] **DNS Records**: A records pointing to `23.21.33.96`
- [ ] **SSL/TLS**: Set to "Full" encryption mode
- [ ] **Proxy Status**: Enabled for both @ and www

### Post-Setup Verification
- [ ] **Domain Access**: `http://vitalgo.co` loads
- [ ] **HTTPS Redirect**: Automatic redirect to `https://vitalgo.co`
- [ ] **SSL Certificate**: Valid and issued by Cloudflare
- [ ] **CDN**: Response headers show Cloudflare

## Notes
- DNS propagation can take 24-48 hours
- Cloudflare provides better performance and security than direct GoDaddy DNS
- The nginx reverse proxy solution keeps your app on port 3000 while serving traffic properly on standard web ports