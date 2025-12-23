import React from 'react';
import { LayoutDashboard, Trophy, FileText, Mic2, RefreshCw, Activity, ListFilter, Split, ShoppingBag, Zap } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onSyncOdds, 
  onOpenSplits,   // This opens Pulse
  onOpenTeasers,  // This opens Wong Teasers
  onOpenContest   // This opens Contest Lines
}) {
  
  const NavTab = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm ${
        activeTab === id 
        ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/50 border border-slate-700' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <Icon size={16} className={activeTab === id ? "text-emerald-400" : ""} />
      {label}
      {id === 'mycard' && cartCount > 0 && (
          <span className="bg-emerald-500 text-white text-[10px] px-1.5 rounded-full ml-1">
              {cartCount}
          </span>
      )}
    </button>
  );

  const ActionButton = ({ onClick, icon: Icon, label, colorClass = "text-slate-400 hover:text-white" }) => (
      <button 
        onClick={onClick} 
        className={`p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-all group relative ${colorClass}`}
        title={label}
      >
          <Icon size={18} />
          {/* Tooltip */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">
              {label}
          </span>
      </button>
  );

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-rose-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/20">
                <span className="text-white font-black text-xl tracking-tighter">PR</span>
            </div>
            <div>
                <h1 className="text-white font-black text-lg tracking-tight leading-none">PLATINUM ROSE</h1>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-emerald-500 tracking-wider">WEEK 17 • LIVE</span>
                </div>
            </div>
        </div>

        {/* NAVIGATION TABS (Center) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
            <NavTab id="dashboard" label="The Board" icon={LayoutDashboard} />
            <NavTab id="mycard" label="My Card" icon={ShoppingBag} />
            <NavTab id="standings" label="Expert Standings" icon={Trophy} />
            <NavTab id="devlab" label="AI Dev Lab" icon={Mic2} />
        </nav>

        {/* ACTION BUTTONS (Right) */}
        <div className="flex items-center gap-3">
            <button 
                onClick={onSyncOdds}
                className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg shadow-indigo-900/20 transition-all"
            >
                <RefreshCw size={14} /> SYNC ODDS
            </button>
            
            <div className="h-8 w-px bg-slate-800 mx-1"></div>

            {/* 🔥 WIRED UP BUTTONS */}
            <ActionButton onClick={onOpenTeasers} icon={Split} label="Wong Teasers" colorClass="text-purple-400 hover:text-purple-300 hover:border-purple-500/30" />
            <ActionButton onClick={onOpenContest} icon={ListFilter} label="Contest Lines" colorClass="text-orange-400 hover:text-orange-300 hover:border-orange-500/30" />
            <ActionButton onClick={onOpenSplits} icon={Activity} label="Market Pulse" colorClass="text-rose-400 hover:text-rose-300 hover:border-rose-500/30" />
        </div>

      </div>
      
      {/* MOBILE NAV (Bottom Bar for small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-2 z-50 flex justify-around">
          <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-500'}`}><LayoutDashboard size={24}/></button>
          <button onClick={() => setActiveTab('mycard')} className={`p-2 rounded-lg ${activeTab === 'mycard' ? 'text-emerald-400' : 'text-slate-500'}`}><ShoppingBag size={24}/></button>
          <button onClick={() => setActiveTab('devlab')} className={`p-2 rounded-lg ${activeTab === 'devlab' ? 'text-emerald-400' : 'text-slate-500'}`}><Mic2 size={24}/></button>
      </div>
    </header>
  );
}