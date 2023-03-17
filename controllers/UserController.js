const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserModel = require("../models/User.js");

module.exports.register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretik123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      success: true,
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to register",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid login or password",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Invalid login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretik123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      success: true,
      ...userData,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to login",
    });
  }
};

module.exports.getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) res.status(404).json({ message: "User wasn't found" });
    const { passwordHash, ...userData } = user._doc;

    res.json({
      success: true,
      ...userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "No access",
    });
  }
};
