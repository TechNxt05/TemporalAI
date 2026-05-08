"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ModelComparisonTable({ state }: { state: string }) {
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    if (!state) return;
    
    axios.get(`http://localhost:8000/api/compare?state=${state}`)
      .then(res => {
        setModels(res.data);
      })
      .catch(err => console.error("Could not fetch models", err));
  }, [state]);

  if (!state) return null;
  if (models.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Model Performance ({state})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm tracking-wider uppercase">
              <th className="p-4 rounded-tl-xl">Model</th>
              <th className="p-4">RMSE</th>
              <th className="p-4">MAPE (%)</th>
              <th className="p-4">MAE</th>
              <th className="p-4 rounded-tr-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {models.map((m, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{m.model_name}</td>
                <td className="p-4 text-gray-600">{m.rmse.toFixed(2)}</td>
                <td className="p-4 text-gray-600">{(m.mape * 100).toFixed(2)}%</td>
                <td className="p-4 text-gray-600">{m.mae.toFixed(2)}</td>
                <td className="p-4">
                  {idx === 0 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Best Model</span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">Evaluated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
