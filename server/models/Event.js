const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: ['webinar', 'meetup', 'workshop'],
        default: 'webinar',
    },
    link: {
        type: String, // Google Meet / Zoom link
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
