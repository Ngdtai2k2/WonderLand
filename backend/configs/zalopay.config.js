const dotenv = require("dotenv");

dotenv.config();

const config = {
  app_id: process.env.ZALO_APP_ID,
  key1: process.env.ZALO_KEY_1,
  key2: process.env.ZALO_KEY_2,
  endpoint: process.env.ZALO_ENDPOINT,
  redirecturl: process.env.ZALO_REDIRECT_URL,
  callbackurl: process.env.ZALO_CALLBACK_URL,
};

module.exports = config;