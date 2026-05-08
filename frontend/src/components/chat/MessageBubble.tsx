import { Bot, User } from "lucide-react";

export default function MessageBubble({ role, content }: { role: 'user' | 'bot', content: string }) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${isUser ? 'bg-indigo-100 text-indigo-600 ml-4' : 'bg-green-100 text-green-600 mr-4'}`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        
        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border ${
          isUser 
            ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-none' 
            : 'bg-white text-gray-800 border-gray-100 rounded-tl-none'
        }`}>
          {content.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </div>
        
      </div>
    </div>
  );
}
