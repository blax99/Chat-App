import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const socketAuth = async (socket, next) => {
  try {
    // Get token sent by client
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(
        new Error("Authentication token is required")
      );
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find the real user
    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      return next(
        new Error("User not found")
      );
    }

    // Attach verified user to socket
    socket.user = user;

    next();
  } catch (error) {
    next(
      new Error("Authentication failed")
    );
  }
};

export default socketAuth;