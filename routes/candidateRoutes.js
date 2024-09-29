// const express = require('express');
// const {
//     getCandidates,
//     addCandidate,
//     updateCandidate,
//     deleteCandidate,

// } = require('../controllers/candidateController');
// const multer = require('multer');
// const path = require('path'); // Import the path module
// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'upload/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Use path.extname for file extension
//     },
// });

// // File filter to accept only specific types of files
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type'), false);
//     }
// };

// const upload = multer({ storage, fileFilter });

// // Candidate routes
// router.get('/candidates', getCandidates); // Fetch all candidates
// router.post('/candidates', upload.single('icon'), addCandidate); // Add a new candidate with icon upload
// router.put('/candidates/:id', upload.single('icon'), updateCandidate); // Update a candidate, allowing icon update
// router.delete('/candidates/:id', deleteCandidate); // Delete a candidate



// module.exports = router;
const express = require('express');
const router = express.Router();
const { getCandidates, addCandidate, updateCandidate, deleteCandidate, getCandidatesByElection } = require('../controllers/candidateController');

//const { authMiddleware, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use path.extname for file extension
    },
});

// File filter to accept only specific types of files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({ storage, fileFilter });

router.get('/candidates', getCandidates);
router.post('/candidates', upload.single('icon'), addCandidate);
router.put('/candidates/:id', upload.single('icon'), updateCandidate);
router.delete('/candidates/:id', deleteCandidate);
router.get('/elections/:electionId/candidates', getCandidatesByElection);


module.exports = router;