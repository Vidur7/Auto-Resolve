import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Star, BookOpen, TrendingUp, Save } from 'lucide-react';
import { Incident } from '../types/incident';

interface LearningFeedbackPanelProps {
  incident: Incident;
  onFeedbackSubmit: (feedback: any) => void;
}

export const LearningFeedbackPanel: React.FC<LearningFeedbackPanelProps> = ({ 
  incident, 
  onFeedbackSubmit 
}) => {
  const [feedback, setFeedback] = useState({
    helpful: incident.engineerFeedback === 'helpful',
    notHelpful: incident.engineerFeedback === 'not_helpful',
    rating: 0,
    comments: '',
    teachingExample: incident.isTeachingExample || false,
    improvementSuggestions: ''
  });

  const handleSubmit = () => {
    onFeedbackSubmit({
      incidentId: incident.id,
      ...feedback,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Learning Feedback</h2>
      </div>

      <div className="space-y-6">
        {/* Quick Feedback */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Was the AI summary and recommendations helpful?
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setFeedback(prev => ({ ...prev, helpful: true, notHelpful: false }))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                feedback.helpful 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful</span>
            </button>
            <button
              onClick={() => setFeedback(prev => ({ ...prev, helpful: false, notHelpful: true }))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                feedback.notHelpful 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>Not Helpful</span>
            </button>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Overall AI Performance Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                className={`p-1 transition-colors ${
                  star <= feedback.rating ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Teaching Example */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={feedback.teachingExample}
              onChange={(e) => setFeedback(prev => ({ ...prev, teachingExample: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">
                Mark as Teaching Example
              </span>
            </div>
          </label>
          <p className="text-xs text-slate-400 mt-1 ml-7">
            This incident will be used to improve AI training and help with similar future incidents
          </p>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Additional Comments
          </label>
          <textarea
            value={feedback.comments}
            onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="What worked well? What could be improved?"
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none"
            rows={3}
          />
        </div>

        {/* Improvement Suggestions */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Suggestions for AI Improvement
          </label>
          <textarea
            value={feedback.improvementSuggestions}
            onChange={(e) => setFeedback(prev => ({ ...prev, improvementSuggestions: e.target.value }))}
            placeholder="What additional context or recommendations would have been helpful?"
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
        >
          <Save className="w-4 h-4" />
          <span>Submit Feedback</span>
        </button>
      </div>
    </div>
  );
};