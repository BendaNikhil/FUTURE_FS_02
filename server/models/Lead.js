const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    source: {
        type: String,
        enum: ['Website', 'Social Media', 'Referral', 'Other'],
        default: 'Other'
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Converted', 'Lost'],
        default: 'New'
    },
    notes: [NoteSchema]
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
