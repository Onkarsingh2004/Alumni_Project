const StudentProfile = require('../models/StudentProfile');
const AlumniProfile = require('../models/AlumniProfile');
const User = require('../models/User');

// @desc    Create or update user profile
// @route   POST /api/profiles
// @access  Private
// @desc    Create or update user profile
// @route   POST /api/profiles
// @access  Private
const updateProfile = async (req, res) => {
    const { role } = req.user;
    const { avatar, ...profileData } = req.body; // Extract avatar to update User model

    try {
        // Update User avatar if provided
        if (avatar) {
            await User.findByIdAndUpdate(req.user.id, { avatar });
        }

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
            profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email avatar');
        } else if (req.user.role === 'alumni') {
            profile = await AlumniProfile.findOne({ user: req.user.id }).populate('user', 'name email avatar');
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

        const alumni = await AlumniProfile.find(query).populate('user', 'name email avatar');
        res.json(alumni);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get alumni profile by ID
// @route   GET /api/profiles/alumni/:id
// @access  Private
const getAlumniById = async (req, res) => {
    try {
        const profile = await AlumniProfile.findById(req.params.id).populate('user', 'name email avatar');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    updateProfile,
    getMyProfile,
    getAllAlumni,
    getAlumniById
};
