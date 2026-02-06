const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const settings = await Settings.getSettings();
    res.json(settings);
}));

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, admin, asyncHandler(async (req, res) => {
    const { heroImage } = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
        settings = await Settings.create({ heroImage });
    } else {
        if (heroImage !== undefined) {
            settings.heroImage = heroImage;
        }
        await settings.save();
    }

    res.json(settings);
}));

module.exports = router;

