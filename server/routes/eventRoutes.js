const express = require('express');
const router = express.Router();
const { getEvents, createEvent, registerEvent, getEventById } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEvents);
router.post('/', protect, createEvent);
router.get('/:id', protect, getEventById);
router.put('/:id/register', protect, registerEvent);

module.exports = router;
