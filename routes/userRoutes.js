const express = require('express');
const userControllers = require('../controllers/usersController'); 
const { authorizeAdminOrSubAdmin, authorizeDelete } = require('../middlewares/authenticateRole');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');
const router = express.Router();


router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
router.post('/logout', authenticate, userControllers.logoutUser);
router.get('/getAllUser', authenticate, authorizeAdminOrSubAdmin, userControllers.getAllUser);
router.get('/getAllUsers', authenticate, userControllers.getAllUsers);
router.delete('/delete/:id', authenticate, authorizeDelete, userControllers.deleteUser);
router.post('/upload-profile', authenticate, upload.single('profile_picture'), userControllers.uploadProfilePicture);
router.get("/search", authenticate, userControllers.searchUsersByNameOrPhone);


module.exports = router;