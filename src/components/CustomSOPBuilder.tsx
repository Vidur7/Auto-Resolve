import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Save, Eye, TrendingUp } from 'lucide-react';
import { CustomSOP } from '../types/incident';

interface CustomSOPBuilderProps {
  sops: CustomSOP[];
  onCreateSOP: (sop: Omit<CustomSOP, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateSOP: (id: string, sop: Partial<CustomSOP>) => void;
  onDeleteSOP: (id: string) => void;
}

export const CustomSOPBuilder: React.FC<CustomSOPBuilderProps> = ({ 
  sops, 
  onCreateSOP, 
  onUpdateSOP, 
  onDeleteSOP 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSOP, setEditingSOP] = useState<string | null>(null);
  const [newSOP, setNewSOP] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    services: [] as string[],
    authorId: 'Current User',
    usageCount: 0,
    effectiveness: 0,
    status: 'draft' as const
  });

  const handleCreateSOP = () => {
    if (newSOP.title && newSOP.content) {
      onCreateSOP(newSOP);
      setNewSOP({
        title: '',
        content: '',
        tags: [],
        services: [],
        authorId: 'Current User',
        usageCount: 0,
        effectiveness: 0,
        status: 'draft'
      });
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: CustomSOP['status']) => {
    switch (status) {
      case 'draft': return 'text-yellow-400 bg-yellow-500/10';
      case 'published': return 'text-green-400 bg-green-500/10';
      case 'deprecated': return 'text-red-400 bg-red-500/10';
    }
  };

  const addTag = (tag: string) => {
    if (tag && !newSOP.tags.includes(tag)) {
      setNewSOP(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setNewSOP(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Custom SOP Builder</h2>
          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
            {sops.length} SOPs
          </span>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New SOP</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
          <h3 className="text-white font-medium mb-4">Create New SOP</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                type="text"
                value={newSOP.title}
                onChange={(e) => setNewSOP(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                placeholder="SOP Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Content (Markdown)</label>
              <textarea
                value={newSOP.content}
                onChange={(e) => setNewSOP(prev => ({ ...prev, content: e.target.value }))}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none"
                rows={8}
                placeholder="# SOP Title

## Quick Diagnosis
1. Step one
2. Step two

## Resolution Steps
1. Action one
2. Action two"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newSOP.tags.map(tag => (
                  <span key={tag} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs flex items-center space-x-1">
                    <span>{tag}</span>
                    <button onClick={() => removeTag(tag)} className="text-blue-400 hover:text-blue-300">×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                placeholder="Add tags (press Enter)"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCreateSOP}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save SOP</span>
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOP List */}
      <div className="space-y-4">
        {sops.map(sop => (
          <div key={sop.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-white font-medium">{sop.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(sop.status)}`}>
                    {sop.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {sop.tags.map(tag => (
                    <span key={tag} className="bg-slate-600/50 text-slate-300 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Used {sop.usageCount} times</span>
                  </div>
                  <span>•</span>
                  <span>Effectiveness: {sop.effectiveness}%</span>
                  <span>•</span>
                  <span>By {sop.authorId}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button className="p-2 hover:bg-slate-600/50 rounded transition-colors">
                  <Eye className="w-4 h-4 text-slate-400" />
                </button>
                <button 
                  onClick={() => setEditingSOP(sop.id)}
                  className="p-2 hover:bg-slate-600/50 rounded transition-colors"
                >
                  <Edit className="w-4 h-4 text-slate-400" />
                </button>
                <button 
                  onClick={() => onDeleteSOP(sop.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {sops.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No custom SOPs created</p>
            <p className="text-slate-500 text-sm">Create your first SOP to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};