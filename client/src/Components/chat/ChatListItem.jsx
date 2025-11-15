import React from "react";
export default function ChatListItem({ room, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
        active ? "bg-green-50 border-l-4 border-l-green-600" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <img src={room.avatar} className="w-12 h-12 rounded-full" alt="" />
          {room.online && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-semibold truncate">{room.name}</h3>
            <span className="text-xs text-gray-500">{room.time}</span>
          </div>

          <p className="text-xs text-green-600 truncate">{room.product}</p>
          <p className="text-sm truncate text-gray-600">{room.lastMessage}</p>
        </div>

        {room.unread > 0 && (
          <div className="w-5 h-5 bg-green-600 rounded-full text-white text-xs flex items-center justify-center">
            {room.unread}
          </div>
        )}
      </div>
    </div>
  );
}
