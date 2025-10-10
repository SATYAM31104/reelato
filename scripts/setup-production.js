#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Reelato Production Setup\n');

// Check if MongoDB Atlas URL is configured
const envPath = path.join(__dirname, '../backend/.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('localhost:27017')) {
        console.log('⚠️  You are currently using local MongoDB');
        console.log('📋 For Vercel deployment, you need MongoDB Atlas');
        console.log('📖 Please follow the guide: MONGODB_ATLAS_SETUP.md\n');
        
        console.log('✅ Steps to complete:');
        console.log('1. Set up MongoDB Atlas (free)');
        console.log('2. Update MONGODB_URL in your .env file');
        console.log('3. Test connection locally');
        console.log('4. Deploy to Vercel\n');
    } else if (envContent.includes('mongodb+srv://')) {
        console.log('✅ MongoDB Atlas is configured!');
        console.log('🚀 You are ready to deploy to Vercel\n');
        
        console.log('📋 Deployment checklist:');
        console.log('✅ MongoDB Atlas configured');
        console.log('⬜ Push code to GitHub');
        console.log('⬜ Deploy to Vercel');
        console.log('⬜ Add environment variables in Vercel');
        console.log('⬜ Test deployed application\n');
    }
} else {
    console.log('❌ .env file not found');
    console.log('📋 Please create backend/.env file with your configuration\n');
}

console.log('📚 Available guides:');
console.log('- MONGODB_ATLAS_SETUP.md - Set up free MongoDB Atlas');
console.log('- DEPLOYMENT_GUIDE.md - Complete Vercel deployment guide');
console.log('\n💡 Need help? Check the guides above!');