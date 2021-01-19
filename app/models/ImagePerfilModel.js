const mongoose = require('../../database');

const ImagePerfilSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

const ImagePerfil = mongoose.model('ImagePerfil', ImagePerfilSchema);

module.exports = ImagePerfil