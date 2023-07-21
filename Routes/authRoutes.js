const express = require("express");
const { logIn } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/login", logIn);

module.exports = authRouter;
