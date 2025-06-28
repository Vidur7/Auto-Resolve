import { 
  Incident, 
  KnowledgeBaseEntry, 
  AIAction, 
  PerformanceMetric, 
  IncidentTimelineEvent,
  RootCauseAnalytics,
  ChaosTestCoverage,
  EngineerFeedback,
  CustomSOP
} from '../types/incident';

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    title: 'Payment API Response Time Degradation',
    severity: 'critical',
    status: 'investigating',
    source: 'PagerDuty',
    timeDetected: '2 minutes ago',
    aiConfidence: 94,
    affectedSystems: ['Payment Gateway', 'User Authentication', 'Order Processing'],
    correlatedTickets: 3,
    tags: ['api', 'latency', 'payment_gateway', 'database'],
    contextGathered: true,
    escalationRisk: 'high',
    estimatedResolutionTime: 45,
    assignedEngineer: 'Sarah Chen',
    aiSummary: 'High latency detected in payment processing API. Correlation with recent database connection pool changes suggests resource exhaustion. Similar incident INC-2024-089 resolved 3 weeks ago by scaling connection pool.',
    recommendedSOPs: [
      'Check database connection pool metrics',
      'Review recent deployment logs',
      'Scale payment service replicas',
      'Monitor downstream service health'
    ],
    similarIncidents: ['INC-2024-089', 'INC-2023-234'],
    rootCause: 'Database connection pool exhaustion',
    resolutionSteps: [
      'Scaled database connection pool from 50 to 100',
      'Increased payment service replicas from 3 to 6',
      'Added connection pool monitoring alerts'
    ],
    timeline: [
      {
        id: 'evt-001',
        timestamp: '2 minutes ago',
        type: 'detection',
        actor: 'system',
        description: 'High latency alert triggered from payment API monitoring'
      },
      {
        id: 'evt-002',
        timestamp: '2 minutes ago',
        type: 'ai_analysis',
        actor: 'ai',
        description: 'AI agent activated, gathering context from CloudWatch and deployment logs'
      },
      {
        id: 'evt-003',
        timestamp: '1 minute ago',
        type: 'ai_analysis',
        actor: 'ai',
        description: 'Generated hypothesis: Database connection pool exhaustion based on similar incident patterns'
      },
      {
        id: 'evt-004',
        timestamp: '30 seconds ago',
        type: 'human_action',
        actor: 'Sarah Chen',
        description: 'Engineer joined incident, reviewing AI summary and recommendations'
      }
    ]
  },
  {
    id: 'INC-2024-002',
    title: 'User Login Service Intermittent Failures',
    severity: 'high',
    status: 'active',
    source: 'ServiceNow',
    timeDetected: '15 minutes ago',
    aiConfidence: 87,
    affectedSystems: ['Authentication Service', 'User Database'],
    correlatedTickets: 2,
    tags: ['auth', 'intermittent', 'redis', 'session'],
    contextGathered: true,
    escalationRisk: 'medium',
    estimatedResolutionTime: 30,
    assignedEngineer: 'Mike Rodriguez',
    aiSummary: 'Authentication service showing 15% failure rate. Redis session store experiencing memory pressure. Recent traffic spike correlates with marketing campaign launch.',
    recommendedSOPs: [
      'Check Redis memory usage and eviction policies',
      'Review authentication service logs',
      'Verify load balancer health checks',
      'Scale Redis cluster if needed'
    ],
    similarIncidents: ['INC-2024-045', 'INC-2023-178'],
    timeline: [
      {
        id: 'evt-005',
        timestamp: '15 minutes ago',
        type: 'detection',
        actor: 'system',
        description: 'Authentication failure rate exceeded threshold (15%)'
      },
      {
        id: 'evt-006',
        timestamp: '14 minutes ago',
        type: 'ai_analysis',
        actor: 'ai',
        description: 'Correlating with Redis metrics and recent traffic patterns'
      },
      {
        id: 'evt-007',
        timestamp: '12 minutes ago',
        type: 'human_action',
        actor: 'Mike Rodriguez',
        description: 'Acknowledged incident, implementing Redis memory scaling'
      }
    ]
  },
  {
    id: 'INC-2024-003',
    title: 'SSL Certificate Expiration Warning',
    severity: 'medium',
    status: 'resolved',
    source: 'Opsgenie',
    timeDetected: '1 hour ago',
    timeResolved: '45 minutes ago',
    aiConfidence: 99,
    affectedSystems: ['Web Portal', 'API Gateway'],
    correlatedTickets: 1,
    tags: ['ssl', 'certificate', 'security'],
    contextGathered: true,
    escalationRisk: 'low',
    estimatedResolutionTime: 15,
    assignedEngineer: 'Alex Kim',
    engineerFeedback: 'helpful',
    rootCause: 'SSL certificate approaching expiration',
    resolutionSteps: [
      'Renewed SSL certificate through cert-manager',
      'Updated certificate in load balancer',
      'Verified certificate chain validity'
    ],
    isTeachingExample: true,
    learningNotes: 'Automated certificate renewal process worked perfectly. AI correctly identified the issue and provided accurate SOPs.',
    timeline: [
      {
        id: 'evt-008',
        timestamp: '1 hour ago',
        type: 'detection',
        actor: 'system',
        description: 'SSL certificate expiration warning (7 days remaining)'
      },
      {
        id: 'evt-009',
        timestamp: '58 minutes ago',
        type: 'ai_analysis',
        actor: 'ai',
        description: 'Identified certificate renewal SOP and cert-manager automation'
      },
      {
        id: 'evt-010',
        timestamp: '50 minutes ago',
        type: 'human_action',
        actor: 'Alex Kim',
        description: 'Executed certificate renewal process'
      },
      {
        id: 'evt-011',
        timestamp: '45 minutes ago',
        type: 'resolution',
        actor: 'Alex Kim',
        description: 'Certificate renewed successfully, incident resolved'
      }
    ]
  }
];

export const mockKnowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: 'KB-001',
    incidentId: 'INC-2024-089',
    title: 'Database Connection Pool Exhaustion - Payment Service',
    tags: ['database', 'connection_pool', 'payment', 'latency'],
    rootCause: 'Insufficient connection pool size during traffic spike',
    resolutionSteps: [
      'Monitor connection pool metrics in Grafana',
      'Scale connection pool size based on concurrent users',
      'Implement connection pool monitoring alerts',
      'Review application connection handling patterns'
    ],
    effectiveness: 95,
    usageCount: 12,
    lastUsed: '2 minutes ago',
    createdAt: '3 weeks ago',
    authoredBy: 'Sarah Chen',
    sopType: 'manual',
    engineerNotes: 'This pattern repeats during high traffic. Consider auto-scaling connection pools.'
  },
  {
    id: 'KB-002',
    incidentId: 'INC-2023-234',
    title: 'Redis Memory Pressure - Session Store',
    tags: ['redis', 'memory', 'session', 'auth'],
    rootCause: 'Redis memory limit reached due to session accumulation',
    resolutionSteps: [
      'Check Redis memory usage with INFO memory command',
      'Review session TTL configuration',
      'Implement session cleanup job',
      'Scale Redis cluster or increase memory limits'
    ],
    effectiveness: 88,
    usageCount: 8,
    lastUsed: '15 minutes ago',
    createdAt: '6 months ago',
    authoredBy: 'Mike Rodriguez',
    sopType: 'auto_generated'
  },
  {
    id: 'KB-003',
    incidentId: 'INC-2023-178',
    title: 'SSL Certificate Auto-Renewal Failure',
    tags: ['ssl', 'certificate', 'cert-manager', 'security'],
    rootCause: 'cert-manager ACME challenge failed due to DNS propagation',
    resolutionSteps: [
      'Check cert-manager logs for ACME challenge errors',
      'Verify DNS configuration and propagation',
      'Manually trigger certificate renewal',
      'Update certificate in ingress controller'
    ],
    effectiveness: 92,
    usageCount: 15,
    lastUsed: '1 hour ago',
    createdAt: '8 months ago',
    authoredBy: 'Alex Kim',
    sopType: 'community'
  }
];

export const mockAIActions: AIAction[] = [
  {
    id: 'AI-001',
    incidentId: 'INC-2024-001',
    timestamp: '2 minutes ago',
    type: 'context_gathering',
    description: 'Gathered CloudWatch metrics for payment service',
    dataSource: 'CloudWatch',
    confidence: 95
  },
  {
    id: 'AI-002',
    incidentId: 'INC-2024-001',
    timestamp: '2 minutes ago',
    type: 'similarity_search',
    description: 'Found 2 similar incidents with database connection issues',
    confidence: 94,
    result: ['INC-2024-089', 'INC-2023-234']
  },
  {
    id: 'AI-003',
    incidentId: 'INC-2024-001',
    timestamp: '1 minute ago',
    type: 'hypothesis_generation',
    description: 'Generated hypothesis: Database connection pool exhaustion',
    confidence: 94
  },
  {
    id: 'AI-004',
    incidentId: 'INC-2024-001',
    timestamp: '1 minute ago',
    type: 'sop_recommendation',
    description: 'Recommended 4 SOPs based on similar incidents',
    confidence: 92,
    result: ['Check database connection pool metrics', 'Review recent deployment logs']
  }
];

export const mockPerformanceMetrics: PerformanceMetric[] = [
  { date: '2024-01-01', avgContextTime: 25, aiAccuracy: 89, engineerSatisfaction: 4.2, incidentsResolved: 12, avgResolutionTime: 45 },
  { date: '2024-01-02', avgContextTime: 23, aiAccuracy: 91, engineerSatisfaction: 4.4, incidentsResolved: 8, avgResolutionTime: 38 },
  { date: '2024-01-03', avgContextTime: 22, aiAccuracy: 93, engineerSatisfaction: 4.6, incidentsResolved: 15, avgResolutionTime: 32 },
  { date: '2024-01-04', avgContextTime: 20, aiAccuracy: 94, engineerSatisfaction: 4.7, incidentsResolved: 11, avgResolutionTime: 28 },
  { date: '2024-01-05', avgContextTime: 18, aiAccuracy: 96, engineerSatisfaction: 4.8, incidentsResolved: 9, avgResolutionTime: 25 },
  { date: '2024-01-06', avgContextTime: 17, aiAccuracy: 97, engineerSatisfaction: 4.9, incidentsResolved: 13, avgResolutionTime: 22 },
  { date: '2024-01-07', avgContextTime: 16, aiAccuracy: 98, engineerSatisfaction: 4.9, incidentsResolved: 7, avgResolutionTime: 20 }
];

export const mockRootCauseAnalytics: RootCauseAnalytics[] = [
  { category: 'Database', count: 23, avgResolutionTime: 35, trend: 'decreasing', lastOccurrence: '2 minutes ago' },
  { category: 'Authentication', count: 18, avgResolutionTime: 22, trend: 'stable', lastOccurrence: '15 minutes ago' },
  { category: 'SSL/TLS', count: 12, avgResolutionTime: 15, trend: 'decreasing', lastOccurrence: '1 hour ago' },
  { category: 'Network', count: 15, avgResolutionTime: 28, trend: 'increasing', lastOccurrence: '3 hours ago' },
  { category: 'Memory/CPU', count: 9, avgResolutionTime: 42, trend: 'stable', lastOccurrence: '6 hours ago' },
  { category: 'API Gateway', count: 14, avgResolutionTime: 31, trend: 'decreasing', lastOccurrence: '12 hours ago' }
];

export const mockChaosTestCoverage: ChaosTestCoverage[] = [
  {
    service: 'Payment Gateway',
    lastTestDate: '2 days ago',
    testTypes: ['Latency Injection', 'Circuit Breaker'],
    riskLevel: 'low',
    recommendations: []
  },
  {
    service: 'Authentication Service',
    lastTestDate: '1 week ago',
    testTypes: ['Pod Failure'],
    riskLevel: 'medium',
    recommendations: ['Add memory pressure test', 'Test Redis failover']
  },
  {
    service: 'Order Processing',
    lastTestDate: 'Never',
    testTypes: [],
    riskLevel: 'high',
    recommendations: ['Implement basic chaos tests', 'Test database connection failures', 'Add timeout scenarios']
  },
  {
    service: 'User Database',
    lastTestDate: '3 days ago',
    testTypes: ['Connection Pool Exhaustion', 'Slow Query'],
    riskLevel: 'low',
    recommendations: []
  }
];

export const mockEngineerFeedback: EngineerFeedback[] = [
  {
    id: 'FB-001',
    incidentId: 'INC-2024-003',
    engineerId: 'Alex Kim',
    timestamp: '45 minutes ago',
    rating: 'helpful',
    category: 'sop',
    comments: 'Certificate renewal SOP was perfect. Saved 20 minutes of research.',
    status: 'reviewed'
  },
  {
    id: 'FB-002',
    incidentId: 'INC-2024-001',
    engineerId: 'Sarah Chen',
    timestamp: '30 seconds ago',
    rating: 'helpful',
    category: 'summary',
    comments: 'AI correctly identified connection pool issue. Timeline was very helpful.',
    status: 'pending'
  },
  {
    id: 'FB-003',
    incidentId: 'INC-2024-002',
    engineerId: 'Mike Rodriguez',
    timestamp: '12 minutes ago',
    rating: 'not_helpful',
    category: 'escalation',
    comments: 'Escalation risk was too high. This was a routine Redis scaling issue.',
    status: 'pending'
  }
];

export const mockCustomSOPs: CustomSOP[] = [
  {
    id: 'SOP-001',
    title: 'Database Connection Pool Scaling',
    content: `# Database Connection Pool Scaling

## Quick Diagnosis
1. Check current pool metrics: \`kubectl exec -it db-pod -- mysql -e "SHOW STATUS LIKE 'Threads_connected'"\`
2. Review connection pool configuration
3. Monitor application connection patterns

## Resolution Steps
1. Scale connection pool size
2. Restart affected services
3. Monitor for improvement
4. Add alerting if missing`,
    tags: ['database', 'connection_pool', 'scaling'],
    services: ['Payment Gateway', 'User Database'],
    authorId: 'Sarah Chen',
    createdAt: '2 weeks ago',
    updatedAt: '1 week ago',
    usageCount: 12,
    effectiveness: 95,
    status: 'published'
  },
  {
    id: 'SOP-002',
    title: 'Redis Memory Pressure Response',
    content: `# Redis Memory Pressure Response

## Immediate Actions
1. Check memory usage: \`redis-cli INFO memory\`
2. Review eviction policy
3. Identify memory-heavy keys

## Resolution
1. Scale Redis cluster
2. Implement key expiration
3. Optimize data structures`,
    tags: ['redis', 'memory', 'scaling'],
    services: ['Authentication Service', 'Session Store'],
    authorId: 'Mike Rodriguez',
    createdAt: '1 month ago',
    updatedAt: '3 days ago',
    usageCount: 8,
    effectiveness: 88,
    status: 'published'
  }
];