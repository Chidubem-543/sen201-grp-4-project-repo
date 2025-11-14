# Netlify Deployment Guide

## ⚠️ Important: Limitations with Netlify

This application uses **Node.js/Express with SQLite database**, which presents challenges for Netlify deployment:

### Issues:
1. **SQLite Database**: Netlify's serverless functions are stateless - the SQLite file won't persist between function invocations
2. **Express Server**: The full Express app needs to be converted to serverless functions
3. **File System**: Netlify functions have read-only file systems (except `/tmp`)

## 🎯 Recommended Solutions

### Option 1: Use Render.com (RECOMMENDED)
Render is better suited for this full-stack app:

1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: `Chidubem-543/sen201-grp-4-project-repo`
5. Configure:
   ```
   Name: accessible-content-platform
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
6. Add environment variables:
   - `JWT_SECRET` = (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
7. Click "Create Web Service"

**Advantages:**
- ✅ Full Node.js support
- ✅ Persistent file system (SQLite works)
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ No code changes needed

### Option 2: Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create accessible-platform`
4. Set env vars:
   ```bash
   heroku config:set JWT_SECRET=your_secret_here
   heroku config:set NODE_ENV=production
   ```
5. Deploy: `git push heroku main`

### Option 3: Railway.app
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. New Project → Deploy from GitHub repo
4. Select your repo
5. Add environment variables
6. Deploy automatically

### Option 4: DigitalOcean App Platform
1. Go to [digitalocean.com](https://www.digitalocean.com/products/app-platform)
2. Create App → GitHub
3. Select repository
4. Configure environment variables
5. Deploy

## 🔧 Option 5: Adapt for Netlify (Advanced)

If you must use Netlify, you'll need to:

### Changes Required:
1. **Replace SQLite with External Database**:
   - Use MongoDB Atlas (free tier)
   - Use PostgreSQL on ElephantSQL or Supabase
   - Use Netlify Blob Store

2. **Convert Express to Serverless Functions**:
   - Create separate function files for each API route
   - Restructure app architecture

3. **Update Code Structure**:
   ```
   netlify/
   └── functions/
       ├── auth.js
       ├── content.js
       └── contact.js
   ```

### Would you like me to convert the app for Netlify?
This is complex and involves:
- Replacing SQLite with MongoDB/PostgreSQL
- Breaking Express routes into serverless functions
- Updating all database calls
- Testing thoroughly

**Estimated time**: 1-2 hours of refactoring

## 🚀 Quick Deploy (Render - RECOMMENDED)

The fastest path to deployment:

```bash
# No changes needed! Just:
1. Go to render.com
2. Connect GitHub repo
3. Deploy as Web Service
4. Add environment variables
5. Done!
```

## 📊 Platform Comparison

| Platform | Complexity | Free Tier | Setup Time | Best For |
|----------|-----------|-----------|------------|----------|
| **Render** | ⭐ Easy | ✅ Yes | 5 min | This app (RECOMMENDED) |
| **Railway** | ⭐ Easy | ✅ Yes | 5 min | Quick deploys |
| **Heroku** | ⭐⭐ Medium | ⚠️ Limited | 10 min | Mature apps |
| **Netlify** | ⭐⭐⭐⭐ Complex | ✅ Yes | 2+ hours | Static/JAMstack sites |
| **DigitalOcean** | ⭐⭐ Medium | ❌ No | 10 min | Production apps |

## ❓ Which Should You Choose?

- **Just want it deployed fast?** → Use **Render** (5 minutes, no code changes)
- **Need free forever?** → Use **Render** or **Railway**
- **Already know Heroku?** → Use **Heroku**
- **Want to learn serverless?** → I can help convert for **Netlify**

## 🆘 Need Help?

Let me know which platform you'd like to use and I can:
1. Walk you through the deployment steps
2. Generate the necessary config files
3. Help troubleshoot any issues

**My recommendation**: Deploy to Render.com - it's the easiest path with zero code changes needed.
