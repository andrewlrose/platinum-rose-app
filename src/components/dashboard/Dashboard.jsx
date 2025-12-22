import React from 'react';
import { Clock, Trophy, TrendingUp, BarChart2, Activity } from 'lucide-react';

const Dashboard = ({ 
  schedule,       // Data from App.jsx comes in as 'schedule'
  stats,          // EPA Stats
  onGameClick,    // For the Wizard
  onShowHistory   // Optional
}) => {

  // --- BRIDGE: TRANSLATE DATA ---
  // This turns our simple "schedule" into the rich "games" object your UI expects
  const visibleGames = schedule.map(game => {
    const homeStats = stats.find(s => s.team === game.home) || {};
    const visStats = stats.find(s => s.team === game.visitor) || {};
    
    return {
      ...game,
      commence_time: new Date().toISOString(), // Fake date to satisfy sort
      status: 'SCHEDULED',                     // Force 'Active' state
      home_score: 0,
      visitor_score: 0,
      // Inject EPA stats so we can display them
      homeStats,
      visStats
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleGames.length === 0 ? (
        <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl text-slate-400 font-semibold">No Active Games</h3>
          <p className="text-slate-500">Waiting for schedule update...</p>
        </div>
      ) : (
        visibleGames.map((game) => {
          // Use our translated stats
          const { homeStats, visStats } = game; 
          
          // Determine Edge
          const edge = parseFloat(homeStats.off_epa) > parseFloat(visStats.off_epa) ? game.home : game.visitor;

          return (
            <div key={game.id} className="relative bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-xl overflow-hidden transition-all duration-300 group shadow-lg">
              
              {/* Header: Time & Actions */}
              <div className="px-4 py-3 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                   <Clock className="w-4 h-4" />
                   <span>{game.time}</span>
                </div>
                
                {/* Action Icons */}
                <div className="flex items-center space-x-1">
                   <button className="p-1.5 hover:bg-slate-800 rounded text-slate-600 hover:text-slate-400 cursor-not-allowed">
                      <TrendingUp className="w-4 h-4" />
                   </button>
                   <button onClick={() => onGameClick(game)} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-emerald-400 transition-colors">
                      <BarChart2 className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Game Body */}
              <div className="p-4 space-y-4">
                
                {/* MATCHUP ROW */}
                <div className="flex justify-between items-center pb-2">
                    {/* Visitor */}
                    <div className="text-left">
                        <div className="text-xl font-bold text-white tracking-tight">{game.visitor}</div>
                        <div className="flex items-center gap-1 mt-1">
                             <Activity size={10} className="text-slate-500"/>
                             <span className={`text-xs font-mono font-bold ${parseFloat(visStats.off_epa) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {visStats.off_epa ? parseFloat(visStats.off_epa).toFixed(2) : '-'}
                             </span>
                        </div>
                    </div>
                    
                    <div className="text-slate-700 font-thin text-2xl">@</div>
                    
                    {/* Home */}
                    <div className="text-right">
                        <div className="text-xl font-bold text-white tracking-tight">{game.home}</div>
                         <div className="flex items-center justify-end gap-1 mt-1">
                             <span className={`text-xs font-mono font-bold ${parseFloat(homeStats.off_epa) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {homeStats.off_epa ? parseFloat(homeStats.off_epa).toFixed(2) : '-'}
                             </span>
                             <Activity size={10} className="text-slate-500"/>
                        </div>
                    </div>
                </div>

                {/* Betting Lines */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                        onClick={() => onGameClick(game)}
                        className="relative group/btn flex flex-col items-center justify-center py-2 rounded-lg border bg-slate-800/50 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800 transition-all"
                    >
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Spread</span>
                        <span className="text-sm font-mono font-medium text-slate-300 group-hover/btn:text-white">
                            {game.home} {game.spread > 0 ? '+' : ''}{game.spread}
                        </span>
                    </button>

                    <button 
                        onClick={() => onGameClick(game)}
                        className="relative group/btn flex flex-col items-center justify-center py-2 rounded-lg border bg-slate-800/50 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800 transition-all"
                    >
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total</span>
                        <span className="text-sm font-mono font-medium text-slate-300 group-hover/btn:text-white">
                            O/U {game.total}
                        </span>
                    </button>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
                    <div className="flex items-center space-x-1">
                         <span className="flex items-center text-slate-600">
                           <Trophy className="w-3 h-3 mr-1" />
                           Edge: <span className={edge === game.home ? "text-emerald-500" : "text-indigo-400"}>{edge}</span>
                        </span>
                    </div>
                    <div>
                         <span className="truncate max-w-[120px]">72° Dome</span>
                    </div>
                </div>

              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Dashboard;