const express = require("express");
const postsRouter = express.Router();
const checkLogin = require("./authValidator.js");
const postsController = require("../controller/postsController.js");
const { checkBlock, checkFollow } = require("../controller/methods.js");

// id is post_id

postsRouter.route("/p/:page").post(postsController.getAllPosts); // page 1,2,3 ...; gives 20 posts per page

postsRouter.route("/c/getComments").post(postsController.getComments);

postsRouter
  .route("/u/:username/p/:page")
  .get(postsController.getPostsByUsername);

postsRouter.route("/create").post(postsController.createPost);

postsRouter
  .route("/p/:id/edit")
  .put(postsController.editPost)
  .delete(postsController.deletePost);

postsRouter
  .route("/p/:id/like")
  .post(postsController.likePost)
  .delete(postsController.unlikePost);

postsRouter.route("/p/:id/open").get(postsController.openPost);

module.exports = postsRouter;
