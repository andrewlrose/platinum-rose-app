import React from 'react';
import { BrainCircuit, X, Activity, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Shared';

export default function ReviewPicksModal({ isOpen, onClose, stagedPicks, onConfirm, onDiscard }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center shrink-0 bg-indigo-900/20">
          <div className="flex gap-2 text-indigo-400 items-center"><BrainCircuit size={20}/><h3 className="font-bold text-lg">Parser Review</h3></div><button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {stagedPicks.length === 0 ? <div className="text-center py-8 text-gray-500 italic">No picks detected in this text.</div> : (
            <div className="space-y-4">
              {stagedPicks.map((pick, idx) => (
                <div key={idx} className={`bg-gray-800 border ${pick.type==='injury' ? 'border-red-500/50' : 'border-gray-700'} p-4 rounded flex justify-between items-start gap-3 group`}>
                  <div className="flex-1"><div className="flex items-center gap-2 mb-2"><span className="font-bold text-white text-lg">{pick.selection}</span>{pick.type === 'injury' ? <Badge className="bg-red-600 text-white flex items-center gap-1"><Activity size={10}/> Injury</Badge> : <Badge className="bg-gray-700 text-gray-300">{pick.type}</Badge>}</div>{pick.summary && pick.summary.length > 0 && (<div className="mb-3"><ul className="list-disc pl-4 space-y-1">{pick.summary.map((s, i) => (<li key={i} className="text-sm text-gray-200 font-medium leading-snug">{s}</li>))}</ul></div>)}<div className="text-xs text-gray-500 italic border-t border-gray-700 pt-2">Full Context: "{pick.analysis}"</div></div><button onClick={() => onDiscard(idx)} className="text-gray-500 hover:text-red-400 p-1"><X size={20}/></button></div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900"><button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button><button onClick={onConfirm} disabled={stagedPicks.length === 0} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-emerald-900/50"><CheckCircle2 size={16}/> Confirm All</button></div>
      </div>
    </div>
  );
}