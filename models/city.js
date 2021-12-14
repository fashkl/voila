const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('City', citySchema);
