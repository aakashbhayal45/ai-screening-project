const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Account Info (Pre-existing/Core)
    name: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['hr', 'candidate', 'admin'], default: 'candidate' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

    // 1. Basic Information
    profilePhoto: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say', ''], default: '' },
    dateOfBirth: { type: Date },
    nationality: { type: String, default: '' },

    // 2. Contact Details
    phone: { type: String, default: '' },
    alternatePhone: { type: String, default: '' },
    address: { type: String, default: '' },
    zipCode: { type: String, default: '' },

    // 4. Professional Information
    jobTitle: { type: String, default: '' },
    companyName: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    industry: { type: String, default: '' },
    skills: { type: [String], default: [] },
    certifications: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },

    // 5. Security & Account Meta
    accountStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    twoFactorEnabled: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },

    // 6. Preferences
    language: { type: String, default: 'English (US)' },
    theme: { type: String, enum: ['System Default', 'Light Mode', 'Dark Mode', 'Midnight Blue', 'Forest Green', 'Sunset Orange', 'Rose Gold', 'Cyberpunk'], default: 'System Default' },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    isVisibleToRecruiters: { type: Boolean, default: true },

    // 7. Documents (File URLs)
    resumeUrl: { type: String, default: '' },
    idProofUrl: { type: String, default: '' },
    idProofVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
