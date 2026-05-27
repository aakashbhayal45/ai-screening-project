const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Server error pulling profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        console.log('--- Incoming profile update ---');
        console.log(req.body);

        // Prevent users from updating sensitive fields directly
        const { passwordHash, role, identifier, _id, companyId, ...updateData } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error updating profile' });
    }
};

// @desc    Upload profile file (photo, abstract document)
// @route   POST /api/users/profile/upload
// @access  Private
exports.uploadProfileFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fieldName = req.body.field || 'profilePhoto'; // e.g. 'profilePhoto', 'resumeUrl', 'idProofUrl'
        const fileUrl = `/uploads/${req.file.filename}`;

        const updateData = {};
        updateData[fieldName] = fileUrl;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        ).select('-passwordHash');

        res.status(200).json({
            success: true,
            data: user,
            message: `File uploaded to ${fieldName} successfully.`,
            fileUrl
        });
    } catch (error) {
        console.error('Error uploading file to profile:', error);
        res.status(500).json({ success: false, message: 'Server error uploading file to profile' });
    }
};
