import React from "react";
export default function TypingIndicator({ avatar }) {
  return (
    <div className="flex items-center gap-2">
      <img src={avatar} className="w-8 h-8 rounded-full" />
      <div className="bg-white border px-4 py-3 rounded-2xl">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    </div>
  );
}
