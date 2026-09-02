import express from "express";

import {
  getChatHistory,
} from "../controllers/messageController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Get chat history with another user
router.get(
  "/:userId",
  authMiddleware,
  getChatHistory
);

export default router;