const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const RefreshToken = require("../models/refreshToken.model");
const User = require("../models/user.model");
const ResetPassword = require("../models/resetPassword.model");
const friendsModel = require("../models/friends.model");
const userSocketModel = require("../models/userSocket.model");

const createMailOptions = require("../configs/mail.config");

dotenv.config();

const authController = {
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        _id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "30s",
      }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        _id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: "365d",
      }
    );
  },

  checkUniqueNickname: async (req, res) => {
    try {
      const { nickname } = req.body;
      const uniqueNickname = await User.findOne({ nickname: nickname });

      if (uniqueNickname) {
        return res.json({ unique: false });
      } else {
        return res.json({ unique: true });
      }
    } catch (err) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { fullname, email, nickname, password } = req.body;

      const uniqueEmail = await User.findOne({ email: email });

      if (uniqueEmail) {
        return res.status(400).json({ message: req.t('exists.email') });
      }

      const uniqueNickname = await User.findOne({ nickname: nickname });
      if (uniqueNickname) {
        return res.status(400).json({ message: req.t('exists.nickname') });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const newUser = new User({
        email: email,
        password: hashed,
        fullname: fullname,
        nickname: nickname,
      });

      const user = await newUser.save();
      res
        .status(201)
        .json({ message: req.t("auth.registered_success"), user: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      }).populate("media").populate('coverArt');

      if (!user) {
        return res.status(404).json({ message: req.t("not_found.email") });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res
          .status(404)
          .json({ message: req.t("auth.invalid_password") });
      }

      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        const device = uuid.v4();

        const newRefreshToken = new RefreshToken({
          token: refreshToken,
          user: user._id,
          device: device,
        });
        await newRefreshToken.save();

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        let responseData = {
          ...others,
          accessToken,
          device,
          message: req.t("auth.login_success"),
        };
        if (user.media) {
          responseData.media = user.media;
        }

        // push socket to friends list
        const friends = await friendsModel.find({
          $or: [{ user: user._id }, { friend: user._id }],
        });

        let userSockets = [];

        await Promise.all(
          friends.map(async (friend) => {
            const id = user._id.equals(friend.friend)
              ? friend.user
              : friend.friend;
            const sockets = await userSocketModel.find({ user: id });
            userSockets.push(...sockets);
          })
        );

        if (userSockets.length > 0) {
          userSockets.forEach(async (socket) => {
            global._io
              .to(socket.socketId)
              .emit("msg-socket-connected", `${user._id} online`, user._id);
          });
        }

        return res.status(200).json(responseData);
      }
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  requestRefreshToken: async (req, res) => {
    try {
      let refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        const dataToken = await RefreshToken.findOne({
          user: req.params.id,
          device: req.params.device,
        });
        refreshToken = dataToken?.token;
        if (!refreshToken) {
          return res
            .status(401)
            .json({ message: req.t("auth.not_authenticated") });
        }
      }

      const refreshTokenDoc = await RefreshToken.findOne({
        token: refreshToken,
      });
      if (!refreshTokenDoc) {
        return res
          .status(403)
          .json({ message: req.t("auth.refresh_token_not_valid") });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY,
        async (err, decodedToken) => {
          if (err) {
            return res
              .status(401)
              .json({ message: req.t("auth.refresh_token_not_valid") });
          }

          const newAccessToken =
            authController.generateAccessToken(decodedToken);
          const newRefreshToken =
            authController.generateRefreshToken(decodedToken);

          await RefreshToken.updateOne(
            { user: decodedToken._id },
            { token: newRefreshToken }
          );

          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict",
          });

          return res.status(200).json({
            accessToken: newAccessToken,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  logoutUser: async (req, res) => {
    try {
      const { id, device } = req.body;

      await RefreshToken.deleteOne({ user: id, device: device });
      res.clearCookie("refreshToken");

      return res.status(200).json({ message: req.t("auth.logout_success") });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  changePassword: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: req.t("auth.invalid_old_password") });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

      user.password = hashedPassword;
      const updatedUser = await user.save();

      return res
        .status(200)
        .json({ user: updatedUser, message: req.t("auth.change_password") });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  requestResetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ message: req.t("auth.email_not_registered") });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const token = crypto.randomBytes(3).toString("hex");
      const tokenExpiry = Date.now() + 5 * 60 * 1000;

      let resetPassword = await ResetPassword.findOne({ user: user._id });

      if (resetPassword) {
        resetPassword.token = token;
        resetPassword.exp = tokenExpiry.toString();
      } else {
        resetPassword = new ResetPassword({
          user: user._id,
          token: token,
          exp: tokenExpiry.toString(),
        });
      }
      await resetPassword.save();

      const mailOptions = createMailOptions(email, token);
      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: req.t("message.check_mail"),
      });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, token, newPassword } = req.body;
      const user = await User.findOne({ email });

      if (!user)
        return res
          .status(404)
          .json({ message: req.t("auth.email_not_registered") });
      if (!token)
        return res.status(404).json({ message: req.t("auth.provide_token") });
      if (!newPassword)
        return res
          .status(404)
          .json({ message: req.t("auth.provide_new_password") });

      const resetPassword = await ResetPassword.findOne({ user: user._id });

      if (
        !resetPassword ||
        resetPassword.token !== token ||
        Date.now() > parseInt(resetPassword.exp)
      )
        return res.status(400).json({ message: req.t("auth.fail_token") });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();
      await ResetPassword.deleteOne({ user: user._id });

      return res
        .status(200)
        .json({ message: req.t("auth.reset_password_success") });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = authController;
