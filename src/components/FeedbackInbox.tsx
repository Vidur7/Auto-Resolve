import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { EngineerFeedback } from '../types/incident';

interface FeedbackInboxProps {
  feedback: EngineerFeedback[];
  onUpdateFeedbackStatus: (feedbackId: string, status: EngineerFeedback['status']) => void;
}

export const FeedbackInbox: React.FC<FeedbackInboxProps> = ({ 
  feedback, 
  onUpdateFeedbackStatus 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = ['summary', 'sop', 'timeline', 'escalation'];
  const statuses = ['pending', 'reviewed', 'implemented'];

  const filteredFeedback = selectedCategory 
    ? feedback.filter(item => item.category === selectedCategory)
    : feedback;

  const getStatusColor = (status: EngineerFeedback['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/10';
      case 'reviewed': return 'text-blue-400 bg-blue-500/10';
      case 'implemented': return 'text-green-400 bg-green-500/10';
    }
  };

  const getStatusIcon = (status: EngineerFeedback['status']) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'reviewed': return Clock;
      case 'implemented': return CheckCircle;
    }
  };

  const getRatingColor = (rating: EngineerFeedback['rating']) => {
    return rating === 'helpful' ? 'text-green-400' : 'text-red-400';
  };

  const getRatingIcon = (rating: EngineerFeedback['rating']) => {
    return rating === 'helpful' ? ThumbsUp : ThumbsDown;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Feedback Inbox</h2>
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
          {feedback.filter(f => f.status === 'pending').length} pending
        </span>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectedCategory === null 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
              : 'bg-slate-700/50 text-slate-400 hover:text-white'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
              selectedCategory === category 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-slate-700/50 text-slate-400 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Feedback Items */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredFeedback.map(item => {
          const StatusIcon = getStatusIcon(item.status);
          const RatingIcon = getRatingIcon(item.rating);
          
          return (
            <div key={item.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getRatingColor(item.rating)} bg-current/10`}>
                    <RatingIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 text-sm font-medium">{item.incidentId}</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-300 text-xs capitalize">{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-400 text-xs">{item.engineerId}</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-400 text-xs">{item.timestamp}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="capitalize">{item.status}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                {item.comments}
              </p>

              {item.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onUpdateFeedbackStatus(item.id, 'reviewed')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    onClick={() => onUpdateFeedbackStatus(item.id, 'implemented')}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Mark Implemented
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredFeedback.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No feedback found</p>
            <p className="text-slate-500 text-sm">
              {selectedCategory ? `No feedback for ${selectedCategory} category` : 'Feedback will appear here as engineers provide input'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};