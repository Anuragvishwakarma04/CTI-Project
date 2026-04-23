# Bitnami Lightsail Deployment Guide

## Bitnami Server Setup

Bitnami uses:
- User: `bitnami` (not ubuntu)
- Apache on port 80/443
- htdocs: `/opt/bitnami/apache/htdocs/`

## Step 1: Install Node.js on Bitnami

```bash
# Connect via Termius
# Login as: bitnami

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version

# Install PM2
sudo npm install -g pm2
```

## Step 2: Setup Project

```bash
# Move to home directory (not htdocs)
cd /home/bitnami

# If you uploaded to htdocs, move it
sudo mv /opt/bitnami/apache/htdocs/ctiweb.tar.gz /home/bitnami/
sudo chown bitnami:bitnami ctiweb.tar.gz

# Extract
tar -xzf ctiweb.tar.gz
cd ctiweb

# Install dependencies
npm install

# Create .env.local
nano .env.local
```

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://ctiapp.morbustech.com
NODE_ENV=production
PORT=3000
```

Save (Ctrl+X, Y, Enter)

```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "ctiweb" -- start
pm2 save
pm2 startup
# Run the command it outputs

# Check status
pm2 status
pm2 logs ctiweb
```

## Step 3: Configure Apache Reverse Proxy

```bash
# Enable required modules
sudo /opt/bitnami/ctlscript.sh stop apache
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_wstunnel
sudo a2enmod rewrite

# Create Apache config
sudo nano /opt/bitnami/apache/conf/vhosts/ctiweb.conf
```

Add this configuration:
```apache
<VirtualHost *:80>
    ServerName YOUR_DOMAIN_OR_IP
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # WebSocket support
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:3000/$1" [P,L]
    
    ErrorLog "logs/ctiweb-error.log"
    CustomLog "logs/ctiweb-access.log" common
</VirtualHost>
```

Save and exit.

```bash
# Test Apache config
sudo /opt/bitnami/apache/bin/apachectl configtest

# Start Apache
sudo /opt/bitnami/ctlscript.sh start apache

# Check status
sudo /opt/bitnami/ctlscript.sh status
```

## Step 4: Configure Firewall (Lightsail Console)

1. Go to Lightsail console
2. Click your instance
3. Go to "Networking" tab
4. Add firewall rules:
   - HTTP (80)
   - HTTPS (443)
   - Custom TCP (3000) - for direct access

## Step 5: Setup SSL with Bitnami

```bash
# Bitnami has built-in SSL tool
sudo /opt/bitnami/bncert-tool
```

Follow the prompts:
1. Enter your domain name
2. Enable www redirect
3. Enable HTTPS redirect
4. Agree to Let's Encrypt terms
5. Enter your email

This automatically:
- Gets SSL certificate
- Configures Apache
- Sets up auto-renewal

## Alternative: Manual SSL Setup

```bash
# Install Certbot
sudo apt install -y certbot

# Stop Apache
sudo /opt/bitnami/ctlscript.sh stop apache

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Start Apache
sudo /opt/bitnami/ctlscript.sh start apache

# Update Apache config
sudo nano /opt/bitnami/apache/conf/vhosts/ctiweb.conf
```

Add SSL VirtualHost:
```apache
<VirtualHost *:443>
    ServerName YOUR_DOMAIN
    
    SSLEngine on
    SSLCertificateFile "/etc/letsencrypt/live/yourdomain.com/cert.pem"
    SSLCertificateKeyFile "/etc/letsencrypt/live/yourdomain.com/privkey.pem"
    SSLCertificateChainFile "/etc/letsencrypt/live/yourdomain.com/chain.pem"
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:3000/$1" [P,L]
</VirtualHost>
```

## Useful Bitnami Commands

```bash
# Stop all services
sudo /opt/bitnami/ctlscript.sh stop

# Start all services
sudo /opt/bitnami/ctlscript.sh start

# Restart Apache only
sudo /opt/bitnami/ctlscript.sh restart apache

# Check status
sudo /opt/bitnami/ctlscript.sh status

# View Apache logs
sudo tail -f /opt/bitnami/apache/logs/error_log
sudo tail -f /opt/bitnami/apache/logs/access_log
```

## PM2 Commands

```bash
# View logs
pm2 logs ctiweb

# Restart app
pm2 restart ctiweb

# Stop app
pm2 stop ctiweb

# Monitor
pm2 monit

# List apps
pm2 list
```

## Update Deployment

```bash
# SSH to server
cd /home/bitnami/ctiweb

# Upload new files via Termius SFTP or Git pull
git pull

# Install dependencies
npm install

# Rebuild
npm run build

# Restart
pm2 restart ctiweb
```

## Troubleshooting

### Check if Node.js app is running
```bash
pm2 status
pm2 logs ctiweb --lines 50
curl http://localhost:3000
```

### Check Apache
```bash
sudo /opt/bitnami/ctlscript.sh status
sudo tail -f /opt/bitnami/apache/logs/error_log
```

### Check port 3000
```bash
sudo netstat -tulpn | grep 3000
```

### Restart everything
```bash
pm2 restart ctiweb
sudo /opt/bitnami/ctlscript.sh restart apache
```

### Permission issues
```bash
# Fix ownership
sudo chown -R bitnami:bitnami /home/bitnami/ctiweb
```

## Access Your App

- Direct Node.js: `http://YOUR_IP:3000`
- Via Apache: `http://YOUR_IP` or `http://yourdomain.com`
- HTTPS: `https://yourdomain.com` (after SSL setup)

## Important Notes

1. **Don't put Next.js in htdocs** - It needs Node.js, not Apache
2. **Use /home/bitnami/** for your app
3. **Apache proxies** requests from port 80 to Node.js on port 3000
4. **PM2 keeps** your Node.js app running
5. **Bitnami user** is `bitnami`, not `ubuntu`

## Quick Setup Summary

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# 2. Setup project
cd /home/bitnami
tar -xzf ctiweb.tar.gz
cd ctiweb
npm install
npm run build

# 3. Start app
pm2 start npm --name "ctiweb" -- start
pm2 save

# 4. Configure Apache proxy
sudo nano /opt/bitnami/apache/conf/vhosts/ctiweb.conf
# (Add proxy config from above)

# 5. Restart Apache
sudo /opt/bitnami/ctlscript.sh restart apache
```

Done! Access at `http://YOUR_IP`
