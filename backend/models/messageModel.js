const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    media: { type: String },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Messages = mongoose.model('Message', messageSchema);

module.exports = Messages;