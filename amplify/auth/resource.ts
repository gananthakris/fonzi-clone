import { defineAuth, secret } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';
import { preSignUp } from './pre-sign-up/resource';
import { preTokenGeneration } from './pre-token-generation/resource';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        attributeMapping: {
          email: 'email',
          fullname: 'name',
          profilePicture: 'picture',
        },
      },
      callbackUrls: [
        'http://localhost:3000/api/auth/callback',
        'https://fonzi.ai/api/auth/callback',
      ],
      logoutUrls: [
        'http://localhost:3000/',
        'https://fonzi.ai/',
      ],
    },
  },

  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    fullname: {
      required: false,
      mutable: true,
    },
    'custom:role': {
      dataType: 'String',
      mutable: true,
      maxLen: 50,
      minLen: 1,
    },
    'custom:companyId': {
      dataType: 'String',
      mutable: true,
      maxLen: 100,
      minLen: 0,
    },
  },

  multifactor: {
    mode: 'OPTIONAL',
    totp: true,
  },

  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },

  groups: ['ADMIN', 'CONCIERGE', 'CANDIDATE', 'COMPANY_ADMIN', 'COMPANY_MEMBER'],

  triggers: {
    postConfirmation,
    preSignUp,
    preTokenGeneration,
  },

  access: (allow) => [
    allow.resource(postConfirmation).to(['addUserToGroup']),
  ],
});
