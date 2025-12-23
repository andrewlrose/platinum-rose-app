import React, { useState, useEffect } from 'react';
import { X, Mic, Users, Key, Zap, RefreshCw, CheckCircle } from 'lucide-react';
import { INITIAL_EXPERTS } from '../../lib/constants'; 

export default function AudioUploadModal({ isOpen, onClose, onAnalyze, experts = [] }) {
  const [text, setText] = useState('');
  
  // 🔥 AUTO-LOAD KEY LOGIC
  // This pulls from your .env file automatically
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENAI_API_KEY || '');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNewSource, setIsNewSource] = useState(false); 
  const [selectedSource, setSelectedSource] = useState(""); 
  const [newSourceName, setNewSourceName] = useState('');

  const expertList = experts.length > 0 ? experts : INITIAL_EXPERTS;
  const uniqueShows = Array.from(new Set(expertList.map(e => e.source))).sort();

  // Reset text when opening, but KEEP the key if it loaded from env
  useEffect(() => {
      if (isOpen) {
          setText('');
          // Re-check env var if state is empty
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

    // Send to App.jsx for processing
    await onAnalyze(text, sourceData);
    
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
                <Mic size={24} />
             </div>
             <div>
                <h3 className="font-bold text-white text-lg">AI Transcript Analyzer</h3>
                <p className="text-xs text-slate-400">Powered by OpenAI GPT-4o</p>
             </div>
           </div>
           <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar bg-slate-900">
           
           {/* API KEY INPUT */}
           <div className={`border p-4 rounded-xl transition-colors ${apiKey ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-950 border-slate-700'}`}>
               <label className="text-[10px] font-bold uppercase flex items-center gap-2 mb-2 text-slate-400 tracking-wider">
                   <Key size={12} className={apiKey ? "text-emerald-400" : "text-slate-500"} /> 
                   {apiKey ? <span className="text-emerald-400">API Key Active</span> : "OpenAI API Key Required"}
               </label>
               {apiKey ? (
                   <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                       <CheckCircle size={14} /> Key loaded securely from environment.
                   </div>
               ) : (
                   <input 
                       type="password" 
                       placeholder="sk-..."
                       className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 text-sm focus:border-indigo-500 focus:outline-none font-mono"
                       value={apiKey}
                       onChange={(e) => setApiKey(e.target.value)}
                   />
               )}
           </div>

           {/* SOURCE SELECTOR */}
           <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
              <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2 mb-3 tracking-wider">
                  <Users size={12} /> Select Source / Expert
              </label>

              <div className="flex gap-2 mb-4 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button onClick={() => setIsNewSource(false)} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${!isNewSource ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Existing Show</button>
                  <button onClick={() => setIsNewSource(true)} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${isNewSource ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>+ Create New</button>
              </div>

              {isNewSource ? (
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 text-sm focus:border-indigo-500 outline-none" 
                    placeholder="e.g. 'The Daily Wager' or 'Simmons Podcast'" 
                    value={newSourceName} 
                    onChange={(e) => setNewSourceName(e.target.value)} 
                  />
              ) : (
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 text-sm focus:border-indigo-500 outline-none appearance-none" 
                    value={selectedSource} 
                    onChange={(e) => setSelectedSource(e.target.value)}
                  >
                      <option value="">-- Choose a Source --</option>
                      {uniqueShows.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
              )}
           </div>

           {/* TRANSCRIPT INPUT */}
           <div className="flex-1 min-h-[200px] relative flex flex-col">
               <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-wider">Paste Transcript / Notes</label>
               <textarea 
                  className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
                  placeholder='Paste raw text here... The AI will extract picks, lines, and rationale automatically.'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
               />
           </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-950">
           <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-bold">Cancel</button>
           
           <button 
                onClick={handleAnalyze} 
                disabled={!text || isProcessing}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${isProcessing ? 'bg-indigo-600 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}`}
            >
              {isProcessing ? (
                  <><RefreshCw size={18} className="animate-spin" /> Analyzing...</>
              ) : (
                  <><Zap size={18} fill="currentColor" /> Extract Picks</>
              )}
           </button>
        </div>
      </div>
    </div>
  );
}