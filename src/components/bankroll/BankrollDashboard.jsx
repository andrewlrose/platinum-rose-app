// src/components/bankroll/BankrollDashboard.jsx
// Main bankroll management dashboard

import React, { useState, useEffect } from 'react';
import { 
    DollarSign, TrendingUp, TrendingDown, Target, Calculator, 
    Plus, Settings, Download, Upload, Calendar, BarChart3,
    Award, AlertTriangle, Clock, CheckCircle 
} from 'lucide-react';
import { 
    calculateAnalytics, 
    getBankrollData, 
    updateBankrollSettings, 
    BET_STATUS, 
    BET_TYPES,
    exportBankrollData,
    importBankrollData 
} from '../../lib/bankroll';

export default function BankrollDashboard({ onAddBet, onShowCalculator, onImportBets, onShowPending, onShowSettings }) {
    const [analytics, setAnalytics] = useState(null);
    const [timeframe, setTimeframe] = useState('all');
    const [loading, setLoading] = useState(true);
    const [bankrollData, setBankrollData] = useState(null);

    useEffect(() => {
        loadData();
    }, [timeframe]);

    const loadData = () => {
        setLoading(true);
        try {
            const data = getBankrollData();
            const analyticsData = calculateAnalytics(timeframe);
            setBankrollData(data);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Error loading bankroll data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const data = exportBankrollData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bankroll-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const formatPercent = (value) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    };

    if (loading || !analytics) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const { settings } = bankrollData;
    const profitColor = analytics.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400';
    const roiColor = analytics.roi >= 0 ? 'text-emerald-400' : 'text-red-400';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Bankroll Management</h1>
                    <p className="text-slate-400 mt-1">Track your betting performance and manage your bankroll</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Timeframe Filter */}
                    <select 
                        value={timeframe} 
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm"
                    >
                        <option value="all">All Time</option>
                        <option value="season">This Season</option>
                        <option value="month">Last 30 Days</option>
                        <option value="week">Last 7 Days</option>
                        <option value="today">Today</option>
                    </select>
                    
                    <button 
                        onClick={onShowCalculator}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white transition-colors"
                    >
                        <Calculator size={16} />
                        Calculator
                    </button>
                    
                    <button 
                        onClick={onImportBets}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                    >
                        <Upload size={16} />
                        Import Bets
                    </button>
                    
                    <button 
                        onClick={onShowPending}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-white transition-colors"
                    >
                        <Clock size={16} />
                        Pending Bets
                    </button>
                    
                    <button 
                        onClick={onAddBet}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white transition-colors"
                    >
                        <Plus size={16} />
                        Add Bet
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Current Bankroll */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Current Bankroll</p>
                            <p className="text-2xl font-bold text-white mt-1">{formatCurrency(analytics.currentBankroll)}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                Started: {formatCurrency(settings.totalBankroll)}
                            </p>
                        </div>
                        <div className={`p-3 rounded-full ${analytics.totalProfit >= 0 ? 'bg-emerald-900/20' : 'bg-red-900/20'}`}>
                            <DollarSign className={`w-6 h-6 ${profitColor}`} />
                        </div>
                    </div>
                </div>

                {/* Total P&L */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total P&L</p>
                            <p className={`text-2xl font-bold mt-1 ${profitColor}`}>
                                {formatCurrency(analytics.totalProfit)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {analytics.unitsWon > 0 ? '+' : ''}{analytics.unitsWon.toFixed(2)} units
                            </p>
                        </div>
                        <div className={`p-3 rounded-full ${analytics.totalProfit >= 0 ? 'bg-emerald-900/20' : 'bg-red-900/20'}`}>
                            {analytics.totalProfit >= 0 ? 
                                <TrendingUp className="w-6 h-6 text-emerald-400" /> :
                                <TrendingDown className="w-6 h-6 text-red-400" />
                            }
                        </div>
                    </div>
                </div>

                {/* Win Rate */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Win Rate</p>
                            <p className="text-2xl font-bold text-white mt-1">{analytics.winRate.toFixed(1)}%</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {analytics.wins}W - {analytics.losses}L - {analytics.pushes}P
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-900/20">
                            <Target className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* ROI */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">ROI</p>
                            <p className={`text-2xl font-bold mt-1 ${roiColor}`}>
                                {formatPercent(analytics.roi)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {formatCurrency(analytics.totalWagered)} wagered
                            </p>
                        </div>
                        <div className={`p-3 rounded-full ${analytics.roi >= 0 ? 'bg-emerald-900/20' : 'bg-red-900/20'}`}>
                            <BarChart3 className={`w-6 h-6 ${roiColor}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Form & Streaks */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400 text-sm">Recent Form (Last 10)</span>
                                <span className="text-white font-medium">{analytics.recentForm.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div 
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${analytics.recentForm}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="text-center">
                                <p className="text-slate-400 text-xs">Current Streak</p>
                                <p className={`text-lg font-bold ${analytics.currentStreak.type === 'win' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {analytics.currentStreak.count} {analytics.currentStreak.type === 'win' ? 'W' : 'L'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-slate-400 text-xs">Best Streak</p>
                                <p className="text-lg font-bold text-emerald-400">{analytics.longestWinStreak}W</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bet Type Breakdown */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Bet Types</h3>
                    <div className="space-y-3">
                        {Object.entries(analytics.betsByType).map(([type, data]) => {
                            const winRate = data.count > 0 ? (data.wins / data.count) * 100 : 0;
                            const profitColor = data.profit >= 0 ? 'text-emerald-400' : 'text-red-400';
                            
                            return (
                                <div key={type} className="flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-medium capitalize">{type}</p>
                                        <p className="text-xs text-slate-400">{data.count} bets • {winRate.toFixed(1)}%</p>
                                    </div>
                                    <p className={`font-bold ${profitColor}`}>
                                        {formatCurrency(data.profit)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Total Bets</span>
                            <span className="text-white font-medium">{analytics.totalBets}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Pending</span>
                            <span className="text-yellow-400 font-medium">{analytics.pendingBets}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Avg Bet Size</span>
                            <span className="text-white font-medium">{formatCurrency(analytics.avgWager)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Biggest Win</span>
                            <span className="text-emerald-400 font-medium">{formatCurrency(analytics.biggestWin)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Biggest Loss</span>
                            <span className="text-red-400 font-medium">{formatCurrency(analytics.biggestLoss)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
                <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white transition-colors"
                >
                    <Download size={16} />
                    Export Data
                </button>
                <button 
                    onClick={() => onShowSettings()}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white transition-colors"
                >
                    <Settings size={16} />
                    Settings
                </button>
            </div>
        </div>
    );
}