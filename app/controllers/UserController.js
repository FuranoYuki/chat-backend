//dependencies
const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const multer = require('multer');
const bucket = require('../../storage/storage')
const urlFromGoogleCloud = require('../functions/urlFromGoogleCloud')

//models
const User = require('../models/UserModel');
const ImagePerfil = require('../models/ImagePerfilModel');
const Chat = require('../models/ChatModel')
const Notification = require('../models/NotificationModel')

//socket
const io = require('../../index');

//authMiddleware
const authMiddleware = require('../middlewares/authMiddleware');
const multerMiddleware = require('../middlewares/multerMiddleware');
const { populate, remove, findById } = require('../models/UserModel');

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

        const compare =  await bcrypt.compare(password, exist.password)

        exist.password = undefined

        if(!compare){
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
        const friendsList = await User.findById(req.userId)
                .populate({
                    path: 'friends',
                    select: 'name code status imagePerfil imagePerfilDefault',
                    populate: {
                        path: 'imagePerfil',
                        select: 'path'
                    }
                })
                .select('friends');

        const newFriends = friendsList.friends.map(async (friend) => {
            friend.imagePerfil === undefined ?
            friend.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg')
        :
            friend.imagePerfil.path = await urlFromGoogleCloud(friend.imagePerfil.path)
        })

        await Promise.all(newFriends);
        friendsList.friends = newFriends

        return res.status(200).send(friendsList);
    } catch (error) {
        return res.status(400).send('failed at getFriends')
    }
});

routes.post('/getPending', authMiddleware, async(req, res) => {
    try {
        const user = await User.findById(req.userId)
                                    .populate({
                                        path: 'pending.user',
                                        populate: {
                                            path: 'imagePerfil',
                                            select: 'path'
                                        },
                                        select: 'name code imagePerfil imagePerfilDefault'
                                    })
                                    .select('pending');

        if(!user)
            return res.status(400).send({error: 'user doesnt exist, failed at getUserChats'})

        const pendingWithImage = user.pending.map(async data => {
            data.user.imagePerfil === undefined ?
            data.user.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg') :
            data.user.imagePerfil.path = await urlFromGoogleCloud(data.user.imagePerfil.path)
            return data
        })

        Promise.all(pendingWithImage).then(pending => {
            user.pending = pending
            return res.send(user);
        })

    } catch (error) {
        return res.status(400).send('failed at getPending')
    }
})

routes.post('/getUserChats', authMiddleware, async(req, res) => {
    try {
        const user = await User.findById(req.userId)
                                .populate({
                                    path: 'chats',
                                    select: 'friend updatedAt',
                                    populate: {
                                        path: 'friend',
                                        select: 'name code status imagePerfil imagePerfilDefault',
                                        populate: {
                                            path: 'imagePerfil',
                                            select: 'path'
                                        }
                                    }
                                })
                                .select('chats')
                                .sort('-chats.updatedAt')

        if(!user)
            return res.status(400).send({error: 'failed at getUserChats'})
        
        const friendsWithImage = user.chats.map(async data => {
            data.friend.imagePerfil === undefined ?
            data.friend.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg') :
            data.friend.imagePerfil.path = await urlFromGoogleCloud(data.friend.imagePerfil.path)
        })

        await Promise.all(friendsWithImage)
        user.chats = friendsWithImage

        return res.send(user)
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
        const user = await User.findById(req.userId)
            .populate({
                path: 'imagePerfil',
                select: 'path'
            })
            .select('name email code imagePerfil imagePerfilDefault');
        
        if(!user)
            return res.status(400).send({error: "failed at getUserConfig"})

        user.imagePerfil === undefined ?
            user.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg')
        :
            user.imagePerfil.path = await urlFromGoogleCloud(user.imagePerfil.path)

        return res.status(200).send(user);
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

        if(verifyPending)
            return res.status(400).send({error: 'you already have a pending with this user'})
        
        if(verifyFriends)
            return res.status(400).send({error: 'you are already friend with this user'})

        if(verifyReceiver._id == req.userId)
            return res.status(400).send({error: 'you cant send a request for yourself !'})
        
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
        
    } catch (error) {
        return res.status(400).send({error: 'Hm, didn\'t work. Double check that the capitalization, spelling, any spaces and number are correct.'})
    }
});


routes.post("/recusePending", authMiddleware, async (req, res) => {
    try {
        const {id} = req.body;
        if(!id)
            return res.status(400).send({error: 'failed at recusePending'})

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

        if(!id)
            return res.status(400).send({error: 'failed at acceptPending'})

        await User.findByIdAndUpdate(id,
            {
            $push: {
                friends: req.userId
            },
            $pull: {
                pending: {
                    user: req.userId
                }
            }}
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

        const user = await User.findByIdAndUpdate(req.userId, {$set :{status}}, {new: true})
                                .select('status')

        res.send(user)
    } catch (error) {
        res.status(400).send("error at changeStatus")
    }
});

routes.post('/userOnline', authMiddleware, async(req, res) => {
    try {
        await User.findByIdAndUpdate(req.userId, {$set: {status: 'Online'}})

        res.send()
    } catch (error) {
        res.status(400).send({message: 'error at userOnline'})
    }
})

routes.post('/userOffline', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.userId, {$set: {status: 'Offline'}})

        res.send()
    } catch (error) {
        res.status(400).send({message: 'error at userOffline'})
    }
})

routes.post("/changeName", authMiddleware, async(req, res) => {
    try {
        const {name, password} = req.body

        const user = await User.findById(req.userId).select('+password')
        const compare = await bcrypt.compare(password, user.password)

        const alreadyExist = await User.findOne({name})

        if(alreadyExist)
            return res.status(400).send({error: 'this name is already at use'})

        if(!compare)
            return res.status(400).send({error: 'wrong password'})

        await User.findByIdAndUpdate(req.userId, {$set:{ name }})

        return res.send()
    } catch (error) {
        return res.status(400).send('failed at changeName')
    }
});

routes.post("/changeEmail", authMiddleware, async(req, res) => {
    try {
        const {email, password} = req.body

        const alreadyExist = await User.findOne({email})

        if(alreadyExist)
            return res.status(400).send({error: 'this email is already at use'})

        const user = await User.findById(req.userId).select('+password')
        const compare = await bcrypt.compare(password, user.password)

        if(!compare)
            return res.status(400).send({error: 'wrong password'})

        await User.findByIdAndUpdate(req.userId, {$set:{ email }})

        return res.send()
    } catch (error) {
        return res.status(400).send('failed at changeEmail')
    }
});

routes.post("/changePassword", authMiddleware, async(req, res) => {
    try {
        const {password, newPassword} = req.body;

        const user = await User.findById(req.userId).select('+password');
        
        if(!bcrypt.compareSync(password, user.password))
            return res.status(400).send('failed at changePassword, password incorrect');

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

        // verify password
        const user = await User.findById(req.userId).populate('imagePerfil').select('+password');
        const compare = await bcrypt.compare(password, user.password)
        if(!compare)
            return res.status(400).send('failed at deleteAccount, password incorrect');
        
        // delete chats and image from database
        await Chat.deleteMany({user: req.userId})
        await ImagePerfil.deleteOne({user: req.userId})

        // delete all pendings dependences
        const friends = await User.findById(req.userId)
                                    .populate({
                                        path: 'pending',
                                        populate: {
                                            path: 'user'
                                        }
                                    })
                                    .populate({
                                        path: 'chats',
                                        populate: {
                                            path: 'friend'
                                        }
                                    })
                                    .select('pending chats')

        if(friends.pending){
            await Promise.all(
                friends.pending.map(async data => {
                    await User.findByIdAndUpdate(data.user._id, {
                        $pull: {
                            pending:{
                                user: req.userId
                            }
                        }
                    })
                })
            )
        }

        if(friends.chats){
            await Promise.all(
                friends.chats.map(async data => {
                    await User.findByIdAndUpdate(data.friend._id, {
                        $pull: {
                            chats:{
                                friend: req.userId
                            }
                        }
                    })
                })
            )
        }

        // delete image from firebase
        if(user.imagePerfil !== undefined)
            await bucket.file(`${req.userId}/${user.imagePerfil.name}`).delete()

        // delete user
        await User.findByIdAndDelete(req.userId)

        return res.send();
    } catch (error) {
        return res.status(400).send('failed at deleteUser')
    }
});

routes.post('/changeImagePerfil', authMiddleware, multer(multerMiddleware).single("file"), async(req, res) => {
    try {

        if(!req.file)
            return res.status(400).send('failed at changeImagePerfil, could not find file');

        const {originalname: name, size, mimetype: type} = req.file

        const blob = bucket.file(`${req.userId}/${name}`)
        const blobStream = blob.createWriteStream({
            metadata:{
                contentType: type
            }
        })
        blobStream.on('finish', async () => {
            const publicUrl = `${req.userId}/${name}`;
            const imagePerfil = await ImagePerfil.create({
                name,
                size,
                path: publicUrl,
                user: req.userId,
                type
            })
    
            const user = await User.findByIdAndUpdate(req.userId,{
                $set: {
                    imagePerfil: imagePerfil._id
                }
            })
            .populate({
                path: 'imagePerfil',
                select: 'name'
            })
    
            await ImagePerfil.findByIdAndDelete(user.imagePerfil._id);
            await bucket.file(`${req.userId}/${user.imagePerfil.name}`).delete()
        })

        blobStream.on('error', (err) => {
            return res.status(400).send('failed at changeImagePerfil, could not find file');
        })

        blobStream.end(req.file.buffer);            
        return res.status(200).send();
    } catch (error) {
        return res.status(400).send('failed at changeImagePerfil')
    }
});

routes.post('/getFriend', authMiddleware, async(req, res) => {
    try {
        const {name, code} = req.body

        const friend = await User.findOne({name, code})
                                    .populate({
                                        path: 'imagePerfil',
                                        select: 'path'
                                    })
                                    .select('name imagePerfil imagePerfilDefault')

        if(!friend) return res.status(400).json({message: 'failed at findById in getFriend'})

        return res.send(friend)

    } catch (error) {
        return res.status(400).json({message: 'failed at getFriend'})
    }
})


routes.post('/getUserBasicInfo', authMiddleware, async(req, res) => {
    try {
        const user = await User.findById(req.userId)
                                .populate({
                                    path: 'imagePerfil',
                                    select: 'path key'
                                })
                                .populate({
                                    path: 'friends',
                                    select: 'name code'
                                })
                                .select('name code status imagePerfil imagePerfilDefault')
        
        if(!user)
            return res.status(400).send('user doesnt exist')

        user.imagePerfil === undefined ?
            user.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg')
        :
            user.imagePerfil.path = await urlFromGoogleCloud(user.imagePerfil.path)

        return res.send(user)
    } catch (error) {
        return res.status(400).send('failed at getUserBasicInfo')
    }
})

routes.post('/changeUserBasic', authMiddleware, async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.userId, req.body, {new: true})
                                .populate({
                                    path: 'imagePerfil',
                                    select: 'path'
                                })
                                .select('name code status imagePerfil imagePerfilDefault')

        if(!user)
            return res.status(400).send('failed at changeUserBasic')

        return res.send(user)
    } catch (error) {
        return res.status(400).send('failed at changeUserBasic')
    }
})

routes.post('/getUserNotification', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
                            .populate({
                                path: 'notifications',
                                populate: {
                                    path: 'from',
                                    populate: {
                                        path: 'imagePerfil',
                                        select: 'path'
                                    },
                                    select: 'name imagePerfil imagePerfilDefault'
                                }
                            })
                            .select('notifications')

        if(!user)
            return res.status(400).send({error: 'user doesnt exist, failed at getUserNotification'})
        
        await Promise.all(
            user.notifications.map(async data => {
                data.from.imagePerfil === undefined ?
                data.from.imagePerfilDefault = await urlFromGoogleCloud('default/dog.jpeg') :
                data.from.imagePerfil.path = await urlFromGoogleCloud(data.from.imagePerfil.path)
            })
        ) 
        return res.status(200).send(user.notifications)
    } catch (error) {
        return res.status(400).send({error: 'failed at getUserNotification'})
    }
})

routes.post('/removeUserNotification', authMiddleware, async(req, res) => {
    try {
        const {friend_id} = req.body

        const exist = await Notification.findOne({user: req.userId, from: friend_id})

        if(!exist)
            return res.status(400).send({error: 'notifications doesnt exist, failed at removeUserNotification'})
        
        const not = await Notification.findOneAndDelete({user: req.userId, from: friend_id})

        await User.findByIdAndUpdate(req.userId, {
            $pull: {
                notifications: not._id
            }
        })

        return res.status(200).send()

    } catch (error) {
        return res.status(400).send({error: 'failed at removeUserNotification'})
    }
})

module.exports = app => app.use("/user", routes);