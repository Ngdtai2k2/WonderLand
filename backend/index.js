const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const i18next = require("i18next");
const i18nextBackend = require("i18next-fs-backend");
const i18nextMiddleware = require("i18next-http-middleware");

const routes = require("./routes");

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

// Use routes
app.use("/api/v1", routes);

io.on("connection", (socket) => {
  socketService.connection(socket);
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`>>> Server running on port ${PORT}`);
});
