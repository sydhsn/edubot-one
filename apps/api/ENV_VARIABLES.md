# Environment Variables Documentation

This document explains all the environment variables used in the EduBot API.

## Required Environment Variables

### Database Configuration
- **DATABASE_URL**: MongoDB connection string
  - Development: `mongodb://localhost:27017`
  - Production: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
  
- **DATABASE_NAME**: Name of the MongoDB database
  - Example: `edubot` or `school_bd`

### Security Configuration
- **SECRET_KEY**: Secret key for JWT token encryption
  - **IMPORTANT**: Change this in production to a strong random key
  - Generate with: `openssl rand -hex 32`
  
- **ALGORITHM**: JWT algorithm (default: HS256)
- **ACCESS_TOKEN_EXPIRE_MINUTES**: Token expiration time in minutes (default: 30)

### AI Configuration
Choose one of the following AI providers:

#### Gemini (Recommended - Free tier available)
- **GEMINI_API_KEY**: Your Google Gemini API key
  - Get from: https://makersuite.google.com/app/apikey
  - Free tier: 15 requests per minute
  
- **GEMINI_MODEL**: Model to use (default: gemini-1.5-flash)

#### OpenAI (Alternative)
- **OPENAI_API_KEY**: Your OpenAI API key
  - Get from: https://platform.openai.com/api-keys
  - Paid service

### CORS Configuration
- **ALLOWED_ORIGINS**: Comma-separated list of allowed frontend domains
  - Development: `http://localhost:3000,http://localhost:4200,http://localhost:5173`
  - Production: `https://yourdomain.com,https://www.yourdomain.com`

### Email Configuration (Optional)
Used for sending notifications and password reset emails:

- **SMTP_SERVER**: SMTP server address (default: smtp.gmail.com)
- **SMTP_PORT**: SMTP port (default: 587)
- **SMTP_USERNAME**: Your email address
- **SMTP_PASSWORD**: Your email password or app password
- **FROM_EMAIL**: Email address shown as sender

### Server Configuration
- **PORT**: Port number for the API server (default: 8000)

## Setting Up Your .env File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values:
   - Add your MongoDB connection string
   - Generate a strong SECRET_KEY
   - Add your Gemini API key
   - Configure CORS origins for your frontend
   - (Optional) Configure email settings

## Getting API Keys

### Gemini API Key (Recommended)
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your .env file

### OpenAI API Key (Alternative)
1. Go to https://platform.openai.com/api-keys
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key to your .env file

### MongoDB Atlas (Production Database)
1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Get your connection string
4. Replace `<username>` and `<password>` with your credentials

## Security Best Practices

1. **Never commit .env files to version control**
2. **Use strong, unique SECRET_KEY in production**
3. **Restrict CORS origins to your actual domains**
4. **Use MongoDB Atlas with authentication in production**
5. **Use Gmail App Passwords instead of regular passwords**

## Environment-Specific Settings

### Development
```env
ENV=development
DEBUG=True
DATABASE_URL=mongodb://localhost:27017
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Production
```env
ENV=production
DEBUG=False
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
ALLOWED_ORIGINS=https://yourdomain.com
```