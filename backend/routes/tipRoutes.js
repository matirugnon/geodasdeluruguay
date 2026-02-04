const express = require('express');
const router = express.Router();
const Tip = require('../models/Tip');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    const tips = await Tip.find({});
    res.json(tips);
});

router.get('/:id', async (req, res) => {
    try {
        // Intentar buscar por slug primero, si falla buscar por ID (retrocompatibilidad)
        let tip = await Tip.findOne({ slug: req.params.id });
        
        // Si no se encuentra por slug y el parámetro parece un ObjectId válido, buscar por _id
        if (!tip && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            tip = await Tip.findById(req.params.id);
        }
        
        if (tip) {
            res.json(tip);
        } else {
            res.status(404).json({ message: 'Tip not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tip', error: error.message });
    }
});

router.post('/', protect, admin, async (req, res) => {
    const tip = new Tip(req.body);
    const createdTip = await tip.save();
    res.status(201).json(createdTip);
});

router.put('/:id', protect, admin, async (req, res) => {
    const tip = await Tip.findById(req.params.id);
    if (tip) {
        tip.title = req.body.title || tip.title;
        tip.excerpt = req.body.excerpt || tip.excerpt;
        tip.content = req.body.content || tip.content;
        tip.image = req.body.image || tip.image;
        tip.tags = req.body.tags || tip.tags;
        tip.date = req.body.date || tip.date;

        const updatedTip = await tip.save();
        res.json(updatedTip);
    } else {
        res.status(404).json({ message: 'Tip not found' });
    }
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