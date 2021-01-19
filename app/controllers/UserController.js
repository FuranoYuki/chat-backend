//dependencies
const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const multer = require('multer');


//models
const User = require('../models/UserModel');
const ImagePerfil = require('../models/ImagePerfilModel');

//socket
const io = require('../../index');

//authMiddleware
const authMiddleware = require('../middlewares/authMiddleware');
const multerMiddleware = require('../middlewares/multerMiddleware');
const { populate } = require('../models/UserModel');

const createToken = (data = {}) => {
    const token = jwt.sign({id: data.id}, process.env.SECRET_API, {
        expiresIn: 86400
    });

    return token
}

//routes

routes.post("/login", async(req, res) => {
    try {
        
        const {email, password} = req.body
        
        const exist = await User.findOne({email}).select('+password');

        if(!exist){
            return res.status(400).send("this e-mail isn't register in our database");
        }

        if(!bcrypt.compare(password, exist.password)){
            return res.status(400).send('this password is wrong');
        }
        
        const token = createToken(exist);

        res.send({message: "credentials are right", token});

    } catch (error) {
        res.status(400).send("error at login");
    }
});


routes.post("/register", async (req, res) => {
    try {
        const {email} = req.body

        const exist = await User.findOne({email});

        if(exist){
            return res.status(400).send("This e-mail is already register");
        }

        const user = await User.create(req.body);

        user.password = undefined;

        const token = createToken(user);

        return res.send({message: "creadetials are right", token});

    } catch (error) {
        return res.status(400).send({error})
    }
});

routes.post('/getFriends', authMiddleware, async(req, res) => {
    try {
        const friends = await User.findById(req.userId)
                                    .populate({
                                        path: 'friends',
                                        select: 'name code status imagePerfil imagePerfilDefault',
                                        populate: {
                                            path: 'imagePerfil',
                                            select: "key"
                                        }
                                    })
                                    .select('friends');
        return res.send(friends);
    } catch (error) {
        return res.status(400).send('failed at getFriends')
    }
});

routes.post('/getPending', authMiddleware, async(req, res) => {
    try {
        const pending = await User.findById(req.userId)
                                    .populate({
                                        path: 'pending',
                                        populate: {
                                            path: 'user',
                                            select: 'name code imagePerfil imagePerfilDefault'
                                        }
                                    })
                                    .select('pending');

        return res.send(pending);
    } catch (error) {
        return res.status(400).send('failed at getPending')
    }
})

routes.post('/getUserChats', authMiddleware, async(req, res) => {
    try {
        const chats = await User.findById(req.userId)
                                .populate({
                                    path: 'chats',
                                    populate: {
                                        path: 'friend',
                                        select: 'name code status imagePerfil imagePerfilDefault',
                                        populate: {
                                            path: 'imagePerfil',
                                            select: 'key'
                                        }
                                    }
                                })
                                .select('chats');

        return res.send(chats)
    } catch (error) {
        return res.status(400).send('failed at getUserChats')
    }
})

routes.post("/getUser", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
                                .populate({
                                    path: 'pending', 
                                    populate: {
                                        path: 'user',
                                        select: "name code"
                                    }
                                })
                                .populate({
                                    path: "friends",
                                    select: "name code status"
                                })
                                .populate({
                                    path: "chats",
                                    populate: {
                                        path: "friend",
                                        select: "name code status"
                                    },
                                    select: "friend messages"
                                })
                                .populate({
                                    path: "imagePerfil",
                                    select: "key"
                                })
        if(!user){
            return res.status(400).send("user doesn't exist");
        }

        return res.send(user);

    } catch (error) {
        return res.status(400).send("failed at getUser");
    }
});

routes.post('/getUserConfig', authMiddleware, async(req, res) => {
    try {
        const user = await (await User.findById(req.userId)
                                        .populate({
                                            path: "imagePerfil",
                                            select: "key"
                                        })
                                        .select('name email code imagePerfil imagePerfilDefault'));
                                        
        return res.send(user);
    } catch (error) {
        return res.status(400).send('failed at getUserConfig')
    }
})

routes.post("/pedingAccept", authMiddleware, async (req, res) => {
    try {
        if(! await User.findById(req.userId)){
            return res.status(400).send({error: `user peding doesn't exist`});
        }

        const user = await User.findByIdAndUpdate(req.userId, 
            {
                $pull: {
                    pending: {
                        user: req.body.accept 
                    }
                }
            }, {new: true});
        
        return res.send(user);
    } catch (error) {
        return res.status(400).send({error: `peding error: ${error}`})
    }
});

routes.post("/pendingAdd", authMiddleware, async (req, res) => {
    try {
        const {name, code} = req.body;

        const verifyReceiver = await User.findOne({name, code});

        const verifyPending = await User.findOne({_id: req.userId, pending: {$elemMatch: {user: verifyReceiver._id}}});

        const verifyFriends = await User.findOne({_id: req.userId, friends: {$in: verifyReceiver._id}})

        if(!verifyPending && !verifyFriends){
            const receiver = await User.findOneAndUpdate({name, code}, 
                {
                    $push: {
                        pending: {
                            user: req.userId,
                            receiver: true,
                            sender: false
                        }
                    }
                });
    
            await User.findByIdAndUpdate(req.userId, 
                {
                    $push: {
                        pending: {
                            user: receiver._id,
                            receiver: false,
                            sender: true
                        }
                    }   
                });

            return res.send();
        }
        return res.send();
        
    } catch (error) {
        return res.status(400).send('failed at pendingAdd')
    }
});


routes.post("/recusePending", authMiddleware, async (req, res) => {
    try {
        const {id} = req.body;

        await User.findByIdAndUpdate(req.userId, {
            $pull: {
                pending: {
                    user: id
                }
            }
        })

        await User.findByIdAndUpdate(id, {
            $pull: {
                pending: {
                    user: req.userId
                }
            }
        })
        
        return res.send();
    } catch (error) {
        return res.status(400).send("failed at recuse Pending");
    }
});

routes.post("/acceptPending", authMiddleware, async(req, res) => {
    try {
        const {id} = req.body;

        await User.findByIdAndUpdate(id,
            {
                $push: {
                    friends: req.userId
                },
                $pull: {
                    pending: {
                        user: req.userId
                    }
                }
            }
        );

        await User.findByIdAndUpdate(req.userId,
            {
                $push: {
                    friends: id
                },
                $pull: {
                    pending: {
                        user: id
                    }
                }
            }    
        )

        return res.send();

    } catch (error) {
        return res.status(400).send("failed at accept pending");
    }
});

routes.post("/removeFriend", authMiddleware, async (req, res) => {
    try {
        const {name, id} = req.body;

        await User.findByIdAndUpdate(req.userId, {$pull: {friends: id}});

        await User.findByIdAndUpdate(id, {$pull: {friends: req.userId}});

        res.send();

    } catch (error) {
        res.status(400).send("failed at removeFriend")
    }
});

routes.post("/changeStatus", authMiddleware, async(req, res) => {
    try {
        const {status} = req.body

        await User.findByIdAndUpdate(req.userId, {$set :{status}})

        res.send()
    } catch (error) {
        res.status(400).send("error at changeStatus")
    }
});

routes.post("/changeName", authMiddleware, async(req, res) => {
    try {
        const {name, password} = req.body

        await User.findOneAndUpdate({
            _id: req.userId,
            password
        }, {
            $set:{
                name
            }
        })
    } catch (error) {
        return res.status(400).send('failed at changeName')
    }
});

routes.post("/changeEmail", authMiddleware, async(req, res) => {
    try {
        const {email, password} = req.body

        await User.findOneAndUpdate({
            _id: req.userId,
            password
        }, {
            $set:{
                email
            }
        })
    } catch (error) {
        return res.status(400).send('failed at changeName')
    }
});

routes.post("/changePassword", authMiddleware, async(req, res) => {
    try {
        const {password, newPassword} = req.body;

        const user = await User.findById(req.userId).select('+password');
        
        if(!bcrypt.compareSync(password, user.password)){
            return res.status(400).send('failed at changePassword, password incorrect');
        }

        await User.findOneAndUpdate({
            _id: req.userId,
            password
        }, {
            $set:{
                password: newPassword
            }
        })
        
        return res.send();
    } catch (error) {
        return res.status(400).send('failed at changeName')
    }
});

routes.post('/deleteAccount', authMiddleware, async(req, res) => {
    try {
        const {password} = req.body;

        const verify = await User.findOne({_id: req.userId, password});

        if(!verify){
            return res.status(400).send('failed at deleteAccount, password incorrect');
        }
        
        await User.findOneAndRemove({
            password,
            _id: req.userId
        })

        return res.send();

    } catch (error) {
        return res.status(400).send('failed at deleteUser')
    }
});

routes.post('/changeImagePerfil', authMiddleware, multer(multerMiddleware).single("file"), async(req, res) => {
    try {
        const {originalname: name, size, filename: key, path, mimetype: type} = req.file

        const imagePerfil = await ImagePerfil.create({
            name,
            key,
            size,
            path,
            user: req.userId,
            type
        })

        await User.findByIdAndUpdate(req.userId,{
            $set: {
                imagePerfil: imagePerfil._id
            }
        });


        return res.send()
    } catch (error) {
        return res.status(400).send('failed at changeImagePerfil')
    }
});


module.exports = app => app.use("/user", routes);