const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get chat history with a specific user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get list of users involved in conversations
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id; // Changed from myId to userId and req.user.id to req.user._id

        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
            .sort({ createdAt: -1 }) // Changed sort order to get latest messages first
            .populate('sender', 'name role') // Changed populate fields
            .populate('receiver', 'name role'); // Changed populate fields

        const conversations = [];
        const seenUsers = new Set();
        const unreadCounts = {};

        // Calculate unread counts
        messages.forEach(msg => {
            const receiverId = msg.receiver._id ? msg.receiver._id.toString() : msg.receiver.toString();
            if (receiverId === userId.toString() && msg.status !== 'read') {
                const senderId = msg.sender._id ? msg.sender._id.toString() : msg.sender.toString();
                unreadCounts[senderId] = (unreadCounts[senderId] || 0) + 1;
            }
        });

        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === userId.toString()
                ? msg.receiver
                : msg.sender;

            if (!seenUsers.has(otherUser._id.toString())) {
                seenUsers.add(otherUser._id.toString());
                conversations.push({
                    _id: otherUser._id,
                    name: otherUser.name,
                    role: otherUser.role,
                    lastMessage: msg.content,
                    updatedAt: msg.createdAt,
                    unreadCount: unreadCounts[otherUser._id.toString()] || 0
                });
            }
        });

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc sendMessage (via REST, though Socket is preferred)
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name')
            .populate('receiver', 'name');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Mark messages as read
// @route   PUT /api/messages/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const { senderId } = req.body;
        const myId = req.user.id;

        await Message.updateMany(
            { sender: senderId, receiver: myId, status: { $ne: 'read' } },
            { $set: { status: 'read' } }
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const myId = req.user.id;
        const count = await Message.countDocuments({
            receiver: myId,
            status: { $ne: 'read' }
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMessages, getConversations, sendMessage, markAsRead, getUnreadCount };
