//dependencies
const express = require('express');
const routes = express.Router();
//auth Middleware
const authMiddleware = require('../middlewares/authMiddleware');
//model
const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');
const Notification = require('../models/NotificationModel')
//googleCloud
const urlFromGoogleCloud = require('../functions/urlFromGoogleCloud')
// mongoose
const mongoose = require('../../database');
const { notification } = require('../../storage/storage');

//config routes
routes.use(authMiddleware)

//routes

routes.post("/getChat", async(req, res) => {
    const {friend_id} = req.body;

    try {
        const chat = await Chat.findOne({user: req.userId, friend: friend_id, }, {
            messages: {
                $slice: -20
            }
        })
        .populate({
            path: "friend", 
            populate: {
                path: 'imagePerfil',
                select: 'path'
            },
            select: "name code status imagePerfil imagePerfilDefault",
        })
        .populate({
            path: "user", 
            populate: {
                path: 'imagePerfil',
                select: 'path'
            },
            select: "name code imagePerfil imagePerfilDefault",
        })                      

        if(!chat)
            return res.status(400).send("chat doesn't exist");

        chat.friend.imagePerfil === undefined ?
        chat.friend.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg') :
        chat.friend.imagePerfil.path = await urlFromGoogleCloud(chat.friend.imagePerfil.path)

        chat.user.imagePerfil === undefined ?
        chat.user.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg') :
        chat.user.imagePerfil.path = await urlFromGoogleCloud(chat.user.imagePerfil.path)

        return res.send(chat);
    } catch (error) {
        return res.status(400).send("error at getChat");
    }
})

routes.post("/createChat", async(req, res) => {
    const {friend_id} = req.body

    try {
        const exist = await Chat.findOne({
            user: req.userId,
            friend: friend_id
        });

        if(exist)
            return res.status(400).send("failed at createChat, chat already exist")

        const chat = await Chat.create({
            user: req.userId,
            friend: friend_id
        });

        chat
        .populate({
            path: "friend", 
            populate: {
                path: 'imagePerfil',
                select: 'path'
            },
            select: "name code status imagePerfil imagePerfilDefault"
        })
        .populate({
            path: "user", 
            populate: {
                path: 'imagePerfil',
                select: 'path'
            },  
            select: "name code imagePerfil imagePerfilDefault"
        })
        .execPopulate();

        chat.friend.imagerPerfil === undefined ?
        chat.friend.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg') :
        chat.friend.imagePerfil.path = await urlFromGoogleCloud(chat.friend.imagePerfil.path)

        chat.user.imagePerfil === undefined ?
        chat.user.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg') :
        chat.user.imagePerfil.path = await urlFromGoogleCloud(chat.user.imagePerfil.path)

        chat.save()

        await User.findByIdAndUpdate(req.userId, {
            $push: {
                chats: chat._id
            }
        });
        
        const exist2 = await Chat.findOne({
            user: friend_id,
            friend: req.userId
        })

        if(exist2)
            return res.status(400).send({error: 'failed at createChat'})

        const friendChat = await Chat.create({
            user: friend_id,
            friend: req.userId
        });

        friendChat.friend.imagerPerfil === undefined ?
        friendChat.friend.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg') :
        friendChat.friend.imagePerfil.path = await urlFromGoogleCloud(friendChat.friend.imagePerfil.path)

        friendChat.user.imagePerfil === undefined ?
        friendChat.user.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg') :
        chfriendChatat.user.imagePerfil.path = await urlFromGoogleCloud(friendChat.user.imagePerfil.path)

        friendChat.save()

        await User.findByIdAndUpdate(friend_id, {
            $push: {
                chats: friendChat._id
            }
        })
        
        return res.send()
    } catch (error) {
        return res.status(400).send("failed at createChat")
    }
})

routes.post("/sendMessage", async (req, res) => {
    // const date = new Date();
    // //user
    // const lastMessage = await Chat.findById(chat_id, {messages: { $slice: -1}});
    // //friend
    // const lastMessageFriend =await Chat.findOne({user, friend}, {messages: { $slice: -1}})
    // //messageCreatedAt
    // const message = lastMessage.messages[0].createdAt
    // //time
    // const timeNow = `${date.getHours()}:${date.getMinutes()}`
    // const messageTime = `${message.getHours()}:${message.getMinutes()}`
    // //date
    // const dateNow = `${date.getDate()}/${date.getMonth()}/${date.getMinutes()}`
    // const messageDate = `${date.getDate()}/${date.getMonth()}/${date.getMinutes()}`
    try {   
        const {chat_id, text, user, friend} = req.body


        // if(timeNow === messageTime && dateNow === messageDate){
        // }

        const userChat = await Chat.findByIdAndUpdate(chat_id, {
            $push: {
                messages: {
                    user: req.userId,
                    text
                }
            }
        }, {new: true});

        const friendChat = await Chat.findOneAndUpdate({user, friend}, {
            $push: {
                messages: {
                    user: req.userId,
                    text
                }
            }
        })

        const alreadyNotification = await Notification.findOneAndUpdate({
            user: user, 
            from: req.userId
        }, {$inc: {messageNumber: 1}}, {new: true})


        if(!alreadyNotification){
            const noti = await Notification.create({
                user, 
                from: req.userId, 
                chat: friendChat._id
            })

            await User.findByIdAndUpdate(user, {
                $push: {
                    notifications: noti._id
                }
            })
        }

        res.send(userChat.messages.slice(-1)[0]);
    } catch (error) {
        console.log(error);
        res.status(400).send("failed at sendMessage");
    }
})

routes.post('/getLastMessage', authMiddleware, async(req, res) => {
    try {
        const {chat_id} = req.body

        const chat = await Chat.findById(chat_id, {
            messages: {
                $slice: -1
            }
        })

        if(!chat)
            return res.status(400).send({error: 'chat doesnt exist, failed at getLastMessage'})
        
        return res.status(200).send(chat.messages[0])
    } catch (error) {
        return res.status(400).send({error: 'failed at getLastMessage'})
    }
})

module.exports = app => app.use("/chat", routes);