# Edubot Deployment Guide

## Table of Contents
1. [Docker Setup & Local Development](#docker-setup--local-development)
2. [Building Docker Images](#building-docker-images)
3. [Running Applications](#running-applications)
4. [API Deployment on Render](#api-deployment-on-render)
5. [Web App Deployment on Vercel](#web-app-deployment-on-vercel)
6. [Environment Configuration](#environment-configuration)
7. [Production Considerations](#production-considerations)

---

## Docker Setup & Local Development

### Prerequisites
- Docker Desktop installed (Apple Silicon version for M1/M2 Macs)
- Node.js 20+ installed
- Python 3.11+ installed

### Project Structure
```
edubot-one/
├── apps/
│   ├── api/               # FastAPI Backend
│   │   ├── src/
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── .env
│   └── web/               # React Frontend
│       ├── src/
│       ├── Dockerfile
│       ├── nginx.conf
│       └── package.json
├── docker-compose.yml     # Multi-service orchestration
├── deploy.sh             # Deployment script
└── check-docker.sh       # Docker verification script
```

---

## Building Docker Images

### Build Individual Services

#### API (FastAPI) Build
```bash
# From project root
docker build -f apps/api/Dockerfile -t edubot-api .
```

#### Web (React) Build
```bash
# From project root
docker build -f apps/web/Dockerfile -t edubot-web .
```

### Build All Services
```bash
# Using docker-compose
docker-compose build

# Or use the deployment script
./deploy.sh
```

### Docker Images Details

#### API Dockerfile (`apps/api/Dockerfile`)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY apps/api/src/ ./src/

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Web Dockerfile (`apps/web/Dockerfile`)
```dockerfile
# Build stage
FROM node:20-alpine as build

WORKDIR /workspace

# Copy everything and build
COPY . .
RUN npm install
RUN npx nx build web

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /workspace/apps/web/dist/ /usr/share/nginx/html/

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

---

## Running Applications

### Local Development (Docker)

#### Quick Start
```bash
# Make scripts executable
chmod +x deploy.sh check-docker.sh

# Check Docker installation
./check-docker.sh

# Deploy all services
./deploy.sh
```

#### Manual Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

#### Individual Service Control
```bash
# Start only API
docker-compose up -d api mongodb

# Start only Web
docker-compose up -d web

# Restart a service
docker-compose restart api
```

### Local Development (Without Docker)

#### API Setup
```bash
cd apps/api

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the server
uvicorn src.main:app --reload --port 8000
```

#### Web Setup
```bash
# From project root
npm install

# Start development server
npx nx serve web
```

### Service URLs
- **Web Application**: http://localhost (port 80)
- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MongoDB**: localhost:27017

---

## API Deployment on Render

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure `apps/api/requirements.txt` is up to date
3. Create production environment file

### Step 2: Render Configuration

#### Create Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

```yaml
# Render Configuration
Name: edubot-api
Environment: Python 3
Region: Oregon (US West)
Branch: main
Build Command: cd apps/api && pip install -r requirements.txt
Start Command: cd apps/api && uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

#### Environment Variables on Render
```bash
# Required Environment Variables
ENV=production
DEBUG=False
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (MongoDB Atlas recommended)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/edubot

# OpenAI (if using AI features)
OPENAI_API_KEY=your-openai-api-key

# CORS (include your Vercel domain)
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 3: Database Setup
1. Create MongoDB Atlas cluster (free tier available)
2. Configure network access (allow all IPs: 0.0.0.0/0 for Render)
3. Create database user
4. Get connection string and add to Render environment variables

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Access your API at: `https://your-service-name.onrender.com`

### Step 5: Verification
```bash
# Test API health
curl https://your-service-name.onrender.com/health

# Test API docs
# Visit: https://your-service-name.onrender.com/docs
```

---

## Web App Deployment on Vercel

### Step 1: Prepare for Vercel

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Update API URL
Create or update `apps/web/src/config/api.ts`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-service.onrender.com'
  : 'http://localhost:8000';

export { API_BASE_URL };
```

### Step 2: Vercel Configuration

#### Create `vercel.json` in project root
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-api-service.onrender.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/apps/web/dist/$1"
    }
  ],
  "functions": {
    "apps/web/dist/index.html": {
      "includeFiles": "apps/web/dist/**"
    }
  }
}
```

#### Create build script in `apps/web/package.json`
```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm run build"
  }
}
```

### Step 3: Deploy to Vercel

#### Using Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: edubot-web
# - In which directory is your code located? ./apps/web

# For production deployment
vercel --prod
```

#### Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   ```
   Framework Preset: Vite
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### Step 4: Environment Variables on Vercel
```bash
# In Vercel Dashboard → Project → Settings → Environment Variables
VITE_API_URL=https://your-api-service.onrender.com
NODE_ENV=production
```

### Step 5: Update CORS on API
Update your API's environment variables on Render to include your Vercel domain:
```bash
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000,http://localhost:4200
```

---

## Environment Configuration

### API Environment Variables (`.env`)
```bash
# Application
ENV=development|production
DEBUG=True|False

# Security
SECRET_KEY=your-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
MONGODB_URL=mongodb://localhost:27017/edubot

# External Services
OPENAI_API_KEY=sk-...

# CORS
ALLOWED_ORIGINS=http://localhost,http://localhost:3000,http://localhost:4200

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Web Environment Variables
```bash
# API Configuration
VITE_API_URL=http://localhost:8000

# Application
NODE_ENV=development|production
```

---

## Production Considerations

### Security
1. **API Security**:
   - Use strong secret keys (32+ characters)
   - Enable HTTPS in production
   - Implement rate limiting
   - Validate all inputs
   - Use environment variables for secrets

2. **Database Security**:
   - Use MongoDB Atlas with authentication
   - Enable network restrictions
   - Use strong passwords
   - Regular backups

### Performance
1. **API Optimization**:
   - Enable gzip compression
   - Implement caching
   - Use connection pooling
   - Monitor performance

2. **Web Optimization**:
   - Enable CDN (Vercel provides this)
   - Optimize images
   - Use lazy loading
   - Bundle optimization

### Monitoring
1. **API Monitoring**:
   - Health check endpoints
   - Error logging
   - Performance metrics
   - Uptime monitoring

2. **Web Monitoring**:
   - Vercel Analytics
   - Error tracking
   - Performance monitoring

### Backup & Recovery
1. **Database Backups**:
   - MongoDB Atlas automatic backups
   - Regular export schedules
   - Test restore procedures

2. **Code Backups**:
   - Git repository (GitHub)
   - Regular commits
   - Tag releases

---

## Deployment Commands Reference

### Docker Commands
```bash
# Build and run locally
./deploy.sh

# Check Docker setup
./check-docker.sh

# Manual container management
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose restart <service>

# Clean up
docker-compose down -v
docker system prune -a
```

### Production Deployment
```bash
# Deploy API to Render
# (Done through Render dashboard or GitHub integration)

# Deploy Web to Vercel
vercel --prod

# Update environment variables
# (Done through respective dashboards)
```

### Development Commands
```bash
# Start API locally
cd apps/api && uvicorn src.main:app --reload

# Start Web locally
npx nx serve web

# Build for production
npx nx build web

# Install dependencies
npm install
cd apps/api && pip install -r requirements.txt
```

---

## Troubleshooting

### Common Issues

1. **Docker Build Fails**:
   - Check Docker is running
   - Verify Dockerfile paths
   - Check for file permissions

2. **API Won't Start**:
   - Check environment variables
   - Verify database connection
   - Check port availability

3. **Web Build Fails**:
   - Check Node.js version (20+)
   - Verify dependencies
   - Check build configuration

4. **CORS Errors**:
   - Update ALLOWED_ORIGINS
   - Check API URL configuration
   - Verify domain settings

### Support
- Check application logs in respective platforms
- Verify environment variables
- Test API endpoints independently
- Use browser developer tools for web issues

---

This documentation provides comprehensive guidance for deploying your Edubot application locally with Docker and in production with Render (API) and Vercel (Web).