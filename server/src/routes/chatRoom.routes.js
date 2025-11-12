import { Router } from "express";
import { createOrGetChatRoom, getChatRoomById, getUserChatRooms, incrementUnreadCount, resetUnreadCount } from "../controllers/chatRoom.controllers.js";



const router= Router()


// Create or get chat room
router.post("/create",createOrGetChatRoom)

// Get all chat rooms for a user
router.get("/user/:userId", getUserChatRooms)

// Get specific chat room by ID
router.get("/:roomId", getChatRoomById);
// Reset unread count
router.put("/:roomId/reset-unread",resetUnreadCount);
// Increment unread count
router.put("/:roomId/increment-unread", incrementUnreadCount);
export default router