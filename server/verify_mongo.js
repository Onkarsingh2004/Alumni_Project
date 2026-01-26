require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log(`Connecting to: ${process.env.MONGO_URI}`);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        console.log('Database connection is functional.');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
