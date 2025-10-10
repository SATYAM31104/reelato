#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

async function testAtlasConnection() {
    try {
        console.log('🧪 Testing MongoDB Atlas connection...\n');
        
        const mongoUrl = process.env.MONGODB_URL;
        
        if (!mongoUrl) {
            console.error('❌ MONGODB_URL not found in .env file');
            process.exit(1);
        }
        
        if (mongoUrl.includes('localhost')) {
            console.error('❌ Still using local MongoDB URL');
            console.log('📋 Please update MONGODB_URL in backend/.env with your Atlas connection string');
            console.log('💡 Format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Reelato');
            process.exit(1);
        }
        
        console.log('📡 Connecting to Atlas...');
        await mongoose.connect(mongoUrl);
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        // Test basic operations
        console.log('🔍 Testing database operations...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📊 Found ${collections.length} collections in database`);
        
        if (collections.length > 0) {
            console.log('📋 Collections:');
            collections.forEach(col => console.log(`   - ${col.name}`));
        }
        
        console.log('\n🎉 Atlas connection test successful!');
        console.log('🚀 You are ready to deploy to Vercel!');
        
    } catch (error) {
        console.error('❌ Atlas connection failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check your username and password in the connection string');
        console.log('2. Ensure your IP is whitelisted (0.0.0.0/0 for all IPs)');
        console.log('3. Verify the database user has proper permissions');
        console.log('4. Check if the cluster is running');
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

testAtlasConnection();