const express = require('express');
const router = express.Router();
const { requestMentorship, getRequests, updateRequestStatus } = require('../controllers/mentorshipController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, requestMentorship);
router.get('/requests', protect, getRequests);
router.put('/respond', protect, updateRequestStatus);

module.exports = router;
