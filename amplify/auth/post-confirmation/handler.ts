import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient();

/**
 * Post-confirmation trigger for Fonzi talent marketplace.
 *
 * After a user confirms their email this handler:
 * 1. Reads the custom:role attribute to decide the Cognito group.
 * 2. Adds the user to CANDIDATE or COMPANY_ADMIN (defaults to CANDIDATE).
 *
 * The UserProfile record creation is handled by the data layer
 * (a DynamoDB stream or a separate GraphQL mutation on the client)
 * so this trigger focuses only on group assignment.
 */
export const handler: PostConfirmationTriggerHandler = async (event) => {
  // Only run for confirmed sign-ups, not for forgotten-password confirmations
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    return event;
  }

  const role = event.request.userAttributes['custom:role'] ?? 'CANDIDATE';

  // Map the role attribute to a valid Cognito group
  const groupMap: Record<string, string> = {
    CANDIDATE: 'CANDIDATE',
    COMPANY_ADMIN: 'COMPANY_ADMIN',
    COMPANY_MEMBER: 'COMPANY_MEMBER',
    CONCIERGE: 'CONCIERGE',
    ADMIN: 'ADMIN',
  };

  const groupName = groupMap[role.toUpperCase()] ?? 'CANDIDATE';

  try {
    await cognitoClient.send(
      new AdminAddUserToGroupCommand({
        GroupName: groupName,
        Username: event.userName,
        UserPoolId: event.userPoolId,
      })
    );

    console.log(
      `[post-confirmation] Added user ${event.userName} to group ${groupName}`
    );
  } catch (error) {
    console.error(
      `[post-confirmation] Failed to add user ${event.userName} to group ${groupName}:`,
      error
    );
    // Do not throw -- we still want the confirmation to succeed even if
    // group assignment fails. The user can be assigned later by an admin.
  }

  return event;
};
