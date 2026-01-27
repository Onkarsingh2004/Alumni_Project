const express = require('express');
const router = express.Router();
const { updateProfile, getMyProfile, getAllAlumni, getAlumniById } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, updateProfile);
router.get('/me', protect, getMyProfile);
router.get('/alumni', protect, getAllAlumni);
router.get('/alumni/:id', protect, getAlumniById);

module.exports = router;
