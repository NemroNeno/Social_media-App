const express = require('express');
const userRouter = express.Router()
const checkLogin = require('./authValidator.js')
const userController = require('../controller/userController.js')
const formidable=require("express-formidable");

  
userRouter
    .route('/u/@:username/profile')
    .get( userController.getProfile)
    .put( userController.updateProfile)

    // privacy checks for follow not complete yet
userRouter
    .route('/u/@:username/followers')
    .get(checkLogin, userController.getFollowers)


    userRouter
    .route('/profile/image')
    .post( formidable(),userController.updateProfileImage)    
    
userRouter
    .route('/u/@:username/following')
    .get(checkLogin, userController.getFollowing)

userRouter
    .route('/u/@:username/f/:action')  // action is follow or unfollow
    .post(checkLogin, userController.followOrUnfollowUser) // follow
    .delete(checkLogin, userController.followOrUnfollowUser) //unfollow

userRouter
    .route('/blocked')
    .get(checkLogin, userController.getBlockList)

userRouter
    .route('/blocked/:action')  // block or unblock
    .post(checkLogin, userController.blockOrUnblockUser)
    .delete(checkLogin, userController.blockOrUnblockUser)

userRouter
    .route('/notifications')
    .get(checkLogin, userController.getNotifications)
    .post()


module.exports = userRouter