import { generateClient } from "aws-amplify/data";

// Schema type placeholder - actual schema is in amplify/data/resource.ts
type Schema = any;

export const client = generateClient<Schema>();

/**
 * Server-side client for use in Server Components and Route Handlers.
 * Uses apiKey auth mode to avoid cookie/session dependency.
 */
export function getServerClient() {
  return generateClient<Schema>({ authMode: "apiKey" });
}
