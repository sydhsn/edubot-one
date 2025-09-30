# 🚀 Render Deployment Guide for EduBot API

## ⚠️ **IMPORTANT: Choose Deployment Method**

Render offers two deployment methods. Choose **Option A (Recommended)** for simplicity:

### **Option A: Native Python Environment (Recommended)**
- ✅ Faster builds
- ✅ Easier debugging  
- ✅ Better for Python apps
- ✅ Uses `requirements.txt` directly

### **Option B: Docker Environment**
- 🐳 Uses Dockerfile
- 📦 More isolated
- 🛠️ More complex setup

---

## 🚀 **Option A: Native Python Deployment (Recommended)**

### 1. 📁 **Connect Repository to Render**

1. Go to [https://render.com](https://render.com)
2. Sign up/Login with your GitHub account
3. Click **"New +"** → **"Web Service"**
4. Connect your `edubot-one` repository
5. Select the repository and click **"Connect"**

### 2. ⚙️ **Configure Service Settings**

**IMPORTANT: Select Native Environment (NOT Docker)**

**Basic Configuration:**
- **Name**: `edubot-api`
- **Branch**: `main`
- **Runtime**: `Python 3` ⚠️ **NOT Docker**
- **Region**: Choose closest to your users
- **Build Command**: `cd apps/api && pip install -r requirements.txt`
- **Start Command**: `cd apps/api && uvicorn src.main:app --host 0.0.0.0 --port $PORT`
- **Instance Type**: `Free` (or paid for production)

**Advanced Settings:**
- **Root Directory**: Leave empty (Render will use repository root)
- **Auto-Deploy**: `Yes` (deploys on every push to main)
- **Python Version**: `3.11.9` (will be read from runtime.txt)

---

## 🐳 **Option B: Docker Deployment (Alternative)**

If you prefer Docker deployment:

**Basic Configuration:**
- **Name**: `edubot-api`
- **Branch**: `main`  
- **Runtime**: `Docker` 
- **Dockerfile Path**: `Dockerfile` (in root directory)
- **Instance Type**: `Free` (or paid for production)

**Advanced Settings:**
- **Root Directory**: Leave empty
- **Auto-Deploy**: `Yes`

---

### 3. 🔐 **Environment Variables**

Add these environment variables in Render dashboard:

```bash
# Required Variables
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/edubot?retryWrites=true&w=majority
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENV=production
DEBUG=False
PORT=10000

# Optional Variables
OPENAI_API_KEY=your-openai-api-key
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000
```

### 4. 🗄️ **Database Setup (MongoDB Atlas)**

If you don't have MongoDB Atlas set up:

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Get the connection string
5. Replace `DATABASE_URL` in environment variables

### 5. 🚀 **Deploy**

1. Click **"Create Web Service"**
2. Render will automatically start building and deploying
3. Wait for the build to complete (5-10 minutes)
4. Your API will be available at: `https://edubot-api.onrender.com`

## 📋 **Post-Deployment Checklist**

### ✅ **Test API Endpoints**

```bash
# Health check
curl https://edubot-api.onrender.com/health

# Root endpoint
curl https://edubot-api.onrender.com/

# API documentation
# Visit: https://edubot-api.onrender.com/docs
```

### ✅ **Update Frontend Configuration**

Update your web app's API configuration to use the Render URL:

```typescript
// apps/web/src/config/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://edubot-api.onrender.com/api/v1'
  : 'http://localhost:8000/api/v1';
```

## 🔧 **Troubleshooting**

### **"No Dockerfile found" Error**
✅ **Solution**: Choose **"Python 3"** runtime, NOT "Docker"
- In Render dashboard, make sure Runtime is set to "Python 3"
- If you accidentally selected Docker, delete the service and recreate with Python 3

### **Build Fails**
- Check the build logs in Render dashboard
- Verify `requirements.txt` has all dependencies
- Ensure Python version in `runtime.txt` is supported (3.11.9)

### **App Crashes on Start**
- Check start command: `cd apps/api && uvicorn src.main:app --host 0.0.0.0 --port $PORT`
- Verify environment variables are set correctly
- Check application logs for import errors

### **Import Errors**
- Ensure the start command includes `cd apps/api`
- Check that all required files are in the `apps/api` directory
- Verify PYTHONPATH is set correctly

### **Database Connection Issues**
- Verify `DATABASE_URL` is correct
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Check database user permissions

### **CORS Issues**
- Add your frontend domain to `ALLOWED_ORIGINS`
- Update CORS middleware in `main.py`

## 📊 **Monitoring & Logs**

- **Logs**: View in Render dashboard → Service → Logs
- **Metrics**: Available in Service → Metrics tab
- **Health**: Monitor `/health` endpoint

## 🔄 **Auto-Deploy Setup**

Your service will automatically redeploy when you push to the `main` branch. To deploy:

```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

## 💰 **Costs**

- **Free Tier**: 750 hours/month, sleeps after 15 min inactivity
- **Paid Plans**: Start at $7/month for always-on service

## 🔗 **Useful Links**

- **Service URL**: `https://edubot-api.onrender.com`
- **API Docs**: `https://edubot-api.onrender.com/docs`
- **Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)

---

## 🎯 **Next Steps**

1. ✅ Deploy API to Render
2. 🌐 Deploy frontend to Vercel
3. 🔗 Connect frontend to deployed API
4. 🧪 Test full application flow

Your API is ready for production! 🚀