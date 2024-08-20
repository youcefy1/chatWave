const User = require("../model/User");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

const getLoggedInUserRooms = async (req, res) => {
  const loggedInUsername = req.user;
  try {
    const user = await User.findOne({ username: loggedInUsername }).populate({
      path: "rooms",
      populate: {
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roomsWithLastMessage = user.rooms.map((room) => ({
      room: room.room,
      lastMessage:
        room.messages.length > 0
          ? room.messages[room.messages.length - 1]
          : null,
    }));

    res.json(roomsWithLastMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUser = async (req, res) => {
  const user = req.user;
  res.json(user);
};

const modifyUsername = async (req, res) => {
  const { newUsername } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Username updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const modifyPassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteChat = async (req, res) => {
  const { roomId } = req.params;
  try {
    const loggedInUsername = req.user;
    const user = await User.findOne({ username: loggedInUsername });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.rooms.findIndex((room) => room.room === roomId);
    if (index !== -1) {
      user.rooms.splice(index, 1);
      await user.save();
      res.status(200).json({ message: "Chat deleted successfully" });
    } else {
      res.status(404).json({ message: "Chat not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getLoggedInUserRooms,
  getUser,
  modifyPassword,
  modifyUsername,
  deleteChat,
  blockUser,
  getUserById
};
