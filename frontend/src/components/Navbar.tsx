import Link from "next/link";
import { Activity, BrainCircuit, MessageSquareText } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">
              TemporalAI
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/simulation" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium transition-colors">
              <BrainCircuit size={18} />
              <span>Simulation</span>
            </Link>
            <Link href="/copilot" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium transition-colors">
              <MessageSquareText size={18} />
              <span>Copilot</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
