const mongoose = require('mongoose');

// Default to MOCK_DB until connection is successful
global.MOCK_DB = true;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 1000 // Fail fast if no MongoDB is running
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        global.MOCK_DB = false;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.warn("Running in MOCK_DB mode. No data will be saved permanently.");
        global.MOCK_DB = true;
        
        // Initialize in-memory storage for Mock Mode
        if (!global.mockCandidates) global.mockCandidates = [];
        if (!global.mockApplications) global.mockApplications = [];
        if (!global.mockInterviews) global.mockInterviews = [];
    }
};

module.exports = connectDB;
