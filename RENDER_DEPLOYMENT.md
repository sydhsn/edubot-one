# Render.com Configuration for FastAPI

## Quick Deploy Button
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## Manual Configuration

### Service Settings
- **Name**: edubot-api
- **Environment**: Python 3
- **Region**: Oregon (US West) or your preferred region
- **Branch**: main
- **Root Directory**: apps/api

### Build & Deploy Commands
```bash
# Build Command
pip install -r requirements.txt

# Start Command
uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables
Set these in your Render service dashboard:

#### Required Variables
```
ENV=production
DEBUG=False
SECRET_KEY=your-super-secret-key-change-this-to-32-characters-minimum
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
PORT=8000
```

#### Database Configuration
```
# For MongoDB Atlas (Recommended)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/edubot?retryWrites=true&w=majority

# For local MongoDB (not recommended for production)
MONGODB_URL=mongodb://localhost:27017/edubot
```

#### Optional Services
```
# OpenAI API (if using AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# CORS Origins (include your Vercel domain)
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000,http://localhost:4200
```

### Health Check
Render will automatically use the health check endpoint at `/health`

### Scaling
- **Instance Type**: Starter (free tier) or Standard
- **Auto-scaling**: Available on paid plans

### Custom Domain
1. Go to Settings → Custom Domains
2. Add your domain
3. Configure DNS records as instructed

## MongoDB Atlas Setup (Recommended)

### 1. Create Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create free cluster
3. Choose cloud provider and region

### 2. Configure Network Access
1. Go to Network Access
2. Add IP Address: `0.0.0.0/0` (allows access from anywhere)
3. Or add Render's IP ranges for better security

### 3. Create Database User
1. Go to Database Access
2. Add new user with read/write permissions
3. Use strong password

### 4. Get Connection String
1. Go to Clusters → Connect
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your user password
5. Replace `<dbname>` with your database name (e.g., "edubot")

## Deployment Steps

### 1. Prepare Repository
Ensure your repository structure:
```
apps/api/
├── src/
│   ├── main.py
│   ├── core/
│   ├── models/
│   ├── routers/
│   └── services/
├── requirements.txt
└── .env.example
```

### 2. Deploy on Render
1. Fork/push your repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure settings as above
6. Add environment variables
7. Click "Create Web Service"

### 3. Monitor Deployment
1. Watch build logs in Render dashboard
2. Check service status
3. Test API endpoints

### 4. Update CORS for Frontend
Once deployed, add your Render API URL to your frontend configuration.

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check requirements.txt has all dependencies
   - Verify Python version compatibility
   - Check build logs for specific errors

2. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has correct permissions

3. **Environment Variables**:
   - All required variables are set
   - No extra spaces in variable values
   - Correct formatting for complex values

4. **Port Issues**:
   - Use `$PORT` environment variable (provided by Render)
   - Don't hardcode port numbers

### Support Resources
- [Render Documentation](https://render.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## Production Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Health check endpoint working
- [ ] CORS configured for frontend domain
- [ ] Secret key is secure (32+ characters)
- [ ] Debug mode disabled
- [ ] SSL/HTTPS enabled (automatic on Render)
- [ ] Monitoring/logging configured
- [ ] Backup strategy in place