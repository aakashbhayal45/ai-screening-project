const mongoose = require('mongoose');

const CandidateProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for HR manually uploaded resumes
    },
    name: String,
    initial: String,
    role: String,
    location: String,
    exp: Number,
    bg: String,
    textColors: String,
    score: Number,
    status: { type: String, default: 'pending' },
    missing: [String],
    resumeUrl: {
        type: String
    },
    contact: {
        email: String,
        phone: String,
        linkedin: String,
        portfolio: String
    },
    parsedData: {
        skills: [String],
        experience: [{
            role: String,
            company: String,
            duration: String,
            location: String,
            points: [String]
        }],
        education: [{
            degree: String,
            school: String,
            duration: String
        }]
    },
    aiSummary: {
        type: String
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CandidateProfile', CandidateProfileSchema);
