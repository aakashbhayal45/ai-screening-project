const User = require('../models/User'); // ADDED User Model
const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const Job = require('../models/Job');
const pdfParse = require('pdf-parse');

// @desc    Get current candidate profile
// @desc    Get current candidate profile
// @route   GET /api/candidates/me
// @access  Private/Candidate
exports.getMyProfile = async (req, res) => {
    try {
        const profile = await CandidateProfile.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(200).json({ success: true, data: null });
        }
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create or update candidate profile
// @desc    Create or update candidate profile
// @route   POST /api/candidates
// @access  Private/Candidate
exports.createOrUpdateProfile = async (req, res) => {
    try {
        const profileData = { ...req.body, userId: req.user.id };
        const profile = await CandidateProfile.findOneAndUpdate(
            { userId: req.user.id },
            profileData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ success: true, message: 'Profile updated', data: profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error saving profile' });
    }
};

// @desc    Get all candidates (uploaded/offline or registered apps)
// @route   GET /api/candidates
// @access  Private/HR or Admin
exports.getAllCandidates = async (req, res) => {
    try {
        if (global.MOCK_DB) {
            const apps = global.mockApplications || [];
            const data = apps.map(app => ({
                id: app.id,
                user: { name: app.name, email: `${app.name.toLowerCase().replace(/[^a-z]/g, '')}@mock.com` },
                name: app.name,
                email: `${app.name.toLowerCase().replace(/[^a-z]/g, '')}@mock.com`,
                initial: app.name ? app.name.substring(0, 2).toUpperCase() : '??',
                role: app.role,
                score: app.score,
                skills: app.skills || [],
                missing: app.missing || [],
                status: app.status,
                exp: app.exp || 0,
                bg: app.bg || 'bg-muted',
                textColors: app.textColors || 'text-foreground',
                location: app.location || 'Remote'
            }));
            return res.status(200).json({ success: true, count: data.length, data: data });
        }
        // Fetch users who are candidates to populate a scheduling dropdown.
        // In a real app we might combine 'Users' and 'CandidateProfiles' 
        // depending on whether they signed up or were just uploaded by HR.

        const candidateUsers = await User.find({ role: 'candidate' }).select('-passwordHash');

        // We can optionally fetch their applications or profiles here if needed for deeper stats.
        const transformedData = candidateUsers.map(user => ({
            id: user._id.toString(), // To match some frontend logic that uses .id instead of ._id
            user: user, // Embedding the whole user object for the frontend dropdown
            name: user.name || 'Unknown',
            email: user.email,
            initial: user.name ? user.name.substring(0, 2).toUpperCase() : '??',
            role: 'Candidate',
            // Mocking other fields to prevent frontend crashes on the candidate list page if they use it
            score: 0,
            skills: [],
            status: 'pending'
        }));

        res.status(200).json({ success: true, count: transformedData.length, data: transformedData });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private/HR or Admin
exports.getCandidateById = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (global.MOCK_DB) {
            const apps = global.mockApplications || [];
            const app = apps.find(a => a.id === id);
            
            // Generate full profile data based on the uploaded data or fallback
            const candidateData = app ? {
                id: app.id,
                name: app.name,
                initial: app.name ? app.name.substring(0, 2).toUpperCase() : '??',
                role: app.role,
                email: `${app.name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
                phone: '+1 (555) 000-0000',
                location: 'Remote',
                score: app.score,
                status: app.status,
                aiSummary: `AI Evaluation for ${app.name}: Strong fundamentals detected. The candidate scored ${app.score}% matching the role of ${app.role}.`,
                matchingSkills: app.skills || ['React', 'Node.js', 'Teamwork', 'JavaScript'],
                missingSkills: app.missing || ['Cybersecurity', 'AWS'],
                experience: [
                    { id: 1, role: app.role, company: 'Tech Solutions Inc.', duration: '2021 - Present', location: 'Remote', points: ['Developed responsive web applications.', 'Collaborated with cross-functional teams.'] }
                ],
                education: [
                    { id: 1, degree: 'B.S. in Computer Science', school: 'Tech University', duration: '2016 - 2020' }
                ]
            } : null;

            if (!candidateData) {
                return res.status(404).json({ success: false, message: 'Candidate not found' });
            }
            return res.status(200).json({ success: true, data: candidateData });
        }

        // Real DB Logic (simplified)
        const profile = await CandidateProfile.findById(id).populate('userId', 'name email');
        if (!profile) return res.status(404).json({ success: false, message: 'Candidate not found' });
        
        const responseData = profile.toObject();
        responseData.matchingSkills = profile.parsedData?.skills || [];
        responseData.missingSkills = profile.missing || [];
        
        res.status(200).json({ success: true, data: responseData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Upload a resume file and get mock AI matching result
// @route   POST /api/candidates/upload
// @access  Private/HR or Admin
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const fileName = req.file.originalname;

        const targetJobTitle = req.body.targetJob || 'Evaluating...';
        // Mock AI Evaluation Response
        const name = fileName.replace(/\.[^/.]+$/, "");
        
        let job = null;
        if (!global.MOCK_DB) {
            job = await Job.findOne({ title: new RegExp(targetJobTitle, 'i') });
            if (!job) job = await Job.findOne(); // Fallback to any job
        }

        const uniqueEmail = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 10000) + '@example.com';
        let user = { _id: Date.now().toString() };
        if (!global.MOCK_DB) {
            user = await User.create({
                 name: name,
                 identifier: uniqueEmail,
                 passwordHash: 'dummy_hash',
                 role: 'candidate'
            });
        }

        // Fixed required skill set
        const requiredSkills = ['Java', 'Python', 'C++', 'MySQL', 'PostgreSQL', 'React', 'MongoDB', 'Node.js'];

        // Randomly pick how many skills matched (1 to 5) so some are above 70 and some below
        const numMatched = Math.floor(Math.random() * 5) + 1; // 1 to 5 skills
        const shuffled = [...requiredSkills].sort(() => Math.random() - 0.5);
        const matchedSkills = shuffled.slice(0, numMatched);
        const missingSkills = requiredSkills.filter(s => !matchedSkills.includes(s));

        // 20% per matched skill, capped at 100%
        const score = Math.min(matchedSkills.length * 20, 100);

        let status = 'shortlisted';
        let bg = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700';
        let textColors = 'text-emerald-700 dark:text-emerald-400';

        if (score < 60) {
            status = 'rejected';
            bg = 'bg-rose-500/10 border-rose-500/20 text-rose-700';
            textColors = 'text-rose-700 dark:text-rose-400';
        }

        const mockCandidateData = {
            userId: user._id,
            name: name,
            initial: name.substring(0, 2).toUpperCase(),
            role: job ? job.title : targetJobTitle,
            location: 'Remote',
            exp: Math.floor(Math.random() * 10),
            bg: bg,
            textColors: textColors,
            score: score,
            skills: matchedSkills.length > 0 ? matchedSkills : ['None'],
            missing: missingSkills,
            status: status,
            parsedData: { skills: matchedSkills }
        };

        // Save to DB
        let savedProfile = { _id: Date.now().toString() + "profile" };
        if (!global.MOCK_DB) {
            savedProfile = await CandidateProfile.create(mockCandidateData);

            if (job) {
                 await Application.create({
                     jobId: job._id,
                     candidateId: user._id,
                     aiMatchScore: mockCandidateData.score,
                     status: mockCandidateData.status
                 });
            }
        }

        const returnData = {
            id: savedProfile._id ? savedProfile._id.toString() : savedProfile.id,
            ...mockCandidateData
        };

        if (global.MOCK_DB && global.mockApplications) {
            const appEntry = {
                id: returnData.id,
                name: returnData.name,
                role: returnData.role,
                score: returnData.score,
                exp: returnData.exp,
                status: returnData.status,
                skills: returnData.skills,
                missing: returnData.missing,
                bg: returnData.bg,
                textColors: returnData.textColors,
                location: returnData.location
            };
            global.mockApplications.push(appEntry);

            // Auto-schedule interview for candidates with score >= 60
            if (score >= 60) {
                if (!global.mockInterviews) global.mockInterviews = [];
                const interviewDate = new Date();
                interviewDate.setDate(interviewDate.getDate() + 3); // Schedule 3 days from now
                global.mockInterviews.push({
                    id: 'int-' + returnData.id,
                    applicationId: returnData.id,
                    candidateId: returnData.id,
                    candidate: returnData.name,
                    candidateEmail: `${returnData.name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
                    role: returnData.role,
                    date: interviewDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    rawDate: interviewDate,
                    time: '10:00 AM',
                    duration: 60,
                    type: 'Technical Round',
                    status: 'upcoming',
                    location: 'https://zoom.us/j/auto-scheduled',
                    interviewerIds: [],
                    feedback: null,
                    initial: returnData.name ? returnData.name.substring(0, 2).toUpperCase() : '??',
                    color: 'bg-emerald-500/10 text-emerald-700',
                    score: returnData.score
                });
                // Update status to 'interview' since it was auto-scheduled
                appEntry.status = 'interview';
                returnData.status = 'interview';
            }
        }

        res.status(200).json({
            success: true,
            data: returnData,
            message: 'Resume parsed and application created successfully.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error during upload', error: error.message });
    }
};
