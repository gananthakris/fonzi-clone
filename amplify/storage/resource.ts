import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'fonziStorage',
  access: (allow) => ({
    // ── Resumes: owner uploads, authenticated reads own, admins read all ──
    'resumes/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.groups(['ADMIN', 'CONCIERGE']).to(['read']),
    ],

    // ── Avatars: owner uploads, everyone can read (public) ──
    'avatars/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
    ],

    // ── Company logos: owner uploads, everyone can read (public) ──
    'logos/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
    ],

    // ── Blog images: admins upload, everyone can read ──
    'blog-images/*': [
      allow.groups(['ADMIN']).to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
    ],

    // ── Event images: admins upload, everyone can read ──
    'event-images/*': [
      allow.groups(['ADMIN']).to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
    ],
  }),
});
