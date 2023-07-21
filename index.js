const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const path = require("path");
const userRouter = require("./Routes/UserRoutes");
const postRouter = require("./Routes/postRoutes");
const authRouter = require("./Routes/authRoutes");
const { signUp, protect } = require("./controllers/authController");
const { createPost } = require("./controllers/postController");
const globalErrorHandler = require("./controllers/errorController");
//Configuration

dotenv.config({ path: "./config.env" });
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(
  "/api/v1/assets",
  express.static(path.join(__dirname, "public/assets"))
);

//File Storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/v1/signup", upload.single("picture"), signUp);

app.post("/api/v1/posts", protect, upload.single("picture"), createPost);

//Mongoose setup
const port = process.env.PORT || 3000;
const db = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);

app.use("/api/v1", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/posts", postRouter);

app.use(globalErrorHandler);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("Connection Done");
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});
