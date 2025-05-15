const bcrypt = require('bcryptjs');
const User = require('../models/usersModel');
const validateRegistration = require('../utils/validation');
const generateToken = require("../utils/generateTokens");
const roleMap = require('../utils/roles'); 


const registerUser = async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  console.log(req.body,"this iskcbdsjb jb")
  let { username, email, password, full_name, phone_number, dob, profile_picture, role } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // ✅ Convert role string ("admin", "sub admin", "client") to number (1, 2, 3)
    if (typeof role === 'string') {
      role = roleMap[role.toLowerCase()];
      if (!role) {
        return res.status(400).json({ message: 'Invalid role' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      full_name,
      phone_number,
      dob,
      profile_picture,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { phone_number, password } = req.body;

  // Basic validation
  if (!phone_number || !password) {
    return res.status(400).json({ message: 'Please provide both phone number and password' });
  }

  try {
    const user = await User.findOne({ phone_number });
    console.log(user, "this is userccbsacbjascj")
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }
    
    const token = generateToken(user._id);
    // Save the token to the user document
    user.token = token;
    await user.save(); 

    // response 
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      dob: user.dob,
      profile_picture: user.profile_picture,
      token: generateToken(user._id),
      
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;  // Get user ID from the request (from auth middleware)

    // Find the user and remove the token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the token from the user's record (assuming you're storing the token in the database)
    user.token = null;  // Set token to null

    // Save the user document after clearing the token
    await user.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = deleteUser;


module.exports = { registerUser, loginUser, logoutUser, getAllUser } 
