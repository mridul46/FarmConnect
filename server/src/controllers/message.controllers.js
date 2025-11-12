import { asyncHandler } from "../utils/asyncHandler.js";
import {Message} from  "../models/Message.model.js"

//send a new Message
const sendMessage=asyncHandler(async(req,res)=>{
  const {chatRoomId,senderId,text,attachments,type}=req.body
  if(!chatRoomId || !senderId || !text){
    return res.status(400).
    json({
        success:false,
        message:"chatRoomId, senderId, and text are required"
    })
  }
  const message= new MessageChannel({
    chatRoomId,
    senderId,
    text,
    attachments:attachments || [],
    type:trpe || "text"
  });
  const saveMessage = await message.save()
  res.status(201).json({
    success:true,
    data:saveMessage,
    message:"Message sent successfully"

  });
})

//get all message from chatRoom

const getMessageByChatRoom=asyncHandler(async(req ,res)=>{
     const {chatRoomId}= req.params

     if(!mongoose.Types.ObjectId.isValid(chatRoomId)){
        return res.status(400).hson({
            success:false,
            message:"Invalid chatRoomId"
        })
     }
     const message= await  Message.find({chatRoomId})
     .populate("senderId","name email avatar")
     .sort({createdAt:1})

     res.status(200).json({
        success:true,
        count:message.length,
        data:message
     })
})

//  Mark a message as read

const markMessageAsRead=asyncHandler(async(req,res)=>{
    const { messageId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid messageId or userId" });
    }

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    await message.markAsRead(userId);

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message
    });
})


//Delete a message
const deleteMessage=asyncHandler(async(req,res)=>{
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid messageId" });
    }

    const message = await Message.findByIdAndDelete(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });
})


export {
  sendMessage,
  getMessageByChatRoom,
  markMessageAsRead,
  deleteMessage,
}