"use client";

import { useState } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";

export default function DatasetUploader({ onTrainStart }: { onTrainStart: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTrain = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(/api/train);
      setMessage(res.data.message || "Training started successfully!");
      onTrainStart();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to start training");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">
      <div className="bg-blue-50 p-4 rounded-full text-blue-600">
        <UploadCloud size={32} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">Dataset Ready</h3>
      <p className="text-sm text-gray-500 text-center">
        The Excel dataset is loaded on the server. Click below to begin the automated ML pipeline.
      </p>
      <button
        onClick={handleTrain}
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Initializing Pipeline..." : "Train Models"}
      </button>
      {message && <p className="text-sm text-gray-600 font-medium">{message}</p>}
    </div>
  );
}
