"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function StateSelector({ selectedState, onStateChange }: { selectedState: string, onStateChange: (state: string) => void }) {
  const [states, setStates] = useState<string[]>([]);
  
  useEffect(() => {
    // In a real app we'd have a /states endpoint, but here we can just get metrics and extract keys
    axios.get(/api/metrics)
      .then(res => {
        if (res.data && !res.data.message) {
          setStates(Object.keys(res.data));
        }
      })
      .catch(err => console.error("Could not fetch states", err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Select Region</h3>
      <select 
        value={selectedState} 
        onChange={(e) => onStateChange(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">-- Choose a State --</option>
        {states.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
        {states.length === 0 && <option disabled>No models trained yet</option>}
      </select>
    </div>
  );
}
