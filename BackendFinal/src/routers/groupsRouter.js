const express = require("express");
const groupsRouter = express.Router();
const checkLogin = require("./authValidator.js");
const groupsController = require("../controller/groupsController.js");

groupsRouter.route("/create").post(groupsController.createGroup);

groupsRouter
  .route("/g/joined") // for logged in user
  .get(groupsController.getJoinedGroupsList);

groupsRouter
  .route("/g/:chatid")
  .get(groupsController.getGroupInfo)
  .put(groupsController.editGroup)
  .delete(groupsController.deleteGroup); // not completed

groupsRouter
  .route("/g/:chatid/members")
  .get(groupsController.getGroupMembers)
  .post(groupsController.addGroupMember)
  .delete(groupsController.removeGroupMember);

groupsRouter
  .route("/g/:chatid/admins")
  .get(groupsController.getGroupAdmins)
  .post(groupsController.checkGroupAdmin)
  .delete(groupsController.removeGroupAdmin);

groupsRouter
  .route("/g/:chatid/approvals") // for admin
  .get(groupsController.getApprovalsList)
  .post(groupsController.approveJoinRequest, groupsController.addGroupMember)
  .delete(checkLogin, groupsController.disapproveJoinRequest);

module.exports = groupsRouter;
