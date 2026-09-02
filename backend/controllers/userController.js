import User from "../models/Users.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};



// Get user by ID
export const getUserById = async (req, res) => {
  try {
    // Normal users can only access themselves
    if (
      req.user.role !== "admin" &&
      req.user.userId.toString() !== req.params.id
    ) {
      return res.status(403).json({
        message: "You cannot access another user's profile",
      });
    }

    const user = await User.findById(req.params.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};


// Update user
export const updateUser = async (req, res) => {
  try {
    // Normal users can only update themselves
    if (
      req.user.role !== "admin" &&
      req.user.userId.toString() !== req.params.id
    ) {
      return res.status(403).json({
        message: "You cannot update another user",
      });
    }

    const { name } = req.body;
  
    

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update allowed fields
    if (name) {
      user.name = name;
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update user",
    });
  }
};


// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};