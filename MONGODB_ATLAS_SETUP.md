# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Sign up with your email or Google account

## Step 2: Create a Free Cluster
1. Choose "Build a Database"
2. Select **M0 Sandbox** (FREE tier)
3. Choose your preferred cloud provider (AWS recommended)
4. Select a region close to you
5. Name your cluster (e.g., "reelato-cluster")
6. Click "Create"

## Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Vercel deployment
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with "Reelato"

Your connection string should look like:
```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/Reelato?retryWrites=true&w=majority
```

## Step 6: Test Connection Locally
Update your `backend/.env` file:
```
MONGODB_URL=mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/Reelato?retryWrites=true&w=majority
```

## Step 7: Migrate Your Data (Optional)
If you have existing data in your local MongoDB:

1. **Export from local MongoDB:**
   ```bash
   mongodump --db Reelato --out ./backup
   ```

2. **Import to Atlas:**
   ```bash
   mongorestore --uri "your_atlas_connection_string" ./backup/Reelato
   ```

## Verification
Test your connection by running your backend locally with the new connection string. You should see "DB connected successfully" in your console.