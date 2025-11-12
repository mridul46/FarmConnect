import express, { Router } from 'express'
import { deleteMessage, getMessageByChatRoom, markMessageAsRead, sendMessage } from '../controllers/message.controllers.js'


const router= Router()

//post send a message
router.post("/", sendMessage)
//get->get all message of a chat room
router.get("/:chatRoomId", getMessageByChatRoom)
//put->marks messages of a chatRoom
router.put("/:messageId/read", markMessageAsRead)
//delete->delete message
router.delete("/:messageId",deleteMessage)
 
export default router