import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/Users.js";
const onlineUsers = new Map();

const setupSocket = (io) => {
  io.on("connection", async (socket) => {
    // User verified by socketAuth.js
    const user = socket.user;

    console.log(
      `User connected: ${user.name} (${user._id})`
    );

    // Join authenticated user's personal room
    const userId = user._id.toString();

    socket.join(userId);

    // Track socket connection
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    // Mark user online only on first connection
    if (onlineUsers.get(userId).size === 1) {
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: null,
      });

      socket.broadcast.emit("user:status", {
        userId,
        isOnline: true,
      });
    }

    // ==========================================
    // MESSAGE: SEND
    // ==========================================

    socket.on("message:send", async (messageData) => {
      try {
        const { receiverId, content } = messageData;

        // Validate message
        if (!receiverId || !content?.trim()) {
          return socket.emit("message:error", {
            message:
              "Receiver ID and message content are required",
          });
        }

        // Get sender from verified JWT
        const senderId = user._id.toString();

        // Prevent sending messages to yourself
        if (senderId === receiverId) {
          return socket.emit("message:error", {
            message:
              "You cannot send a message to yourself",
          });
        }

        // ==========================================
        // FIND EXISTING CONVERSATION
        // ==========================================

        let conversation = await Conversation.findOne({
          participants: {
            $all: [senderId, receiverId],
          },
        });

        // ==========================================
        // CREATE CONVERSATION IF NOT FOUND
        // ==========================================

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [senderId, receiverId],
          });

          console.log(
            "New conversation created:",
            conversation._id
          );
        }

        // ==========================================
        // CREATE AND SAVE MESSAGE
        // ==========================================

        const newMessage = await Message.create({
          conversation: conversation._id,
          sender: senderId,
          receiver: receiverId,
          content: content.trim(),
        });

        console.log(
          "Message saved:",
          newMessage._id
        );

        // ==========================================
        // UPDATE LAST MESSAGE
        // ==========================================

        conversation.lastMessage = newMessage._id;

        await conversation.save();

        // ==========================================
        // PREPARE MESSAGE FOR CLIENT
        // ==========================================
        const messageDataToSend = {
          _id: newMessage._id.toString(),

          conversation: conversation._id.toString(),

          sender: senderId,

          receiver: receiverId,

          content: newMessage.content,

          status: newMessage.status,

          createdAt: newMessage.createdAt,
        };

        // ==========================================
        // SEND MESSAGE TO RECEIVER
        // ==========================================

        io.to(receiverId).emit(
          "message:new",
          messageDataToSend
        );

        // ==========================================
        // SEND MESSAGE TO SENDER
        // ==========================================

        socket.emit(
          "message:new",
          messageDataToSend
        );

      } catch (error) {
        console.error(
          "Message sending error:",
          error
        );

        socket.emit("message:error", {
          message: "Failed to send message",
        });
      }
    });

    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on("disconnect", async () => {
      try {
        const userId = socket.user._id.toString();

        const userSockets = onlineUsers.get(userId);

        if (userSockets) {
          userSockets.delete(socket.id);

          // User is offline only when all connections are gone
          if (userSockets.size === 0) {
            onlineUsers.delete(userId);

            await User.findByIdAndUpdate(userId, {
              isOnline: false,
              lastSeen: new Date(),
            });

            socket.broadcast.emit("user:status", {
              userId,
              isOnline: false,
            });

            console.log(`User offline: ${userId}`);
          }
        }
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    });
  });
};

export default setupSocket;