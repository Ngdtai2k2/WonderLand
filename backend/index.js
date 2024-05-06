const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const socketio = require("socket.io");

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const categoryRoute = require("./routes/category.route");
const postRoute = require("./routes/post.route");
const reactionRoute = require("./routes/reaction.route");
const savePostRoute = require("./routes/savePost.route");
const commentRoute = require("./routes/comment.route");
const notificationRoute = require("./routes/notification.route");
const socketService = require("./services/socket.service");

dotenv.config();

const app = express();
const server = require("http").Server(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

global._io  =  io; 

mongoose
  .connect(process.env.MONGOOSE_DB)
  .then(() => {
    console.log(">>> Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error(">>> Error connecting to MongoDB:", error);
  });

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/reaction", reactionRoute);
app.use("/api/v1/save-post", savePostRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/notification", notificationRoute);

io.on('connection', (socket) => {
  socketService.connection(socket);
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`>>> Server running on port ${PORT}`);
});

