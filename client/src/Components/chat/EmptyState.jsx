import { User } from "lucide-react";
import React from "react";
export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User size={40} className="text-green-600" />
        </div>

        <h3 className="text-2xl font-bold">Start a Conversation</h3>
        <p className="text-gray-600 mt-2">
          Select a chat from the sidebar to view messages.
        </p>
      </div>
    </div>
  );
}
