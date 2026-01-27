const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('host', 'name')
            .sort({ date: 1 }); // Soonest first
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private (Alumni/Admin only ideally, but allowing all for demo)
const createEvent = async (req, res) => {
    const { title, description, date, type, link } = req.body;

    try {
        const event = await Event.create({
            host: req.user.id,
            title,
            description,
            date,
            type,
            link
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register for an event
// @route   PUT /api/events/:id/register
// @access  Private
const registerEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already registered' });
        }

        event.attendees.push(req.user.id);
        await event.save();

        res.json(event.attendees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('host', 'name email')
            .populate('attendees', 'name email'); // Populate attendees to show who is coming

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getEvents,
    createEvent,
    registerEvent,
    getEventById
};
