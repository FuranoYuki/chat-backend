const mongoose = require('../../database');

const NotificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    messageNumber: {
        type: Number,
        default: 1
    }
}, {timestamps: true});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification