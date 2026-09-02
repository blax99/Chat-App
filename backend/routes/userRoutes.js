import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// Get all users
router.get("/", authMiddleware, getUsers);


// Get one user
router.get("/:id", authMiddleware, getUserById);


// UPDATE user
router.put(
  "/:id",
  authMiddleware,
  updateUser
);


// Delete user — ADMIN ONLY
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  deleteUser
);

export default router;