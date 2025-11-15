import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import React from "react";
export default function ChatHeader({ selectedChat, setSelectedChat }) {
  return (
    <div className="px-6 py-4 border-b shadow-sm bg-white">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>

          <div className="relative">
            <img src={selectedChat.avatar} className="w-11 h-11 rounded-full" />
            {selectedChat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>}
          </div>

          <div>
            <h3 className="font-semibold">{selectedChat.name}</h3>
            <p className="text-sm text-gray-500">{selectedChat.online ? "Active now" : "Offline"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg"><Phone size={20} /></button>
          <button className="p-2 hover:bg-gray-100 rounded-lg"><Video size={20} /></button>
          <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical size={20} /></button>
        </div>
      </div>

      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <p className="text-sm"><span className="font-medium">Discussing:</span> {selectedChat.product}</p>
      </div>
    </div>
  );
}
