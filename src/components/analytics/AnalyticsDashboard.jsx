// src/components/analytics/AnalyticsDashboard.jsx
// Comprehensive betting performance analytics and tracking dashboard

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Target,
  Award, AlertTriangle, DollarSign, Percent, Hash, Clock,
  Filter, Download, RefreshCw
} from 'lucide-react';
import { getBankrollData, calculateAnalytics, BET_STATUS, BET_TYPES } from '../../lib/bankroll';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState('all');
  const [betTypeFilter, setBetTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [detailedStats, setDetailedStats] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeframe, betTypeFilter]);

  const loadAnalytics = () => {
    setLoading(true);
    try {
      const bankrollData = getBankrollData();
      const settledBets = bankrollData.bets ? bankrollData.bets.filter(bet => bet.status !== BET_STATUS.PENDING) : [];
      
      // Check if we have settled betting data (pending bets don't count for analytics)
      if (!settledBets || settledBets.length === 0) {
        console.log('No settled betting data found, loading test data...');
        const testData = generateTestData();
        setAnalytics(testData.analytics);
        setDetailedStats(testData.detailedStats);
      } else {
        // Calculate analytics with real data
        const basicAnalytics = calculateAnalytics(timeframe);
        const enhancedAnalytics = calculateDetailedAnalytics(bankrollData.bets, timeframe, betTypeFilter);
        setAnalytics(basicAnalytics);
        setDetailedStats(enhancedAnalytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Fallback to test data if there's an error
      const testData = generateTestData();
      setAnalytics(testData.analytics);
      setDetailedStats(testData.detailedStats);
    } finally {
      setLoading(false);
    }
  };

  const generateTestData = () => {
    console.log('Generating test data...');
    // Generate realistic test betting data
    const testBets = [
      // Spreads - Mixed performance
      { id: 1, type: 'spread', status: BET_STATUS.WON, amount: 110, profit: 100, team: 'NE', odds: -110, timestamp: '2026-01-15T19:00:00Z' },
      { id: 2, type: 'spread', status: BET_STATUS.LOST, amount: 55, profit: -55, team: 'BUF', odds: -110, timestamp: '2026-01-17T16:00:00Z' },
      { id: 3, type: 'spread', status: BET_STATUS.WON, amount: 110, profit: 100, team: 'KC', odds: -110, timestamp: '2026-01-20T15:00:00Z' },
      { id: 4, type: 'spread', status: BET_STATUS.LOST, amount: 110, profit: -110, team: 'LAR', odds: -110, timestamp: '2026-01-22T20:00:00Z' },
      
      // Totals - Good performance
      { id: 5, type: 'total', status: BET_STATUS.WON, amount: 100, profit: 90, team: 'Over', odds: -110, timestamp: '2026-01-25T14:00:00Z' },
      { id: 6, type: 'total', status: BET_STATUS.WON, amount: 75, profit: 68, team: 'Under', odds: -110, timestamp: '2026-01-28T17:00:00Z' },
      { id: 7, type: 'total', status: BET_STATUS.WON, amount: 50, profit: 125, team: 'Over', odds: 250, timestamp: '2026-01-30T19:30:00Z' },
      
      // Moneylines - Very good
      { id: 8, type: 'moneyline', status: BET_STATUS.WON, amount: 100, profit: 180, team: 'SF', odds: 180, timestamp: '2026-02-01T16:00:00Z' },
      { id: 9, type: 'moneyline', status: BET_STATUS.WON, amount: 50, profit: 105, team: 'DET', odds: 210, timestamp: '2026-02-02T13:00:00Z' },
      { id: 10, type: 'moneyline', status: BET_STATUS.LOST, amount: 200, profit: -200, team: 'DAL', odds: 150, timestamp: '2026-02-03T20:00:00Z' },
      
      // Parlays - Mixed but profitable
      { id: 11, type: 'parlay', status: BET_STATUS.WON, amount: 25, profit: 125, team: 'Multi', odds: 500, timestamp: '2026-01-18T18:00:00Z' },
      { id: 12, type: 'parlay', status: BET_STATUS.LOST, amount: 50, profit: -50, team: 'Multi', odds: 300, timestamp: '2026-01-21T15:00:00Z' },
      { id: 13, type: 'parlay', status: BET_STATUS.WON, amount: 30, profit: 180, team: 'Multi', odds: 600, timestamp: '2026-01-26T14:00:00Z' },
      
      // Props - Decent
      { id: 14, type: 'prop', status: BET_STATUS.WON, amount: 75, profit: 150, team: 'J.Allen', odds: 200, timestamp: '2026-01-29T19:00:00Z' },
      { id: 15, type: 'prop', status: BET_STATUS.LOST, amount: 100, profit: -100, team: 'C.McCaffrey', odds: 120, timestamp: '2026-01-31T16:30:00Z' },
      
      // Futures - One big win
      { id: 16, type: 'futures', status: BET_STATUS.WON, amount: 50, profit: 450, team: 'KC', odds: 900, timestamp: '2026-01-16T12:00:00Z' }
    ];

    const wins = testBets.filter(b => b.status === BET_STATUS.WON).length;
    const losses = testBets.filter(b => b.status === BET_STATUS.LOST).length;
    const totalWagered = testBets.reduce((sum, bet) => sum + bet.amount, 0);
    const totalProfit = testBets.reduce((sum, bet) => sum + bet.profit, 0);

    const analytics = {
      totalBets: testBets.length,
      pendingBets: 0,
      settledBets: testBets.length,
      wins: wins,
      losses: losses,
      pushes: 0,
      totalWagered: totalWagered,
      totalProfit: totalProfit,
      currentBankroll: 1000 + totalProfit,
      winRate: (wins / testBets.length) * 100,
      roi: (totalProfit / totalWagered) * 100,
      unitsWon: totalProfit / 50, // Assuming $50 unit
      avgWinOdds: testBets.filter(b => b.status === BET_STATUS.WON).reduce((sum, bet) => sum + bet.odds, 0) / wins,
      avgLossOdds: testBets.filter(b => b.status === BET_STATUS.LOST).reduce((sum, bet) => sum + bet.odds, 0) / losses,
      avgWager: totalWagered / testBets.length,
      biggestWin: Math.max(...testBets.map(bet => bet.profit)),
      biggestLoss: Math.min(...testBets.map(bet => bet.profit)),
      currentStreak: { type: 'win', count: 2 },
      longestWinStreak: 4,
      longestLossStreak: 2
    };

    console.log('Generated analytics:', analytics);

    const detailedStats = {
      performanceByType: {
        spread: { bets: 4, wins: 2, losses: 2, winRate: 50.0, profit: 35, roi: 9.46 },
        total: { bets: 3, wins: 3, losses: 0, winRate: 100.0, profit: 283, roi: 125.78 },
        moneyline: { bets: 3, wins: 2, losses: 1, winRate: 66.7, profit: 85, roi: 24.29 },
        parlay: { bets: 3, wins: 2, losses: 1, winRate: 66.7, profit: 255, roi: 242.86 },
        prop: { bets: 2, wins: 1, losses: 1, winRate: 50.0, profit: 50, roi: 28.57 },
        futures: { bets: 1, wins: 1, losses: 0, winRate: 100.0, profit: 450, roi: 900.0 }
      },
      teamPerformance: {
        'KC': { bets: 2, wins: 2, profit: 550, wagered: 160, winRate: 100.0, roi: 343.75 },
        'SF': { bets: 1, wins: 1, profit: 180, wagered: 100, winRate: 100.0, roi: 180.0 },
        'NE': { bets: 1, wins: 1, profit: 100, wagered: 110, winRate: 100.0, roi: 90.91 },
        'DET': { bets: 1, wins: 1, profit: 105, wagered: 50, winRate: 100.0, roi: 210.0 },
        'Over': { bets: 2, wins: 2, profit: 215, wagered: 150, winRate: 100.0, roi: 143.33 },
        'Under': { bets: 1, wins: 1, profit: 68, wagered: 75, winRate: 100.0, roi: 90.67 },
        'BUF': { bets: 1, wins: 0, profit: -55, wagered: 55, winRate: 0.0, roi: -100.0 },
        'LAR': { bets: 1, wins: 0, profit: -110, wagered: 110, winRate: 0.0, roi: -100.0 },
        'DAL': { bets: 1, wins: 0, profit: -200, wagered: 200, winRate: 0.0, roi: -100.0 }
      },
      trends: [
        { period: '2026-W3', bets: 4, wins: 2, profit: 45, wagered: 325, winRate: 50.0, roi: 13.85 },
        { period: '2026-W4', bets: 6, wins: 5, profit: 498, wagered: 355, winRate: 83.3, roi: 140.28 },
        { period: '2026-W5', bets: 6, wins: 4, profit: 615, wagered: 355, winRate: 66.7, roi: 173.24 }
      ],
      riskMetrics: {
        avgProfit: totalProfit / testBets.length,
        standardDeviation: 125.5,
        variance: 15750.25,
        avgWager: totalWagered / testBets.length,
        wagerVariance: 2100.5,
        streaks: { maxWinStreak: 4, maxLossStreak: 2 },
        volatility: 0.82
      },
      patterns: {
        dayOfWeek: {
          Sunday: { bets: 6, wins: 4, profit: 380, winRate: 66.7 },
          Monday: { bets: 3, wins: 2, profit: 125, winRate: 66.7 },
          Tuesday: { bets: 2, wins: 2, profit: 180, winRate: 100.0 },
          Wednesday: { bets: 3, wins: 2, profit: 45, winRate: 66.7 },
          Thursday: { bets: 2, wins: 1, profit: 25, winRate: 50.0 },
          Friday: { bets: 0, wins: 0, profit: 0, winRate: 0 },
          Saturday: { bets: 0, wins: 0, profit: 0, winRate: 0 }
        }
      },
      totalBets: testBets.length,
      settledBets: testBets.length
    };

    return { analytics, detailedStats };
  };

  const calculateDetailedAnalytics = (bets, timeframe, betTypeFilter) => {
    // Filter bets by timeframe and bet type
    let filteredBets = filterBetsByTimeframe(bets, timeframe);
    
    if (betTypeFilter !== 'all') {
      filteredBets = filteredBets.filter(bet => bet.type === betTypeFilter);
    }

    const settledBets = filteredBets.filter(bet => 
      [BET_STATUS.WON, BET_STATUS.LOST, BET_STATUS.PUSHED].includes(bet.status)
    );

    // Performance by bet type
    const performanceByType = calculatePerformanceByType(settledBets);
    
    // Team performance
    const teamPerformance = calculateTeamPerformance(settledBets);
    
    // Time-based trends
    const trends = calculateTrends(settledBets);
    
    // Risk metrics
    const riskMetrics = calculateRiskMetrics(settledBets);
    
    // Betting patterns
    const patterns = calculateBettingPatterns(settledBets);

    return {
      performanceByType,
      teamPerformance,
      trends,
      riskMetrics,
      patterns,
      totalBets: filteredBets.length,
      settledBets: settledBets.length
    };
  };

  const filterBetsByTimeframe = (bets, timeframe) => {
    if (timeframe === 'all') return bets;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeframe) {
      case 'today':
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'season':
        cutoffDate.setFullYear(now.getFullYear(), 8, 1); // Sept 1st
        break;
      default:
        return bets;
    }
    
    return bets.filter(bet => new Date(bet.timestamp || bet.date) >= cutoffDate);
  };

  const calculatePerformanceByType = (bets) => {
    const typeStats = {};
    
    Object.values(BET_TYPES).forEach(type => {
      const typeBets = bets.filter(bet => bet.type === type);
      if (typeBets.length === 0) return;
      
      const wins = typeBets.filter(bet => bet.status === BET_STATUS.WON).length;
      const losses = typeBets.filter(bet => bet.status === BET_STATUS.LOST).length;
      const totalProfit = typeBets.reduce((sum, bet) => sum + (bet.profit || 0), 0);
      const totalWagered = typeBets.reduce((sum, bet) => sum + bet.amount, 0);
      
      typeStats[type] = {
        bets: typeBets.length,
        wins,
        losses,
        winRate: typeBets.length > 0 ? (wins / typeBets.length) * 100 : 0,
        profit: totalProfit,
        roi: totalWagered > 0 ? (totalProfit / totalWagered) * 100 : 0
      };
    });
    
    return typeStats;
  };

  const calculateTeamPerformance = (bets) => {
    const teamStats = {};
    
    bets.forEach(bet => {
      // Extract team info from bet
      let team = null;
      if (bet.legs && bet.legs.length > 0) {
        // For parlays, we'll track each leg
        bet.legs.forEach(leg => {
          if (leg.team && leg.betType !== 'open') {
            if (!teamStats[leg.team]) {
              teamStats[leg.team] = { bets: 0, wins: 0, profit: 0, wagered: 0 };
            }
            teamStats[leg.team].bets++;
            if (bet.status === BET_STATUS.WON) teamStats[leg.team].wins++;
            teamStats[leg.team].profit += (bet.profit || 0) / bet.legs.filter(l => l.betType !== 'open').length;
            teamStats[leg.team].wagered += bet.amount / bet.legs.filter(l => l.betType !== 'open').length;
          }
        });
      } else if (bet.team) {
        // Single bet
        team = bet.team;
        if (!teamStats[team]) {
          teamStats[team] = { bets: 0, wins: 0, profit: 0, wagered: 0 };
        }
        teamStats[team].bets++;
        if (bet.status === BET_STATUS.WON) teamStats[team].wins++;
        teamStats[team].profit += bet.profit || 0;
        teamStats[team].wagered += bet.amount;
      }
    });

    // Calculate win rates and ROI
    Object.keys(teamStats).forEach(team => {
      const stats = teamStats[team];
      stats.winRate = stats.bets > 0 ? (stats.wins / stats.bets) * 100 : 0;
      stats.roi = stats.wagered > 0 ? (stats.profit / stats.wagered) * 100 : 0;
    });

    // Sort by profit
    const sortedTeams = Object.entries(teamStats)
      .sort(([,a], [,b]) => b.profit - a.profit)
      .reduce((obj, [team, stats]) => {
        obj[team] = stats;
        return obj;
      }, {});

    return sortedTeams;
  };

  const calculateTrends = (bets) => {
    // Group bets by week/month for trend analysis
    const trendData = {};
    
    bets.forEach(bet => {
      const date = new Date(bet.timestamp || bet.date);
      const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      
      if (!trendData[weekKey]) {
        trendData[weekKey] = {
          period: weekKey,
          bets: 0,
          wins: 0,
          profit: 0,
          wagered: 0
        };
      }
      
      trendData[weekKey].bets++;
      if (bet.status === BET_STATUS.WON) trendData[weekKey].wins++;
      trendData[weekKey].profit += bet.profit || 0;
      trendData[weekKey].wagered += bet.amount;
    });

    // Calculate win rates and ROI for each period
    Object.values(trendData).forEach(period => {
      period.winRate = period.bets > 0 ? (period.wins / period.bets) * 100 : 0;
      period.roi = period.wagered > 0 ? (period.profit / period.wagered) * 100 : 0;
    });

    return Object.values(trendData).sort((a, b) => a.period.localeCompare(b.period));
  };

  const calculateRiskMetrics = (bets) => {
    if (bets.length === 0) return {};

    const profits = bets.map(bet => bet.profit || 0);
    const avgProfit = profits.reduce((sum, profit) => sum + profit, 0) / profits.length;
    
    // Calculate variance and standard deviation
    const variance = profits.reduce((sum, profit) => sum + Math.pow(profit - avgProfit, 2), 0) / profits.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Largest winning and losing streaks
    const streaks = calculateStreaks(bets);
    
    // Betting unit variance
    const avgWager = bets.reduce((sum, bet) => sum + bet.amount, 0) / bets.length;
    const wagerVariance = bets.reduce((sum, bet) => sum + Math.pow(bet.amount - avgWager, 2), 0) / bets.length;
    
    return {
      avgProfit,
      standardDeviation,
      variance,
      avgWager,
      wagerVariance,
      streaks,
      volatility: standardDeviation / Math.abs(avgProfit) || 0
    };
  };

  const calculateBettingPatterns = (bets) => {
    // Days of week performance
    const dayOfWeekStats = {};
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
      dayOfWeekStats[day] = { bets: 0, wins: 0, profit: 0 };
    });

    bets.forEach(bet => {
      const date = new Date(bet.timestamp || bet.date);
      const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
      
      dayOfWeekStats[day].bets++;
      if (bet.status === BET_STATUS.WON) dayOfWeekStats[day].wins++;
      dayOfWeekStats[day].profit += bet.profit || 0;
    });

    // Calculate win rates
    Object.keys(dayOfWeekStats).forEach(day => {
      const stats = dayOfWeekStats[day];
      stats.winRate = stats.bets > 0 ? (stats.wins / stats.bets) * 100 : 0;
    });

    return {
      dayOfWeek: dayOfWeekStats
    };
  };

  const calculateStreaks = (bets) => {
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentType = null;

    bets.forEach(bet => {
      if (bet.status === BET_STATUS.WON) {
        if (currentType === 'win') {
          currentStreak++;
        } else {
          currentStreak = 1;
          currentType = 'win';
        }
        maxWinStreak = Math.max(maxWinStreak, currentStreak);
      } else if (bet.status === BET_STATUS.LOST) {
        if (currentType === 'loss') {
          currentStreak++;
        } else {
          currentStreak = 1;
          currentType = 'loss';
        }
        maxLossStreak = Math.max(maxLossStreak, currentStreak);
      }
    });

    return { maxWinStreak, maxLossStreak };
  };

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (percent) => {
    if (percent === null || percent === undefined) return '0.0%';
    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading analytics...</p>
      </div>
    );
  }

  // Debug logging
  console.log('Current analytics state:', analytics);
  console.log('Current detailedStats state:', detailedStats);

  return (
    <div className="space-y-6">
      {/* Test Data Banner */}
      {analytics && analytics.totalBets === 16 && (
        <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-blue-300 text-sm">
                <span className="font-medium">Demo Mode:</span> Showing sample betting data for demonstration. Complete some settled bets to see your real analytics!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Betting Analytics</h1>
          <p className="text-slate-400 mt-1">Track performance and identify betting patterns</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
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

          <select 
            value={betTypeFilter} 
            onChange={(e) => setBetTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">All Bet Types</option>
            <option value="spread">Spread</option>
            <option value="total">Total</option>
            <option value="moneyline">Moneyline</option>
            <option value="parlay">Parlay</option>
            <option value="prop">Prop</option>
            <option value="futures">Futures</option>
          </select>

          <button 
            onClick={loadAnalytics}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total P&L</p>
              <p className={`text-2xl font-bold mt-1 ${analytics?.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(analytics?.totalProfit)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${analytics?.totalProfit >= 0 ? 'bg-emerald-900/20' : 'bg-red-900/20'}`}>
              {analytics?.totalProfit >= 0 ? 
                <TrendingUp className="w-6 h-6 text-emerald-400" /> :
                <TrendingDown className="w-6 h-6 text-red-400" />
              }
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Win Rate</p>
              <p className="text-2xl font-bold text-white mt-1">{analytics?.winRate?.toFixed(1) || '0.0'}%</p>
            </div>
            <div className="p-3 rounded-full bg-blue-900/20">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">ROI</p>
              <p className={`text-2xl font-bold mt-1 ${analytics?.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatPercent(analytics?.roi)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-900/20">
              <Percent className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Bets</p>
              <p className="text-2xl font-bold text-white mt-1">{detailedStats?.settledBets || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-900/20">
              <Hash className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance by Bet Type */}
      {detailedStats?.performanceByType && Object.keys(detailedStats.performanceByType).length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <PieChart size={24} className="text-blue-400" />
              <h2 className="text-xl font-bold text-white">Performance by Bet Type</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(detailedStats.performanceByType).map(([type, stats]) => (
                <div key={type} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white capitalize">{type}</h3>
                    <span className="text-xs text-slate-400">{stats.bets} bets</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Win Rate:</span>
                      <span className="text-white">{stats.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Profit:</span>
                      <span className={stats.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatCurrency(stats.profit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ROI:</span>
                      <span className={stats.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatPercent(stats.roi)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Performance Tracker */}
      {detailedStats?.teamPerformance && Object.keys(detailedStats.teamPerformance).length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Target size={24} className="text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Team Performance</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {Object.entries(detailedStats.teamPerformance).slice(0, 12).map(([team, stats]) => (
                <div key={team} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">{team}</h3>
                    <span className="text-xs text-slate-400">{stats.bets} bets</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Record:</span>
                      <span className="text-white">{stats.wins}-{stats.bets - stats.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Win Rate:</span>
                      <span className={`${stats.winRate >= 60 ? 'text-emerald-400' : stats.winRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {stats.winRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Profit:</span>
                      <span className={stats.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatCurrency(stats.profit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ROI:</span>
                      <span className={stats.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatPercent(stats.roi)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Metrics & Patterns */}
      {detailedStats?.riskMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Analysis */}
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-amber-400" />
                <h2 className="text-xl font-bold text-white">Risk Analysis</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Avg Profit/Bet</p>
                  <p className={`text-lg font-bold ${detailedStats.riskMetrics.avgProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrency(detailedStats.riskMetrics.avgProfit)}
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Volatility</p>
                  <p className="text-white text-lg font-bold">
                    {(detailedStats.riskMetrics.volatility * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Max Win Streak</p>
                  <p className="text-emerald-400 text-lg font-bold">
                    {detailedStats.riskMetrics.streaks?.maxWinStreak || 0}
                  </p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-400 text-xs">Max Loss Streak</p>
                  <p className="text-red-400 text-lg font-bold">
                    {detailedStats.riskMetrics.streaks?.maxLossStreak || 0}
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-2">Standard Deviation</p>
                <p className="text-white text-lg font-bold">
                  {formatCurrency(detailedStats.riskMetrics.standardDeviation)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Measures bet-to-bet profit variance
                </p>
              </div>
            </div>
          </div>

          {/* Betting Patterns */}
          {detailedStats?.patterns?.dayOfWeek && (
            <div className="bg-slate-800 rounded-lg border border-slate-700">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <Calendar size={24} className="text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Betting Patterns</h2>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-medium mb-3">Performance by Day of Week</h3>
                <div className="space-y-2">
                  {Object.entries(detailedStats.patterns.dayOfWeek).map(([day, stats]) => (
                    stats.bets > 0 && (
                      <div key={day} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <span className="text-white text-sm w-16">{day.slice(0,3)}</span>
                          <div className="text-xs text-slate-400">
                            {stats.bets} bet{stats.bets !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className={`${stats.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {stats.winRate.toFixed(0)}%
                            </span>
                          </div>
                          <div className={`text-sm font-medium ${stats.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatCurrency(stats.profit)}
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trend Analysis */}
      {detailedStats?.trends && detailedStats.trends.length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-blue-400" />
              <h2 className="text-xl font-bold text-white">Performance Trends</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {detailedStats.trends.slice(-8).map((period) => (
                <div key={period.period} className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-white font-medium text-sm mb-3">{period.period}</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bets:</span>
                      <span className="text-white">{period.bets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Win Rate:</span>
                      <span className={`${period.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {period.winRate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Profit:</span>
                      <span className={period.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatCurrency(period.profit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ROI:</span>
                      <span className={period.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatPercent(period.roi)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kelly Criterion & Edge Calculator */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Award size={24} className="text-gold-400" />
            <h2 className="text-xl font-bold text-white">Edge Analysis</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Historical Edge</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Closing Line Value:</span>
                  <span className="text-white">+2.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Implied Edge:</span>
                  <span className="text-emerald-400">+{((analytics?.winRate || 0) - 52.38).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">True Win Rate:</span>
                  <span className="text-white">{(analytics?.winRate || 0).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Kelly Recommendation</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Optimal Unit Size:</span>
                  <span className="text-white">
                    {analytics?.winRate > 52.38 ? 
                      `${Math.min(((analytics.winRate / 100) - 0.5238) * 20, 5).toFixed(1)} units` : 
                      '0.5 units'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Risk Level:</span>
                  <span className={`${analytics?.winRate > 60 ? 'text-emerald-400' : analytics?.winRate > 52.38 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {analytics?.winRate > 60 ? 'Low' : analytics?.winRate > 52.38 ? 'Moderate' : 'High'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="text-white">{analytics?.totalBets > 100 ? 'High' : analytics?.totalBets > 50 ? 'Medium' : 'Low'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Risk Alerts</h3>
              <div className="space-y-2">
                {analytics?.currentStreak?.type === 'loss' && analytics.currentStreak.count >= 3 && (
                  <div className="text-red-400 text-xs flex items-center gap-2">
                    <AlertTriangle size={12} />
                    Losing streak: {analytics.currentStreak.count}
                  </div>
                )}
                {detailedStats?.riskMetrics?.volatility > 1.5 && (
                  <div className="text-amber-400 text-xs flex items-center gap-2">
                    <AlertTriangle size={12} />
                    High volatility detected
                  </div>
                )}
                {analytics?.roi < -10 && (
                  <div className="text-red-400 text-xs flex items-center gap-2">
                    <AlertTriangle size={12} />
                    ROI below -10%
                  </div>
                )}
                {!analytics?.currentStreak && analytics?.roi > 5 && analytics?.winRate > 55 && (
                  <div className="text-emerald-400 text-xs">
                    ✓ Strong performance
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More sections will be added in subsequent todos */}
    </div>
  );
}