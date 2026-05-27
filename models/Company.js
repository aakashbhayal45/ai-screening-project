const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String
    },
    industry: {
        type: String
    },
    location: {
        type: String
    },
    links: {
        website: String,
        linkedin: String
    },
    description: {
        type: String
    },
    preferences: {
        remoteAllowed: { type: Boolean, default: false },
        benefits: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Company', CompanySchema);
