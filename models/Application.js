const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shortlisted', 'rejected', 'interview'],
        default: 'pending'
    },
    aiMatchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    hrRating: {
        type: Number,
        min: 1,
        max: 5
    },
    hrNotes: {
        type: String
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', ApplicationSchema);
