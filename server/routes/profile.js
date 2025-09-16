import express from 'express';
import Profile from '../models/profile.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/profiles - Fetch paginated, sorted, and filtered profiles
router.get('/', auth, async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    try {
        const profiles = await Profile.find({ createdBy: req.user._id })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ [sortBy]: order });

        const count = await Profile.countDocuments({ createdBy: req.user._id });

        res.json({
            profiles,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/profiles - Create a new profile
router.post('/', auth, async (req, res) => {
    const profile = new Profile({
        ...req.body,
        createdBy: req.user._id
    });
    try {
        const newProfile = await profile.save();
        res.status(201).json(newProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/profiles/:id - Update a profile
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProfile) return res.status(404).json({ message: 'Profile not found' });
        res.json(updatedProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/profiles/:id - Delete a single profile
router.delete('/:id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/profiles/delete-many - Bulk delete profiles
router.post('/delete-many', auth, async (req, res) => {
    try {
        const { ids } = req.body;
        await Profile.deleteMany({
            _id: { $in: ids },
            createdBy: req.user._id
        });
        res.json({ message: 'Selected profiles deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
