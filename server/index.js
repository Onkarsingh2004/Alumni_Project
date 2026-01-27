const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const onlineUsers = new Map();

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/mentorship', require('./routes/mentorshipRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (userId) => {
        socket.join(userId);
        onlineUsers.set(userId, socket.id);
        io.emit("user_online", userId);

        // Also send current list of online users to the joining user
        const onlineIds = Array.from(onlineUsers.keys());
        socket.emit("online_users_list", onlineIds);
    });

    socket.on("send_message", async (data) => {
        // Relay message
        socket.to(data.receiverId).emit("receive_message", data);
    });

    socket.on("message_delivered", async ({ messageId, senderId }) => {
        // Update DB
        try {
            await Message.findByIdAndUpdate(messageId, { status: 'delivered' });
            io.to(senderId).emit("message_status_update", { messageId, status: 'delivered' });
        } catch (err) { console.error("Delivered update error", err); }
    });

    socket.on("read_message", ({ senderId, readerId }) => {
        // Notify the sender that their messages were read
        socket.to(senderId).emit("messages_read", { readerId });
    });

    socket.on("disconnect", () => {
        let userId;
        for (const [uid, sid] of onlineUsers.entries()) {
            if (sid === socket.id) {
                userId = uid;
                onlineUsers.delete(uid);
                break;
            }
        }
        if (userId) io.emit("user_offline", userId);
        console.log("User Disconnected", socket.id);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
