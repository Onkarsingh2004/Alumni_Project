const StudentProfile = require('../models/StudentProfile');
const AlumniProfile = require('../models/AlumniProfile');
const User = require('../models/User');

// @desc    Create or update user profile
// @route   POST /api/profiles
// @access  Private
const updateProfile = async (req, res) => {
    const { role } = req.user;
    const profileData = req.body;

    try {
        let profile;

        if (role === 'student') {
            profile = await StudentProfile.findOne({ user: req.user.id });
            if (profile) {
                // Update
                profile = await StudentProfile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileData },
                    { new: true }
                );
            } else {
                // Create
                profile = await StudentProfile.create({
                    user: req.user.id,
                    ...profileData,
                });
            }
        } else if (role === 'alumni') {
            profile = await AlumniProfile.findOne({ user: req.user.id });
            if (profile) {
                profile = await AlumniProfile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileData },
                    { new: true }
                );
            } else {
                profile = await AlumniProfile.create({
                    user: req.user.id,
                    ...profileData,
                });
            }
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get current user profile
// @route   GET /api/profiles/me
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        let profile;
        if (req.user.role === 'student') {
            profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email');
        } else if (req.user.role === 'alumni') {
            profile = await AlumniProfile.findOne({ user: req.user.id }).populate('user', 'name email');
        }

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all alumni profiles (with filtering)
// @route   GET /api/profiles/alumni
// @access  Private
const getAllAlumni = async (req, res) => {
    try {
        const { company, domain, skills } = req.query;
        let query = {};

        if (company) {
            query.company = { $regex: company, $options: 'i' };
        }
        if (domain) {
            query.domain = { $regex: domain, $options: 'i' };
        }
        if (skills) {
            query.skills = { $in: skills.split(',') };
        }

        const alumni = await AlumniProfile.find(query).populate('user', 'name email');
        res.json(alumni);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    updateProfile,
    getMyProfile,
    getAllAlumni,
};
