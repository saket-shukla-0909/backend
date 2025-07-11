const express = require("express");
const messagesController = require("../controllers/messageControllers");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.post('/send/:id', authenticate, messagesController.sendMessage);
router.get('/getMessage/:id', authenticate,  messagesController.getMessage);
router.get('/getAllMessages', authenticate, messagesController.getAllMessages);


module.exports = router;