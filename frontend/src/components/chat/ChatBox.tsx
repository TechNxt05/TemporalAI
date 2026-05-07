"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble";

type Message = { role: 'user' | 'bot', content: string };

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I am your TemporalAI Copilot. Ask me anything about the data, anomalies, or future trends." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/copilot/chat", {
        query: userMsg
      });
      
      setMessages(prev => [...prev, { role: 'bot', content: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "Error communicating with TemporalAI memory store." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 p-4">
        <h3 className="font-semibold text-gray-800">Intelligence Copilot</h3>
        <p className="text-xs text-gray-500">Powered by FAISS Vector Memory & LLM</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="flex w-full mb-6 justify-start">
            <div className="flex max-w-[80%] flex-row">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mr-4">
                <span className="animate-pulse">...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex space-x-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about state trends, anomalies, or strategies..."
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
