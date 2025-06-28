export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'resolved' | 'escalated';
  source: 'ServiceNow' | 'PagerDuty' | 'Opsgenie' | 'Jira';
  timeDetected: string;
  timeResolved?: string;
  aiConfidence: number;
  affectedSystems: string[];
  correlatedTickets: number;
  tags: string[];
  aiSummary?: string;
  recommendedSOPs?: string[];
  contextGathered: boolean;
  engineerFeedback?: 'helpful' | 'not_helpful' | null;
  rootCause?: string;
  resolutionSteps?: string[];
  similarIncidents?: string[];
  learningNotes?: string;
  isTeachingExample?: boolean;
  escalationRisk?: 'low' | 'medium' | 'high';
  estimatedResolutionTime?: number; // in minutes
  timeline?: IncidentTimelineEvent[];
  assignedEngineer?: string;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  type: 'detection' | 'ai_analysis' | 'human_action' | 'escalation' | 'resolution';
  actor: 'system' | 'ai' | string; // engineer name
  description: string;
  metadata?: any;
}

export interface KnowledgeBaseEntry {
  id: string;
  incidentId: string;
  title: string;
  tags: string[];
  rootCause: string;
  resolutionSteps: string[];
  effectiveness: number;
  usageCount: number;
  lastUsed: string;
  createdAt: string;
  engineerNotes?: string;
  authoredBy?: string;
  sopType: 'auto_generated' | 'manual' | 'community';
}

export interface AIAction {
  id: string;
  incidentId: string;
  timestamp: string;
  type: 'context_gathering' | 'hypothesis_generation' | 'sop_recommendation' | 'similarity_search' | 'escalation';
  description: string;
  dataSource?: string;
  confidence: number;
  result?: any;
}

export interface PerformanceMetric {
  date: string;
  avgContextTime: number;
  aiAccuracy: number;
  engineerSatisfaction: number;
  incidentsResolved: number;
  avgResolutionTime: number;
}

export interface RootCauseAnalytics {
  category: string;
  count: number;
  avgResolutionTime: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastOccurrence: string;
}

export interface ChaosTestCoverage {
  service: string;
  lastTestDate: string;
  testTypes: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface EngineerFeedback {
  id: string;
  incidentId: string;
  engineerId: string;
  timestamp: string;
  rating: 'helpful' | 'not_helpful';
  category: 'summary' | 'sop' | 'timeline' | 'escalation';
  comments: string;
  status: 'pending' | 'reviewed' | 'implemented';
}

export interface CustomSOP {
  id: string;
  title: string;
  content: string;
  tags: string[];
  services: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  effectiveness: number;
  status: 'draft' | 'published' | 'deprecated';
}