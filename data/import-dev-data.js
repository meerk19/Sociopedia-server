const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { users, posts } = require("./index");
const Users = require("../Models/UserModel");
const Posts = require("../Models/postModel");

dotenv.config({ path: "../config.env" });

const DB = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("Connection Done i");
  });

const createData = async () => {
  try {
    await Users.create(users, { validateBeforeSave: false });
    await Posts.create(posts);
    console.log("create done");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Users.deleteMany();
    await Posts.deleteMany();

    console.log("delete done");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  createData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
