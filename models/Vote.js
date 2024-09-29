const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;