const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Get all applications for logged-in candidate
// @route   GET /api/applications/me
// @access  Private/Candidate
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ candidateId: req.user.id })
            .populate('jobId', 'title companyId location type') // Basic job details
            .populate({
                path: 'jobId',
                populate: { path: 'companyId', select: 'name logoUrl location' } // Nested populate for company name
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all applications for a job
// @route   GET /api/jobs/:jobId/applications
// @access  Private/HR
exports.getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Verify HR owns the job
        if (job.hrId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to view these applications' });
        }

        const applications = await Application.find({ jobId: req.params.jobId }).populate('candidateId', 'name identifier');
        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Submit an application
// @route   POST /api/applications
// @access  Private/Candidate
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        // Prevent multiple applications
        const existingApp = await Application.findOne({ jobId, candidateId: req.user.id });
        if (existingApp) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }

        // Mock AI Score computation
        const aiMatchScore = Math.floor(Math.random() * (100 - 50 + 1) + 50);

        const application = await Application.create({
            jobId,
            candidateId: req.user.id,
            status: 'pending',
            aiMatchScore
        });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update application status (Shortlist/Reject) & Notes
// @route   PUT /api/applications/:id
// @access  Private/HR
exports.updateApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        res.status(200).json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
