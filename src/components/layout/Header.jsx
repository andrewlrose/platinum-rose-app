import React from 'react';
import { LayoutDashboard, Trophy, FileText, Mic2, RefreshCw, Activity, ListFilter, Split, ShoppingBag, Zap, ChevronRight } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onSyncOdds, 
  onOpenSplits,   
  onOpenTeasers,  
  onOpenContest   
}) {
  
  const NavTab = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`relative h-full px-4 flex items-center gap-2 font-bold text-sm transition-all border-b-2 ${
        activeTab === id 
        ? 'border-emerald-500 text-white' 
        : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={16} className={activeTab === id ? "text-emerald-400" : ""} />
      {label}
      {id === 'mycard' && cartCount > 0 && (
          <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1.5 shadow-sm shadow-emerald-500/50">
              {cartCount}
          </span>
      )}
    </button>
  );

  const ToolButton = ({ onClick, icon: Icon, label, colorClass }) => (
      <button 
        onClick={onClick} 
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-all ${colorClass}`}
      >
          <Icon size={14} />
          <span className="text-xs font-bold">{label}</span>
      </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-slate-950 shadow-2xl">
      
      {/* --- TOP LAYER: BRANDING & TOOLS --- */}
      <div className="border-b border-slate-800 bg-slate-950 relative z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            
            {/* LOGO */}
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-rose-600 to-purple-700 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-rose-900/20">
                    <span className="text-white font-black text-sm tracking-tighter">PR</span>
                </div>
                <div className="hidden md:block">
                    <h1 className="text-white font-black text-sm tracking-tight leading-none">PLATINUM ROSE</h1>
                    <div className="flex items-center gap-1.5 opacity-80">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[9px] font-bold text-emerald-500 tracking-wider">WEEK 17 • LIVE</span>
                    </div>
                </div>
            </div>

            {/* TOOLS (Right Side) */}
            <div className="flex items-center gap-2">
                <button 
                    onClick={onSyncOdds}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] shadow-lg shadow-indigo-900/20 transition-all mr-2"
                >
                    <RefreshCw size={12} /> SYNC
                </button>
                
                <div className="h-6 w-px bg-slate-800 mx-1 hidden md:block"></div>

                <div className="hidden md:flex items-center gap-2">
                    <ToolButton onClick={onOpenTeasers} icon={Split} label="Teasers" colorClass="text-purple-400" />
                    <ToolButton onClick={onOpenContest} icon={ListFilter} label="Contest" colorClass="text-orange-400" />
                    <ToolButton onClick={onOpenSplits} icon={Activity} label="Pulse" colorClass="text-rose-400" />
                </div>
            </div>
        </div>
      </div>

      {/* --- BOTTOM LAYER: NAVIGATION TABS --- */}
      <div className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <NavTab id="dashboard" label="The Board" icon={LayoutDashboard} />
            <NavTab id="mycard" label="My Card" icon={ShoppingBag} />
            <NavTab id="standings" label="Expert Standings" icon={Trophy} />
            <NavTab id="devlab" label="AI Dev Lab" icon={Mic2} />
        </div>
      </div>
      
      {/* MOBILE NAV (Bottom Bar remains for mobile UX) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-2 z-50 flex justify-around pb-safe">
          <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <LayoutDashboard size={20}/>
              <span className="text-[10px] font-bold">Board</span>
          </button>
          <button onClick={() => setActiveTab('mycard')} className={`p-2 rounded-lg flex flex-col items-center gap-1 relative ${activeTab === 'mycard' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <ShoppingBag size={20}/>
              {cartCount > 0 && <span className="absolute top-1 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>}
              <span className="text-[10px] font-bold">Card</span>
          </button>
          <button onClick={() => setActiveTab('devlab')} className={`p-2 rounded-lg flex flex-col items-center gap-1 ${activeTab === 'devlab' ? 'text-emerald-400' : 'text-slate-500'}`}>
              <Mic2 size={20}/>
              <span className="text-[10px] font-bold">AI Lab</span>
          </button>
          <button onClick={onOpenSplits} className="p-2 rounded-lg flex flex-col items-center gap-1 text-rose-500">
              <Activity size={20}/>
              <span className="text-[10px] font-bold">Pulse</span>
          </button>
      </div>

    </header>
  );
}