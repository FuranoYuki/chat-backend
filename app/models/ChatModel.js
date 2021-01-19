const mongoose = require('../../database');

const ChatSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
 
    },

    friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    messages:[{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text:{
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now()
        }
    }]
    ,
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;