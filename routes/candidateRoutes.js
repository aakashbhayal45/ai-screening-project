const express = require('express');
const multer = require('multer');
const { getMyProfile, createOrUpdateProfile, uploadResume, getAllCandidates, getCandidateById } = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Set up multer memory storage for file upload
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/', protect, authorize('hr', 'admin'), getAllCandidates);
router.get('/:id', protect, authorize('hr', 'admin'), getCandidateById);
router.get('/me', protect, authorize('candidate'), getMyProfile);
router.post('/', protect, authorize('candidate'), createOrUpdateProfile);
router.post('/upload', upload.single('resume'), uploadResume);

module.exports = router;
