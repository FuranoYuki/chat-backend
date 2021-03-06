const mongoose = require("../../database");
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    imagePerfil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ImagePerfil"
    },
    imagePerfilDefault:{
        type: String,
        default: "gs://chat-db68c.appspot.com/default/dog.jpeg"
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    status:{
        type: String,
        default: 'Online'
    },
    pending: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        sender: Boolean,
        receiver: Boolean
    }],
    notifications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    chats:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }],
    code: {
        type: String,
        default: '@9090'
    }
}, {timestamps: true});

UserSchema.pre("save", async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User