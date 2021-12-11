const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    creationDate: {
        type: Date,
        defaults: Date.now
    },
});

module.exports = mongoose.model('City', citySchema);
