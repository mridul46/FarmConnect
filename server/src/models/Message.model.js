import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: [true, 'Chat room ID is required'],
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender ID is required']
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  attachments: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 5;
      },
      message: 'Cannot attach more than 5 files'
    }
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  type: {
    type: String,
    enum: {
      values: ['text', 'image', 'order', 'system'],
      message: 'Invalid message type'
    },
    default: 'text'
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ chatRoomId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

// Virtual for sender details
messageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});

// Method to mark as read
messageSchema.methods.markAsRead = async function(userId) {
  if (!this.readBy.includes(userId)) {
    this.readBy.push(userId);
    await this.save();
  }
  return this;
};

// Post-save hook to update chat room
messageSchema.post('save', async function() {
  try {
    const ChatRoom = mongoose.model('ChatRoom');
    await ChatRoom.findByIdAndUpdate(this.chatRoomId, {
      lastMessage: {
        text: this.text,
        senderId: this.senderId,
        createdAt: this.createdAt
      },
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating chat room:', error);
  }
});

module.exports = mongoose.model('Message', messageSchema);