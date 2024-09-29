const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const voteController = require('../controllers/voteController');

// Route for getting all elections
router.get('/', voteController.getAllElections);

// Route for getting candidates for a specific election
router.get('/:electionId/candidates', voteController.getCandidatesForElection);

// Route for submitting a vote
router.post('/:electionId/vote', authMiddleware, voteController.submitVote);

// Route for fetching election results
router.get('/result', voteController.getResults);

module.exports = router;