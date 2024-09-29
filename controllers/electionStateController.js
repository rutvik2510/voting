const Election = require('../models/ElectionState');

// Get all elections
exports.getElections = async(req, res) => {
    try {
        const elections = await Election.find().populate('candidates'); // Populate candidates if present
        res.status(200).json(elections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving elections', error });
    }
};

// Create a new election
exports.createElection = async(req, res) => {
    const { state, category, startDate, endDate } = req.body;
    try {
        const newElection = new Election({
            state,
            category,
            startDate,
            endDate,
        });

        await newElection.save();
        res.status(201).json({ message: 'Election created successfully!', newElection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating election', error });
    }
};

// Update an existing election
exports.updateElection = async(req, res) => {
    const { id } = req.params;
    const { state, category, startDate, endDate } = req.body;
    try {
        const updatedElection = await Election.findByIdAndUpdate(
            id, { state, category, startDate, endDate }, { new: true }
        );
        if (!updatedElection) return res.status(404).json({ message: 'Election not found' });

        res.status(200).json({ message: 'Election updated successfully!', updatedElection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating election', error });
    }
};

// Delete an election
exports.deleteElection = async(req, res) => {
    const { id } = req.params;
    try {
        const deletedElection = await Election.findByIdAndDelete(id);
        if (!deletedElection) return res.status(404).json({ message: 'Election not found' });

        res.status(200).json({ message: 'Election deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting election', error });
    }
};