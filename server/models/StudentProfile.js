const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    universityId: {
        type: String,
    },
    branch: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    interests: {
        type: [String],
        default: [],
    },
    resume: {
        type: String, // URL to Cloudinary
    },
    github: {
        type: String,
    },
    linkedin: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
