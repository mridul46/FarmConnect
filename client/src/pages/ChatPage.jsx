import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import React from "react";
import Footer from "../components/layout/Footer";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const location = useLocation();
  const incomingFarmerId = location.state?.farmerId;

  const chatRooms = [
    {
      id: 1,
      name: "Rajesh Kumar",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
      lastMessage: "The tomatoes are fresh today!",
      time: "2m ago",
      unread: 2,
      product: "Organic Tomatoes",
      online: true,
    },
    {
      id: 2,
      name: "Priya Sharma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      lastMessage: "When can you deliver?",
      time: "1h ago",
      unread: 0,
      product: "Alphonso Mangoes",
      online: false,
    },
    {
      id: 3,
      name: "Amit Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
      lastMessage: "Thank you for the order!",
      time: "3h ago",
      unread: 0,
      product: "Fresh Spinach",
      online: true,
    },
  ];

  // Auto-open chat when navigated from ProductCard
  useEffect(() => {
    if (incomingFarmerId) {
      const matched = chatRooms.find((room) => room.id === incomingFarmerId);
      if (matched) {
        setSelectedChat(matched);
      }
    }
  }, [incomingFarmerId]);

  const sampleMessages = [
    { id: 1, text: "Hi, are the tomatoes organic?", sender: "me", time: "10:30 AM" },
    { id: 2, text: "Yes! They are freshly picked.", sender: "other", time: "10:32 AM" },
    { id: 3, text: "Can I get 5kg delivered today?", sender: "me", time: "10:33 AM" },
    { id: 4, text: "I can deliver by 5 PM.", sender: "other", time: "10:35 AM" },
  ];

  useEffect(() => {
    if (selectedChat) setMessages(sampleMessages);
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMsg]);
    setMessage("");

    setTimeout(() => setIsTyping(true), 500);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Thanks! I'll reply shortly.",
          sender: "other",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-green-50 via-white to-emerald-50">

  {/* Chat Section */}
  <div className="flex flex-1 overflow-hidden">
    <ChatSidebar
      chatRooms={chatRooms}
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
    />

    <ChatWindow
      selectedChat={selectedChat}
      messages={messages}
      message={message}
      setMessage={setMessage}
      isTyping={isTyping}
      handleSendMessage={handleSendMessage}
      messagesEndRef={messagesEndRef}
      setSelectedChat={setSelectedChat}
    />
  </div>

  {/* Footer Section */}
  <Footer />

</div>
     
   
  );
}
