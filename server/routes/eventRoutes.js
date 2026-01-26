const express = require('express');
const router = express.Router();
const { getEvents, createEvent, registerEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEvents);
router.post('/', protect, createEvent);
router.put('/:id/register', protect, registerEvent);

module.exports = router;
