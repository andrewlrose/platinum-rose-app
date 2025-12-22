import React, { useState } from 'react';
import { Trophy, ArrowLeft, X } from 'lucide-react';
import { INITIAL_EXPERTS, WEEK_13_HISTORY } from '../../lib/constants';
import { Badge } from '../ui/Shared';

export default function LeaderboardModal({ isOpen, onClose, stats, games, experts }) {
  const [selId, setSelId] = useState(null);
  if(!isOpen) return null;
  const groupedStats = stats.reduce((acc, curr) => {
      const existing = acc.find(i => i.name === curr.name);
      if(existing) { existing.wins += curr.wins; existing.losses += curr.losses; existing.pushes += curr.pushes; const t = existing.wins+existing.losses; existing.winPct = t > 0 ? ((existing.wins/t)*100).toFixed(1) : "0.0"; } else { acc.push({...curr}); } return acc;
  }, []);
  const sel = groupedStats.find(s=>s.id===selId);
  const expertList = experts || INITIAL_EXPERTS;
  const picks = selId ? [...WEEK_13_HISTORY, ...games].flatMap(g=> { const targetName = sel.name; const allIds = expertList.filter(e => e.name === targetName).map(e => e.id); const spr = (g.expertPicks?.spread || []).filter(p=>allIds.includes(p.expertId)).map(p=>({...p,type:'Spread',game:g})); const tot = (g.expertPicks?.total || []).filter(p=>allIds.includes(p.expertId)).map(p=>({...p,type:'Total',game:g})); return [...spr, ...tot]; }) : [];
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"><div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto"><div className="p-4 border-b border-gray-800 flex justify-between sticky top-0 bg-gray-900 z-10"><div className="flex gap-2 text-yellow-400"><Trophy/><h3 className="font-bold">{sel?sel.name:"Standings"}</h3></div><div className="flex gap-2">{sel && <button onClick={()=>setSelId(null)} className="text-xs px-3 py-1 bg-gray-800 rounded flex gap-1 text-white"><ArrowLeft size={14}/> Back</button>}<button onClick={onClose}><X/></button></div></div><div className="p-6">{!sel ? (<table className="w-full text-left text-sm text-gray-400"><thead><tr className="bg-gray-800/50 text-xs uppercase"><th>Expert</th><th>Wins</th><th>Loss</th><th>%</th></tr></thead><tbody>{groupedStats.sort((a,b)=>b.winPct-a.winPct).map(s=><tr key={s.id} onClick={()=>setSelId(s.id)} className="hover:bg-gray-800/30 cursor-pointer"><td className="p-3 text-white font-medium">{s.name}</td><td className="p-3 text-emerald-400">{s.wins}</td><td className="p-3 text-red-400">{s.losses}</td><td className="p-3 text-white">{s.winPct}%</td></tr>)}</tbody></table>) : (<div className="space-y-3">{picks.length===0 ? <div className="text-center text-gray-500">No picks.</div> : picks.map((p,i)=>(<div key={i} className="bg-gray-800/50 p-3 rounded"><div className="font-bold text-white">{p.game.visitor} @ {p.game.home}</div><div className="text-xs text-gray-500">{p.type}: <span className="text-emerald-400">{p.pick}</span> {p.line && <span className="text-[10px] bg-gray-700 px-1 rounded text-gray-300 ml-1">({p.line})</span>} {p.pickType && <Badge className="ml-1 text-[10px] bg-blue-600 text-white">{p.pickType}</Badge>}</div>{p.analysis && <div className="text-xs italic text-gray-400 mt-1">"{p.analysis}"</div>}</div>))}</div>)}</div></div></div>
  );
}