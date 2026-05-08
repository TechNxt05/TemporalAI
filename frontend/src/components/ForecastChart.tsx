"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

export default function ForecastChart({ state }: { state: string }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!state) return;
    
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/forecast?state=${state}`)
      .then(res => {
        const { actuals, predictions, dates } = res.data;
        
        // Format data for Recharts
        const chartData = [];
        // Add actuals
        for (let i = 0; i < actuals.dates.length; i++) {
          chartData.push({
            date: actuals.dates[i],
            actual: actuals.values[i],
            predicted: null
          });
        }
        
        // Add predictions
        for (let i = 0; i < dates.length; i++) {
          chartData.push({
            date: dates[i],
            actual: null,
            predicted: predictions[i]
          });
        }
        
        setData(chartData);
      })
      .catch(err => console.error("Could not fetch forecast", err));
  }, [state]);

  if (!state) return <div className="text-slate-400 text-center py-10 border border-dashed border-white/40 bg-white/50 backdrop-blur-sm rounded-2xl">Select a state to view forecast</div>;
  if (data.length === 0) return <div className="text-slate-400 text-center py-10 border border-dashed border-white/40 bg-white/50 backdrop-blur-sm rounded-2xl">Loading...</div>;

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/40 h-96 transition-all duration-300">
      <h3 className="text-lg font-bold text-slate-800 mb-6">8-Week Forecast for {state}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{fontSize: 12}} 
            tickFormatter={(val) => val.split('-').slice(1).join('/')}
          />
          <YAxis tick={{fontSize: 12}} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="actual" 
            name="Actual Sales"
            stroke="#6366f1" 
            strokeWidth={3}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            name="Forecast"
            stroke="#f43f5e" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
