# 🔐 Render Environment Variables Configuration

## Required Environment Variables for Render

Copy and paste these into your Render service environment variables section:

### 1. **Database Configuration**
```
DATABASE_URL=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/edubot?retryWrites=true&w=majority
```
⚠️ **Important**: Replace with your actual MongoDB Atlas connection string

### 2. **Security Configuration**
```
SECRET_KEY=your-super-secret-jwt-key-at-least-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
⚠️ **Important**: Generate a strong secret key for production

### 3. **Application Configuration**
```
ENV=production
DEBUG=False
PORT=10000
```

### 4. **CORS Configuration**
```
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000
```
⚠️ **Important**: Update with your actual frontend domain after Vercel deployment

### 5. **Optional Variables**
```
OPENAI_API_KEY=your-openai-api-key-for-ai-features
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-email-app-password
```

## 🔑 **How to Generate a Strong Secret Key**

Run this in your terminal to generate a secure secret key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 📋 **MongoDB Atlas Setup Quick Guide**

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create account and free cluster
3. Create database user (Database Access → Add New Database User)
4. Allow all IP addresses (Network Access → Add IP Address → 0.0.0.0/0)
5. Get connection string (Connect → Connect your application)

## ⚙️ **Render Service Configuration Summary**

```yaml
# Service Settings
Name: edubot-api
Environment: Python 3
Branch: main
Build Command: ./apps/api/build.sh
Start Command: ./apps/api/start.sh
Auto-Deploy: Yes
```

## 🚀 **Ready to Deploy!**

After setting up these environment variables in Render, your API will be ready to deploy!

Your API will be available at: `https://edubot-api-[random].onrender.com`