const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const i18next = require("i18next");
const i18nextBackend = require("i18next-fs-backend");
const i18nextMiddleware = require("i18next-http-middleware");

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const categoryRoute = require("./routes/category.route");
const postRoute = require("./routes/post.route");
const reactionRoute = require("./routes/reaction.route");
const savePostRoute = require("./routes/savePost.route");
const commentRoute = require("./routes/comment.route");
const reportRoute = require("./routes/report.route");
const notificationRoute = require("./routes/notification.route");
const ruleRoute = require("./routes/rule.route");
const searchRoute = require("./routes/search.route");
const friendsRoute = require("./routes/friends.route");
const socketRoute = require("./routes/socket.route");
const chatRoute = require("./routes/chat.route");
const messageRoute = require("./routes/message.route");
const badWordRoute = require("./routes/badword.route");

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

global._io = io;

mongoose
  .connect(process.env.MONGOOSE_DB)
  .then(() => {
    console.log(">>> Connected to MongoDB successfully!");
    require("./cronjob/birthdayCron");
  })
  .catch((error) => {
    console.error(">>> Error connecting to MongoDB:", error);
  });

// lang
i18next.use(i18nextBackend).use(i18nextMiddleware.LanguageDetector)
.init({
  fallbackLng: 'en',
  backend: {
    loadPath: "./locales/{{lng}}/translations.json"
  }
})
// cors
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.options = ('*', corsOptions);
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next));
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/reaction", reactionRoute);
app.use("/api/v1/save-post", savePostRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/report", reportRoute);
app.use("/api/v1/rule", ruleRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/friend", friendsRoute);
app.use("/api/v1/socket", socketRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/bad-word", badWordRoute);

io.on("connection", (socket) => {
  socketService.connection(socket);
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`>>> Server running on port ${PORT}`);
});
