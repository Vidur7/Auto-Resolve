import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Clock, Brain, ThumbsUp, Target } from 'lucide-react';
import { PerformanceMetric } from '../types/incident';

interface PerformanceChartsProps {
  metrics: PerformanceMetric[];
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ metrics }) => {
  const latestMetric = metrics[metrics.length - 1];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-slate-300 text-sm mb-2">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name.includes('Time') ? 's' : entry.name.includes('Satisfaction') ? '/5' : '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Avg Context Time', 
            value: `${latestMetric.avgContextTime}s`, 
            change: metrics.length > 1 ? latestMetric.avgContextTime - metrics[metrics.length - 2].avgContextTime : 0,
            icon: Clock,
            color: 'blue'
          },
          { 
            label: 'AI Accuracy', 
            value: `${latestMetric.aiAccuracy}%`, 
            change: metrics.length > 1 ? latestMetric.aiAccuracy - metrics[metrics.length - 2].aiAccuracy : 0,
            icon: Brain,
            color: 'green'
          },
          { 
            label: 'Engineer Satisfaction', 
            value: `${latestMetric.engineerSatisfaction}/5`, 
            change: metrics.length > 1 ? latestMetric.engineerSatisfaction - metrics[metrics.length - 2].engineerSatisfaction : 0,
            icon: ThumbsUp,
            color: 'purple'
          },
          { 
            label: 'Avg Resolution Time', 
            value: `${latestMetric.avgResolutionTime}m`, 
            change: metrics.length > 1 ? latestMetric.avgResolutionTime - metrics[metrics.length - 2].avgResolutionTime : 0,
            icon: Target,
            color: 'orange'
          }
        ].map((metric, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                metric.color === 'blue' ? 'bg-blue-500/20' :
                metric.color === 'green' ? 'bg-green-500/20' :
                metric.color === 'purple' ? 'bg-purple-500/20' : 'bg-orange-500/20'
              }`}>
                <metric.icon className={`w-5 h-5 ${
                  metric.color === 'blue' ? 'text-blue-400' :
                  metric.color === 'green' ? 'text-green-400' :
                  metric.color === 'purple' ? 'text-purple-400' : 'text-orange-400'
                }`} />
              </div>
              <div className={`text-sm font-medium ${
                metric.change > 0 ? 'text-red-400' : metric.change < 0 ? 'text-green-400' : 'text-slate-400'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{metric.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Performance Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="aiAccuracy" 
                stroke="#10B981" 
                strokeWidth={2}
                name="AI Accuracy"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="engineerSatisfaction" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Engineer Satisfaction"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Response Time Metrics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="avgContextTime" 
                fill="#3B82F6" 
                name="Avg Context Time"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="avgResolutionTime" 
                fill="#F59E0B" 
                name="Avg Resolution Time"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};