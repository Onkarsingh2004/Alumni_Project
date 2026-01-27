const express = require('express');
const router = express.Router();
const { getMessages, getConversations, sendMessage, markAsRead, getUnreadCount } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/read', protect, markAsRead);

module.exports = router;
