import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

// ── Function imports (uncomment as implementations are added) ──
// import { resumeParser } from './functions/resume-parser/resource';
// import { matchingEngine } from './functions/matching-engine/resource';
// import { aiScreeningAgent } from './functions/ai-screening-agent/resource';
// import { aiInterviewer } from './functions/ai-interviewer/resource';
// import { sendEmail } from './functions/send-email/resource';
// import { stripeWebhook } from './functions/stripe-webhook/resource';
// import { githubAnalyzer } from './functions/github-analyzer/resource';
// import { generateJobDescription } from './functions/generate-job-description/resource';
// import { calendarIntegration } from './functions/calendar-integration/resource';
// import { matchDayScheduler } from './functions/match-day-scheduler/resource';
// import { cohortReminder } from './functions/cohort-reminder/resource';
// import { fraudDetector } from './functions/fraud-detector/resource';
// import { processIncentive } from './functions/process-incentive/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  // ── Register functions here as they are implemented ──
  // resumeParser,
  // matchingEngine,
  // aiScreeningAgent,
  // aiInterviewer,
  // sendEmail,
  // stripeWebhook,
  // githubAnalyzer,
  // generateJobDescription,
  // calendarIntegration,
  // matchDayScheduler,
  // cohortReminder,
  // fraudDetector,
  // processIncentive,
});

// ── Bedrock IAM policy (enable when AI features are ready) ──
// import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
//
// const bedrockPolicy = new PolicyStatement({
//   effect: Effect.ALLOW,
//   actions: [
//     'bedrock:InvokeModel',
//     'bedrock:InvokeModelWithResponseStream',
//   ],
//   resources: [
//     'arn:aws:bedrock:*::foundation-model/anthropic.claude-*',
//     'arn:aws:bedrock:*::foundation-model/amazon.titan-*',
//   ],
// });
//
// // Attach to specific Lambda functions that need Bedrock access:
// backend.aiScreeningAgent.resources.lambda.addToRolePolicy(bedrockPolicy);
// backend.aiInterviewer.resources.lambda.addToRolePolicy(bedrockPolicy);
// backend.generateJobDescription.resources.lambda.addToRolePolicy(bedrockPolicy);
// backend.matchingEngine.resources.lambda.addToRolePolicy(bedrockPolicy);
