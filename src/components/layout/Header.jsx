import React, { useRef } from 'react';
import { 
  RefreshCw, Trash2, Mic, Upload, 
  BarChart2, Save, Download, 
  Split, Activity, Trophy, List, FileText
} from 'lucide-react';

const Header = ({ 
  activeTab, 
  setActiveTab, 
  cartCount = 0,
  // Placeholders for future features
  onSyncOdds = () => console.log("Sync triggered"),
  onReset = () => console.log("Reset triggered"),
  onSaveFile = () => console.log("Save triggered"),
  onLoadFile = () => console.log("Load triggered")
}) => {
  const fileInputRef = useRef(null);

  // Helper for Navigation Tabs
  const NavTab = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`relative h-full px-6 flex items-center gap-2 font-bold text-sm transition-all border-b-2 ${
        activeTab === id 
          ? 'text-white border-rose-500 bg-slate-800/50' 
          : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/30'
      }`}
    >
      <Icon size={18} className={activeTab === id ? "text-rose-400" : "text-slate-500"} />
      {label}
    </button>
  );

  // Helper for Tool Buttons
  const ToolButton = ({ onClick, icon: Icon, title, color = "text-slate-400 hover:text-white" }) => (
    <button 
      onClick={onClick}
      title={title}
      className={`p-3 rounded-xl transition-all bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-600 hover:scale-105 hover:shadow-lg ${color}`}
    >
      <Icon size={20} />
    </button>
  );

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-2xl shadow-black/20 flex flex-col">
      
      {/* --- TOP ROW: TOOLS & ACTIONS --- */}
      <div className="relative container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/20 border border-white/10">
            <span className="text-white font-black text-sm tracking-tighter">PR</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-white font-black leading-none tracking-tight text-lg">PLATINUM ROSE</h1>
            <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Week 17 • Live</span>
            </div>
          </div>
        </div>

        {/* CENTER: TOOLS (Visual Only for now) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden xl:flex items-center gap-4">
            
            {/* SYNC BUTTON */}
            <button 
              onClick={onSyncOdds}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-900/20 hover:scale-105 mr-2"
            >
              <RefreshCw size={18} /> <span className="tracking-wide">SYNC ODDS</span>
            </button>

            <div className="w-px h-8 bg-slate-800"></div>

            {/* ANALYTICS GROUP (Placeholders) */}
            <div className="flex items-center gap-2">
               <ToolButton onClick={() => alert("Splits Feature Coming Soon")} icon={Split} title="Betting Splits" color="text-indigo-400" />
               <ToolButton onClick={() => alert("Teasers Feature Coming Soon")} icon={List} title="Wong Teasers" color="text-purple-400" />
               <ToolButton onClick={() => alert("Pulse Feature Coming Soon")} icon={Activity} title="Market Pulse" color="text-rose-400" />
               <ToolButton onClick={() => alert("Contest Feature Coming Soon")} icon={Trophy} title="SuperContest" color="text-amber-400" />
            </div>

            <div className="w-px h-8 bg-slate-800"></div>

            {/* INPUT GROUP */}
            <div className="flex items-center gap-2">
               <ToolButton onClick={() => alert("Import Feature Coming Soon")} icon={FileText} title="Bulk Text Import" />
               <ToolButton onClick={() => alert("Audio Feature Coming Soon")} icon={Mic} title="Audio Analysis" />
            </div>
        </div>

        {/* RIGHT: FILE SYSTEM */}
        <div className="flex items-center gap-2 z-10">
            
            <button 
              onClick={onSaveFile} 
              title="Save Week File" 
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-lg font-bold text-xs transition-all"
            >
              <Save size={18} /> <span className="hidden lg:inline">SAVE</span>
            </button>
            
            <button 
              onClick={() => fileInputRef.current.click()} 
              title="Load Week File" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-lg font-bold text-xs transition-all"
            >
              <Download size={18} /> <span className="hidden lg:inline">LOAD</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={onLoadFile} accept=".json" className="hidden" />

            <div className="w-px h-8 bg-slate-800 mx-2"></div>

            <button 
              onClick={onReset} 
              className="p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors" 
              title="Reset All"
            >
              <Trash2 size={20} />
            </button>
        </div>
      </div>

      {/* --- BOTTOM ROW: NAVIGATION TABS --- */}
      <div className="bg-slate-950/50 border-t border-slate-800 h-12">
        <div className="container mx-auto px-4 h-full flex items-center justify-center gap-4 overflow-x-auto no-scrollbar">
          <NavTab id="dashboard" label="The Board" icon={BarChart2} />
          <NavTab id="mycard" label={`My Card (${cartCount})`} icon={Save} />
          {/* Future Tabs */}
          <NavTab id="devlab" label="AI Dev Lab" icon={Mic} />
          <NavTab id="standings" label="Expert Standings" icon={Upload} />
        </div>
      </div>

    </header>
  );
};

export default Header;