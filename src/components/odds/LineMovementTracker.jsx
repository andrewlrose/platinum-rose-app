// src/components/odds/LineMovementTracker.jsx
// Track and display historical line movements and alerts

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Bell, Activity, Target, 
  AlertTriangle, Clock, Filter, BarChart3
} from 'lucide-react';

export default function LineMovementTracker() {
  const [movements, setMovements] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('24h');

  useEffect(() => {
    generateMockLineMovements();
    generateMockAlerts();
  }, [timeframe]);

  const generateMockLineMovements = () => {
    // Mock line movement data - in real implementation, this would come from tracking historical odds
    const mockMovements = [
      {
        id: 1,
        game: 'KC @ BUF',
        type: 'spread',
        originalLine: -3,
        currentLine: -2.5,
        movement: +0.5,
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        book: 'DraftKings',
        volume: 'Heavy',
        significance: 'HIGH'
      },
      {
        id: 2,
        game: 'SF @ DAL',
        type: 'total',
        originalLine: 47.5,
        currentLine: 49,
        movement: +1.5,
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        book: 'FanDuel',
        volume: 'Medium',
        significance: 'MEDIUM'
      },
      {
        id: 3,
        game: 'BAL @ CIN',
        type: 'moneyline',
        originalLine: -150,
        currentLine: -130,
        movement: +20,
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        book: 'BetMGM',
        volume: 'Light',
        significance: 'LOW'
      },
      {
        id: 4,
        game: 'LAR @ SEA',
        type: 'spread',
        originalLine: -7,
        currentLine: -6,
        movement: +1,
        timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
        book: 'Caesars',
        volume: 'Heavy',
        significance: 'HIGH'
      },
      {
        id: 5,
        game: 'GB @ MIN',
        type: 'total',
        originalLine: 44,
        currentLine: 42.5,
        movement: -1.5,
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        book: 'DraftKings',
        volume: 'Medium',
        significance: 'MEDIUM'
      }
    ];

    setMovements(mockMovements);
  };

  const generateMockAlerts = () => {
    const mockAlerts = [
      {
        id: 1,
        type: 'favorable_movement',
        game: 'KC @ BUF',
        message: 'KC spread moved from -3 to -2.5 (favorable for KC bettors)',
        severity: 'success',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        actionable: true
      },
      {
        id: 2,
        type: 'reverse_movement',
        game: 'SF @ DAL',
        message: 'Total moved against your Under 47.5 bet (now 49)',
        severity: 'warning',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        actionable: false
      },
      {
        id: 3,
        type: 'steam_move',
        game: 'LAR @ SEA',
        message: 'STEAM ALERT: LAR spread getting heavy action (-7 to -6)',
        severity: 'info',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        actionable: true
      },
      {
        id: 4,
        type: 'arb_opportunity',
        game: 'BAL @ CIN',
        message: 'Potential arbitrage: CIN +150 at Bookmaker vs BAL -130 at BetMGM',
        severity: 'success',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        actionable: true
      }
    ];

    setAlerts(mockAlerts);
  };

  const formatMovement = (movement, type) => {
    if (type === 'moneyline') {
      return movement > 0 ? `+${movement}` : `${movement}`;
    }
    return movement > 0 ? `+${movement}` : `${movement}`;
  };

  const getMovementColor = (movement) => {
    return movement > 0 ? 'text-green-400' : 'text-red-400';
  };

  const getMovementIcon = (movement) => {
    return movement > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  const getSignificanceColor = (significance) => {
    switch(significance) {
      case 'HIGH': return 'text-red-400 bg-red-900/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/20';
      case 'LOW': return 'text-green-400 bg-green-900/20';
      default: return 'text-slate-400 bg-slate-700';
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'favorable_movement': return <TrendingUp className="text-green-400" size={16} />;
      case 'reverse_movement': return <TrendingDown className="text-red-400" size={16} />;
      case 'steam_move': return <Activity className="text-blue-400" size={16} />;
      case 'arb_opportunity': return <Target className="text-purple-400" size={16} />;
      default: return <Bell className="text-slate-400" size={16} />;
    }
  };

  const getAlertSeverityColor = (severity) => {
    switch(severity) {
      case 'success': return 'border-green-600 bg-green-900/20';
      case 'warning': return 'border-yellow-600 bg-yellow-900/20';
      case 'error': return 'border-red-600 bg-red-900/20';
      case 'info': return 'border-blue-600 bg-blue-900/20';
      default: return 'border-slate-600 bg-slate-800';
    }
  };

  const filteredMovements = movements.filter(movement => {
    if (filter === 'all') return true;
    if (filter === 'significant') return movement.significance === 'HIGH';
    if (filter === 'spread') return movement.type === 'spread';
    if (filter === 'total') return movement.type === 'total';
    if (filter === 'moneyline') return movement.type === 'moneyline';
    return true;
  });

  const timeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Line Movement Tracker</h2>
          <p className="text-slate-400 mt-1">Monitor line movements and betting alerts</p>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
            <span className="px-2 py-1 bg-yellow-600 text-black text-xs rounded-full">
              {alerts.length}
            </span>
          </div>
        </div>
        <div className="p-4">
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <div 
                  key={alert.id} 
                  className={`border rounded-lg p-4 ${getAlertSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">{alert.game}</span>
                        <span className="text-xs text-slate-400">{timeAgo(alert.timestamp)}</span>
                      </div>
                      <p className="text-sm text-slate-300">{alert.message}</p>
                      {alert.actionable && (
                        <button className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                          View Opportunity
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">No active alerts</p>
          )}
        </div>
      </div>

      {/* Line Movements */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className="text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Recent Line Movements</h3>
            </div>
            
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-900 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              <option value="all">All Movements</option>
              <option value="significant">Significant Only</option>
              <option value="spread">Spread</option>
              <option value="total">Total</option>
              <option value="moneyline">Moneyline</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          {filteredMovements.length > 0 ? (
            <div className="space-y-3">
              {filteredMovements.map(movement => (
                <div key={movement.id} className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{movement.game}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getSignificanceColor(movement.significance)}`}>
                            {movement.significance}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400 uppercase">{movement.type}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400">{movement.book}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400">{timeAgo(movement.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <span className="text-slate-400">{movement.originalLine}</span>
                          <span className="mx-2 text-slate-600">→</span>
                          <span className="text-white font-medium">{movement.currentLine}</span>
                        </div>
                        <div className={`flex items-center gap-1 font-bold ${getMovementColor(movement.movement)}`}>
                          {getMovementIcon(movement.movement)}
                          <span>{formatMovement(movement.movement, movement.type)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Volume: {movement.volume}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">No line movements found</p>
          )}
        </div>
      </div>

      {/* Movement Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-400" size={24} />
            <h4 className="text-white font-semibold">Favorable Moves</h4>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-2">12</div>
          <p className="text-sm text-slate-400">Lines moved in your favor today</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-blue-400" size={24} />
            <h4 className="text-white font-semibold">Steam Moves</h4>
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-2">5</div>
          <p className="text-sm text-slate-400">Sharp money movements detected</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-purple-400" size={24} />
            <h4 className="text-white font-semibold">Arb Opportunities</h4>
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-2">3</div>
          <p className="text-sm text-slate-400">Arbitrage chances found</p>
        </div>
      </div>
    </div>
  );
}