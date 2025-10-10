#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

// Your models
const userModel = require('../backend/src/models/user.model');
const foodPartnerModel = require('../backend/src/models/foodpartner.model');
const foodModel = require('../backend/src/models/food.model');

async function migrateData() {
    try {
        console.log('🚀 Starting data migration to MongoDB Atlas...\n');

        // Connect to local MongoDB
        console.log('📡 Connecting to local MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/Reelato');
        console.log('✅ Connected to local MongoDB\n');

        // Fetch all data
        console.log('📊 Fetching data from local database...');
        const users = await userModel.find({});
        const foodPartners = await foodPartnerModel.find({});
        const foods = await foodModel.find({});

        console.log(`Found ${users.length} users`);
        console.log(`Found ${foodPartners.length} food partners`);
        console.log(`Found ${foods.length} food items\n`);

        // Disconnect from local
        await mongoose.disconnect();

        // Connect to Atlas
        console.log('🌐 Connecting to MongoDB Atlas...');
        const atlasUrl = process.env.MONGODB_ATLAS_URL || process.env.MONGODB_URL;
        
        if (!atlasUrl || atlasUrl.includes('localhost')) {
            console.error('❌ Please set MONGODB_ATLAS_URL in your .env file with your Atlas connection string');
            process.exit(1);
        }

        await mongoose.connect(atlasUrl);
        console.log('✅ Connected to MongoDB Atlas\n');

        // Insert data
        if (users.length > 0) {
            console.log('👥 Migrating users...');
            await userModel.insertMany(users);
            console.log('✅ Users migrated');
        }

        if (foodPartners.length > 0) {
            console.log('🏪 Migrating food partners...');
            await foodPartnerModel.insertMany(foodPartners);
            console.log('✅ Food partners migrated');
        }

        if (foods.length > 0) {
            console.log('🍕 Migrating food items...');
            await foodModel.insertMany(foods);
            console.log('✅ Food items migrated');
        }

        console.log('\n🎉 Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

// Run migration
migrateData();