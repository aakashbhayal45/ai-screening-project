const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hrId: { // Primary organizer/scheduler
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    interviewerIds: [{ // For panel interviews
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    roundType: {
        type: String,
        required: true,
        enum: ['HR', 'Technical', 'Managerial', 'Final']
    },
    date: {
        type: Date, // Stores the Date
        required: true
    },
    time: {
        type: String, // e.g. "10:00 AM"
        required: true
    },
    duration: {
        type: Number, // In minutes e.g. 30, 60
        required: true,
        default: 60
    },
    locationOrLink: { // Zoom/Meet link or physical location
        type: String
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
        default: 'upcoming'
    },
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        notes: { type: String },
        decision: { type: String, enum: ['Hire', 'Reject', 'Hold', 'Pending'], default: 'Pending' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interview', InterviewSchema);
