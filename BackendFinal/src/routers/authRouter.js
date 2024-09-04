const express = require("express");
const authRouter = express.Router();
const checkLogin = require("./authValidator.js");
const authController = require("../controller/authController.js");

authRouter.route("/logout").get(authController.logOutUser);

authRouter.route("/signup").post(authController.postSignUp); // requires username, password, email, display_name, dob

authRouter
  .route("/login")
  .get(authController.getLogin) // send get request to check if already login
  .post(authController.postLogin); // requries username or email as username, password

authRouter.route("/reset").post(authController.sendEmail);

authRouter.route("/checkUserName").post(authController.checkUserName);

authRouter.route("/searchUser").post( authController.searchUser);
authRouter.route("/updatePassword").post( authController.updatePassword);
module.exports = authRouter;
