const mongoose = require('mongoose');

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/your-database-name';

// Function to connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Stop the application on failure
  }
};

module.exports = connectDB;
