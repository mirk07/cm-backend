const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const {
  registerValidation,
  loginValidation,
  postCreateValidation,
} = require("./validations/validations.js");

const { checkAuth } = require("./utils/checkAuth.js");
const { login, register, getMe } = require("./controllers/UserController.js");
const {
  create,
  getAll,
  getOne,
  remove,
  patch,
  getLastTags,
} = require("./controllers/PostController");
const handleValidationErrors = require("./utils/handleValidationErrors.js");

mongoose
  .connect(
    "mongodb+srv://user:user123@cluster0.n77ffro.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(console.log("Connected to DB"))
  .catch((e) => console.log(e));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
     if (!fs.existsSync("uploads")) {
      fs.mkdir("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  register
);
app.get("/auth/me", checkAuth, getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/tags", getLastTags);
app.get("/posts", getAll);
app.get("/posts/tags", getLastTags);
app.get("/posts/:id", getOne);
app.delete("/posts/:id", checkAuth, remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  patch
);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  create
);

const server = app.listen(process.env.PORT || 4444, () => {
  console.log("Server started", process.env.PORT);
});
