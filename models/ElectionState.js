const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    state: { type: String, required: true },
    category: { type: String, required: true, enum: ['upcoming', 'other'] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }], // Add this field if candidates are needed
}, { timestamps: true });

const Election = mongoose.model('Election', electionSchema);
module.exports = Election;