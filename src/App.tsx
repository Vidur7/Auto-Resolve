import React, { useState, useEffect } from 'react';
import { Shield, Zap, Brain, Clock, AlertTriangle, CheckCircle, Activity, Database, GitBranch, Users, BarChart3, Settings, Bell, Search, Filter, Download, ExternalLink, ChevronRight, Star, ArrowRight, Webhook, MessageSquare, FileText, ThumbsUp, ThumbsDown, Play, Pause, RotateCcw, Cpu, Network, Server, Code, Slack, Send, Eye, Target, Beaker, Lightbulb, BookOpen, TrendingUp, Plus, RefreshCw, Baseline as Timeline, Layers, UserCheck } from 'lucide-react';

import { 
  Incident, 
  KnowledgeBaseEntry, 
  AIAction, 
  PerformanceMetric,
  RootCauseAnalytics,
  ChaosTestCoverage,
  EngineerFeedback,
  CustomSOP
} from './types/incident';

import { 
  mockIncidents, 
  mockKnowledgeBase, 
  mockAIActions, 
  mockPerformanceMetrics,
  mockRootCauseAnalytics,
  mockChaosTestCoverage,
  mockEngineerFeedback,
  mockCustomSOPs
} from './data/mockData';

import { KnowledgeBasePanel } from './components/KnowledgeBasePanel';
import { AIActionsTimeline } from './components/AIActionsTimeline';
import { PerformanceCharts } from './components/PerformanceCharts';
import { LearningFeedbackPanel } from './components/LearningFeedbackPanel';
import { IncidentTimelineViewer } from './components/IncidentTimelineViewer';
import { SimilarIncidentsPanel } from './components/SimilarIncidentsPanel';
import { RootCauseHeatmap } from './components/RootCauseHeatmap';
import { FeedbackInbox } from './components/FeedbackInbox';
import { ChaosTestingCoverage } from './components/ChaosTestingCoverage';
import { CustomSOPBuilder } from './components/CustomSOPBuilder';
import { OnCallCompanionPanel } from './components/OnCallCompanionPanel';

const integrationSources = [
  { name: 'ServiceNow', status: 'connected', lastSync: '2 min ago', icon: Database },
  { name: 'PagerDuty', status: 'connected', lastSync: '1 min ago', icon: Bell },
  { name: 'Opsgenie', status: 'connected', lastSync: '3 min ago', icon: AlertTriangle },
  { name: 'Jira', status: 'connected', lastSync: '5 min ago', icon: FileText },
  { name: 'Datadog', status: 'connected', lastSync: '30 sec ago', icon: BarChart3 },
  { name: 'CloudWatch', status: 'connected', lastSync: '1 min ago', icon: Activity },
  { name: 'GitHub', status: 'connected', lastSync: '2 min ago', icon: GitBranch },
  { name: 'Slack', status: 'connected', lastSync: 'real-time', icon: MessageSquare }
];

const currentEngineer = {
  name: 'Sarah Chen',
  id: 'sarah.chen',
  shift: 'Night Shift (8PM - 8AM)',
  services: ['Payment Gateway', 'User Authentication', 'Order Processing']
};

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'incident-detail' | 'knowledge-base'>('landing');
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseEntry[]>(mockKnowledgeBase);
  const [aiActions, setAIActions] = useState<AIAction[]>(mockAIActions);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>(mockPerformanceMetrics);
  const [rootCauseAnalytics, setRootCauseAnalytics] = useState<RootCauseAnalytics[]>(mockRootCauseAnalytics);
  const [chaosTestCoverage, setChaosTestCoverage] = useState<ChaosTestCoverage[]>(mockChaosTestCoverage);
  const [engineerFeedback, setEngineerFeedback] = useState<EngineerFeedback[]>(mockEngineerFeedback);
  const [customSOPs, setCustomSOPs] = useState<CustomSOP[]>(mockCustomSOPs);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedKBEntry, setSelectedKBEntry] = useState<KnowledgeBaseEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'integrations' | 'chaos' | 'knowledge-base' | 'learning' | 'analytics' | 'sop-builder' | 'on-call'>('overview');

  const severityColors = {
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    low: 'text-green-400 bg-green-500/10 border-green-500/20'
  };

  const statusColors = {
    active: 'text-red-400 bg-red-500/10',
    investigating: 'text-yellow-400 bg-yellow-500/10',
    resolved: 'text-green-400 bg-green-500/10',
    escalated: 'text-purple-400 bg-purple-500/10'
  };

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
    
    const updatedIncidents = incidents.map(inc => 
      inc.id === feedback.incidentId 
        ? { 
            ...inc, 
            engineerFeedback: feedback.helpful ? 'helpful' : 'not_helpful',
            isTeachingExample: feedback.teachingExample,
            learningNotes: feedback.comments
          }
        : inc
    );
    setIncidents(updatedIncidents);
    
    if (selectedIncident && selectedIncident.id === feedback.incidentId) {
      setSelectedIncident({
        ...selectedIncident,
        engineerFeedback: feedback.helpful ? 'helpful' : 'not_helpful',
        isTeachingExample: feedback.teachingExample,
        learningNotes: feedback.comments
      });
    }
  };

  const handleMarkSimilar = (incidentId: string, isSimilar: boolean) => {
    console.log(`Marked incident ${incidentId} as ${isSimilar ? 'similar' : 'not similar'}`);
    // In a real app, this would update the similarity learning model
  };

  const handleUpdateFeedbackStatus = (feedbackId: string, status: EngineerFeedback['status']) => {
    setEngineerFeedback(prev => 
      prev.map(fb => fb.id === feedbackId ? { ...fb, status } : fb)
    );
  };

  const handleCreateSOP = (sop: Omit<CustomSOP, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSOP: CustomSOP = {
      ...sop,
      id: `SOP-${Date.now()}`,
      createdAt: 'Just now',
      updatedAt: 'Just now'
    };
    setCustomSOPs(prev => [newSOP, ...prev]);
  };

  const handleUpdateSOP = (id: string, updates: Partial<CustomSOP>) => {
    setCustomSOPs(prev => 
      prev.map(sop => sop.id === id ? { ...sop, ...updates, updatedAt: 'Just now' } : sop)
    );
  };

  const handleDeleteSOP = (id: string) => {
    setCustomSOPs(prev => prev.filter(sop => sop.id !== id));
  };

  const handleTakeOver = (incidentId: string) => {
    console.log(`Taking over incident ${incidentId}`);
    // Update incident assignment
  };

  const handleEscalate = (incidentId: string) => {
    console.log(`Escalating incident ${incidentId}`);
    // Trigger escalation workflow
  };

  const handleAddContext = (incidentId: string) => {
    console.log(`Adding context to incident ${incidentId}`);
    // Open context input modal
  };

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AutoResolve</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#integrations" className="text-slate-300 hover:text-white transition-colors">Integrations</a>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              View Demo
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-500/20">
              <Zap className="w-4 h-4 mr-2" />
              Context-Ready Before You Login
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Intelligence First,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Action Second
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              AutoResolve triggers the moment an incident fires, gathering context from logs, deployments, and history. 
              Your on-call engineers get AI-powered summaries and SOPs before they even open their laptop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                Try Interactive Demo
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <button className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Instant Context', icon: Clock, desc: 'AI gathers full context before engineer logs in' },
              { label: 'Faster Resolution', icon: BarChart3, desc: 'Pre-built summaries accelerate debugging' },
              { label: 'Reduced Cognitive Load', icon: ThumbsUp, desc: 'Focus on solutions, not information gathering' }
            ].map((stat, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-slate-400 font-medium mb-2">{stat.label}</div>
                <div className="text-sm text-slate-500">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Features */}
        <section id="features" className="py-20 bg-slate-800/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Core Features</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Rapid value delivery focused on what engineers need most during incidents.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Webhook,
                  title: 'Incident Trigger Integration',
                  description: 'Webhooks from PagerDuty, ServiceNow, Opsgenie, and Jira automatically activate the AI agent.',
                  status: 'Core'
                },
                {
                  icon: Brain,
                  title: 'Context Gathering Agent',
                  description: 'Pulls logs, deployment history, similar incidents, and system metrics in real-time.',
                  status: 'Core'
                },
                {
                  icon: FileText,
                  title: 'AI Summarizer',
                  description: 'LLM-powered summaries with root cause analysis and correlated event timelines.',
                  status: 'Core'
                },
                {
                  icon: Lightbulb,
                  title: 'SOP Recommender',
                  description: 'Tag-based SOP mapping provides relevant runbooks and debug steps instantly.',
                  status: 'Core'
                },
                {
                  icon: MessageSquare,
                  title: 'Slack/Teams Bot',
                  description: 'Rich notifications with summaries, SOPs, and action buttons for immediate response.',
                  status: 'Core'
                },
                {
                  icon: BarChart3,
                  title: 'Feedback Loop',
                  description: 'Engineers rate AI recommendations to continuously improve accuracy and relevance.',
                  status: 'Core'
                },
                {
                  icon: Beaker,
                  title: 'Chaos Testing Hook',
                  description: 'Sandbox-only chaos simulations to validate AI hypotheses and improve accuracy.',
                  status: 'Advanced'
                },
                {
                  icon: FileText,
                  title: 'Postmortem Generator',
                  description: 'Auto-draft postmortems using incident timeline and resolution data.',
                  status: 'Advanced'
                },
                {
                  icon: Target,
                  title: 'Predictive Analysis',
                  description: 'ML models to predict incident likelihood based on system patterns.',
                  status: 'Future'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/30 transition-colors group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-colors">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      feature.status === 'Core' ? 'bg-green-500/20 text-green-400' :
                      feature.status === 'Advanced' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Sources */}
        <section id="integrations" className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Integration Stack</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Connect with your existing incident management and monitoring tools.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {integrationSources.map((integration, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center hover:border-slate-600/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <integration.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-slate-400">Connected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-slate-900">
      {/* Dashboard Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-3 hover:bg-slate-700/50 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AutoResolve</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-2 rounded-lg">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">AI Agent Active</span>
            </div>
            <button className="relative">
              <Bell className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button>
              <Settings className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800/30 backdrop-blur-sm border-r border-slate-700/50 min-h-screen p-6">
          <nav className="space-y-2">
            {[
              { icon: BarChart3, label: 'Overview', key: 'overview', active: activeTab === 'overview' },
              { icon: AlertTriangle, label: 'Active Incidents', key: 'overview' },
              { icon: Timeline, label: 'Incident Analytics', key: 'analytics', active: activeTab === 'analytics' },
              { icon: BookOpen, label: 'Knowledge Base', key: 'knowledge-base', active: activeTab === 'knowledge-base' },
              { icon: FileText, label: 'SOP Builder', key: 'sop-builder', active: activeTab === 'sop-builder' },
              { icon: TrendingUp, label: 'Learning & Analytics', key: 'learning', active: activeTab === 'learning' },
              { icon: UserCheck, label: 'On-Call Companion', key: 'on-call', active: activeTab === 'on-call' },
              { icon: Webhook, label: 'Integrations', key: 'integrations', active: activeTab === 'integrations' },
              { icon: Beaker, label: 'Chaos Testing', key: 'chaos', active: activeTab === 'chaos', badge: 'Advanced' },
              { icon: Users, label: 'On-Call Schedule', key: 'overview' },
              { icon: Settings, label: 'Configuration', key: 'overview' }
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.key as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  item.active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Active Incidents', value: '2', change: '-1', color: 'red', icon: AlertTriangle },
                  { label: 'Avg Context Time', value: '16s', change: '-7s', color: 'green', icon: Clock },
                  { label: 'AI Accuracy', value: '98%', change: '+2%', color: 'blue', icon: Brain },
                  { label: 'Engineer Satisfaction', value: '4.9/5', change: '+0.2', color: 'purple', icon: ThumbsUp }
                ].map((stat, index) => (
                  <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        stat.color === 'red' ? 'bg-red-500/20' :
                        stat.color === 'green' ? 'bg-green-500/20' :
                        stat.color === 'blue' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                      }`}>
                        <stat.icon className={`w-5 h-5 ${
                          stat.color === 'red' ? 'text-red-400' :
                          stat.color === 'green' ? 'text-green-400' :
                          stat.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                        }`} />
                      </div>
                      <div className={`text-sm font-medium ${
                        stat.color === 'green' ? 'text-green-400' : 
                        stat.color === 'red' ? 'text-red-400' : 
                        stat.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Incidents Table */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Recent Incidents</h2>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="Search incidents..."
                          className="bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                      <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                        <Filter className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/30">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Incident</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Severity</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Source</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">AI Status</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Time</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {incidents.map((incident) => (
                        <tr key={incident.id} className="hover:bg-slate-700/20 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <button 
                                onClick={() => {
                                  setSelectedIncident(incident);
                                  setCurrentView('incident-detail');
                                }}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                              >
                                {incident.id}
                              </button>
                              <div className="text-white font-medium mt-1">{incident.title}</div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {incident.tags.map((tag, index) => (
                                  <span key={index} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityColors[incident.severity]}`}>
                              {incident.severity.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[incident.status]}`}>
                              {incident.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{incident.source}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {incident.contextGathered ? (
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  <span className="text-sm text-green-400">Ready</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm text-blue-400">Gathering</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{incident.timeDetected}</td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => {
                                setSelectedIncident(incident);
                                setCurrentView('incident-detail');
                              }}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Incident Analytics</h2>
                <p className="text-slate-400">Root cause patterns and incident trends analysis</p>
              </div>

              <RootCauseHeatmap analytics={rootCauseAnalytics} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FeedbackInbox 
                  feedback={engineerFeedback}
                  onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
                />
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Escalation Predictions</h3>
                  <div className="space-y-4">
                    {incidents.filter(inc => inc.escalationRisk).map(incident => (
                      <div key={incident.id} className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm">{incident.id}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            incident.escalationRisk === 'high' ? 'bg-red-500/20 text-red-400' :
                            incident.escalationRisk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {incident.escalationRisk?.toUpperCase()} RISK
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{incident.title}</p>
                        {incident.estimatedResolutionTime && (
                          <p className="text-slate-400 text-xs mt-1">
                            Est. resolution: {incident.estimatedResolutionTime}m
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge-base' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Incident Knowledge Base</h2>
                  <p className="text-slate-400">AI-powered searchable repository of incident resolutions and SOPs</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Entry</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <KnowledgeBasePanel 
                    knowledgeBase={knowledgeBase}
                    onSelectEntry={setSelectedKBEntry}
                  />
                </div>
                <div>
                  <AIActionsTimeline actions={aiActions} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sop-builder' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Custom SOP Builder</h2>
                <p className="text-slate-400">Create and manage custom Standard Operating Procedures</p>
              </div>

              <CustomSOPBuilder 
                sops={customSOPs}
                onCreateSOP={handleCreateSOP}
                onUpdateSOP={handleUpdateSOP}
                onDeleteSOP={handleDeleteSOP}
              />
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Learning & Analytics</h2>
                <p className="text-slate-400">AI performance metrics and continuous improvement insights</p>
              </div>

              <PerformanceCharts metrics={performanceMetrics} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Recent Learning Feedback</h3>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {incidents.filter(inc => inc.engineerFeedback).map(incident => (
                      <div key={incident.id} className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm">{incident.id}</span>
                          <div className="flex items-center space-x-2">
                            {incident.engineerFeedback === 'helpful' ? (
                              <ThumbsUp className="w-4 h-4 text-green-400" />
                            ) : (
                              <ThumbsDown className="w-4 h-4 text-red-400" />
                            )}
                            {incident.isTeachingExample && (
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            )}
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">{incident.title}</p>
                        {incident.learningNotes && (
                          <p className="text-slate-400 text-xs mt-2">{incident.learningNotes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">AI Training Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-slate-300">Knowledge Base Entries</span>
                      <span className="text-white font-medium">{knowledgeBase.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-slate-300">Teaching Examples</span>
                      <span className="text-white font-medium">{incidents.filter(inc => inc.isTeachingExample).length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-slate-300">Feedback Collected</span>
                      <span className="text-white font-medium">{incidents.filter(inc => inc.engineerFeedback).length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <span className="text-slate-300">Last Model Update</span>
                      <span className="text-white font-medium">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'on-call' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">On-Call Companion</h2>
                <p className="text-slate-400">Personalized incident management for on-call engineers</p>
              </div>

              <OnCallCompanionPanel 
                engineer={currentEngineer}
                activeIncidents={incidents.filter(inc => inc.status === 'active' || inc.status === 'investigating')}
                onTakeOver={handleTakeOver}
                onEscalate={handleEscalate}
                onAddContext={handleAddContext}
              />
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Integration Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integrationSources.map((integration, index) => (
                    <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                            <integration.icon className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                            <p className="text-sm text-slate-400">Last sync: {integration.lastSync}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-green-400 font-medium">Connected</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chaos' && (
            <div className="space-y-8">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Beaker className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">Chaos Testing (Advanced)</h2>
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">Live</span>
                </div>
                <p className="text-slate-300 mb-6">
                  Sandbox-only chaos simulations to validate AI hypotheses and improve incident response accuracy.
                </p>
              </div>

              <ChaosTestingCoverage coverage={chaosTestCoverage} />
            </div>
          )}
        </main>
      </div>
    </div>
  );

  const IncidentDetail = () => {
    if (!selectedIncident) return null;

    const similarIncidents = incidents.filter(inc => 
      inc.id !== selectedIncident.id && 
      inc.tags.some(tag => selectedIncident.tags.includes(tag))
    ).slice(0, 3);

    return (
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </button>
              <span className="text-slate-400">|</span>
              <span className="text-white font-medium">{selectedIncident.id}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Slack className="w-4 h-4" />
                <span>Send to Slack</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Incident Overview */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h1 className="text-2xl font-bold text-white mb-4">{selectedIncident.title}</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-slate-400">Severity</label>
                    <div className={`mt-1 px-3 py-1 rounded-full text-xs font-medium border inline-block ${severityColors[selectedIncident.severity]}`}>
                      {selectedIncident.severity.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Status</label>
                    <div className={`mt-1 px-3 py-1 rounded-full text-xs font-medium inline-block ${statusColors[selectedIncident.status]}`}>
                      {selectedIncident.status.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Source</label>
                    <p className="text-white mt-1">{selectedIncident.source}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Detected</label>
                    <p className="text-white mt-1">{selectedIncident.timeDetected}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIncident.tags.map((tag, index) => (
                    <span key={index} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Incident Timeline */}
              {selectedIncident.timeline && (
                <IncidentTimelineViewer 
                  timeline={selectedIncident.timeline}
                  incidentId={selectedIncident.id}
                />
              )}

              {/* AI Summary */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">AI-Generated Summary</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${selectedIncident.aiConfidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-300">{selectedIncident.aiConfidence}% confidence</span>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {selectedIncident.aiSummary}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-400">Was this summary helpful?</span>
                  <button 
                    onClick={() => {
                      const updatedIncidents = incidents.map(inc => 
                        inc.id === selectedIncident.id 
                          ? { ...inc, engineerFeedback: 'helpful' }
                          : inc
                      );
                      setIncidents(updatedIncidents);
                      setSelectedIncident({ ...selectedIncident, engineerFeedback: 'helpful' });
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedIncident.engineerFeedback === 'helpful' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'hover:bg-slate-700/50 text-slate-400'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      const updatedIncidents = incidents.map(inc => 
                        inc.id === selectedIncident.id 
                          ? { ...inc, engineerFeedback: 'not_helpful' }
                          : inc
                      );
                      setIncidents(updatedIncidents);
                      setSelectedIncident({ ...selectedIncident, engineerFeedback: 'not_helpful' });
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedIncident.engineerFeedback === 'not_helpful' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'hover:bg-slate-700/50 text-slate-400'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Similar Incidents */}
              <SimilarIncidentsPanel 
                currentIncident={selectedIncident}
                similarIncidents={similarIncidents}
                onMarkSimilar={handleMarkSimilar}
              />

              {/* Recommended SOPs */}
              {selectedIncident.recommendedSOPs && (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-6 h-6 text-green-400" />
                    <h2 className="text-xl font-bold text-white">Recommended SOPs</h2>
                  </div>
                  <div className="space-y-3">
                    {selectedIncident.recommendedSOPs.map((sop, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-slate-700/30 rounded-lg">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-400 text-sm font-medium">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-300">{sop}</p>
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Feedback Panel */}
              <LearningFeedbackPanel 
                incident={selectedIncident}
                onFeedbackSubmit={handleFeedbackSubmit}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Affected Systems */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Affected Systems</h3>
                <div className="space-y-3">
                  {selectedIncident.affectedSystems.map((system, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Server className="w-4 h-4 text-red-400" />
                        <span className="text-slate-300">{system}</span>
                      </div>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Actions Timeline */}
              <AIActionsTimeline 
                actions={aiActions} 
                incidentId={selectedIncident.id}
              />

              {/* Quick Actions */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Escalate to Team</span>
                  </button>
                  <button className="w-full border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Logs</span>
                  </button>
                  <button className="w-full border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'incident-detail' && <IncidentDetail />}
    </>
  );
}

export default App;