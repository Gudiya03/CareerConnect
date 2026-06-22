const Message = require("../models/Message");
const User = require("../models/User");

// Get message history between current user and another user
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving messages" });
  }
};

// Send message to another user
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, interviewDetails } = req.body;
    const senderId = req.user._id;

    if (!receiverId || (!content && !interviewDetails)) {
      return res.status(400).json({ message: "Recipient and message content are required" });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content || "Scheduled an interview.",
      interviewDetails,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Error sending message" });
  }
};

// Get list of conversations for current user
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name email role companyName")
      .populate("receiver", "name email role companyName");

    // Group by unique contact
    const conversationMap = new Map();

    messages.forEach((msg) => {
      const otherUser = msg.sender._id.toString() === currentUserId.toString() ? msg.receiver : msg.sender;
      const otherUserId = otherUser._id.toString();

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: {
            _id: otherUser._id,
            name: otherUser.name,
            email: otherUser.email,
            role: otherUser.role,
            companyName: otherUser.companyName,
          },
          lastMessage: msg.content,
          updatedAt: msg.createdAt,
          isRead: msg.sender._id.toString() === currentUserId.toString() ? true : msg.isRead,
          senderId: msg.sender._id,
        });
      }
    });

    res.json(Array.from(conversationMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching conversations" });
  }
};
