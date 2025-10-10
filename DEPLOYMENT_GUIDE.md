# Reelato Deployment Guide - Vercel

## Prerequisites
1. GitHub account
2. Vercel account (sign up at vercel.com)
3. MongoDB Atlas account (sign up at mongodb.com/atlas)

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with username/password
4. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)
5. Get your connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/reelato`)

## Step 2: Prepare Your Repository

1. Push your code to GitHub
2. Make sure all files are committed

## Step 3: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a full-stack app

### Environment Variables in Vercel

Add these environment variables in Vercel dashboard:

```
NODE_ENV=production
MONGODB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
FRONTEND_URL=https://your-app-name.vercel.app
```

## Step 4: Configure Build Settings

In Vercel dashboard:
- **Framework Preset**: Other
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm run install:all`

## Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Important Notes

- Your API endpoints will be available at the same domain: `https://your-app-name.vercel.app/api/`
- Make sure to update CORS settings if needed
- Test all functionality after deployment

## Troubleshooting

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Ensure MongoDB Atlas allows connections from all IPs
4. Check that all dependencies are properly installed