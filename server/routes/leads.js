const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lead = require('../models/Lead');

// @route   GET api/leads
// @desc    Get all leads
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/leads/:id
// @desc    Get single lead
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ msg: 'Lead not found' });
        res.json(lead);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Lead not found' });
        res.status(500).send('Server Error');
    }
});

// @route   POST api/leads
// @desc    Create a lead
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, email, phone, source, status } = req.body;

    try {
        const newLead = new Lead({
            name,
            email,
            phone,
            source,
            status
        });

        const lead = await newLead.save();
        res.json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, email, phone, source, status } = req.body;

    // Build lead object
    const leadFields = {};
    if (name) leadFields.name = name;
    if (email) leadFields.email = email;
    if (phone) leadFields.phone = phone;
    if (source) leadFields.source = source;
    if (status) leadFields.status = status;

    try {
        let lead = await Lead.findById(req.params.id);

        if (!lead) return res.status(404).json({ msg: 'Lead not found' });

        lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { $set: leadFields },
            { new: true }
        );

        res.json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let lead = await Lead.findById(req.params.id);

        if (!lead) return res.status(404).json({ msg: 'Lead not found' });

        await Lead.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Lead removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/leads/:id/notes
// @desc    Add a note to a lead
// @access  Private
router.post('/:id/notes', auth, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ msg: 'Lead not found' });

        const newNote = {
            content: req.body.content,
            author: req.body.author || 'Admin', // In real app, get name from user ID
            createdAt: new Date()
        };

        lead.notes.unshift(newNote);
        await lead.save();
        res.json(lead.notes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
