# ✅ FIXED: Vercel Deployment Guide for EduBot Web App

## ⚠️ **Deployment Issues Resolved**

The following issues have been fixed:
- ✅ Missing build scripts in package.json
- ✅ Incorrect vercel.json configuration
- ✅ Wrong output directory for Nx monorepo
- ✅ Build command errors

## 🚀 **Quick Deploy Steps (Now Working)**

### 1. 📁 **Connect Repository to Vercel**

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click **"Add New"** → **"Project"**
4. Import your `edubot-one` repository
5. Click **"Import"**

### 2. ⚙️ **Project Settings (Auto-configured)**

Vercel will automatically use these settings from our fixed `vercel.json`:

```json
{
  "buildCommand": "npm install && npx nx build web --prod",
  "outputDirectory": "dist/apps/web",
  "installCommand": "npm install"
}
```

**DO NOT OVERRIDE** - Let Vercel use the vercel.json configuration.

### 3. 🔧 **Fixed Configuration Files**

#### ✅ Updated `apps/web/package.json`
Now includes proper build scripts:
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite dev",
    "preview": "vite preview"
  }
}
```

#### ✅ Updated `vercel.json`
Now works with Nx monorepo:
```json
{
  "buildCommand": "npm install && npx nx build web --prod",
  "outputDirectory": "dist/apps/web"
}
```
Create `apps/web/src/config/api.ts`:

```typescript
// API Configuration
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return process.env.VITE_API_URL || 'http://localhost:8000';
  }
  
  // Client-side
  return process.env.NODE_ENV === 'production' 
    ? 'https://your-api-service.onrender.com'
    : 'http://localhost:8000';
};

export const API_BASE_URL = getApiUrl();
export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: '/api/v1/auth',
  ADMISSIONS: '/api/v1/admissions',
  AI: '/api/v1/ai',
  ATTENDANCE: '/api/v1/attendance'
};
```

### 3. Update Vite Configuration
Update `apps/web/vite.config.ts`:

```typescript
/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  
  preview: {
    port: 4200,
    host: 'localhost',
  },
  
  plugins: [react()],
  
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  
  test: {
    name: '@edubot-one/web',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
  
  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
}));
```

## Deployment Methods

### Method 1: Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy from Project Root
```bash
# Initial deployment
vercel

# Follow the prompts:
# ? Set up and deploy "~/edubot-one"? [Y/n] Y
# ? Which scope do you want to deploy to? (your-account)
# ? Link to existing project? [y/N] N
# ? What's your project's name? edubot-web
# ? In which directory is your code located? ./apps/web

# Production deployment
vercel --prod
```

### Method 2: Vercel Dashboard

#### 1. Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository

#### 2. Configure Project
```
Framework Preset: Vite
Root Directory: apps/web
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 20.x
```

#### 3. Environment Variables
Add these in Project Settings → Environment Variables:

```bash
# Production API URL
VITE_API_URL=https://your-api-service.onrender.com

# Node environment
NODE_ENV=production

# Optional: Feature flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=true
```

## Vercel Configuration File

The `vercel.json` file in your project root configures:

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
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## Environment Variables

### Development
```bash
# .env.local (for local development)
VITE_API_URL=http://localhost:8000
NODE_ENV=development
```

### Production (Vercel Dashboard)
```bash
VITE_API_URL=https://your-api-service.onrender.com
NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
```

## Custom Domain Setup

### 1. Add Domain in Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 2. DNS Configuration
```
Type: CNAME
Name: www (or @ for root domain)
Value: cname.vercel-dns.com
```

### 3. SSL Certificate
- Automatically provided by Vercel
- Includes www and root domain variants

## Performance Optimization

### 1. Build Optimization
Already configured in `vite.config.ts`:
- Tree shaking
- Code splitting
- Compression
- Asset optimization

### 2. Vercel Features
Automatically enabled:
- Global CDN
- Edge caching
- Image optimization
- Automatic compression

### 3. Additional Optimizations
```typescript
// In your React components
import { lazy, Suspense } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('./components/Dashboard'));
const Reports = lazy(() => import('./components/Reports'));

// Use Suspense for loading states
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

## Monitoring & Analytics

### 1. Vercel Analytics
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to your app
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 2. Error Tracking
```typescript
// Simple error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## API Integration

### 1. Update API URLs
Ensure your API service on Render allows CORS from your Vercel domain:

```python
# In your FastAPI app (apps/api/src/main.py)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:4200", 
        "https://your-app.vercel.app",
        "https://your-custom-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. API Client Configuration
```typescript
// apps/web/src/lib/api.ts
import { API_BASE_URL } from '../config/api';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // API methods
  async getHealth() {
    return this.request('/health');
  }

  async getAdmissions() {
    return this.request('/api/v1/admissions');
  }
}

export const apiClient = new ApiClient();
```

## Troubleshooting

### Common Issues

1. **Build Fails**:
   ```bash
   # Check Node.js version
   node --version  # Should be 20+
   
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **API Calls Fail**:
   - Check CORS configuration on API
   - Verify API URL in environment variables
   - Test API endpoints directly

3. **Routing Issues**:
   - Ensure `vercel.json` has correct rewrites
   - Check for conflicting routes
   - Verify build output structure

4. **Environment Variables Not Working**:
   - Variables must start with `VITE_` for client-side access
   - Redeploy after adding variables
   - Check variable names and values

### Debug Commands
```bash
# Test build locally
npm run build
npm run preview

# Check environment variables
echo $VITE_API_URL

# Vercel CLI debugging
vercel logs
vercel inspect
```

## Production Checklist

- [ ] API URL configured correctly
- [ ] Environment variables set
- [ ] CORS configured on API
- [ ] Custom domain configured (if needed)
- [ ] Analytics enabled
- [ ] Error boundaries implemented
- [ ] Performance optimizations applied
- [ ] Security headers configured
- [ ] SSL certificate active
- [ ] Build succeeds without errors
- [ ] All routes work correctly
- [ ] API integration tested

## Deployment Commands

```bash
# Development deployment
vercel

# Production deployment
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-url]
```

Your React frontend will be available at:
- Development: `https://your-project-git-branch.vercel.app`
- Production: `https://your-project.vercel.app`
- Custom domain: `https://your-domain.com`