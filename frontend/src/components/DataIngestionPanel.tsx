"use client";

import { useState } from "react";
import axios from "axios";
import { UploadCloud, Database, Globe, Play, FileSpreadsheet } from "lucide-react";

export default function DataIngestionPanel({ onTrainStart }: { onTrainStart: () => void }) {
  const [activeTab, setActiveTab] = useState<"demo" | "upload" | "external">("demo");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleDemoTrain = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/train`);
      setMessage(res.data.message || "Training started successfully!");
      onTrainStart();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to start training");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadTrain = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "File uploaded and training started!");
      onTrainStart();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to upload dataset");
    } finally {
      setLoading(false);
    }
  };

  const handleExternalTrain = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/fetch-external`);
      setMessage(res.data.message || "External data fetched and training started!");
      onTrainStart();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Failed to fetch external data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/40 flex flex-col space-y-6 transition-all duration-300">
      
      {/* Tabs */}
      <div className="flex bg-slate-100/50 p-1 rounded-xl">
        <button
          onClick={() => { setActiveTab("demo"); setMessage(""); }}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === "demo" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Database size={16} /> Demo
        </button>
        <button
          onClick={() => { setActiveTab("upload"); setMessage(""); }}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === "upload" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <UploadCloud size={16} /> Upload
        </button>
        <button
          onClick={() => { setActiveTab("external"); setMessage(""); }}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === "external" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Globe size={16} /> Live Data
        </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-center justify-center space-y-4">
        
        {activeTab === "demo" && (
          <>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-full text-blue-600 shadow-inner">
              <Database size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Load Demo Dataset</h3>
            <p className="text-sm text-slate-500 text-center px-4 leading-relaxed">
              Instantly run the ML pipeline using the pre-configured TemporalAI case study dataset. Perfect for exploring platform capabilities.
            </p>
            <button
              onClick={handleDemoTrain}
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Initializing Pipeline..." : <><Play size={18} fill="currentColor" /> Run Demo Pipeline</>}
            </button>
          </>
        )}

        {activeTab === "upload" && (
          <>
            <div className="w-full relative group">
              <input 
                type="file" 
                accept=".csv, .xlsx, .xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${file ? "border-green-400 bg-green-50" : "border-slate-300 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/50"}`}>
                <FileSpreadsheet size={36} className={file ? "text-green-500 mb-3" : "text-slate-400 mb-3"} />
                <p className="text-sm font-medium text-slate-700 text-center">
                  {file ? file.name : "Drag & drop or click to upload CSV/Excel"}
                </p>
                <p className="text-xs text-slate-500 mt-1">.csv, .xlsx, .xls up to 50MB</p>
              </div>
            </div>
            <button
              onClick={handleUploadTrain}
              disabled={loading || !file}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading & Training..." : "Upload & Train Custom Model"}
            </button>
          </>
        )}

        {activeTab === "external" && (
          <>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-full text-emerald-600 shadow-inner">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Real-World Data</h3>
            <p className="text-sm text-slate-500 text-center px-4 leading-relaxed">
              Connect to live external APIs (e.g., global economic indicators) to dynamically fetch current data and run predictive modeling.
            </p>
            <button
              onClick={handleExternalTrain}
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Fetching & Training..." : "Fetch Live Data & Train"}
            </button>
          </>
        )}

        {message && (
          <div className="w-full p-3 bg-slate-100 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 font-medium text-center">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
