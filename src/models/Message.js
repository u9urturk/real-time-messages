const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    senderId: mongoose.Schema.Types.ObjectId,
    receiverId: mongoose.Schema.Types.ObjectId,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  const Message = mongoose.model('Message', messageSchema);


module.exports = Message;