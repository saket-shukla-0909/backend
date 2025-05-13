const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from the .env file
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = connectDB;
