"use client";

import { useState } from "react";
import DataIngestionPanel from "@/components/DataIngestionPanel";
import StateSelector from "@/components/StateSelector";
import ForecastChart from "@/components/ForecastChart";
import ModelComparisonTable from "@/components/ModelComparisonTable";
import InsightsPanel from "@/components/InsightsPanel";
import { Activity } from "lucide-react";

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState("");
  const [key, setKey] = useState(0); // Used to force re-render/fetch after training

  const handleTrainStart = () => {
    // Increment key to trigger refetch in components if needed, though they poll or user refreshes
    // Realistically we'd want a polling mechanism for completion, but here we can just alert.
    setTimeout(() => {
      setKey(prev => prev + 1);
    }, 5000); // give it a few seconds to finish the first model
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 relative overflow-hidden flex flex-col">
      {/* Decorative Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10" key={key}>
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Temporal Intelligence</h1>
          <p className="mt-3 text-slate-600 font-medium text-lg">Autonomous Forecasting & Simulation Platform</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6 relative z-10">
            <DataIngestionPanel onTrainStart={handleTrainStart} />
            <StateSelector selectedState={selectedState} onStateChange={setSelectedState} />
            {selectedState && <InsightsPanel state={selectedState} />}
          </div>

          {/* Right Column - Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            <ForecastChart state={selectedState} />
            <ModelComparisonTable state={selectedState} />
          </div>

        </div>
      </main>
    </div>
  );
}
