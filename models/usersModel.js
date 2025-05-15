const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const roleMap = require('../utils/roles'); 


// Define the User schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zAZ0-9-.]+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    full_name: {
      type: String,
      required: true
    },
    profile_picture: {
      type: String,
      default: null
    },
    phone_number: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      default: null
    },
    role: {
      type: Number,
      enum: [1, 2, 3], // 1=admin, 2=sub admin, 3=client
      default: roleMap.client,
      required: true
    },
    status: {
      type: Number,
      enum: [0, 1], // 0 = inactive, 1 = active
      default: 0
    },
    token: {
      type: String,
      default: null // Default value if token is not set yet
    }
  },
  { timestamps: true }
);



// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
