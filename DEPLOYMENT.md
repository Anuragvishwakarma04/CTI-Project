# Deployment Guide

## Build and Deploy to Production

### 1. Build the Application

```bash
cd /Users/suraj/Documents/node/ctiweb
npm run build
```

### 2. Test the Build Locally

```bash
npm start
```

Visit http://localhost:3000 to verify the build works correctly.

### 3. Deploy to Production Server

#### Option A: Using PM2 (Recommended)

```bash
# Install PM2 globally if not installed
npm install -g pm2

# Start the application
pm2 start npm --name "ctiweb" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

#### Option B: Using Docker

```bash
# Build Docker image
docker build -t ctiweb .

# Run container
docker run -d -p 3000:3000 --name ctiweb ctiweb
```

#### Option C: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 4. Environment Variables

Make sure your production server has the correct environment variables:

```bash
NEXT_PUBLIC_API_URL=https://ctiapp.morbustech.com
```

### 5. Nginx Configuration (if using reverse proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

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

### 6. SSL Certificate (HTTPS)

```bash
# Using Certbot
sudo certbot --nginx -d your-domain.com
```

## Quick Deploy Commands

```bash
# 1. Build
npm run build

# 2. Copy build to server
scp -r .next package.json package-lock.json user@server:/path/to/app/

# 3. SSH to server
ssh user@server

# 4. Install dependencies and start
cd /path/to/app
npm install --production
pm2 restart ctiweb
```

## Rollback

```bash
# If something goes wrong
pm2 stop ctiweb
# Restore previous version
pm2 start ctiweb
```
