// const express = require('express');
// const router = express.Router();
// const {
//     getElections,
//     getElectionById,
//     createElection,
//     updateElection,
//     deleteElection,
// } = require('../controllers/electionStateController');
// const auth = require("../middleware/authMiddleware")

// // Public routes

// router.get('/get:id', getElectionById);
// router.get('/', auth, getElections);
// // Admin routes
// router.post('/create', createElection);
// router.put('/update:id', updateElection);
// router.delete('/delete:id', deleteElection)


// module.exports = router;
const express = require('express');
const router = express.Router();
const {
    getElections,
    createElection,
    updateElection,
    deleteElection
} = require('../controllers/electionStateController');
const { authMiddleware, admin } = require('../middleware/authMiddleware');

// Election Routes
router.get('/', getElections);
router.post('/create', authMiddleware, admin, createElection);
router.put('/update/:id', authMiddleware, admin, updateElection);
router.delete('/delete/:id', authMiddleware, admin, deleteElection);

module.exports = router;