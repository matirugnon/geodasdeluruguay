const express = require('express');
const router = express.Router();
const Tip = require('../models/Tip');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    const tips = await Tip.find({});
    res.json(tips);
});

router.post('/', protect, admin, async (req, res) => {
    const tip = new Tip(req.body);
    const createdTip = await tip.save();
    res.status(201).json(createdTip);
});

router.delete('/:id', protect, admin, async (req, res) => {
    const tip = await Tip.findById(req.params.id);
    if (tip) {
        await tip.deleteOne();
        res.json({ message: 'Tip removed' });
    } else {
        res.status(404).json({ message: 'Tip not found' });
    }
});

module.exports = router;