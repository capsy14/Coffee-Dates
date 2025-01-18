const Conversation = require("../model/conversationModel");
const Message = require("../model/messageModel");
const { getReceiverSocketId, io } = require("../socketIo/server");

exports.getMessage = async (req, res) => {
  console.log("function called");
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Find conversation between these two users
    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.sendMessage = async (req, res) => {
  console.log("function called");
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
