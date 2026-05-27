const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('hr', 'admin'), getDashboardData);

module.exports = router;
