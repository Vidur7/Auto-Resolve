import React, { useState } from 'react';
import { Search, BookOpen, Star, Clock, TrendingUp, Filter, Tag, ExternalLink } from 'lucide-react';
import { KnowledgeBaseEntry } from '../types/incident';

interface KnowledgeBasePanelProps {
  knowledgeBase: KnowledgeBaseEntry[];
  onSelectEntry: (entry: KnowledgeBaseEntry) => void;
}

export const KnowledgeBasePanel: React.FC<KnowledgeBasePanelProps> = ({ 
  knowledgeBase, 
  onSelectEntry 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(knowledgeBase.flatMap(entry => entry.tags)));

  const filteredEntries = knowledgeBase.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = selectedTag === null || entry.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return 'text-green-400 bg-green-500/10';
    if (effectiveness >= 75) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Knowledge Base</h2>
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
          {knowledgeBase.length} entries
        </span>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedTag === null 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-slate-700/50 text-slate-400 hover:text-white'
            }`}
          >
            All Tags
          </button>
          {allTags.slice(0, 8).map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTag === tag 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Base Entries */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredEntries.map(entry => (
          <div
            key={entry.id}
            onClick={() => onSelectEntry(entry)}
            className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer border border-slate-600/30 hover:border-slate-500/50"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white font-medium text-sm leading-tight">{entry.title}</h3>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getEffectivenessColor(entry.effectiveness)}`}>
                  {entry.effectiveness}%
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            <p className="text-slate-300 text-xs mb-3 line-clamp-2">{entry.rootCause}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {entry.tags.slice(0, 4).map(tag => (
                <span key={tag} className="bg-slate-600/50 text-slate-300 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
              {entry.tags.length > 4 && (
                <span className="text-slate-400 text-xs">+{entry.tags.length - 4} more</span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Used {entry.usageCount} times</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{entry.lastUsed}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No knowledge base entries found</p>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};