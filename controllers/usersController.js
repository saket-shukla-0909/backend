const bcrypt = require('bcryptjs');
const User = require('../models/usersModel');
const validateRegistration = require('../utils/validation');
const generateToken = require("../utils/generateTokens");
const roleMap = require('../utils/roles'); 


const registerUser = async (req, res) => {
  console.log(req.body, "this is req body in register user")
  const { error } = validateRegistration(req.body);
  console.log(req.body, "this is req body in register user")
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
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
      role,
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
    user.status = 1;
    await user.save(); 

    // response 
    res.status(201).json({user, message: 'User Logged In successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;  

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the token from the user's record (assuming you're storing the token in the database)
    user.token = null;  // Set token to null

    // Save the user document after clearing the token
    user.status = 0;
    await user.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const LoggedInUser = req.user._id;
    const users = await User.find({_id: {$ne: LoggedInUser}}).select('-password -token'); 
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}
const getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const total = await User.countDocuments();

    const users = await User.find().skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Upload profile picture controller
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId, "this is user id in upload profile picture")
    const imagePath = req.file ? req.file.path : null;

    if (!imagePath) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile_picture: imagePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const searchUsersByNameOrPhone = async (req, res) => {
  try {
    const search = req.query.search || "";
    const regex = new RegExp(search, "i"); // case-insensitive search

    const LoggedInUser = req.user._id;

    const users = await User.find({
      _id: { $ne: LoggedInUser }, // exclude current user
      $or: [
        { full_name: regex },
        { phone_number: regex }
      ]
    }).select("-password -token");

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




module.exports = { registerUser, loginUser, logoutUser, getAllUser, deleteUser, uploadProfilePicture, getAllUsers, searchUsersByNameOrPhone } 
