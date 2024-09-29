const Election = require('../models/ElectionState');
const Candidate = require('../models/Candidates');
const Vote = require('../models/Vote');

// Fetch all elections
exports.getAllElections = async(req, res) => {
    try {
        const elections = await Election.find();
        res.json(elections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching elections' });
    }
};

// Fetch candidates for a specific election
exports.getCandidatesForElection = async(req, res) => {
    const { electionId } = req.params;
    try {
        const candidates = await Candidate.find({ election: electionId });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching candidates' });
    }
};

// Submit a vote
exports.submitVote = async(req, res) => {
    const { electionId } = req.params;
    const { candidateId } = req.body;

    try {
        // Check if the user has already voted
        const existingVote = await Vote.findOne({ election: electionId, user: req.user.userId });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted in this election.' });
        }

        // Create and save the vote
        const vote = new Vote({
            election: electionId,
            candidate: candidateId,
            user: req.user.userId,
        });
        await vote.save();

        res.status(201).json({ message: 'Vote submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting vote' });
    }
};

// Get election results
exports.getResults = async(req, res) => {
    try {
        const results = await Vote.find()
            .populate('election', 'state')
            .populate({
                path: 'candidate',
                select: 'name party',
            })
            .lean();

        const groupedResults = results.reduce((acc, result) => {
            if (result.election && result.candidate) {
                const electionState = result.election.state;
                const party = result.candidate.party;

                if (!acc[electionState]) {
                    acc[electionState] = {};
                }

                if (!acc[electionState][party]) {
                    acc[electionState][party] = {
                        totalVotes: 0,
                        partyName: party,
                    };
                }

                acc[electionState][party].totalVotes += 1;
            }
            return acc;
        }, {});

        const resultArray = Object.entries(groupedResults).map(([state, parties]) => ({
            state,
            parties: Object.values(parties),
        }));

        res.json(resultArray);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results' });
    }
};