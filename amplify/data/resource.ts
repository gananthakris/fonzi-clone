import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';

// ---------------------------------------------------------------------------
// Lambda function definitions for custom mutations
// Each references a handler file in the corresponding amplify/functions/ dir
// ---------------------------------------------------------------------------

const sendInterviewMessageFn = defineFunction({
  name: 'send-interview-message',
  entry: '../functions/ai-interviewer/handler.ts',
});

const startInterviewSessionFn = defineFunction({
  name: 'start-interview-session',
  entry: '../functions/ai-interviewer/handler.ts',
});

const runScreeningFn = defineFunction({
  name: 'run-screening',
  entry: '../functions/ai-screening-agent/handler.ts',
});

const runMatchingAlgorithmFn = defineFunction({
  name: 'run-matching-algorithm',
  entry: '../functions/matching-engine/handler.ts',
});

const analyzeGitHubFn = defineFunction({
  name: 'analyze-github',
  entry: '../functions/github-analyzer/handler.ts',
});

const runFraudDetectionFn = defineFunction({
  name: 'run-fraud-detection',
  entry: '../functions/fraud-detector/handler.ts',
});

const sendEmailFn = defineFunction({
  name: 'send-email',
  entry: '../functions/send-email/handler.ts',
});

const processIncentivePayoutFn = defineFunction({
  name: 'process-incentive-payout',
  entry: '../functions/process-incentive/handler.ts',
});

const generateJobDescriptionFn = defineFunction({
  name: 'generate-job-description',
  entry: '../functions/generate-job-description/handler.ts',
});

const scheduleInterviewFn = defineFunction({
  name: 'schedule-interview',
  entry: '../functions/calendar-integration/handler.ts',
});

// ---------------------------------------------------------------------------
// Enum definitions
// ---------------------------------------------------------------------------

const UserRole = a.enum([
  'ADMIN',
  'CONCIERGE',
  'CANDIDATE',
  'COMPANY_ADMIN',
  'COMPANY_MEMBER',
]);

const CandidateStatus = a.enum([
  'ONBOARDING',
  'SCREENING',
  'APPROVED',
  'MATCHED',
  'HIRED',
  'REJECTED',
  'INACTIVE',
]);

const CompanyStatus = a.enum([
  'PENDING',
  'APPROVED',
  'ACTIVE',
  'SUSPENDED',
]);

const MatchDayStatus = a.enum([
  'SCHEDULED',
  'APPLICATIONS_OPEN',
  'APPLICATIONS_CLOSED',
  'MATCHING_IN_PROGRESS',
  'OFFERS_LIVE',
  'CANDIDATE_CHOICE',
  'INTERVIEWS_SCHEDULED',
  'COMPLETED',
  'CANCELLED',
]);

const OfferStatus = a.enum([
  'PENDING',
  'ACCEPTED',
  'DECLINED',
  'EXPIRED',
  'WITHDRAWN',
]);

const InterviewStatus = a.enum([
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
]);

const InterviewType = a.enum([
  'AI_SCREENING',
  'TECHNICAL',
  'BEHAVIORAL',
  'CULTURE_FIT',
  'FINAL',
]);

const IncentiveType = a.enum([
  'FIRST_MATCH_DAY',
  'COMPLETED_INTERVIEW',
  'HIRE_BONUS',
  'REFERRAL_MATCH_DAY',
  'REFERRAL_HIRED',
]);

const IncentiveStatus = a.enum([
  'PENDING',
  'APPROVED',
  'PROCESSING',
  'PAID',
  'REJECTED',
]);

const FraudSignalSeverity = a.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

const ContentStatus = a.enum([
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
]);

const RoleFocus = a.enum([
  'FRONTEND',
  'BACKEND',
  'FULLSTACK',
  'ML_ENGINEER',
  'DATA_SCIENTIST',
  'DEVOPS',
  'MOBILE',
  'RESEARCH',
  'MANAGEMENT',
  'OTHER',
]);

const ExperienceLevel = a.enum([
  'JUNIOR',
  'MID',
  'SENIOR',
  'STAFF',
  'PRINCIPAL',
  'DIRECTOR',
  'VP',
]);

const WorkPreference = a.enum([
  'REMOTE',
  'HYBRID',
  'ONSITE',
]);

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const schema = a.schema({

  // =========================================================================
  // Enums (registered in the schema)
  // =========================================================================
  UserRole,
  CandidateStatus,
  CompanyStatus,
  MatchDayStatus,
  OfferStatus,
  InterviewStatus,
  InterviewType,
  IncentiveType,
  IncentiveStatus,
  FraudSignalSeverity,
  ContentStatus,
  RoleFocus,
  ExperienceLevel,
  WorkPreference,

  // =========================================================================
  // 1. UserProfile
  // =========================================================================
  UserProfile: a
    .model({
      email: a.email().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      role: a.ref('UserRole').required(),
      avatarUrl: a.url(),
      phone: a.phone(),
      isActive: a.boolean().default(true),
      cognitoSub: a.string().required(),
      lastLoginAt: a.datetime(),
      // Relationships
      candidateProfile: a.hasOne('CandidateProfile', 'userProfileId'),
      companyMemberships: a.hasMany('CompanyMember', 'userProfileId'),
      incentives: a.hasMany('Incentive', 'userProfileId'),
      notifications: a.hasMany('Notification', 'userProfileId'),
    })
    .secondaryIndexes((index) => [
      index('cognitoSub').queryField('listUserProfileByCognitoSub'),
      index('email').queryField('listUserProfileByEmail'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['ADMIN', 'CONCIERGE']).to(['read', 'update']),
    ]),

  // =========================================================================
  // 2. CandidateProfile
  // =========================================================================
  CandidateProfile: a
    .model({
      userProfileId: a.id().required(),
      userProfile: a.belongsTo('UserProfile', 'userProfileId'),
      status: a.ref('CandidateStatus').required().default('ONBOARDING'),
      headline: a.string(),
      summary: a.string(),
      yearsOfExperience: a.integer(),
      skills: a.string().array(),
      primaryTechStack: a.string().array(),
      experienceLevel: a.ref('ExperienceLevel'),
      roleFocus: a.ref('RoleFocus'),
      currentCompany: a.string(),
      currentTitle: a.string(),
      linkedinUrl: a.url(),
      githubUrl: a.url(),
      portfolioUrl: a.url(),
      resumeS3Key: a.string(),
      workHistory: a.json(),
      education: a.json(),
      certifications: a.string().array(),
      preferredSalaryMin: a.integer(),
      preferredSalaryMax: a.integer(),
      workPreference: a.ref('WorkPreference'),
      preferredLocations: a.string().array(),
      visaRequired: a.boolean().default(false),
      usVisaHolder: a.boolean().default(false),
      availableDate: a.date(),
      aiScreeningScore: a.float(),
      githubScore: a.float(),
      overallScore: a.float(),
      fraudRiskScore: a.float(),
      embeddingVector: a.json(),
      referralCode: a.string(),
      referredBy: a.string(),
      onboardingStep: a.integer().default(0),
      completedAt: a.datetime(),
      // Relationships
      matchDayParticipations: a.hasMany('MatchDayParticipant', 'candidateProfileId'),
      matches: a.hasMany('Match', 'candidateProfileId'),
      offers: a.hasMany('Offer', 'candidateProfileId'),
      interviewSessions: a.hasMany('InterviewSession', 'candidateProfileId'),
      interviews: a.hasMany('Interview', 'candidateProfileId'),
      fraudSignals: a.hasMany('FraudSignal', 'candidateProfileId'),
      incentives: a.hasMany('Incentive', 'candidateProfileId'),
    })
    .secondaryIndexes((index) => [
      index('userProfileId').queryField('listCandidateProfileByUserProfileId'),
      index('status').queryField('listCandidateProfileByStatus'),
      index('referralCode').queryField('listCandidateProfileByReferralCode'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['ADMIN', 'CONCIERGE']),
      allow.authenticated().to(['read']),
    ]),

  // =========================================================================
  // 3. Company
  // =========================================================================
  Company: a
    .model({
      name: a.string().required(),
      website: a.url(),
      description: a.string(),
      logoS3Key: a.string(),
      industry: a.string(),
      size: a.string(),
      foundedYear: a.integer(),
      headquarters: a.string(),
      techStack: a.string().array(),
      benefits: a.string().array(),
      culture: a.string(),
      status: a.ref('CompanyStatus').required().default('PENDING'),
      stripeCustomerId: a.string(),
      approvedAt: a.datetime(),
      approvedBy: a.string(),
      // Relationships
      members: a.hasMany('CompanyMember', 'companyId'),
      jobRoles: a.hasMany('JobRole', 'companyId'),
      matchDayParticipations: a.hasMany('MatchDayCompanyParticipant', 'companyId'),
      offers: a.hasMany('Offer', 'companyId'),
      interviews: a.hasMany('Interview', 'companyId'),
      invoices: a.hasMany('Invoice', 'companyId'),
    })
    .secondaryIndexes((index) => [
      index('status').queryField('listCompanyByStatus'),
    ])
    .authorization((allow) => [
      allow.groups(['ADMIN', 'CONCIERGE']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  // =========================================================================
  // 4. CompanyMember
  // =========================================================================
  CompanyMember: a
    .model({
      userProfileId: a.id().required(),
      userProfile: a.belongsTo('UserProfile', 'userProfileId'),
      companyId: a.id().required(),
      company: a.belongsTo('Company', 'companyId'),
      role: a.string().required().default('MEMBER'),
      joinedAt: a.datetime(),
      invitedBy: a.string(),
    })
    .secondaryIndexes((index) => [
      index('userProfileId').queryField('listCompanyMemberByUserProfileId'),
      index('companyId').queryField('listCompanyMemberByCompanyId'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['ADMIN', 'CONCIERGE']),
    ]),

  // =========================================================================
  // 5. JobRole
  // =========================================================================
  JobRole: a
    .model({
      companyId: a.id().required(),
      company: a.belongsTo('Company', 'companyId'),
      title: a.string().required(),
      description: a.string(),
      requirements: a.string().array(),
      niceToHaves: a.string().array(),
      roleFocus: a.ref('RoleFocus'),
      experienceLevel: a.ref('ExperienceLevel'),
      salaryMin: a.integer(),
      salaryMax: a.integer(),
      equity: a.string(),
      workPreference: a.ref('WorkPreference'),
      locations: a.string().array(),
      isActive: a.boolean().default(true),
      isMatchDayEligible: a.boolean().default(false),
      createdBy: a.string(),
      // Relationships
      matches: a.hasMany('Match', 'jobRoleId'),
      offers: a.hasMany('Offer', 'jobRoleId'),
      interviews: a.hasMany('Interview', 'jobRoleId'),
      invoices: a.hasMany('Invoice', 'jobRoleId'),
    })
    .secondaryIndexes((index) => [
      index('companyId').queryField('listJobRoleByCompanyId'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['ADMIN', 'CONCIERGE']),
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  // =========================================================================
  // 6. MatchDayCohort
  // =========================================================================
  MatchDayCohort: a
    .model({
      name: a.string().required(),
      cohortNumber: a.integer().required(),
      scheduledDate: a.date().required(),
      applicationsOpenDate: a.datetime(),
      applicationsCloseDate: a.datetime(),
      offersStartDate: a.datetime(),
      offersEndDate: a.datetime(),
      status: a.ref('MatchDayStatus').required().default('SCHEDULED'),
      maxCandidates: a.integer(),
      maxCompanies: a.integer(),
      description: a.string(),
      createdBy: a.string(),
      // Relationships
      candidateParticipants: a.hasMany('MatchDayParticipant', 'cohortId'),
      companyParticipants: a.hasMany('MatchDayCompanyParticipant', 'cohortId'),
      matches: a.hasMany('Match', 'cohortId'),
      offers: a.hasMany('Offer', 'cohortId'),
    })
    .secondaryIndexes((index) => [
      index('status').queryField('listMatchDayCohortByStatus'),
      index('cohortNumber').queryField('listMatchDayCohortByCohortNumber'),
    ])
    .authorization((allow) => [
      allow.groups(['ADMIN', 'CONCIERGE']),
      allow.authenticated().to(['read']),
    ]),

  // =========================================================================
  // 7. MatchDayParticipant
  // =========================================================================
  MatchDayParticipant: a
    .model({
      cohortId: a.id().required(),
      cohort: a.belongsTo('MatchDayCohort', 'cohortId'),
      candidateProfileId: a.id().required(),
      candidateProfile: a.belongsTo('CandidateProfile', 'candidateProfileId'),
      status: a.string().required().default('APPLIED'),
      appliedAt: a.datetime(),
      approvedAt: a.datetime(),
      approvedBy: a.string(),
    })
    .secondaryIndexes((index) => [
      index('cohortId').queryField('listMatchDayParticipantByCohortId'),
      index('candidateProfileId').queryField('listMatchDayParticipantByCandidateProfileId'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['ADMIN', 'CONCIERGE']),
    ]),

  // =========================================================================
  // 8. MatchDayCompanyParticipant
  // =========================================================================
  MatchDayCompanyParticipant: a
    .model({
      cohortId: a.id().required(),
      cohort: a.belongsTo('MatchDayCohort', 'cohortId'),
      companyId: a.id().required(),
      company: a.belongsTo('Company', 'companyId'),
      jobRoleIds: a.string().array(),
      status: a.string().required().default('APPLIED'),
      appliedAt: a.datetime(),
      approvedAt: a.datetime(),
      approvedBy: a.string(),
    })
    .secondaryIndexes((index) => [
      index('cohortId').queryField('listMatchDayCompanyParticipantByCohortId'),
      index('companyId').queryField('listMatchDayCompanyParticipantByCompanyId'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['ADMIN', 'CONCIERGE']),
    ]),

  // =========================================================================
  // 9. Match
  // =========================================================================
  Match: a
    .model({
      cohortId: a.id().required(),
      cohort: a.belongsTo('MatchDayCohort', 'cohortId'),
      candidateProfileId: a.id().required(),
      candidateProfile: a.belongsTo('CandidateProfile', 'candidateProfileId'),
      jobRoleId: a.id().required(),
      jobRole: a.belongsTo('JobRole', 'jobRoleId'),
      companyId: a.id().required(),
      overallScore: a.float(),
      skillMatchScore: a.float(),
      experienceFitScore: a.float(),
      salaryFitScore: a.float(),
      locationFitScore: a.float(),
      embeddingScore: a.float(),
      rank: a.integer(),
      isShortlisted: a.boolean().default(false),
      // Relationships
      offers: a.hasMany('Offer', 'matchId'),
    })
    .secondaryIndexes((index) => [
      index('cohortId').queryField('listMatchByCohortId'),
      index('candidateProfileId').queryField('listMatchByCandidateProfileId'),
      index('companyId').queryField('listMatchByCompanyId'),
      index('jobRoleId').queryField('listMatchByJobRoleId'),
    ])
    .authorization((allow) => [
      allow.groups(['ADMIN', 'CONCIERGE']),
      allow.owner().to(['read']),
      allow.authenticated().to(['read']),
    ]),

  // =========================================================================
  // 10. Offer
  // =========================================================================
  Offer: a
    .model({
      matchId: a.id().required(),
      match: a.belongsTo('Match', 'matchId'),
      cohortId: a.id().required(),
      cohort: a.belongsTo('MatchDayCohort', 'cohortId'),
      companyId: a.id().required(),
      company: a.belongsTo('Company', 'companyId'),
      jobRoleId: a.id().required(),
      jobRole: a.belongsTo('JobRole', 'jobRoleId'),
      candidateProfileId: a.id().required(),
      candidateProfile: a.belongsTo('CandidateProfile', 'candidateProfileId'),
      salary: a.integer(),
      equity: a.string(),
      signingBonus: a.integer(),
      benefits: a.string().array(),
      message: a.string(),
      status: a.ref('OfferStatus').required().default('PENDING'),
      expiresAt: a.datetime(),
      respondedAt: a.datetime(),
      responseMessage: a.string(),
    })
    .secondaryIndexes((index) => [
      index('candidateProfileId').queryField('listOfferByCandidateProfileId'),
      index('companyId').queryField('listOfferByCompanyId'),
      index('cohortId').queryField('listOfferByCohortId'),
      index('status').queryField('listOfferByStatus'),
    ])
    .authorization((allow) => [
      allow.groups(['ADMIN', 'CONCIERGE']),
      allow.owner().to(['read', 'update']),
    ]),

  // =========================================================================
  // 11. InterviewSession (AI-driven interview sessions)
  // =========================================================================
  InterviewSession: a
    .model({
      candidateProfileId: a.id().required(),
      candidateProfile: a.belongsTo('CandidateProfile', 'candidateProfileId'),
      type: a.ref('InterviewType').required(),
      status: a.ref('InterviewStatus').required().default('SCHEDULED'),
      messages: a.json(),
      score: a.float(),
      feedback: a.json(),
      startedAt: a.datetime(),
      completedAt: a.datetime(),
      durationSeconds: a.integer(),
    })
    .secondaryIndexes((index) => [
      index('candidateProfileId').queryField('listInterviewSessionByCandidateProfileId'),
    ])
    .authorization((allow) => [
      allow.owner().to(['read']),
      allow.groups(['ADMIN', 'CONCIERGE']),
    ]),

  // =========================================================================
  // 12. Interview (company-candidate interviews)
  // =========================================================================
  Interview: a
    .model({
      candidateProfileId: a.id().required(),
      candidateProfile: a.belongsTo('CandidateProfile', 'candidateProfileId'),
      companyId: a.id().required(),
      company: a.belongsTo('Company', 'companyId'),
      jobRoleId: a.id().required(),
      jobRole: a.belongsTo('JobRole', 'jobRoleId'),
      offerId: a.id(),
      type: a.ref('InterviewType').required(),
      status: a.ref('InterviewStatus').required().default('SCHEDULED'),
      scheduledAt: a.datetime(),
      completedAt: a.datetime(),
      meetingUrl: a.url(),
      interviewerName: a.string(),
      interviewerEmail: a.email(),
      feedback: a.json(),
      candidateFeedback: a.json(),
      score: a.float(),
    })
    .secondaryIndexes((index) => [
      index('candidateProfileId').queryField('listInterviewByCandidateProfileId'),
      index('companyId').queryField('listInterviewByCompanyId'),
      index('jobRoleId').queryField('listInterviewByJobRoleId'),
    ])
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['ADMIN', 'CONCIERGE']),
    ]),

  // =========================================================================
  // 13. FraudSignal
  // =========================================================================
  FraudSignal: a
    .model({
      candidateProfileId: a.id().required(),
      candidateProfile: a.belongsTo('CandidateProfile', 'candidateProfileId'),
      signalType: a.string().required(),
      severity: a.ref('FraudSignalSeverity').required(),
      description: a.string(),
      evidence: a.json(),
      isResolved: a.boolean().default(false),
      resolvedBy: a.string(),
      resolvedAt: a.datetime(),
      resolution: a.string(),
    })
    .secondaryIndexes((index) => [
      index('candidateProfileId').queryField('listFraudSignalByCandidateProfileId'),
    ])
    .authorization((allow) => [
      allow.groups(['ADMIN']),
    ]),

  // =========================================================================
  // 14. Incentive
  // =========================================================================
  Incentive: a
    .model({
      userProfileId: a.id().required(),
      userProfile: a.belongsTo('UserProfile', 'userProfileId'),
      candidateProfileId: a.id(),
      candidateProfile: a.belongsTo('CandidateProfile', 'candidateProfileId'),
      type: a.ref('IncentiveType').required(),
      amount: a.float().required(),
      currency: a.string().default('USD'),
      status: a.ref('IncentiveStatus').required().default('PENDING'),
      triggerEvent: a.string(),
      triggerEntityId: a.string(),
      approvedBy: a.string(),
      approvedAt: a.datetime(),
      paidAt: a.datetime(),
      tremendousOrderId: a.string(),
      notes: a.string(),
    })
    .secondaryIndexes((index) => [
      index('userProfileId').queryField('listIncentiveByUserProfileId'),
      index('candidateProfileId').queryField('listIncentiveByCandidateProfileId'),
      index('status').queryField('listIncentiveByStatus'),
    ])
    .authorization((allow) => [
      allow.owner().to(['read']),
      allow.groups(['ADMIN', 'CONCIERGE']),
    ]),

  // =========================================================================
  // 15. Invoice
  // =========================================================================
  Invoice: a
    .model({
      companyId: a.id().required(),
      company: a.belongsTo('Company', 'companyId'),
      candidateProfileId: a.id(),
      jobRoleId: a.id(),
      jobRole: a.belongsTo('JobRole', 'jobRoleId'),
      amount: a.float().required(),
      feePercentage: a.float().default(18),
      baseSalary: a.integer(),
      stripeInvoiceId: a.string(),
      stripePaymentIntentId: a.string(),
      status: a.string().required().default('DRAFT'),
      dueDate: a.date(),
      paidAt: a.datetime(),
      notes: a.string(),
    })
    .secondaryIndexes((index) => [
      index('companyId').queryField('listInvoiceByCompanyId'),
      index('status').queryField('listInvoiceByStatus'),
    ])
    .authorization((allow) => [
      allow.groups(['ADMIN', 'CONCIERGE']),
      allow.owner().to(['read']),
    ]),

  // =========================================================================
  // 16. BlogPost
  // =========================================================================
  BlogPost: a
    .model({
      title: a.string().required(),
      slug: a.string().required(),
      content: a.string(),
      excerpt: a.string(),
      coverImageS3Key: a.string(),
      author: a.string(),
      tags: a.string().array(),
      status: a.ref('ContentStatus').required().default('DRAFT'),
      publishedAt: a.datetime(),
      seoTitle: a.string(),
      seoDescription: a.string(),
    })
    .secondaryIndexes((index) => [
      index('slug').queryField('listBlogPostBySlug'),
      index('status')
        .sortKeys(['publishedAt'])
        .queryField('listBlogPostByStatusAndPublishedAt'),
    ])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.groups(['ADMIN']),
    ]),

  // =========================================================================
  // 17. GlossaryTerm
  // =========================================================================
  GlossaryTerm: a
    .model({
      term: a.string().required(),
      slug: a.string().required(),
      definition: a.string().required(),
      category: a.string(),
      relatedTerms: a.string().array(),
      status: a.ref('ContentStatus').required().default('DRAFT'),
    })
    .secondaryIndexes((index) => [
      index('slug').queryField('listGlossaryTermBySlug'),
      index('category').queryField('listGlossaryTermByCategory'),
    ])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.groups(['ADMIN']),
    ]),

  // =========================================================================
  // 18. Event
  // =========================================================================
  Event: a
    .model({
      title: a.string().required(),
      description: a.string(),
      date: a.datetime().required(),
      endDate: a.datetime(),
      location: a.string(),
      isVirtual: a.boolean().default(false),
      registrationUrl: a.url(),
      coverImageS3Key: a.string(),
      status: a.ref('ContentStatus').required().default('DRAFT'),
      tags: a.string().array(),
    })
    .secondaryIndexes((index) => [
      index('status').queryField('listEventByStatus'),
    ])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.groups(['ADMIN']),
    ]),

  // =========================================================================
  // 19. NewsletterSubscriber
  // =========================================================================
  NewsletterSubscriber: a
    .model({
      email: a.email().required(),
      source: a.string(),
      subscribedAt: a.datetime(),
      isActive: a.boolean().default(true),
    })
    .secondaryIndexes((index) => [
      index('email').queryField('listNewsletterSubscriberByEmail'),
    ])
    .authorization((allow) => [
      allow.publicApiKey().to(['create']),
      allow.groups(['ADMIN']),
    ]),

  // =========================================================================
  // 20. ScheduleCallRequest
  // =========================================================================
  ScheduleCallRequest: a
    .model({
      companyName: a.string().required(),
      contactName: a.string().required(),
      contactEmail: a.email().required(),
      contactPhone: a.phone(),
      companySize: a.string(),
      message: a.string(),
      status: a.string().default('NEW'),
      notes: a.string(),
      respondedAt: a.datetime(),
      respondedBy: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['create']),
      allow.groups(['ADMIN', 'CONCIERGE']),
    ]),

  // =========================================================================
  // 21. Notification
  // =========================================================================
  Notification: a
    .model({
      userProfileId: a.id().required(),
      userProfile: a.belongsTo('UserProfile', 'userProfileId'),
      title: a.string().required(),
      message: a.string().required(),
      type: a.string(),
      isRead: a.boolean().default(false),
      actionUrl: a.string(),
      metadata: a.json(),
    })
    .secondaryIndexes((index) => [
      index('userProfileId')
        .sortKeys(['createdAt'])
        .queryField('listNotificationByUserProfileId'),
    ])
    .authorization((allow) => [
      allow.owner().to(['read', 'update']),
      allow.groups(['ADMIN', 'CONCIERGE']).to(['create', 'read']),
    ]),

  // =========================================================================
  // 22. AuditLog
  // =========================================================================
  AuditLog: a
    .model({
      userId: a.string().required(),
      action: a.string().required(),
      entityType: a.string().required(),
      entityId: a.string(),
      details: a.json(),
      ipAddress: a.ipAddress(),
    })
    .secondaryIndexes((index) => [
      index('userId').queryField('listAuditLogByUserId'),
      index('entityType')
        .sortKeys(['createdAt'])
        .queryField('listAuditLogByEntityType'),
    ])
    .authorization((allow) => [
      allow.groups(['ADMIN']),
    ]),

  // =========================================================================
  // Custom Mutations (Lambda-backed)
  // =========================================================================

  /**
   * Send a message in an AI interview session and get the AI response.
   */
  sendInterviewMessage: a
    .mutation()
    .arguments({
      sessionId: a.id().required(),
      message: a.string().required(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(sendInterviewMessageFn)),

  /**
   * Start a new AI interview session for a candidate.
   */
  startInterviewSession: a
    .mutation()
    .arguments({
      candidateProfileId: a.id().required(),
      type: a.string().required(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(startInterviewSessionFn)),

  /**
   * Run the AI screening pipeline for a candidate.
   */
  runScreening: a
    .mutation()
    .arguments({
      candidateProfileId: a.id().required(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.groups(['ADMIN', 'CONCIERGE'])])
    .handler(a.handler.function(runScreeningFn)),

  /**
   * Execute the matching algorithm for a Match Day cohort.
   */
  runMatchingAlgorithm: a
    .mutation()
    .arguments({
      cohortId: a.id().required(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.groups(['ADMIN'])])
    .handler(a.handler.function(runMatchingAlgorithmFn)),

  /**
   * Analyze a candidate's GitHub profile and repositories.
   */
  analyzeGitHub: a
    .mutation()
    .arguments({
      candidateProfileId: a.id().required(),
      githubUrl: a.url().required(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.groups(['ADMIN', 'CONCIERGE'])])
    .handler(a.handler.function(analyzeGitHubFn)),

  /**
   * Run fraud detection checks against a candidate profile.
   */
  runFraudDetection: a
    .mutation()
    .arguments({
      candidateProfileId: a.id().required(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.groups(['ADMIN'])])
    .handler(a.handler.function(runFraudDetectionFn)),

  /**
   * Send a transactional email via SES.
   */
  sendEmail: a
    .mutation()
    .arguments({
      to: a.string().required(),
      subject: a.string().required(),
      templateName: a.string().required(),
      templateData: a.json(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.groups(['ADMIN', 'CONCIERGE'])])
    .handler(a.handler.function(sendEmailFn)),

  /**
   * Process an incentive payout through Tremendous.
   */
  processIncentivePayout: a
    .mutation()
    .arguments({
      incentiveId: a.id().required(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.groups(['ADMIN'])])
    .handler(a.handler.function(processIncentivePayoutFn)),

  /**
   * Generate a job description using AI.
   */
  generateJobDescription: a
    .mutation()
    .arguments({
      title: a.string().required(),
      roleFocus: a.string(),
      experienceLevel: a.string(),
      companyId: a.id(),
      requirements: a.string().array(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(generateJobDescriptionFn)),

  /**
   * Schedule an interview between a candidate and a company.
   */
  scheduleInterview: a
    .mutation()
    .arguments({
      candidateProfileId: a.id().required(),
      companyId: a.id().required(),
      jobRoleId: a.id().required(),
      offerId: a.id(),
      type: a.string().required(),
      scheduledAt: a.datetime().required(),
      interviewerName: a.string(),
      interviewerEmail: a.string(),
    })
    .returns(a.json())
    .authorization((allow) => [allow.groups(['ADMIN', 'CONCIERGE'])])
    .handler(a.handler.function(scheduleInterviewFn)),
});

// ---------------------------------------------------------------------------
// Export typed schema and data resource
// ---------------------------------------------------------------------------

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
