const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party: { type: String, required: true },
    age: {
        type: Number,
        min: 18, // Assuming the minimum age is 18
        max: 100, // You can adjust the max as per your needs
    },
    education: { type: String },
    icon: { type: String },
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
}, { timestamps: true });

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;