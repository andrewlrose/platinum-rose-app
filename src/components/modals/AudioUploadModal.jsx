import React, { useState, useEffect } from 'react';
import { X, Mic, Users, Key, Zap, Play } from 'lucide-react';
import { INITIAL_EXPERTS } from '../../lib/constants'; 

export default function AudioUploadModal({ isOpen, onClose, onAnalyze, experts = [] }) {
  const [text, setText] = useState('');
  
  // 1. AUTO-LOAD KEY FROM ENV
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENAI_API_KEY || '');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNewSource, setIsNewSource] = useState(false); 
  const [selectedSource, setSelectedSource] = useState(""); 
  const [newSourceName, setNewSourceName] = useState('');

  const expertList = experts.length > 0 ? experts : INITIAL_EXPERTS;
  const uniqueShows = Array.from(new Set(expertList.map(e => e.source))).sort();

  // Reset text when opening, but KEEP the key
  useEffect(() => {
      if (isOpen) {
          setText('');
          if (!apiKey) setApiKey(import.meta.env.VITE_OPENAI_API_KEY || '');
      }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    if (isNewSource && !newSourceName.trim()) {
        alert("Enter a show name.");
        return;
    }
    if (!isNewSource && !selectedSource) {
        alert("Select a show.");
        return;
    }

    setIsProcessing(true);
    
    const sourceData = {
        name: isNewSource ? newSourceName : selectedSource,
        isNew: isNewSource,
        apiKey: apiKey.trim()
    };

    // Wait for the App to process the data
    await onAnalyze(text, sourceData);
    
    setIsProcessing(false);
    
    // --- CRITICAL FIX ---
    // DO NOT call onClose() here. 
    // The App.jsx handles the transition to the Verification Modal automatically.
    // If we call onClose() here, it wipes out the Verification Modal immediately.
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-indigo-950/30">
           <div className="flex items-center gap-3 text-indigo-400">
             <Mic size={24} />
             <div>
                <h3 className="font-bold text-white text-lg">AI Transcript Analyzer</h3>
                <p className="text-xs text-slate-400">Powered by OpenAI GPT-4o / GPT-5</p>
             </div>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={24}/></button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col gap-6 overflow-hidden custom-scrollbar overflow-y-auto">
           
           {/* API KEY INPUT */}
           <div className={`border p-4 rounded-lg transition-colors ${apiKey ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-950 border-slate-700'}`}>
               <label className="text-xs font-bold uppercase flex items-center gap-2 mb-2 text-slate-400">
                   <Key size={14} className={apiKey ? "text-emerald-400" : "text-slate-500"} /> 
                   {apiKey ? <span className="text-emerald-400">API Key Loaded</span> : "OpenAI API Key"}
               </label>
               <input 
                   type="password" 
                   placeholder="sk-..."
                   className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 text-sm focus:border-emerald-500 focus:outline-none font-mono"
                   value={apiKey}
                   onChange={(e) => setApiKey(e.target.value)}
               />
               <p className="text-[10px] text-slate-500 mt-1">
                   {apiKey ? "Key loaded from .env file." : "Enter key manually or add to .env file."}
               </p>
           </div>

           {/* SHOW SELECTOR */}
           <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
              <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2 mb-3">
                  <Users size={14} /> Select Show / Podcast:
              </label>

              <div className="flex gap-2 mb-3">
                  <button onClick={() => setIsNewSource(false)} className={`flex-1 py-2 text-xs font-bold rounded border ${!isNewSource ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>Select Existing</button>
                  <button onClick={() => setIsNewSource(true)} className={`flex-1 py-2 text-xs font-bold rounded border ${isNewSource ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>+ Create New</button>
              </div>

              {isNewSource ? (
                  <input type="text" className="w-full bg-slate-900 border border-slate-600 text-white rounded p-2 text-sm" placeholder="e.g. The Daily Wager" value={newSourceName} onChange={(e) => setNewSourceName(e.target.value)} />
              ) : (
                  <select className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 text-sm" value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}>
                      <option value="">-- Select Show --</option>
                      {uniqueShows.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
              )}
           </div>

           {/* TRANSCRIPT INPUT */}
           <div className="flex-1 min-h-[150px] relative">
               <textarea 
                  className="w-full h-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 focus:border-indigo-500 focus:outline-none resize-none"
                  placeholder='Paste Raw Transcript Here...'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
               />
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950">
           <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
           
           <button 
                onClick={handleAnalyze} 
                disabled={!text || isProcessing}
                className={`px-6 py-2 rounded font-bold flex items-center gap-2 transition-all ${isProcessing ? 'bg-indigo-600 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'}`}
            >
              {isProcessing ? "Processing..." : (
                  apiKey ? <><Zap size={16} fill="currentColor" /> Auto-Extract Picks</> : <><Play size={16} fill="currentColor" /> Process JSON</>
              )}
           </button>
        </div>
      </div>
    </div>
  );
}