# Deployment Guide

## Frontend Deployment (Vercel)

The frontend is automatically deployed to Vercel when you push to the main branch.

### Setting up Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project" and select your FWEB repository
3. Vercel will automatically detect it's a monorepo

### Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend-url.com
```

Once your backend is deployed, update this URL to point to your actual backend URL.

## Backend Deployment (Railway, Render, or Heroku)

### Option 1: Railway (Recommended)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose the FWEB repository
5. Configure:
   - **Root Directory**: `backend`
   - **Environment Variables**:
     - `MONGO_URI`: Your MongoDB connection string
     - `PORT`: 3000 (Railway assigns this)

### Option 2: Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: your-app-name
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGO_URI`: Your MongoDB connection string

### Option 3: Heroku (Paid)

1. Go to https://heroku.com
2. Click "New" → "Create new app"
3. Connect to GitHub repository
4. Configure:
   - Add buildpack: `heroku/nodejs`
   - **Environment Variables**:
     - `MONGO_URI`: Your MongoDB connection string

## Post-Deployment

After deploying the backend:

1. Note the deployed backend URL
2. Go to Vercel Project Settings
3. Update `VITE_API_URL` environment variable with your backend URL
4. Vercel will automatically redeploy

## Verification

Test your deployment:
- Frontend: Visit your Vercel domain
- Backend API: Visit `https://your-backend-url.com/`
- Swagger Docs: Visit `https://your-backend-url.com/api-docs`

## Troubleshooting

**Frontend shows "Cannot GET /listings":**
- Check VITE_API_URL environment variable in Vercel
- Ensure backend URL doesn't have trailing slash

**API calls fail with CORS error:**
- Verify CORS is enabled in backend (it is by default)
- Check backend is running and accessible

**Database connection error:**
- Verify MONGO_URI is correct
- Check MongoDB Atlas allows connections from your server IP
