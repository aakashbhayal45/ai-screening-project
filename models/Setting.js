const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    general: {
        companyName: { type: String, default: 'Acme Corp' },
        defaultLanguage: { type: String, default: 'English (US)' },
        timeZone: { type: String, default: '(UTC-08:00) Pacific Time' },
        dateTimeFormat: { type: String, default: 'MM/DD/YYYY, 12-hour' },
        emailNotifications: { type: Boolean, default: true },
        theme: { type: String, default: 'System Default' }
    },
    screening: {
        skillsWeight: { type: Number, default: 40 },
        experienceWeight: { type: Number, default: 30 },
        educationWeight: { type: Number, default: 20 },
        certificationsWeight: { type: Number, default: 10 },
        minScoreThreshold: { type: Number, default: 60 },
        rankingFormula: { type: String, default: 'Standard Balanced' },
        requiredKeywords: { type: String, default: 'React, Node.js' },
        preferredKeywords: { type: String, default: 'AWS, Docker' },
        enableSynonyms: { type: Boolean, default: true },
        exactMatchOnly: { type: Boolean, default: false },
        minExperience: { type: Number, default: 2 },
        internshipCredit: { type: String, default: 'Yes, 50% credit' },
        collegeBoost: { type: String, default: 'Apply +5% Boost' },
        defaultDegree: { type: String, default: 'B.Tech / B.E.' }
    },
    ai: {
        strictness: { type: String, default: 'Medium', enum: ['Low', 'Medium', 'High'] },
        biasReduction: { type: String, default: 'Strict (Mask All PII)' },
        autoParse: { type: Boolean, default: true },
        duplicateDetection: { type: Boolean, default: true },
        feedbackGeneration: { type: Boolean, default: true },
        redFlagDetection: { type: Boolean, default: true }
    },
    notifications: {
        shortlistTemplate: { type: String, default: 'Hi {{name}}, congratulations! You have been shortlisted for {{job_title}}.' },
        rejectionTemplate: { type: String, default: 'Hi {{name}}, thank you for applying to {{job_title}}. Unfortunately, we are moving forward with other candidates at this time.' },
        reminderTemplate: { type: String, default: 'Reminder: Your interview for {{job_title}} is scheduled for {{date}} at {{time}}.' },
        alertApply: { type: Boolean, default: true },
        alertStatus: { type: Boolean, default: true },
        alertDigest: { type: Boolean, default: false }
    },
    dashboard: {
        defaultView: { type: String, default: 'Cards Grid View' },
        exportFormat: { type: String, default: 'CSV Data' },
        autoReport: { type: Boolean, default: true },
        visibleColumns: {
            type: [String],
            default: ['Name', 'Score', 'Status', 'Applied Date']
        }
    },
    security: {
        force2FA: { type: Boolean, default: false },
        passwordPolicy: { type: String, default: 'Standard (8+ chars, num)' },
        sessionTimeout: { type: String, default: '30 Minutes Idle' },
        ipAllowlist: { type: String, default: '' },
    },
    data: {
        retentionPeriod: { type: String, default: '1 Year' },
        autoDelete: { type: Boolean, default: true },
        complianceMode: { type: String, default: 'Strict (Consent Required & Data Portable)' }
    },
    analytics: {
        funnelTracking: { type: Boolean, default: true },
        diversityMetrics: { type: Boolean, default: false },
        aiMonitoring: { type: Boolean, default: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
