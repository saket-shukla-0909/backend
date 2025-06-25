const express = require('express');
const userControllers = require('../controllers/usersController'); 
const { authorizeAdminOrSubAdmin, authorizeDelete } = require('../middlewares/authenticateRole');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');
const router = express.Router();


// POST route for user registration
router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
router.post('/logout', authenticate, userControllers.logoutUser);
router.get('/getAllUser', authenticate, authorizeAdminOrSubAdmin, userControllers.getAllUser);
router.get('/getAllUsers', authenticate, userControllers.getAllUsers);
router.delete('/delete/:id', authenticate, authorizeDelete, userControllers.deleteUser);
router.post('/upload-profile/:id', upload.single('profile_picture'), authenticate, userControllers.uploadProfilePicture);
router.get("/search", authenticate, userControllers.searchUsersByNameOrPhone);



module.exports = router;





