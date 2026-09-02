import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";


// ==========================================
// GET CHAT HISTORY
// GET /api/messages/:userId
// ==========================================

export const getChatHistory = async (req, res) => {
  try {
    // Authenticated user
    const currentUserId = req.user.userId.toString();
    console.log(currentUserId);
    

    // User we are chatting with
    const otherUserId = req.params.userId;

    // Prevent requesting a conversation with yourself
    if (currentUserId === otherUserId) {
      return res.status(400).json({
        message: "You cannot retrieve a chat with yourself",
      });
    }

    // Find conversation containing both users
    const conversation = await Conversation.findOne({
      participants: {
        $all: [currentUserId, otherUserId],
      },
    });

    // No conversation means no messages yet
    if (!conversation) {
      return res.status(200).json({
        conversation: null,
        messages: [],
      });
    }

    // Find all messages in this conversation
    const messages = await Message.find({
      conversation: conversation._id,
    })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      conversation: {
        _id: conversation._id,
        participants: conversation.participants,
      },
      messages,
    });

  } catch (error) {
    console.error("Get chat history error:", error);

    return res.status(500).json({
      message: "Failed to retrieve chat history",
    });
  }
};