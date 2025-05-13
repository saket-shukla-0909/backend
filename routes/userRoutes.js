const express = require('express');
const userControllers = require('../controllers/usersController'); // Import controller
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

// POST route for user registration
router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
router.post('/logout', authMiddleware, userControllers.logoutUser);


module.exports = router;
