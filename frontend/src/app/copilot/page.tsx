"use client";

import { MessageSquareText } from "lucide-react";
import ChatBox from "@/components/chat/ChatBox";

export default function CopilotPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg text-green-600">
            <MessageSquareText size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">TemporalAI Copilot</h2>
            <p className="text-gray-500 text-sm mt-1">Talk to your data using Natural Language & RAG Memory</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <ChatBox />
        </div>

      </div>
    </div>
  );
}
