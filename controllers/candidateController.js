const Candidate = require('../models/Candidates');
const Election = require('../models/ElectionState');

// Get all candidates
exports.getCandidates = async(req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving candidates', error });
    }
};

// Add a new candidate
exports.addCandidate = async(req, res) => {
    const { name, party, age, education, electionId } = req.body;
    try {
        const newCandidate = new Candidate({
            name,
            party,
            age,
            education,
            election: electionId,
            icon: req.file ? `/uploads/${req.file.filename}` : null,
        });

        await newCandidate.save();
        res.status(201).json({ message: 'Candidate added successfully!', newCandidate });
    } catch (error) {
        res.status(500).json({ message: 'Error adding candidate', error });
    }
};

// Update candidate
exports.updateCandidate = async(req, res) => {
    const { id } = req.params;
    const { name, party, age, education } = req.body;
    try {
        const updatedCandidate = await Candidate.findByIdAndUpdate(id, {
            name,
            party,
            age,
            education,
        }, { new: true });

        if (req.file) {
            updatedCandidate.icon = `/uploads/${req.file.filename}`;
            await updatedCandidate.save();
        }

        res.status(200).json({ message: 'Candidate updated successfully!', updatedCandidate });
    } catch (error) {
        res.status(500).json({ message: 'Error updating candidate', error });
    }
};

// Delete a candidate
exports.deleteCandidate = async(req, res) => {
    const { id } = req.params;
    try {
        const deletedCandidate = await Candidate.findByIdAndDelete(id);
        res.status(200).json({ message: 'Candidate deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting candidate', error });
    }
};

// Get candidates by election ID
exports.getCandidatesByElection = async(req, res) => {
    const { electionId } = req.params;
    console.log('Election ID:', electionId); // Log the election ID for debugging

    // Validate electionId
    if (!electionId) {
        return res.status(400).json({ message: 'Election ID is required' });
    }

    try {
        const candidates = await Candidate.find({ election: electionId });

        if (!candidates.length) {
            return res.status(404).json({ message: 'No candidates found for this election' });
        }

        res.status(200).json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};