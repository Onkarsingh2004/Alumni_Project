const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    experience: {
        type: Number, // Years
        required: true,
    },
    domain: {
        type: String, // e.g., Frontend, Backend, AI/ML
        required: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    isMentorshipAvailable: {
        type: Boolean,
        default: true,
    },
    github: {
        type: String,
    },
    linkedin: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);
