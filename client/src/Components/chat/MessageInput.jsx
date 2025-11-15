import React from "react";
import { Paperclip, Image, Smile, Send } from "lucide-react";

export default function MessageInput({ message, setMessage, handleSendMessage }) {
  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-end gap-3">

        <button className="p-2 hover:bg-gray-100 rounded-lg"><Paperclip size={20} /></button>
        <button className="p-2 hover:bg-gray-100 rounded-lg"><Image size={20} /></button>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl resize-none focus:ring-green-500"
          />
          <button className="absolute bottom-3 right-3 p-1.5 hover:bg-gray-200 rounded-lg">
            <Smile size={18} />
          </button>
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={`p-3 rounded-xl ${
            message.trim()
              ? "bg-green-600 text-white hover:scale-105"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <Send size={20} />
        </button>
      </div>

      <p className="text-xs text-center text-gray-500 mt-2">Press Enter to send</p>
    </div>
  );
}
