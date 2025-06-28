import React from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, AlertTriangle } from 'lucide-react';
import { RootCauseAnalytics } from '../types/incident';

interface RootCauseHeatmapProps {
  analytics: RootCauseAnalytics[];
}

export const RootCauseHeatmap: React.FC<RootCauseHeatmapProps> = ({ analytics }) => {
  const maxCount = Math.max(...analytics.map(item => item.count));
  
  const getTrendIcon = (trend: RootCauseAnalytics['trend']) => {
    switch (trend) {
      case 'increasing': return TrendingUp;
      case 'decreasing': return TrendingDown;
      case 'stable': return Minus;
    }
  };

  const getTrendColor = (trend: RootCauseAnalytics['trend']) => {
    switch (trend) {
      case 'increasing': return 'text-red-400';
      case 'decreasing': return 'text-green-400';
      case 'stable': return 'text-slate-400';
    }
  };

  const getIntensityColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.8) return 'bg-red-500/80';
    if (intensity > 0.6) return 'bg-red-500/60';
    if (intensity > 0.4) return 'bg-orange-500/60';
    if (intensity > 0.2) return 'bg-yellow-500/60';
    return 'bg-green-500/40';
  };

  const sortedAnalytics = [...analytics].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-orange-400" />
        <h2 className="text-xl font-bold text-white">Root Cause Analysis</h2>
        <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-medium">
          Last 30 days
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {sortedAnalytics.map(item => {
          const TrendIcon = getTrendIcon(item.trend);
          
          return (
            <div 
              key={item.category}
              className={`p-4 rounded-lg border border-slate-600/30 ${getIntensityColor(item.count)} backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium text-sm">{item.category}</h3>
                <div className={`flex items-center space-x-1 ${getTrendColor(item.trend)}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-xs font-medium capitalize">{item.trend}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-xs">Incidents</span>
                  <span className="text-white font-bold text-lg">{item.count}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-xs">Avg Resolution</span>
                  <span className="text-slate-200 text-sm font-medium">{item.avgResolutionTime}m</span>
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Last: {item.lastOccurrence}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {analytics.reduce((sum, item) => sum + item.count, 0)}
          </div>
          <div className="text-sm text-slate-400">Total Incidents</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(analytics.reduce((sum, item) => sum + item.avgResolutionTime, 0) / analytics.length)}m
          </div>
          <div className="text-sm text-slate-400">Avg Resolution Time</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {analytics.filter(item => item.trend === 'decreasing').length}
          </div>
          <div className="text-sm text-slate-400">Improving Categories</div>
        </div>
      </div>
    </div>
  );
};