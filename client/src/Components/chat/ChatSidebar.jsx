import ChatListItem from "./ChatListItem";
import React from "react";
export default function ChatSidebar({ chatRooms, selectedChat, setSelectedChat }) {
  return (
    <div className={`${selectedChat ? "hidden md:block" : "block"} w-full md:w-96 bg-white border-r border-gray-200 flex flex-col`}>
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-sm text-gray-500">Chat with farmers and buyers</p>
      </div>

      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-green-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatRooms.map((room) => (
          <ChatListItem
            key={room.id}
            room={room}
            active={selectedChat?.id === room.id}
            onClick={() => setSelectedChat(room)}
          />
        ))}
      </div>
    </div>
  );
}
