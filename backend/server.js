require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const User = require("./model/User");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;
const server = http.createServer(app);
const usernameToSocketIdMap = {};
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));
app.use("/users", require("./routes/api/users"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", async (data) => {
    const { receiverUsername, author, message, time } = data;

    try {
      const sender = await User.findOne({ username: author });
      const receiver = await User.findOne({ username: receiverUsername });

      if (!sender || !receiver) {
        console.error(`Sender or receiver not found.`);
        return;
      }

      let chatRoomSender = sender.rooms.find(
        (room) => room.room === receiver.username
      );
      if (!chatRoomSender) {
        chatRoomSender = { room: receiver.username, messages: [] };
        sender.rooms.push(chatRoomSender);
        await sender.save();
      }

      let chatRoomReceiver = receiver.rooms.find(
        (room) => room.room === author
      );
      if (!chatRoomReceiver) {
        chatRoomReceiver = { room: author, messages: [] };
        receiver.rooms.push(chatRoomReceiver);
        await receiver.save();
      }

      const chatMessage = { author, message, time };
      chatRoomSender.messages.push(chatMessage);
      chatRoomReceiver.messages.push(chatMessage);

      await sender.save();
      await receiver.save();

      const receiverSocketId = usernameToSocketIdMap[receiver.username];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", data);
      } else {
        console.log(`User with username ${receiver.username} not found.`);
      }
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  });

  socket.on("join_chat", async (data) => {
    const { username, receiverUsername, author } = data;
    const sender = await User.findOne({ username: username });
    const receiver = await User.findOne({ username: receiverUsername });
  
    console.log("Join chat data:", data);
  
    usernameToSocketIdMap[username] = socket.id;
  
    console.log(`User with username ${username} joined the chat.`);
  
    let chatRoomSender = sender.rooms.find(
      (room) => room.room === receiverUsername
    );
  
    if (!chatRoomSender) {
      chatRoomSender = { room: receiverUsername, messages: [] };
      sender.rooms.push(chatRoomSender);
      await sender.save();
    }
  
    let chatRoomReceiver = receiver.rooms.find(
      (room) => room.room === username
    );

    if (!chatRoomReceiver) {
      chatRoomReceiver = { room: username, messages: [] };
      receiver.rooms.push(chatRoomReceiver);
      await receiver.save();
    }

    socket.emit("chat_history", {
      room: receiverUsername,
      history: chatRoomSender.messages,
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
