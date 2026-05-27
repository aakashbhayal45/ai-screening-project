const Company = require('../models/Company');

// @desc    Get company profile
// @route   GET /api/companies/:id
// @access  Public
exports.getCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }
        res.status(200).json({ success: true, data: company });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get logged in user's company profile
// @route   GET /api/companies/my
// @access  Private/HR
exports.getMyCompany = async (req, res) => {
    try {
        if (!req.user.companyId) {
            return res.status(200).json({ success: true, data: null });
        }
        const company = await Company.findById(req.user.companyId);
        res.status(200).json({ success: true, data: company });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create or update company profile
// @route   POST /api/companies
// @access  Private/HR
exports.createOrUpdateCompany = async (req, res) => {
    try {
        let company;

        // If user already has a companyId, update it
        if (req.user.companyId) {
            company = await Company.findByIdAndUpdate(req.user.companyId, req.body, {
                new: true,
                runValidators: true
            });
        } else {
            // Create new company
            company = await Company.create(req.body);
            // Link to user
            req.user.companyId = company._id;
            await req.user.save();
        }

        res.status(200).json({ success: true, data: company });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
