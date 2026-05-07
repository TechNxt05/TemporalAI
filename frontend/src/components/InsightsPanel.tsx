"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";

export default function InsightsPanel({ state }: { state: string }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state) return;
    
    setLoading(true);
    axios.get(`http://localhost:8000/api/explain?state=${state}`)
      .then(res => {
        setInsight(res.data.explanation);
      })
      .catch(err => {
        console.error("Could not fetch insights", err);
        setInsight("No insights available. Ensure LLM is configured correctly.");
      })
      .finally(() => setLoading(false));
  }, [state]);

  if (!state) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-indigo-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Sparkles size={20} />
        </div>
        <h3 className="text-lg font-semibold text-indigo-900">AI Analyst Insights</h3>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-3 py-1">
            <div className="h-2 bg-indigo-200 rounded"></div>
            <div className="h-2 bg-indigo-200 rounded w-5/6"></div>
            <div className="h-2 bg-indigo-200 rounded w-4/6"></div>
          </div>
        </div>
      ) : (
        <div className="text-indigo-800 leading-relaxed text-sm">
          {insight.split('\n').map((line, i) => (
            <p key={i} className="mb-2">{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
