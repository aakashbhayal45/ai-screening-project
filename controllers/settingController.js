const Setting = require('../models/Setting');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res) => {
    try {
        if (global.MOCK_DB) {
            return res.json({ theme: 'light', emailNotifications: true, defaultAiStrictness: 'medium' });
        }
        let settings = await Setting.findOne();

        // If settings doc doesn't exist yet, create a default one
        if (!settings) {
            settings = await Setting.create({});
        }

        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
    try {
        if (global.MOCK_DB) {
            return res.json(req.body);
        }
        let settings = await Setting.findOne();

        // If it doesn't exist, create it from the request body
        if (!settings) {
            settings = await Setting.create(req.body);
            return res.json(settings);
        }

        // Update existing document replacing only the sent fields
        settings = await Setting.findOneAndUpdate(
            {}, // matcher (empty to get the only document)
            { $set: req.body }, // update operation
            { new: true, runValidators: true } // return updated doc
        );

        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
