const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    type: {
        type: String, // Full-time, Internship, etc.
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skillsRequired: {
        type: [String],
        default: [],
    },
    referralAvailable: {
        type: Boolean,
        default: false,
    },
    applyLink: {
        type: String,
    },
    applicants: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        resume: {
            type: String,
        },
        status: {
            type: String,
            enum: ['applied', 'reviewed', 'shortlisted'],
            default: 'applied',
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('JobPost', jobPostSchema);
