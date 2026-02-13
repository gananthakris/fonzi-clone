import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

export const client = generateClient<Schema>();

/**
 * Server-side client for use in Server Components and Route Handlers.
 * Uses apiKey auth mode to avoid cookie/session dependency.
 */
export function getServerClient() {
  return generateClient<Schema>({ authMode: "apiKey" });
}
