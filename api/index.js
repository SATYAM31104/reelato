// Vercel serverless function entry point
const app = require('../backend/server');

// Export the Express app as a Vercel function
module.exports = app;