"use client";

import { useState } from "react";
import DatasetUploader from "@/components/DatasetUploader";
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" key={key}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <DatasetUploader onTrainStart={handleTrainStart} />
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
