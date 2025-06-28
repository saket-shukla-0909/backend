const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Step 1: Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'profile_pictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Step 2: Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // use safe folder path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // unique filename
  }
});

// ✅ Step 3: File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  }
};

// ✅ Step 4: Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // max 2MB
});

module.exports = upload;
