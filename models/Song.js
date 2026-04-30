const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    songName: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        required: true
    },
    singer: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
