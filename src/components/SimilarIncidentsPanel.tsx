import React from 'react';
import { Search, Clock, CheckCircle, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Incident } from '../types/incident';

interface SimilarIncidentsPanelProps {
  currentIncident: Incident;
  similarIncidents: Incident[];
  onMarkSimilar: (incidentId: string, isSimilar: boolean) => void;
}

export const SimilarIncidentsPanel: React.FC<SimilarIncidentsPanelProps> = ({ 
  currentIncident, 
  similarIncidents,
  onMarkSimilar 
}) => {
  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  const calculateSimilarityScore = (incident: Incident) => {
    const tagOverlap = incident.tags.filter(tag => currentIncident.tags.includes(tag)).length;
    const systemOverlap = incident.affectedSystems.filter(system => 
      currentIncident.affectedSystems.includes(system)
    ).length;
    
    const tagScore = (tagOverlap / Math.max(incident.tags.length, currentIncident.tags.length)) * 60;
    const systemScore = (systemOverlap / Math.max(incident.affectedSystems.length, currentIncident.affectedSystems.length)) * 40;
    
    return Math.round(tagScore + systemScore);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Search className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Similar Incidents</h2>
        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-medium">
          {similarIncidents.length} found
        </span>
      </div>

      <div className="space-y-4">
        {similarIncidents.map(incident => {
          const similarityScore = calculateSimilarityScore(incident);
          
          return (
            <div key={incident.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
                      {incident.id}
                    </button>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="w-16 bg-slate-600 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full"
                          style={{ width: `${similarityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400">{similarityScore}% match</span>
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-2">{incident.title}</h3>
                  
                  {/* Common tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {incident.tags.filter(tag => currentIncident.tags.includes(tag)).map(tag => (
                      <span key={tag} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 ml-3" />
              </div>

              {/* Resolution info */}
              {incident.status === 'resolved' && incident.resolutionSteps && (
                <div className="mb-3 p-3 bg-slate-600/30 rounded">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Resolved</span>
                    {incident.timeResolved && (
                      <span className="text-slate-400 text-xs">• {incident.timeResolved}</span>
                    )}
                  </div>
                  <div className="text-slate-300 text-xs">
                    <strong>Root Cause:</strong> {incident.rootCause}
                  </div>
                  <div className="text-slate-300 text-xs mt-1">
                    <strong>Resolution:</strong> {incident.resolutionSteps[0]}
                    {incident.resolutionSteps.length > 1 && (
                      <span className="text-slate-400"> +{incident.resolutionSteps.length - 1} more steps</span>
                    )}
                  </div>
                </div>
              )}

              {/* Similarity feedback */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{incident.timeDetected}</span>
                  </div>
                  <span>•</span>
                  <span>{incident.assignedEngineer || 'Unassigned'}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Similar?</span>
                  <button
                    onClick={() => onMarkSimilar(incident.id, true)}
                    className="p-1 hover:bg-green-500/20 rounded transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3 text-slate-400 hover:text-green-400" />
                  </button>
                  <button
                    onClick={() => onMarkSimilar(incident.id, false)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <ThumbsDown className="w-3 h-3 text-slate-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {similarIncidents.length === 0 && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No similar incidents found</p>
            <p className="text-slate-500 text-sm">The AI will learn from this incident for future matching</p>
          </div>
        )}
      </div>
    </div>
  );
};