import { ChatRoom } from "../models/ChatRoom.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";



//Create or Get Chat Room between two users
const createOrGetChatRoom= asyncHandler(async(req,res)=>{
   const {user1Id,user2Id,productId}= req.body

   if(!user1Id,user2Id){
    return res.status(400).json({
        success:false,
        message:"Both user IDs are required"
    })
   }
  
   const room= await ChatRoom.findOneAndUpdate(user1Id,user2Id,productId)
   return res.status(200).json({
    success:true,
    room,
    message:"ChatRoom created or get Successfully"
   })
})
//  Get all chat rooms for a specific user
const getUserChatRooms =asyncHandler(async(req,res)=>{
  const {userId}= req.params
  const room = await ChatRoom.find({participants:userId})
       .populate("participants" ,"name avatar shopName")
       .populate("lastMessage.senderId","name avatar")
       .sort({updatedAt:-1})
    res.status(200).json({
        success:true,
        room,
        message:"get User chat Successfully"
    })
})
// Get a specific chat room by ID
const getChatRoomById =asyncHandler(async(req,res)=>{
   const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId)
      .populate("participants", "name avatar shopName")
      .populate("lastMessage.senderId", "name avatar");

    if (!room){
        return res.status(404).json({
        success:false,
         message: "Chat room not found"
     });
    } 

    res.status(200).json({ 
        success: true,
         room
    });
})

const resetUnreadCount= asyncHandler(async(req,res)=>{
    const { roomId } = req.params;
    const { userId } = req.body;

    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ message: "Chat room not found" });

    await room.resetUnread(userId);
    res.status(200).json({ 
        success: true, 
        message: "Unread count reset" 
    });
})

const incrementUnreadCount=asyncHandler(async(req,res)=>{
     const { roomId } = req.params;
    const { userId } = req.body;

    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ message: "Chat room not found" });

    await room.incrementUnreadCount(userId);
    res.status(200).json({ success: true, message: "Unread count incremented" });
})

export{
    createOrGetChatRoom,
    getUserChatRooms,
    getChatRoomById,
    resetUnreadCount,
    incrementUnreadCount
}