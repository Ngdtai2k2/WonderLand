const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
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
      }).populate('media');;

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

        const newRefreshToken = new RefreshToken({
          token: refreshToken,
          user: user._id,
        });
        await newRefreshToken.save();

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        let responseData = { ...others, accessToken, message: "Login success!" };
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
      const dataToken = await RefreshToken.findOne({user: req.params.id});
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
      const { id } = req.body;
      await RefreshToken.deleteOne({ user: id });
      res.clearCookie("refreshToken");

      return res.status(200).json({ message: "Successfully logged out!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: "User not found!" });
      }
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

      return res.status(200).json({ user: updatedUser, message: "Changed password!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;
