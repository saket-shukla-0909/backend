const fs = require('fs');
const path = require('path');
const User = require('../models/usersModel');

const upload = async (req, res) => {
  try {
    const userId = req.user._id; // Get user from token
    const imagePath = req.file ? req.file.path : null;

    if (!imagePath) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // 🔁 Step 1: Find current user and check if they already have a profile picture
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldImagePath = user.profile_picture;

    // 🔁 Step 2: Delete the old file if it exists and is in the profile_pictures folder
    if (oldImagePath && oldImagePath.includes('uploads/profile_pictures')) {
      fs.unlink(path.join(__dirname, '..', oldImagePath), (err) => {
        if (err) {
          console.error('Failed to delete old profile picture:', err);
        } else {
          console.log('Old profile picture deleted:', oldImagePath);
        }
      });
    }

    // 🔁 Step 3: Update user with new profile picture path
    user.profile_picture = imagePath;
    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = upload;

// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // ✅ Step 1: Ensure the upload directory exists
// const uploadDir = path.join(__dirname, '..', 'uploads', 'profile_pictures');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // ✅ Step 2: Storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir); // use safe folder path
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // unique filename
//   }
// });

// // ✅ Step 3: File filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimeType = allowedTypes.test(file.mimetype);

//   if (extName && mimeType) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only images (jpeg, jpg, png) are allowed'));
//   }
// };

// // ✅ Step 4: Create multer upload instance
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 } // max 2MB
// });


