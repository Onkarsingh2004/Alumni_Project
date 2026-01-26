const express = require('express');
const router = express.Router();
const { updateProfile, getMyProfile, getAllAlumni } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, updateProfile);
router.get('/me', protect, getMyProfile);
router.get('/alumni', protect, getAllAlumni);

module.exports = router;
