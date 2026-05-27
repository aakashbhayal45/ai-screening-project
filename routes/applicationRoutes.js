const express = require('express');
const { getJobApplications, applyForJob, updateApplication, getMyApplications } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/me').get(protect, authorize('candidate'), getMyApplications);

// Route can be accessed directly or nested from jobs
router.route('/')
    .get(protect, authorize('hr', 'admin'), getJobApplications)
    .post(protect, authorize('candidate'), applyForJob);

router.route('/:id')
    .put(protect, authorize('hr', 'admin'), updateApplication);

module.exports = router;
