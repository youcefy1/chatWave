const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
  author: String,
  message: String,
  time: String,
});

const chatRoomSchema = new Schema({
  room: String,
  messages: [chatMessageSchema],
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  rooms: [chatRoomSchema],
  refreshToken: String,
  blockedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});


module.exports = mongoose.model("User", userSchema);
