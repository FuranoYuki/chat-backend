//dependencies
const express = require('express');
const routes = express.Router();

//auth Middleware
const authMiddleware = require('../middlewares/authMiddleware');

//model
const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');

//config routes
routes.use(authMiddleware)

//routes

routes.post("/getChat", async(req, res) => {
    const {friend_id} = req.body;

    try {
        const chat = await Chat.findOne({
            user: req.userId, 
            friend: friend_id, 
        }, {
            messages: {
                $slice: -20
            }
        })
        .populate({
            path: "friend", 
            select: "name code status imagePerfilDefault",
        })
        .populate({
            path: "user", 
            select: "name code imagePerfilDefault",
        })                      

        if(!chat)
            return res.status(400).send("chat doesn't exist");

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
        .populate({path: "friend", select: "name code status imagePerfilDefault"})
        .populate({path: "user", select: "name"})
        .execPopulate();

        await User.findByIdAndUpdate(req.userId, {
            $push: {
                chats: chat._id
            }
        });

        
        const exist2 = await Chat.findOne({
            user: friend_id,
            friend: req.userId
        })

        if(!exist2){
            const friendChat = await Chat.create({
                user: friend_id,
                friend: req.userId
            });

            await User.findByIdAndUpdate(friend_id, {
                $push: {
                    chats: friendChat._id
                }
            })
        }
        
        return res.send(chat)
    } catch (error) {
        return res.status(400).send("failed at createChat")
    }
})

routes.post("/sendMessage", async (req, res) => {
    const {chat_id, text, user, friend} = req.body
/*     const date = new Date();
    //user
    const lastMessage = await Chat.findById(chat_id, {messages: { $slice: -1}});
    //friend
    const lastMessageFriend =await Chat.findOne({user, friend}, {messages: { $slice: -1}})
    //messageCreatedAt
    const message = lastMessage.messages[0].createdAt
    //time
    const timeNow = `${date.getHours()}:${date.getMinutes()}`
    const messageTime = `${message.getHours()}:${message.getMinutes()}`
    //date
    const dateNow = `${date.getDate()}/${date.getMonth()}/${date.getMinutes()}`
    const messageDate = `${date.getDate()}/${date.getMonth()}/${date.getMinutes()}` */
    try {   

        await Chat.findByIdAndUpdate(chat_id, {
            $push: {
                messages: {
                    user: req.userId,
                    text
                }
            }
        });

        await Chat.findOneAndUpdate({user, friend}, {
            $push: {
                messages: {
                    user: req.userId,
                    text
                }
            }
        })

        res.send();

    } catch (error) {
        res.status(400).send("failed at sendMessage");
    }
})

module.exports = app => app.use("/chat", routes);