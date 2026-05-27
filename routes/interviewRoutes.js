const express = require('express');
const { getInterviews, scheduleInterview, updateInterview } = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getInterviews)
    .post(protect, authorize('hr', 'admin'), scheduleInterview);

router.route('/:id')
    .put(protect, authorize('hr', 'admin'), updateInterview);

module.exports = router;
