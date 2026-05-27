const Application = require('../models/Application');
const Job = require('../models/Job');
const Interview = require('../models/Interview');
const CandidateProfile = require('../models/CandidateProfile');

// @desc    Get dashboard metrics & data
// @route   GET /api/dashboard
// @access  Private/HR or Admin
exports.getDashboardData = async (req, res) => {
    try {
        if (global.MOCK_DB) {
            const apps = global.mockApplications || [];
            
            const candidatesData = apps.map(app => {
                let statusColor = 'amber';
                if (app.status === 'shortlisted') statusColor = 'emerald';
                if (app.status === 'rejected') statusColor = 'rose';
                if (app.status === 'interview') statusColor = 'blue';

                return {
                    id: app.id,
                    name: app.name,
                    role: app.role,
                    score: app.score,
                    exp: app.exp + ' yrs',
                    status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
                    statusColor
                };
            }).reverse().slice(0, 10); // Show latest 10
            
            const aiRecommendationsData = apps.filter(app => app.score >= 80).map(match => {
                let color = 'emerald';
                let status = 'Strong Hire';
                if (match.score < 90) { color = 'amber'; status = 'Moderate Fit'; }

                return {
                    id: match.id,
                    name: match.name,
                    role: match.role,
                    score: match.score,
                    status,
                    reason: `AI Match Score of ${match.score}%`,
                    color
                };
            }).sort((a, b) => b.score - a.score).slice(0, 5);

            let avgAiScore = apps.length > 0 ? Math.round(apps.reduce((acc, app) => acc + app.score, 0) / apps.length) : 0;

            return res.status(200).json({
                success: true,
                data: {
                    overviewData: {
                        totalApplications: apps.length,
                        aiScreened: apps.length,
                        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
                        rejected: apps.filter(a => a.status === 'rejected').length,
                        pendingReview: apps.filter(a => a.status === 'pending').length,
                        activeJobs: 1
                    },
                    jobAnalyticsData: [],
                    candidatesData,
                    aiRecommendationsData,
                    bestMatchesData: aiRecommendationsData.slice(0, 3).map(m => ({ name: m.role, match: `${m.name} (${m.score}%)` })),
                    interviewData: (global.mockInterviews || []).map(inv => ({
                        id: inv.id,
                        name: inv.candidate,
                        type: inv.type,
                        time: `${inv.date}, ${inv.time}`,
                        status: 'Upcoming',
                        color: 'blue'
                    })),
                    notificationsData: [
                        { text: "System ready for AI screening (MOCK MODE)", time: "Just now", type: "alert" }
                    ],
                    avgAiScore,
                    topSkills: (() => {
                        const counts = {};
                        apps.forEach(app => {
                            if (app.skills) {
                                app.skills.forEach(s => {
                                    if (s !== 'None') counts[s] = (counts[s] || 0) + 1;
                                });
                            }
                        });
                        const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
                        return sorted.length > 0 ? sorted.slice(0, 5) : ['React', 'MySQL', 'Java', 'Spring Boot', 'Node.js'];
                    })()
                }
            });
        }

        const query = req.user.role === 'admin' ? {} : { hrId: req.user.id }; // Usually apply this to Jobs, but for now just general stats

        // 1. Overview Data
        const totalApplications = await Application.countDocuments();
        const aiScreened = await Application.countDocuments({ aiMatchScore: { $exists: true } });
        const shortlisted = await Application.countDocuments({ status: 'shortlisted' });
        const rejected = await Application.countDocuments({ status: 'rejected' });
        const pendingReview = await Application.countDocuments({ status: 'pending' });
        const activeJobs = await Job.countDocuments(query.hrId ? { hrId: query.hrId, status: 'open' } : { status: 'open' });

        const overviewData = {
            totalApplications,
            aiScreened,
            shortlisted,
            rejected,
            pendingReview,
            activeJobs
        };

        // 2. Job Analytics Data
        // Find jobs and count applications for each
        const jobs = await Job.find(query.hrId ? { hrId: query.hrId } : {}).select('title _id');
        const jobAnalyticsData = [];
        for (let job of jobs) {
            const applicantsCount = await Application.countDocuments({ jobId: job._id });
            const shortlistedCount = await Application.countDocuments({ jobId: job._id, status: 'shortlisted' });

            if (applicantsCount > 0) {
                jobAnalyticsData.push({
                    role: job.title,
                    applicants: applicantsCount,
                    shortlisted: shortlistedCount,
                    progress: Math.round((shortlistedCount / applicantsCount) * 100) || 0
                });
            }
        }

        // 3. Candidates Data (Recent applications)
        const recentApplications = await Application.find()
            .populate('candidateId', 'name email role')
            .populate('jobId', 'title')
            .sort({ createdAt: -1 })
            .limit(10);

        const candidatesData = recentApplications.map(app => {
            let statusColor = 'amber';
            if (app.status === 'shortlisted') statusColor = 'emerald';
            if (app.status === 'rejected') statusColor = 'rose';
            if (app.status === 'interview') statusColor = 'blue';

            return {
                id: app._id.toString(),
                name: app.candidateId?.name || 'Unknown User',
                role: app.jobId?.title || 'Unknown Role',
                score: app.aiMatchScore || 0,
                exp: 'N/A', // Could fetch from profile if populated
                status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
                statusColor
            };
        });

        // 4. AI Recommendations Data (Top matches)
        const topMatches = await Application.find({ aiMatchScore: { $gte: 80 } })
            .populate('candidateId', 'name')
            .populate('jobId', 'title')
            .sort({ aiMatchScore: -1 })
            .limit(5);

        const aiRecommendationsData = topMatches.map(match => {
            let color = 'emerald';
            let status = 'Strong Hire';
            if (match.aiMatchScore < 90) { color = 'amber'; status = 'Moderate Fit'; }

            return {
                id: match._id.toString(),
                name: match.candidateId?.name || 'Unknown',
                role: match.jobId?.title || 'Unknown',
                score: match.aiMatchScore || 0,
                status,
                reason: `AI Match Score of ${match.aiMatchScore}%`,
                color
            };
        });

        // Best Matches Data (Used for summary panel)
        const bestMatchesData = topMatches.slice(0, 3).map(match => ({
            name: match.jobId?.title || 'Unknown Role',
            match: `${match.candidateId?.name || 'Unknown'} (${match.aiMatchScore}%)`
        }));

        // 5. Interview Data (Upcoming)
        const upcomingInterviews = await Interview.find({ status: 'upcoming' })
            .populate('candidateId', 'name')
            .sort({ date: 1, time: 1 })
            .limit(5);

        const interviewData = upcomingInterviews.map(int => {
            // Formatting date to a readable string (e.g. today, tomorrow)
            const dateStr = new Date(int.date).toLocaleDateString();
            return {
                id: int._id.toString(),
                name: int.candidateId?.name || 'Unknown',
                type: int.roundType + ' Round',
                time: `${dateStr}, ${int.time}`,
                status: int.status.charAt(0).toUpperCase() + int.status.slice(1),
                color: 'blue'
            };
        });

        // 6. Average AI Score
        const allScoredApps = await Application.find({ aiMatchScore: { $exists: true } }).select('aiMatchScore');
        let avgAiScore = 0;
        if (allScoredApps.length > 0) {
            const totalScore = allScoredApps.reduce((acc, app) => acc + (app.aiMatchScore || 0), 0);
            avgAiScore = Math.round(totalScore / allScoredApps.length);
        }

        // 7. Mock Notifications (As there is no Notification model yet)
        const notificationsData = [
            { text: "System ready for AI screening", time: "Just now", type: "success" },
            { text: "Dashboard stats refreshed", time: "1m ago", type: "alert" }
        ];

        res.status(200).json({
            success: true,
            data: {
                overviewData,
                jobAnalyticsData: jobAnalyticsData.slice(0, 5), // Limit to top 5
                candidatesData,
                aiRecommendationsData,
                bestMatchesData,
                interviewData,
                notificationsData,
                avgAiScore,
                topSkills: await (async () => {
                    try {
                        const profiles = await CandidateProfile.find().select('parsedData.skills');
                        const counts = {};
                        profiles.forEach(p => {
                            if (p.parsedData && p.parsedData.skills) {
                                p.parsedData.skills.forEach(s => {
                                    if (s !== 'None') counts[s] = (counts[s] || 0) + 1;
                                });
                            }
                        });
                        const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
                        return sorted.length > 0 ? sorted.slice(0, 5) : ['React', 'MySQL', 'Java', 'Spring Boot', 'Node.js'];
                    } catch (err) {
                        return ['React', 'MySQL', 'Java', 'Spring Boot', 'Node.js'];
                    }
                })()
            }
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ success: false, message: 'Server Error getting dashboard data' });
    }
};
