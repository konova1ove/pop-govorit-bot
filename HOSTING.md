# 🚀 Deployment Guide - Railway (Free 24/7 Hosting)

## 📋 Steps to Deploy:

### 1. Push to GitHub
```bash
git add .
git commit -m "🚀 Add 24/7 hosting support with Railway"
git push
```

### 2. Deploy on Railway
1. **Go to** https://railway.app
2. **Sign up** with GitHub account
3. **Click "New Project"** → **Deploy from GitHub repo**
4. **Select** `pop-govorit-main` repository
5. **Add Environment Variable:**
   - Key: `BOT_TOKEN`
   - Value: `8235736953:AAFnfjCWbSjmYjkzdPI4rLjROkx14kzP-2c`

### 3. Configuration Files Added:
- ✅ `railway.json` - Railway deployment config
- ✅ `Procfile` - Process definition
- ✅ `Dockerfile` - Container setup
- ✅ `.dockerignore` - Exclude unnecessary files

### 4. Alternative Free Hosting Options:

#### Option A: Render.com
1. Go to https://render.com
2. Connect GitHub → Select repo
3. Choose "Web Service"
4. Add environment variable: `BOT_TOKEN`

#### Option B: Heroku (Limited Free)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create pop-govorit-bot

# Set environment variable
heroku config:set BOT_TOKEN=8235736793:AAFnfjCWbSjmYjkzdPI4rLjROkx14kzP-2c

# Deploy
git push heroku main
```

#### Option C: Fly.io
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Launch app
fly launch
fly secrets set BOT_TOKEN=8235736793:AAFnfjCWbSjmYjkzdPI4rLjROkx14kzP-2c
fly deploy
```

## ✅ Benefits of Cloud Hosting:
- 🔄 **24/7 Uptime** - Always available
- 🚀 **Auto-restart** - Automatic recovery from crashes
- 📊 **Monitoring** - Built-in health checks
- 🔒 **Environment Variables** - Secure token storage
- 📈 **Scalability** - Handle more users

## 🎯 Recommended: Railway
- **Free Tier:** 500 hours/month (enough for 24/7)
- **Easy GitHub integration**
- **Automatic deployments**
- **Built-in monitoring**
- **No credit card required**

## 🔧 Monitoring Commands:
```bash
# Railway CLI (after installation)
railway logs
railway status

# Check if bot is responding
curl -X GET "https://api.telegram.org/bot8235736793:AAFnfjCWbSjmYjkzdPI4rLjROkx14kzP-2c/getMe"
```

**🎉 After deployment, your bot will be available 24/7!**