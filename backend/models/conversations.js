const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        validate: [arrayLimit, '{PATH} must have 2 participants'],
    },
    lastMessage: {
        text: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: Date,
    },
}, { timestamps: true });

function arrayLimit(val) {
    return val.length === 2;
}

const Conversations = mongoose.model('Conversation', conversationSchema);

module.exports = Conversations;