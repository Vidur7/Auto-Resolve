import React from 'react';
import { Brain, Database, Search, Lightbulb, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { AIAction } from '../types/incident';

interface AIActionsTimelineProps {
  actions: AIAction[];
  incidentId?: string;
}

export const AIActionsTimeline: React.FC<AIActionsTimelineProps> = ({ 
  actions, 
  incidentId 
}) => {
  const filteredActions = incidentId 
    ? actions.filter(action => action.incidentId === incidentId)
    : actions;

  const getActionIcon = (type: AIAction['type']) => {
    switch (type) {
      case 'context_gathering': return Database;
      case 'similarity_search': return Search;
      case 'hypothesis_generation': return Brain;
      case 'sop_recommendation': return Lightbulb;
      case 'escalation': return AlertTriangle;
      default: return Brain;
    }
  };

  const getActionColor = (type: AIAction['type']) => {
    switch (type) {
      case 'context_gathering': return 'text-blue-400 bg-blue-500/10';
      case 'similarity_search': return 'text-purple-400 bg-purple-500/10';
      case 'hypothesis_generation': return 'text-green-400 bg-green-500/10';
      case 'sop_recommendation': return 'text-yellow-400 bg-yellow-500/10';
      case 'escalation': return 'text-red-400 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-bold text-white">AI Actions Timeline</h2>
        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
          {filteredActions.length} actions
        </span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActions.map((action, index) => {
          const Icon = getActionIcon(action.type);
          const isLast = index === filteredActions.length - 1;

          return (
            <div key={action.id} className="relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-600/50"></div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getActionColor(action.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium text-sm">{action.description}</h3>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`text-xs font-medium ${getConfidenceColor(action.confidence)}`}>
                        {action.confidence}%
                      </span>
                      <span className="text-xs text-slate-400">{action.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="capitalize">{action.type.replace('_', ' ')}</span>
                    {action.dataSource && (
                      <>
                        <span>•</span>
                        <span>{action.dataSource}</span>
                      </>
                    )}
                    {action.incidentId && !incidentId && (
                      <>
                        <span>•</span>
                        <span className="text-blue-400">{action.incidentId}</span>
                      </>
                    )}
                  </div>

                  {action.result && Array.isArray(action.result) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {action.result.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs">
                          {item}
                        </span>
                      ))}
                      {action.result.length > 3 && (
                        <span className="text-slate-400 text-xs">+{action.result.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredActions.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No AI actions recorded</p>
            <p className="text-slate-500 text-sm">Actions will appear here as the AI processes incidents</p>
          </div>
        )}
      </div>
    </div>
  );
};