import React from 'react';
import { User, Bell, Zap, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Incident } from '../types/incident';

interface OnCallCompanionPanelProps {
  engineer: {
    name: string;
    id: string;
    avatar?: string;
    shift: string;
    services: string[];
  };
  activeIncidents: Incident[];
  onTakeOver: (incidentId: string) => void;
  onEscalate: (incidentId: string) => void;
  onAddContext: (incidentId: string) => void;
}

export const OnCallCompanionPanel: React.FC<OnCallCompanionPanelProps> = ({ 
  engineer, 
  activeIncidents,
  onTakeOver,
  onEscalate,
  onAddContext
}) => {
  const myIncidents = activeIncidents.filter(inc => 
    inc.assignedEngineer === engineer.name || 
    inc.affectedSystems.some(system => engineer.services.includes(system))
  );

  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  const getEscalationRiskColor = (risk: Incident['escalationRisk']) => {
    switch (risk) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      {/* Engineer Info */}
      <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-slate-700/50">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{engineer.name}</h2>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{engineer.shift}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bell className="w-3 h-3" />
              <span>{myIncidents.length} active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm text-green-400 font-medium">On Call</span>
        </div>
      </div>

      {/* My Services */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">My Services</h3>
        <div className="flex flex-wrap gap-2">
          {engineer.services.map(service => (
            <span key={service} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Active Incidents */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          My Active Incidents ({myIncidents.length})
        </h3>
        
        <div className="space-y-3">
          {myIncidents.map(incident => (
            <div key={incident.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-blue-400 font-medium text-sm">{incident.id}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                    {incident.escalationRisk && (
                      <div className={`flex items-center space-x-1 ${getEscalationRiskColor(incident.escalationRisk)}`}>
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs font-medium capitalize">{incident.escalationRisk} risk</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-white font-medium text-sm mb-2">{incident.title}</h4>
                  
                  {incident.aiSummary && (
                    <p className="text-slate-300 text-xs mb-3 line-clamp-2">{incident.aiSummary}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span>{incident.timeDetected}</span>
                    {incident.estimatedResolutionTime && (
                      <>
                        <span>•</span>
                        <span>Est. {incident.estimatedResolutionTime}m</span>
                      </>
                    )}
                    {incident.contextGathered && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1 text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          <span>AI Ready</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onTakeOver(incident.id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>Take Over</span>
                </button>
                <button
                  onClick={() => onEscalate(incident.id)}
                  className="border border-yellow-600 text-yellow-400 hover:bg-yellow-600/10 px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Escalate</span>
                </button>
                <button
                  onClick={() => onAddContext(incident.id)}
                  className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Add Context</span>
                </button>
              </div>
            </div>
          ))}

          {myIncidents.length === 0 && (
            <div className="text-center py-6">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No active incidents</p>
              <p className="text-slate-500 text-xs">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors text-sm">
            View Runbooks
          </button>
          <button className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors text-sm">
            Check Alerts
          </button>
          <button className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors text-sm">
            Team Chat
          </button>
          <button className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors text-sm">
            Escalation Path
          </button>
        </div>
      </div>
    </div>
  );
};