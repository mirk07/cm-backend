const jwt = require("jsonwebtoken");

module.exports.checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      const decoded = jwt.verify(token, "secretik123");
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({ message: "No access" });
    }
  } else {
    return res.status(403).json({ message: "No access" });
  }
};
