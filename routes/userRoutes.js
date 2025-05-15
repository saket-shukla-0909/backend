const express = require('express');
const userControllers = require('../controllers/usersController'); 
const { authorizeAdminOrSubAdmin, authorizeDelete } = require('../middlewares/authenticateRole');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

// POST route for user registration
router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
router.post('/logout', authenticate, userControllers.logoutUser);
router.get('/getAllUser', authenticate, authorizeAdminOrSubAdmin, userControllers.getAllUser);
router.delete('/delete/:id', authenticate, authorizeDelete, userControllers.deleteUser);



module.exports = router;
