import React from 'react';
import { Clock } from 'lucide-react';
// 🔥 NEW: Import the real component
import MatchupCard from './MatchupCard';

const Dashboard = ({ 
  schedule, 
  stats, 
  onGameClick, 
  onShowHistory 
}) => {

  // --- BRIDGE: TRANSLATE DATA ---
  const visibleGames = schedule.map(game => {
    const homeStats = stats.find(s => s.team === game.home) || {};
    const visStats = stats.find(s => s.team === game.visitor) || {};
    
    return {
      ...game,
      commence_time: new Date().toISOString(), 
      status: 'SCHEDULED',
      home_score: 0,
      visitor_score: 0,
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
        visibleGames.map((game) => (
          // 🔥 NEW: Use the component we just edited
          <MatchupCard 
            key={game.id} 
            game={game}
            // For now, clicking anything opens the Wizard until we wire up the full betting engine
            onPlaceBet={() => onGameClick(game)} 
            onAnalyze={() => onGameClick(game)}
            onShowHistory={onShowHistory}
            experts={[]} // Placeholder to prevent crash
            myBets={[]}  // Placeholder to prevent crash
            simData={{}} // Placeholder to prevent crash
          />
        ))
      )}
    </div>
  );
};

export default Dashboard;