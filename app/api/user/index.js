/**
 * @author EmmanuelOlaojo
 * @since 10/21/17
 */

let moduleId = 'user/index';

let express = require("express");
let multer = require("multer");
let user = require("./user");
let auth = require("../../../utils/authToken");
let response = require("../../../utils/response");
let http = require("../../../utils/HttpStats");
let userRouter = express.Router();
let upload = multer({dest: "uploads/"});
let uploadImg = upload.single("profileImg");
let authRouter = require("./auth");

userRouter.use("/auth", authRouter);

userRouter.post("/auth/login", user.login, function(req, res){
  res.redirect("/");
});

userRouter.get("/auth/logout", user.logout, function(req, res){
  res.redirect("/");
});

userRouter.route("/")
  .post(user.createUser)
  .put(auth.checkToken, user.editUser)
  .get(auth.checkToken, user.getUser);
userRouter.post("/img", uploadImg, auth.checkToken, user.setProfileImg);

module.exports = userRouter;