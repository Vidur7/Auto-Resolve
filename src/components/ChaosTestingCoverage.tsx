import React from 'react';
import { Beaker, AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';
import { ChaosTestCoverage } from '../types/incident';

interface ChaosTestingCoverageProps {
  coverage: ChaosTestCoverage[];
}

export const ChaosTestingCoverage: React.FC<ChaosTestingCoverageProps> = ({ coverage }) => {
  const getRiskColor = (risk: ChaosTestCoverage['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
  };

  const getRiskIcon = (risk: ChaosTestCoverage['riskLevel']) => {
    switch (risk) {
      case 'low': return CheckCircle;
      case 'medium': return Clock;
      case 'high': return AlertTriangle;
    }
  };

  const getTestCoverageScore = (service: ChaosTestCoverage) => {
    if (service.testTypes.length === 0) return 0;
    if (service.testTypes.length >= 3) return 100;
    if (service.testTypes.length >= 2) return 75;
    return 50;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Beaker className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Chaos Testing Coverage</h2>
        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-medium">
          {coverage.length} services
        </span>
      </div>

      {/* Coverage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {coverage.map(service => {
          const RiskIcon = getRiskIcon(service.riskLevel);
          const coverageScore = getTestCoverageScore(service);
          
          return (
            <div key={service.service} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium text-sm">{service.service}</h3>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded border text-xs font-medium ${getRiskColor(service.riskLevel)}`}>
                  <RiskIcon className="w-3 h-3" />
                  <span className="capitalize">{service.riskLevel} Risk</span>
                </div>
              </div>

              {/* Coverage Score */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-xs">Test Coverage</span>
                  <span className="text-slate-300 text-xs font-medium">{coverageScore}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      coverageScore >= 75 ? 'bg-green-500' : 
                      coverageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${coverageScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Test Types */}
              <div className="mb-3">
                <span className="text-slate-400 text-xs block mb-2">Active Tests</span>
                {service.testTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {service.testTypes.map(test => (
                      <span key={test} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                        {test}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs">No tests configured</span>
                )}
              </div>

              {/* Last Test */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Last test: {service.lastTestDate}</span>
                </div>
              </div>

              {/* Recommendations */}
              {service.recommendations.length > 0 && (
                <div>
                  <span className="text-slate-400 text-xs block mb-2">Recommendations</span>
                  <div className="space-y-1">
                    {service.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Target className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-xs">{rec}</span>
                      </div>
                    ))}
                    {service.recommendations.length > 2 && (
                      <span className="text-slate-400 text-xs">+{service.recommendations.length - 2} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {coverage.filter(s => s.riskLevel === 'low').length}
          </div>
          <div className="text-sm text-green-400">Low Risk</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {coverage.filter(s => s.riskLevel === 'medium').length}
          </div>
          <div className="text-sm text-yellow-400">Medium Risk</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {coverage.filter(s => s.riskLevel === 'high').length}
          </div>
          <div className="text-sm text-red-400">High Risk</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {Math.round(coverage.reduce((sum, s) => sum + getTestCoverageScore(s), 0) / coverage.length)}%
          </div>
          <div className="text-sm text-slate-400">Avg Coverage</div>
        </div>
      </div>
    </div>
  );
};