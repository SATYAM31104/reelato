# Production Deployment Guide

## 🚀 **Your Setup**
- **Backend**: Render.com (`https://reelato-backend.onrender.com`)
- **Frontend**: Vercel (`your-app-name.vercel.app`)
- **Database**: MongoDB Atlas

## 📁 **Environment Configuration**

### Frontend Environment Files:
- `.env` → Production (committed to git): `VITE_API_URL=https://reelato-backend.onrender.com`
- `.env.local` → Local development (ignored by git): `VITE_API_URL=http://localhost:3000`

### Backend Environment Variables (Render):
```
NODE_ENV=production
MONGODB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
FRONTEND_URL=https://your-app-name.vercel.app
```

## 🔧 **How It Works**

### Local Development:
1. Backend runs on `http://localhost:3000`
2. Frontend uses `.env.local` → calls local backend
3. CORS allows `localhost:5173`

### Production:
1. Backend deployed on Render
2. Frontend uses `.env` → calls Render backend
3. CORS allows any `.vercel.app` domain

## 📦 **Deployment Steps**

### 1. Deploy Backend to Render:
- Connect your GitHub repo
- Set environment variables in Render dashboard
- Deploy from `backend/` folder

### 2. Deploy Frontend to Vercel:
- Connect your GitHub repo
- Vercel auto-detects it's a Vite app
- No additional config needed (uses `.env`)

### 3. Update FRONTEND_URL:
- After Vercel deployment, update `FRONTEND_URL` in Render with your actual Vercel URL

## ✅ **Testing**

### Local Testing:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Production Testing:
- Visit your Vercel URL
- Test login, food creation, etc.
- Check browser network tab for API calls to Render

## 🔍 **Troubleshooting**

### CORS Issues:
- Check `FRONTEND_URL` in Render matches your Vercel URL
- Ensure backend CORS allows `.vercel.app` domains

### API Not Found:
- Verify `VITE_API_URL` in frontend `.env`
- Check Render backend is running and accessible

### Authentication Issues:
- Ensure `withCredentials: true` in all API calls
- Check cookies are being sent cross-domain

## 🎯 **Current Status**
✅ All components use centralized API configuration  
✅ CORS configured for both local and production  
✅ Environment variables properly set up  
✅ Ready for deployment!