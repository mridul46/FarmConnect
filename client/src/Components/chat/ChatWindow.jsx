import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import EmptyState from "./EmptyState";
import React from "react";

export default function ChatWindow({
  selectedChat,
  messages,
  message,
  setMessage,
  isTyping,
  handleSendMessage,
  messagesEndRef,
  setSelectedChat
}) {
  if (!selectedChat) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

      <div className="flex-1 overflow-y-auto p-6 bg-linear-to-b from-gray-50 to-white">
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} avatar={selectedChat.avatar} />
          ))}

          {isTyping && <TypingIndicator avatar={selectedChat.avatar} />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}
