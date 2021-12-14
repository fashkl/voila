const mongoose = require('mongoose');

const sentNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
        required: true,
    },
    preference: {
        type: Number,
        required: true,
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SentNotification', sentNotificationSchema)
