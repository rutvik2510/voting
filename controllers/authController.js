const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.registerUser = async(req, res) => {
    const { role, name, dateOfBirth, parentName, email, mobile, password, aadhar } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = new User({
            role,
            name,
            dateOfBirth,
            parentName,
            email,
            mobile,
            password,
            aadhar,
            profilePic: req.file ? `/uploads/${req.file.filename}` : null, // Registration

        });
        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '9h' });
        res.status(201).json({ token, user, msg: "user register successfully " });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User Login
exports.loginUser = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '9h' });
        res.json({ token, user, msg: "user logged successfully " });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserData = async(req, res) => {
    const userId = req.user.userId; // The user ID from the authenticated token
    const { name, dateOfBirth, parentName, email, mobile, password, aadhar } = req.body;

    try {
        // Find the user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only update the fields that are provided in the request body
        if (name) user.name = name;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (parentName) user.parentName = parentName;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (aadhar) user.aadhar = aadhar;

        // If there's a new password, hash it before saving
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // If a new profile picture is uploaded
        if (req.file) {
            user.profilePic = `/uploads/${req.file.filename}`; // Update
        }


        // Save the updated user data
        await user.save();

        res.json({ user, message: 'User data updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Get User Profile

exports.getUserById = async(req, res) => {
    const userId = req.params.id; // Get user ID from the request parameters
    // Get user ID from the token

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user, message: 'User retrieved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};