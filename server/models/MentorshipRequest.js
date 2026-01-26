const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    alumni: {
        type: mongoose.Schema.Types.ObjectId, // Could be User or AlumniProfile, stick to User for easier querying
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending',
    },
    meetingDate: {
        type: Date,
    },
    meetingLink: {
        type: String, // Google Meet / Zoom
    },
}, { timestamps: true });

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
