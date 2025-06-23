const { Message } = require("../models/messageModel");
const { Conversation } = require("../models/conversationModel");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;
    console.log(senderId, recieverId, message, "this is sender id, reciever id and message");

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      message,
    });

    if (newMessage) {
      conversation.message.push(newMessage._id); // ✅ keep 'message' field as in your schema
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMessage = async(req, res)=>{
    try{
        const {id: chatuser} = req.params;
        const senderId = req.user._id;
        console.log(senderId, chatuser, "this is sender id and chat user id");
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, chatuser] }
        }).populate("message");
        if(!conversation){
            return res.status(404).json({ message: "Conversation not found" });
        }
        const messages = conversation.message;
        res.status(200).json(messages);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { sendMessage, getMessage};
