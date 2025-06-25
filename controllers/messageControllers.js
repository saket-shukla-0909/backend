const { Message } = require("../models/messageModel");
const { Conversation } = require("../models/conversationModel");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    // Determine initial status
    const isReceiverOnline = global.onlineUsers?.has(recieverId.toString()); // 👈 Use global user map from socket.io
    const status = isReceiverOnline ? "delivered" : "sent";

    // Create message
    const newMessage = new Message({
      senderId,
      recieverId,
      message,
      status,
    });

    // Push message into conversation
    conversation.message.push(newMessage._id);

    // Save both
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id: chatuser } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatuser] }
    }).populate({
      path: "message",
      options: { sort: { createdAt: 1 } }, // sort by time ascending
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(conversation.message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  sendMessage,  getMessage
};