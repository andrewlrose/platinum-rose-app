// src/components/odds/OddsCenter.jsx
// Main container for all live odds and line shopping features

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Activity } from 'lucide-react';
import LiveOddsDashboard from './LiveOddsDashboard';
import LineMovementTracker from './LineMovementTracker';

export default function OddsCenter() {
  const [activeTab, setActiveTab] = useState('live-odds');

  const tabs = [
    {
      id: 'live-odds',
      label: 'Live Odds',
      icon: BarChart3,
      description: 'Real-time odds comparison'
    },
    {
      id: 'line-movements',
      label: 'Line Movements',
      icon: TrendingUp,
      description: 'Track line changes and alerts'
    },
    {
      id: 'arbitrage',
      label: 'Arbitrage',
      icon: Target,
      description: 'Find guaranteed profit opportunities',
      badge: '3'
    },
    {
      id: 'steam-moves',
      label: 'Steam Moves',
      icon: Activity,
      description: 'Sharp money movements',
      badge: '5'
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'live-odds':
        return <LiveOddsDashboard />;
      case 'line-movements':
        return <LineMovementTracker />;
      case 'arbitrage':
        return <ArbitrageFinder />;
      case 'steam-moves':
        return <SteamMoveTracker />;
      default:
        return <LiveOddsDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 min-w-fit relative ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon size={20} />
                <div className="text-left">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}

// Placeholder components for future features
function ArbitrageFinder() {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
      <div className="text-center">
        <Target size={48} className="text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Arbitrage Finder</h3>
        <p className="text-slate-400 mb-6">Find guaranteed profit opportunities across multiple sportsbooks</p>
        <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
          <p className="text-purple-300 text-sm">
            🎯 <strong>Coming Soon:</strong> Automated arbitrage detection across 10+ sportsbooks with real-time profit calculations and alert notifications.
          </p>
        </div>
      </div>
    </div>
  );
}

function SteamMoveTracker() {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
      <div className="text-center">
        <Activity size={48} className="text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Steam Move Tracker</h3>
        <p className="text-slate-400 mb-6">Follow sharp money movements and professional betting patterns</p>
        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            ⚡ <strong>Coming Soon:</strong> Real-time detection of coordinated betting across multiple books, reverse line movement alerts, and sharp money indicators.
          </p>
        </div>
      </div>
    </div>
  );
}