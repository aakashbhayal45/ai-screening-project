const express = require('express');
const { getCompany, getMyCompany, createOrUpdateCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, authorize('hr', 'admin'), getMyCompany);
router.get('/:id', getCompany);
router.post('/', protect, authorize('hr', 'admin'), createOrUpdateCompany);

module.exports = router;
