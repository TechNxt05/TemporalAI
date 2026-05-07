"use client";

import { useState } from "react";
import axios from "axios";
import StateSelector from "@/components/StateSelector";
import { BrainCircuit } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function SimulationPage() {
  const [selectedState, setSelectedState] = useState("");
  const [multiplier, setMultiplier] = useState(1.0);
  const [event, setEvent] = useState("none");
  const [simData, setSimData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    if (!selectedState) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/simulation/simulate", {
        state: selectedState,
        scenario: { demand_multiplier: multiplier, event: event }
      });
      
      const { base_forecast, simulated_forecast } = res.data;
      
      // Combine for chart
      const chartData = [];
      const dates = base_forecast.dates;
      for (let i = 0; i < dates.length; i++) {
        chartData.push({
          date: dates[i],
          base: base_forecast.predictions[i],
          simulated: simulated_forecast.predictions[i]
        });
      }
      setSimData(chartData);
    } catch (err) {
      console.error("Simulation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
            <BrainCircuit size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Scenario Simulation Engine</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <StateSelector selectedState={selectedState} onStateChange={setSelectedState} />
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Scenario Parameters</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demand Multiplier ({multiplier.toFixed(2)}x)
                </label>
                <input 
                  type="range" 
                  min="0.5" max="2.0" step="0.1" 
                  value={multiplier} 
                  onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Simulated Event</label>
                <select 
                  value={event} 
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="none">None</option>
                  <option value="festival">Festival Spike</option>
                  <option value="supply_chain_disruption">Supply Chain Disruption</option>
                </select>
              </div>

              <button
                onClick={handleSimulate}
                disabled={!selectedState || loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Simulating..." : "Run Simulation"}
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[500px]">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Base vs Simulated Forecast</h3>
              {simData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="base" name="Base Forecast" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="simulated" name="Simulated Scenario" stroke="#9333ea" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 border border-dashed rounded-xl">
                  Run a simulation to view results
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
