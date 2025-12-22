// File: src/components/dashboard/Dashboard.jsx
import React from 'react';
import { Clock, Trophy, TrendingUp, BarChart2, MoreHorizontal } from 'lucide-react';

const Dashboard = ({ 
  games, 
  simResults, 
  contestLines, 
  onPlaceBet, 
  onVote, 
  onAnalyze, 
  onShowHistory,
  experts,
  myBets 
}) => {

  // 🔥 UPDATE: Filter now includes BOTH Upcoming AND Final games
  const visibleGames = games.filter(g => {
      const isUpcoming = new Date(g.commence_time) > new Date();
      const isFinal = g.status === 'FINAL';
      // We explicitly exclude "In Progress" or "Halftime" for now unless you add that logic later
      return isUpcoming || isFinal;
  }).sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));

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
          const gameDate = new Date(game.commence_time);
          const isFinal = game.status === 'FINAL';
          
          // Find Contest Line if available
          const contestLine = contestLines.find(c => 
            c.team === game.home || c.team === game.visitor
          );

          return (
            <div key={game.id} className={`relative bg-slate-900 border ${isFinal ? 'border-slate-700 opacity-90' : 'border-slate-800 hover:border-rose-500/50'} rounded-xl overflow-hidden transition-all duration-300 group`}>
              
              {/* Header: Date or Final Badge */}
              <div className="px-4 py-3 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
                {isFinal ? (
                   <span className="bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                     Final
                   </span>
                ) : (
                   <div className="flex items-center space-x-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        {gameDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {gameDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      </span>
                   </div>
                )}
                
                {/* Action Icons */}
                <div className="flex items-center space-x-1">
                   <button onClick={() => onShowHistory(game)} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400 transition-colors" title="Line History">
                      <TrendingUp className="w-4 h-4" />
                   </button>
                   <button onClick={() => onAnalyze(game)} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-emerald-400 transition-colors" title="Matchup Wizard">
                      <BarChart2 className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Game Body */}
              <div className="p-4 space-y-4">
                
                {/* 🔥 SCOREBOARD / MATCHUP SECTION */}
                {isFinal ? (
                    // 🏁 FINAL SCORE VIEW
                    <div className="flex flex-col space-y-2 py-2">
                        <div className="flex justify-between items-center">
                            <span className={`text-lg font-bold ${game.visitor_score > game.home_score ? 'text-white' : 'text-slate-400'}`}>
                                {game.visitor}
                            </span>
                            <span className={`text-2xl font-mono ${game.visitor_score > game.home_score ? 'text-rose-500' : 'text-slate-600'}`}>
                                {game.visitor_score}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={`text-lg font-bold ${game.home_score > game.visitor_score ? 'text-white' : 'text-slate-400'}`}>
                                {game.home}
                            </span>
                            <span className={`text-2xl font-mono ${game.home_score > game.visitor_score ? 'text-rose-500' : 'text-slate-600'}`}>
                                {game.home_score}
                            </span>
                        </div>
                    </div>
                ) : (
                    // 📅 UPCOMING MATCHUP VIEW
                    <div className="flex justify-between items-center">
                        <div className="text-left">
                            <div className="text-xl font-bold text-white tracking-tight">{game.visitor}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                                {game.visitor_ml > 0 ? `+${game.visitor_ml}` : game.visitor_ml}
                            </div>
                        </div>
                        <div className="text-slate-600 font-thin text-2xl">@</div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-white tracking-tight">{game.home}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                                {game.home_ml > 0 ? `+${game.home_ml}` : game.home_ml}
                            </div>
                        </div>
                    </div>
                )}

                {/* Betting Lines (Disable buttons if Final) */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Spread Button */}
                    <button 
                        disabled={isFinal}
                        onClick={() => onPlaceBet(game.id, 'spread', 'home', game.spread, -110)}
                        className={`relative group/btn flex flex-col items-center justify-center py-2 rounded-lg border transition-all
                            ${isFinal ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed' : 'bg-slate-800/50 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800'}
                        `}
                    >
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Spread</span>
                        <span className={`text-sm font-mono font-medium ${isFinal ? 'text-slate-600' : 'text-slate-300 group-hover/btn:text-white'}`}>
                            {game.home} {game.spread > 0 ? '+' : ''}{game.spread}
                        </span>
                    </button>

                    {/* Total Button */}
                    <button 
                        disabled={isFinal}
                        onClick={() => onPlaceBet(game.id, 'total', 'over', game.total, -110)}
                        className={`relative group/btn flex flex-col items-center justify-center py-2 rounded-lg border transition-all
                            ${isFinal ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed' : 'bg-slate-800/50 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800'}
                        `}
                    >
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total</span>
                        <span className={`text-sm font-mono font-medium ${isFinal ? 'text-slate-600' : 'text-slate-300 group-hover/btn:text-white'}`}>
                            O/U {game.total}
                        </span>
                    </button>
                </div>

                {/* Footer Info (Contest Lines or Weather) */}
                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
                    <div className="flex items-center space-x-1">
                        {contestLine && (
                            <span className="flex items-center text-amber-500/80" title="SuperContest Line">
                                <Trophy className="w-3 h-3 mr-1" />
                                {contestLine.team} {contestLine.spread > 0 ? '+' : ''}{contestLine.spread}
                            </span>
                        )}
                    </div>
                    <div>
                        {game.weather && !game.weather.includes("Dome") && (
                            <span className="truncate max-w-[120px]" title={game.weather}>
                                {game.weather}
                            </span>
                        )}
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