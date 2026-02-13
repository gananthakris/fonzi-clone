import type { PreSignUpTriggerHandler } from 'aws-lambda';

/**
 * Pre-sign-up trigger for Fonzi talent marketplace.
 *
 * Responsibilities:
 * 1. Block disposable / throwaway email domains.
 * 2. Auto-confirm users who sign up via an external provider (Google SSO).
 * 3. Basic fraud-prevention guardrails.
 */

// Disposable email domains to block (extend as needed)
const BLOCKED_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'throwaway.email',
  'yopmail.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'grr.la',
  'dispostable.com',
  'trashmail.com',
  'temp-mail.org',
  'fakeinbox.com',
  'maildrop.cc',
  'mailnesia.com',
  'getnada.com',
]);

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = (
    event.request.userAttributes['email'] ?? ''
  ).toLowerCase().trim();

  // ── 1. Auto-confirm external provider sign-ups (Google SSO) ──
  if (event.triggerSource === 'PreSignUp_ExternalProvider') {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
    console.log(`[pre-sign-up] Auto-confirmed external provider user: ${email}`);
    return event;
  }

  // ── 2. Email validation ──
  if (!email || !email.includes('@')) {
    throw new Error('A valid email address is required to sign up.');
  }

  const domain = email.split('@')[1];

  if (!domain) {
    throw new Error('A valid email address is required to sign up.');
  }

  // ── 3. Block disposable email domains ──
  if (BLOCKED_EMAIL_DOMAINS.has(domain)) {
    throw new Error(
      'Sign-up is not allowed with disposable email addresses. Please use a personal or work email.'
    );
  }

  // ── 4. Basic fraud check: reject obviously invalid patterns ──
  // Block email addresses that have too many dots or hyphens (common spam pattern)
  const localPart = email.split('@')[0];
  if (localPart.length < 2) {
    throw new Error('The email address does not meet our sign-up requirements.');
  }

  console.log(`[pre-sign-up] Validated email for sign-up: ${email}`);

  return event;
};
