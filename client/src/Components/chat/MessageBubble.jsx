import React from "react";
export default function MessageBubble({ msg, avatar }) {
  const isMe = msg.sender === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>
        
        {!isMe && <img src={avatar} className="w-8 h-8 rounded-full" />}

        <div>
          <div
            className={`px-4 py-3 rounded-2xl ${
              isMe
                ? "bg-linear-to-r from-green-600 to-emerald-600 text-white"
                : "bg-white border"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
          <p className={`text-xs text-gray-500 mt-1 ${isMe ? "text-right" : ""}`}>{msg.time}</p>
        </div>
      </div>
    </div>
  );
}
