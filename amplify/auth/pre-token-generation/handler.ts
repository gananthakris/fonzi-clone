import type { PreTokenGenerationTriggerHandler } from 'aws-lambda';

/**
 * Pre-token-generation trigger for Fonzi talent marketplace.
 *
 * Injects custom claims into the Cognito ID token so the client
 * can read the user's role and companyId without an extra API call.
 *
 * Claims added:
 * - custom:role     (e.g. CANDIDATE, COMPANY_ADMIN, ADMIN, CONCIERGE)
 * - custom:companyId (company UUID, empty for candidates)
 */
export const handler: PreTokenGenerationTriggerHandler = async (event) => {
  const userAttributes = event.request.userAttributes;

  const role = userAttributes['custom:role'] ?? 'CANDIDATE';
  const companyId = userAttributes['custom:companyId'] ?? '';

  // Collect the groups the user belongs to (set by post-confirmation trigger)
  const groups = event.request.groupConfiguration?.groupsToOverride ?? [];

  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        'custom:role': role,
        'custom:companyId': companyId,
      },
      // Preserve existing group assignments
      groupOverrideDetails: {
        groupsToOverride: groups.length > 0 ? groups : undefined,
      },
    },
  };

  console.log(
    `[pre-token-generation] Injected claims for ${event.userName}: role=${role}, companyId=${companyId}, groups=[${groups.join(', ')}]`
  );

  return event;
};
