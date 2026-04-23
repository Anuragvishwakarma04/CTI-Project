# How to Upload/Deploy CarTrade Project

## Option 1: Vercel (Recommended - Easiest)

### Step 1: Push to GitHub
```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/ctiweb.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Or use Vercel Dashboard:**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`
5. Click "Deploy"

**Live URL:** `https://your-project.vercel.app`

---

## Option 2: Netlify

### Deploy via Git
```bash
# Push to GitHub first (see above)

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Or use Netlify Dashboard:**
1. Go to https://netlify.com
2. Drag & drop your `.next` folder after running `npm run build`

---

## Option 3: cPanel/Shared Hosting

### Step 1: Build Project
```bash
npm run build
```

### Step 2: Upload Files via FTP
Upload these folders/files:
- `.next/`
- `public/`
- `node_modules/` (or run `npm install` on server)
- `package.json`
- `next.config.js`

### Step 3: Setup Node.js App in cPanel
1. Go to cPanel → Setup Node.js App
2. Node.js version: 18+
3. Application root: `/home/user/public_html`
4. Application URL: `yourdomain.com`
5. Application startup file: `node_modules/next/dist/bin/next`
6. Click "Create"

### Step 4: Add Environment Variables
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## Option 4: VPS (DigitalOcean, AWS, etc.)

### Step 1: Connect to Server
```bash
ssh root@your-server-ip
```

### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Upload Project
```bash
# On your local machine
scp -r ctiweb root@your-server-ip:/var/www/

# Or use Git
cd /var/www
git clone https://github.com/yourusername/ctiweb.git
cd ctiweb
```

### Step 4: Install & Build
```bash
npm install
npm run build
```

### Step 5: Run with PM2
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "ctiweb" -- start

# Save PM2 config
pm2 save
pm2 startup
```

### Step 6: Setup Nginx
```bash
sudo nano /etc/nginx/sites-available/ctiweb
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ctiweb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Option 5: Docker

### Step 1: Build Image
```bash
docker build -t ctiweb .
```

### Step 2: Run Container
```bash
docker run -d -p 3000:3000 --name ctiweb ctiweb
```

### Step 3: Or Use Docker Compose
```bash
docker-compose up -d
```

---

## Environment Variables

Create `.env.local` on server:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NODE_ENV=production
```

---

## Quick Commands Reference

```bash
# Build for production
npm run build

# Start production server
npm start

# Check if running
curl http://localhost:3000

# View logs (PM2)
pm2 logs ctiweb

# Restart app (PM2)
pm2 restart ctiweb

# Stop app (PM2)
pm2 stop ctiweb
```

---

## Troubleshooting

### Port already in use
```bash
# Find process
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

### Build fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Can't connect to API
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure Laravel backend is running
- Check CORS settings in Laravel

---

## Recommended: Vercel + Railway

**Frontend (Next.js):** Deploy to Vercel  
**Backend (Laravel):** Deploy to Railway/Heroku

1. Deploy Laravel to Railway
2. Get Railway URL: `https://your-app.railway.app`
3. Update Vercel env: `NEXT_PUBLIC_API_URL=https://your-app.railway.app`
4. Redeploy Vercel

---

## Free Hosting Options

- **Vercel** - Best for Next.js (Free tier)
- **Netlify** - Alternative to Vercel (Free tier)
- **Railway** - For Laravel backend (Free $5/month credit)
- **Render** - Full-stack hosting (Free tier)
- **Fly.io** - Docker hosting (Free tier)

---

## Need Help?

1. Check build logs
2. Verify environment variables
3. Test locally first: `npm run build && npm start`
4. Check server logs: `pm2 logs` or `vercel logs`
