# AWS Lightsail Deployment Guide

## Prerequisites
- AWS Lightsail instance (Ubuntu 20.04 or later)
- Node.js 18+ installed on server
- Domain name (optional)

## Step 1: Prepare Your Local Project

```bash
# Option 1: Delete folders first (simpler)
cd /Users/suraj/Documents/node/ctiweb
rm -rf node_modules .next
cd ..
tar -czf ctiweb.tar.gz ctiweb/

# Option 2: Exclude during tar (macOS syntax)
cd /Users/suraj/Documents/node
tar --exclude='node_modules' --exclude='.next' --exclude='.git' -czf ctiweb.tar.gz ctiweb/
```

## Step 2: Connect to Lightsail Instance

```bash
# Download your Lightsail SSH key from AWS console
# Then connect:
ssh -i /path/to/LightsailKey.pem ubuntu@YOUR_LIGHTSAIL_IP
```

## Step 3: Install Node.js on Lightsail

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 (process manager)
sudo npm install -g pm2
```

## Step 4: Upload Your Project

### Option A: Using Termius SFTP (Easiest)
1. Open Termius app
2. Connect to your Lightsail server
3. Click the "SFTP" button at the bottom
4. Navigate to `/home/ubuntu/` on the server (right panel)
5. On your local machine (left panel), navigate to `/Users/suraj/Documents/node/`
6. Drag and drop `ctiweb.tar.gz` from left to right panel
7. Wait for upload to complete

### Option B: Using SCP (from your local terminal)
```bash
scp -i /path/to/LightsailKey.pem /Users/suraj/Documents/node/ctiweb.tar.gz ubuntu@YOUR_LIGHTSAIL_IP:/home/ubuntu/
```

### Option C: Using Git (recommended for updates)
```bash
# On Lightsail server (via Termius SSH)
cd /home/ubuntu
git clone YOUR_REPO_URL ctiweb
cd ctiweb
```

## Step 5: Setup Project on Lightsail

```bash
# If you uploaded tar.gz
cd /home/ubuntu
tar -xzf ctiweb.tar.gz
cd ctiweb

# Install dependencies
npm install

# Create .env.local file
nano .env.local
```

Add this to `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://ctiapp.morbustech.com
NODE_ENV=production
```

Save and exit (Ctrl+X, Y, Enter)

## Step 6: Build the Project

```bash
npm run build
```

## Step 7: Start with PM2

```bash
# Start the app
pm2 start npm --name "ctiweb" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs ctiweb
```

## Step 8: Configure Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ctiweb
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ctiweb /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 9: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

Or in Lightsail Console:
1. Go to your instance
2. Click "Networking" tab
3. Add firewall rules:
   - HTTP (80)
   - HTTPS (443)
   - SSH (22)

## Step 10: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is setup automatically
# Test renewal
sudo certbot renew --dry-run
```

## Useful PM2 Commands

```bash
# View logs
pm2 logs ctiweb

# Restart app
pm2 restart ctiweb

# Stop app
pm2 stop ctiweb

# Delete app from PM2
pm2 delete ctiweb

# Monitor
pm2 monit

# List all apps
pm2 list
```

## Update Deployment

```bash
# SSH to server
ssh -i /path/to/LightsailKey.pem ubuntu@YOUR_LIGHTSAIL_IP

# Navigate to project
cd /home/ubuntu/ctiweb

# Pull latest changes (if using Git)
git pull

# Or upload new files via SCP

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart app
pm2 restart ctiweb
```

## Troubleshooting

### Check if app is running
```bash
pm2 status
pm2 logs ctiweb --lines 100
```

### Check Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Check port 3000
```bash
sudo netstat -tulpn | grep 3000
curl http://localhost:3000
```

### Restart everything
```bash
pm2 restart ctiweb
sudo systemctl restart nginx
```

## Environment Variables

Make sure `.env.local` has:
```env
NEXT_PUBLIC_API_URL=https://ctiapp.morbustech.com
NODE_ENV=production
PORT=3000
```

## Performance Optimization

```bash
# Enable Nginx caching
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
```

## Monitoring

```bash
# Install htop for monitoring
sudo apt install htop

# Check system resources
htop

# Check disk space
df -h

# Check memory
free -h
```

## Backup

```bash
# Backup project
cd /home/ubuntu
tar -czf ctiweb-backup-$(date +%Y%m%d).tar.gz ctiweb/

# Download backup to local
scp -i /path/to/LightsailKey.pem ubuntu@YOUR_LIGHTSAIL_IP:/home/ubuntu/ctiweb-backup-*.tar.gz ./
```

## Quick Deploy Script

Create `deploy.sh` on server:
```bash
#!/bin/bash
cd /home/ubuntu/ctiweb
git pull
npm install
npm run build
pm2 restart ctiweb
echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Access Your App

- HTTP: `http://YOUR_LIGHTSAIL_IP`
- HTTPS: `https://yourdomain.com` (after SSL setup)

## Cost Estimate

- Lightsail instance: $3.50-$10/month (depending on size)
- Recommended: $5/month plan (1GB RAM, 1 vCPU)
