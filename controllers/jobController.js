const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'open', visibility: 'public' }).populate('companyId', 'name logoUrl');
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get logged in user's jobs
// @route   GET /api/jobs/me
// @access  Private/HR
exports.getMyJobs = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { hrId: req.user.id };
        const jobs = await Job.find(query);
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/HR
exports.createJob = async (req, res) => {
    try {
        // Add HR ID to request body
        req.body.hrId = req.user.id;

        // Attempt to assign company if available
        if (req.user.companyId) {
            req.body.companyId = req.user.companyId;
        }

        const job = await Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/HR
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Make sure user is job owner
        if (job.hrId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this job' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
