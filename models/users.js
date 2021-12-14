const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'City',
    },
    preference: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Users', userSchema);
