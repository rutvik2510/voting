const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    parentName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    aadhar: { type: String, required: true, unique: true },
    profilePic: { type: String }, // To store image filename
}, { timestamps: true });

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);