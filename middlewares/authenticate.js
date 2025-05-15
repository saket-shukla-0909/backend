const jwt = require('jsonwebtoken');
const { User } = require('../models/usersModel'); 
const dotenv = require("dotenv").config();

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log(token, "this is token")
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded)
    const user = await User.findById(decoded.id); // or User.findById() for Mongo
    console.log(user, "this is user");
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error('JWT error:', err);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = authenticate;
