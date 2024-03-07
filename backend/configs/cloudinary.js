const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "doc4ofoku",
  api_key: "369673421882626",
  api_secret: "EDRNkv8MJlYI8dV2GciVF9qmSnM",
});

module.exports = cloudinary;
