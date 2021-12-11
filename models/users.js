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
        index: true,
    },
    preference: {
        type: Number,
        required: true,
    },
    creationDate: {
        type: Date,
        defaults: Date.now
    },
});

module.exports = mongoose.model('Users', userSchema);
