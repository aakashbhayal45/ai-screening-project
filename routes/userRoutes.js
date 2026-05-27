const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getProfile, updateProfile, uploadProfileFile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure 'uploads/' directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/upload', protect, upload.single('file'), uploadProfileFile);

module.exports = router;
