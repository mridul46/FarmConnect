import mongoose from "mongoose";
const chatRoomSchema = new mongoose.Schema({
  participants: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 2;
      },
      message: 'ChatRoom must have exactly 2 participants'
    }
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  lastMessage: {
    text: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: Date
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ updatedAt: -1 });
chatRoomSchema.index({ productId: 1 });

// Compound index for finding room by participants
chatRoomSchema.index({ 
  'participants.0': 1, 
  'participants.1': 1 
}, { unique: true });

// Virtual for messages
chatRoomSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chatRoomId'
});

// Method to get other participant
chatRoomSchema.methods.getOtherParticipant = function(userId) {
  return this.participants.find(p => !p.equals(userId));
};

// Method to increment unread count
chatRoomSchema.methods.incrementUnread = async function(userId) {
  const currentCount = this.unreadCount.get(userId.toString()) || 0;
  this.unreadCount.set(userId.toString(), currentCount + 1);
  return await this.save();
};

// Method to reset unread count
chatRoomSchema.methods.resetUnread = async function(userId) {
  this.unreadCount.set(userId.toString(), 0);
  return await this.save();
};

// Static method to find or create room
chatRoomSchema.statics.findOrCreate = async function(user1Id, user2Id, productId = null) {
  const participants = [user1Id, user2Id].sort();
  
  let room = await this.findOne({ participants });
  
  if (!room) {
    room = await this.create({
      participants,
      productId,
      unreadCount: new Map([
        [user1Id.toString(), 0],
        [user2Id.toString(), 0]
      ])
    });
  }
  
  return room.populate('participants', 'name avatar shopName');
};

module.exports = mongoose.model('ChatRoom', chatRoomSchema);