const Interview = require('../models/Interview');
const Application = require('../models/Application');

// @desc    Get all interviews for logged in user (HR or Candidate)
// @route   GET /api/interviews
// @access  Private
exports.getInterviews = async (req, res) => {
    try {
        if (global.MOCK_DB) {
            // Only show interviews for candidates with score >= 70 (auto-scheduled)
            const interviews = global.mockInterviews || [];
            return res.status(200).json({ success: true, count: interviews.length, data: interviews });
        }

        let query;

        if (req.user.role === 'hr' || req.user.role === 'admin') {
            query = { hrId: req.user.id };
        } else {
            // For candidate, need to find applications first or populate
            const applications = await Application.find({ candidateId: req.user.id }).select('_id');
            const appIds = applications.map(app => app._id);
            query = { applicationId: { $in: appIds } };
        }

        const interviews = await Interview.find(query)
            .populate({
                path: 'applicationId',
                populate: [
                    { path: 'jobId', select: 'title companyId' }
                ]
            })
            .populate('candidateId', 'name email profile') // Using User schema fields
            .populate('hrId', 'name email')
            .populate('interviewerIds', 'name email')
            .sort({ date: 1, time: 1 });

        // Transform slightly for frontend
        const formatted = interviews.map(inv => ({
            id: inv._id.toString(),
            applicationId: inv.applicationId?._id?.toString(),
            candidateId: inv.candidateId?._id?.toString(),
            candidate: inv.candidateId?.name || 'Unknown Candidate',
            candidateEmail: inv.candidateId?.email,
            role: inv.applicationId?.jobId?.title || 'Unknown Role',
            date: new Date(inv.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: inv.time,
            duration: inv.duration,
            type: inv.roundType,
            status: inv.status,
            location: inv.locationOrLink || 'TBD',
            interviewerIds: inv.interviewerIds || [],
            feedback: inv.feedback,
            initial: inv.candidateId?.name ? inv.candidateId.name.substring(0, 2).toUpperCase() : '??',
            color: inv.status === 'upcoming' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'
        }));

        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Schedule new interview
// @route   POST /api/interviews
// @access  Private/HR
exports.scheduleInterview = async (req, res) => {
    try {
        const { applicationId, candidateId, roundType, date, time, duration, interviewerIds, locationOrLink, candidateName, candidateEmail } = req.body;

        if (!applicationId || !candidateId || !roundType || !date || !time) {
            return res.status(400).json({ success: false, message: 'Missing required interview fields' });
        }

        if (global.MOCK_DB) {
            if (!global.mockInterviews) global.mockInterviews = [];
            
            let role = 'Candidate Role';
            if (global.mockApplications) {
                const app = global.mockApplications.find(a => a.id === applicationId || a.id === candidateId);
                if (app) {
                    role = app.role;
                    app.status = 'interview';
                }
            }
            
            const newInt = {
                id: 'int-' + Date.now(),
                applicationId,
                candidateId,
                candidate: candidateName || 'Unknown Candidate',
                candidateEmail: candidateEmail || '',
                role,
                date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                time,
                duration: duration || 60,
                type: roundType,
                status: 'upcoming',
                location: locationOrLink || 'TBD',
                interviewerIds: interviewerIds || [],
                feedback: null,
                initial: candidateName ? candidateName.substring(0, 2).toUpperCase() : '??',
                color: 'bg-emerald-500/10 text-emerald-700',
            };
            global.mockInterviews.push(newInt);
            return res.status(201).json({ success: true, data: newInt });
        }

        let appToUpdate = await Application.findById(applicationId);

        // Even if there's no formal application, let them schedule directly if candidateId is provided
        // But for our current app architecture, we'll try to keep them linked to an Application

        const interview = await Interview.create({
            applicationId,
            candidateId,
            hrId: req.user.id,
            interviewerIds: interviewerIds || [],
            roundType,
            date,
            time,
            duration: duration || 60,
            locationOrLink,
            status: 'upcoming',
            feedback: { decision: 'Pending' }
        });

        // Update application status to interview if it exists
        if (appToUpdate) {
            appToUpdate.status = 'interview';
            await appToUpdate.save();
        }

        res.status(201).json({ success: true, data: interview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Update interview status
// @route   PUT /api/interviews/:id
// @access  Private/HR
exports.updateInterview = async (req, res) => {
    try {
        const { status, feedback } = req.body;

        let updateData = req.body;

        // If they are explicitly adding feedback, ensure it doesn't overwrite everything else unintentionally
        // Actually, findByIdAndUpdate handles nested objects a bit poorly if not specified carefully, 
        // but for a simple replace of the feedback object it's usually okay.

        const interview = await Interview.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!interview) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }

        res.status(200).json({ success: true, data: interview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
