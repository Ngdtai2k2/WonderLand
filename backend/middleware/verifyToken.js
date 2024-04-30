const jwt = require("jsonwebtoken");

const verifyMiddleware = {
  token: (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        error: "No token provided!",
      });
    }
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        return res.status(401).json({
          error: "Invalid token!!!",
        });
      }
      req.user = user;
      next();
    });
  },

  // Please provide your user ID when using api calls by passing via params or queries
  verifyTokenAndUserAuthorization: (req, res, next) => {
    verifyMiddleware.token(req, res, () => {
      if (
        req.user._id == req.params.id ||
        req.user.isAdmin ||
        req.user._id == req.query.request_user
      ) {
        next();
      } else {
        return res.status(403).json({ message: "You're not allowed!" });
      }
    });
  },

  tokenAndAdminAuth: (req, res, next) => {
    verifyMiddleware.token(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ message: "You're not allowed!" });
      }
    });
  },
};

module.exports = verifyMiddleware;
