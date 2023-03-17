const { body } = require("express-validator");

module.exports.registerValidation = [
  body("email", "Invalid email or password").isEmail(),
  body("password", "Invalid email or password").isLength({ min: 5 }),
  body("fullName", "Invalid name").isLength({ min: 3 }),
  body("avatarUrl", "Invalid avatar image url").optional().isURL(),
];
module.exports.loginValidation = [
  body("email", "Invalid email or password").isEmail(),
  body("password", "Invalid email or password").isLength({ min: 5 }),
];
module.exports.postCreateValidation = [
  body("title", "Please enter post title").isLength({ min: 3 }).isString(),
  body("text", "Please enter post text").isLength({ min: 10 }).isString(),
  body("tags", "Invalid tags format").optional().isArray(),
  body("imageUrl", "Invalid image url").optional().isString(),
];
