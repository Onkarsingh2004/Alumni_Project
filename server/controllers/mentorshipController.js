const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');

// @desc    Request mentorship
// @route   POST /api/mentorship/request
// @access  Private (Student only)
const requestMentorship = async (req, res) => {
    const { alumniId, message } = req.body;

    try {
        // Check if request already exists
        const existingRequest = await MentorshipRequest.findOne({
            student: req.user.id,
            alumni: alumniId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already pending' });
        }

        const request = await MentorshipRequest.create({
            student: req.user.id,
            alumni: alumniId,
            message
        });

        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get requests for alumni
// @route   GET /api/mentorship/requests
// @access  Private
const getRequests = async (req, res) => {
    try {
        let requests;
        if (req.user.role === 'alumni') {
            requests = await MentorshipRequest.find({ alumni: req.user.id })
                .populate('student', 'name email')
                .sort({ createdAt: -1 });
        } else {
            requests = await MentorshipRequest.find({ student: req.user.id })
                .populate('alumni', 'name email')
                .sort({ createdAt: -1 });
        }

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update request status
// @route   PUT /api/mentorship/respond
// @access  Private (Alumni only)
const updateRequestStatus = async (req, res) => {
    const { requestId, status } = req.body; // status: accepted/rejected

    try {
        const request = await MentorshipRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.alumni.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        request.status = status;
        await request.save();

        res.json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    requestMentorship,
    getRequests,
    updateRequestStatus
};
