import User from "../models/Users.js";
import Conversation from "../models/Conversation.js";

export const getStats = async (req, res) => {
try {
const totalUsers = await User.countDocuments();

const totalChats =
  await Conversation.countDocuments();

res.status(200).json({
  totalUsers,
  totalChats,
});

} catch (error) {
console.error("Failed to get statistics:", error);


res.status(500).json({
  message: "Failed to get statistics",
});


}
};
