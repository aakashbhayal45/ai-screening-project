const express = require('express');
const { getJobs, createJob, updateJob, getMyJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(protect, authorize('hr', 'admin'), createJob);

router.route('/me')
    .get(protect, authorize('hr', 'admin'), getMyJobs);

router.route('/:id')
    .put(protect, authorize('hr', 'admin'), updateJob);

module.exports = router;
