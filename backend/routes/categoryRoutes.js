const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// @desc    Fetch all categories
// @route   GET /api/categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;