import React from 'react';
import { Clock, User, Brain, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { IncidentTimelineEvent } from '../types/incident';

interface IncidentTimelineViewerProps {
  timeline: IncidentTimelineEvent[];
  incidentId: string;
}

export const IncidentTimelineViewer: React.FC<IncidentTimelineViewerProps> = ({ 
  timeline, 
  incidentId 
}) => {
  const getEventIcon = (type: IncidentTimelineEvent['type']) => {
    switch (type) {
      case 'detection': return AlertTriangle;
      case 'ai_analysis': return Brain;
      case 'human_action': return User;
      case 'escalation': return Zap;
      case 'resolution': return CheckCircle;
      default: return Clock;
    }
  };

  const getEventColor = (type: IncidentTimelineEvent['type']) => {
    switch (type) {
      case 'detection': return 'text-red-400 bg-red-500/10';
      case 'ai_analysis': return 'text-blue-400 bg-blue-500/10';
      case 'human_action': return 'text-green-400 bg-green-500/10';
      case 'escalation': return 'text-yellow-400 bg-yellow-500/10';
      case 'resolution': return 'text-emerald-400 bg-emerald-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getActorDisplay = (actor: string) => {
    if (actor === 'system') return 'System';
    if (actor === 'ai') return 'AI Agent';
    return actor;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Incident Timeline</h2>
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
          {timeline.length} events
        </span>
      </div>

      <div className="space-y-4">
        {timeline.map((event, index) => {
          const Icon = getEventIcon(event.type);
          const isLast = index === timeline.length - 1;

          return (
            <div key={event.id} className="relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-600/50"></div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getEventColor(event.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium text-sm capitalize">
                        {event.type.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400 text-xs">
                        by {getActorDisplay(event.actor)}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {event.timestamp}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {event.description}
                  </p>

                  {event.metadata && (
                    <div className="mt-2 p-2 bg-slate-700/30 rounded text-xs text-slate-400">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {timeline.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No timeline events recorded</p>
            <p className="text-slate-500 text-sm">Events will appear here as the incident progresses</p>
          </div>
        )}
      </div>
    </div>
  );
};