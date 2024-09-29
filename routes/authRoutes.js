const express = require('express');
const { registerUser, loginUser, updateUserData, getUserById } = require('../controllers/authController');
//const upload = require('../middleware/uploadMiddleware'); // Multer middleware
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware, admin } = require("../middleware/authMiddleware")

// Define storage location and filename format
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter to accept only certain types of files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({ storage, fileFilter });


router.post('/register', upload.single('profilePic'), registerUser); // For registration with image upload
router.post('/login', loginUser);
router.put('/UpdateProfile', authMiddleware, upload.single('profilePic'), updateUserData);
router.get('/user/:id', authMiddleware, getUserById);




module.exports = router;