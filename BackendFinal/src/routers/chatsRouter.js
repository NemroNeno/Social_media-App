const express = require('express');
const chatsRouter = express.Router()
const checkLogin = require('./authValidator.js')
const chatsController = require('../controller/chatsController.js')

// NO API HAS BEEN TESTED YET, NOTHING WORKS 

chatsRouter
    .route('/dm_with/u/:username')
    .post(chatsController.createDM)
    .delete();


chatsRouter
    .route('/getUserChats')
    .post(chatsController.getRecentChats)


chatsRouter // id is chat_id4
    .route('/messages/:id')
    .get(chatsController.getMessages)
    .post( chatsController.sendMessage)
    .delete( chatsController.unsendMessage)

module.exports = chatsRouter