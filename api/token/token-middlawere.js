const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets/utilst");

const checkToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decodeToken) => {
        if (err) {
          res.status(401).json({ message: "token geçersizdir" });
        } else {
          req.decodeToken = decodeToken;
          next();
        }
      });
    } else {
      res.status(401).json({ message: "Token gereklidir" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkToken,
};
