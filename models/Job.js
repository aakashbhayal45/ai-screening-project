const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    hrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    requiredSkills: [String],
    experienceLevel: {
        type: String
    },
    salaryRange: {
        type: String
    },
    location: {
        type: String
    },
    employmentType: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'draft'],
        default: 'open'
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);
