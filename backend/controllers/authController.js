const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const ResetPassword = require("../models/ResetPassword");

const createMailOptions = require("../configs/mailOptions");

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

  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        email: req.body.email,
        password: hashed,
        fullname: req.body.fullname,
      });

      const user = await newUser.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      }).populate("media");

      if (!user) {
        return res.status(404).json({ message: "Email not found!" });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(404).json({ message: "Invalid password!" });
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
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        let responseData = {
          ...others,
          accessToken,
          device,
          message: "Login success!",
        };
        if (user.media) {
          responseData.media = user.media;
        }
        return res.status(200).json(responseData);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  requestRefreshToken: async (req, res) => {
    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      const dataToken = await RefreshToken.findOne({
        user: req.params.id,
        device: req.params.device,
      });
      refreshToken = dataToken?.token;
      if (!refreshToken) {
        return res.status(401).json({ message: "You're not authenticated!" });
      }
    }

    try {
      const refreshTokenDoc = await RefreshToken.findOne({
        token: refreshToken,
      });
      if (!refreshTokenDoc) {
        return res.status(403).json({ message: "Refresh token is not valid!" });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY,
        async (err, decodedToken) => {
          if (err) {
            return res.status(401).json({ message: "Invalid refresh token!" });
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
            secure: false,
            path: "/",
            sameSite: "strict",
          });

          return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  logoutUser: async (req, res) => {
    try {
      const { id, device } = req.body;
      await RefreshToken.deleteOne({ user: id, device: device });
      res.clearCookie("refreshToken");

      return res.status(200).json({ message: "Successfully logged out!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect old password!" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

      user.password = hashedPassword;
      const updatedUser = await user.save();

      return res
        .status(200)
        .json({ user: updatedUser, message: "Changed password!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  requestResetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Email not registered!" });
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
        message: "The confirmation code has been sent, please check the email",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  
  resetPassword: async (req, res) => {
    try {
      const { email, token, newPassword } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: "Email not registered!" });
      if (!token)
        return res.status(404).json({ message: "Please provide tokens!" });
      if (!newPassword)
        return res
          .status(404)
          .json({ message: "Please provide new password!" });

      const resetPassword = await ResetPassword.findOne({ user: user._id });

      if (
        !resetPassword ||
        resetPassword.token !== token ||
        Date.now() > parseInt(resetPassword.exp)
      )
        return res.status(400).json({ message: "Invalid or expired token!" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();
      await ResetPassword.deleteOne({ user: user._id });

      return res
        .status(200)
        .json({ message: "Reset password was successful!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;
