import {
  fetchAuthSession,
  signOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth";
import type { AuthUser } from "@/lib/types";

/**
 * Fetches the current authenticated user's full profile including
 * JWT claims, Cognito groups, and custom attributes.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await fetchAuthSession();
    if (!session.tokens?.idToken) {
      return null;
    }

    const { userId } = await amplifyGetCurrentUser();
    const attributes = await fetchUserAttributes();
    const idToken = session.tokens.idToken;
    const claims = idToken.payload;

    const groups = (claims["cognito:groups"] as string[] | undefined) ?? [];
    const role = getUserRole(groups);
    const companyId = (claims["custom:companyId"] as string) ?? null;

    return {
      id: userId,
      email: attributes.email ?? "",
      role,
      groups,
      companyId,
    };
  } catch {
    return null;
  }
}

/**
 * Derives a single primary role from the user's Cognito group memberships.
 * Priority: ADMIN > COMPANY_ADMIN > CANDIDATE
 */
export function getUserRole(
  groups: string[]
): "ADMIN" | "COMPANY_ADMIN" | "CANDIDATE" | null {
  if (groups.includes("ADMIN")) return "ADMIN";
  if (groups.includes("COMPANY_ADMIN")) return "COMPANY_ADMIN";
  if (groups.includes("CANDIDATE")) return "CANDIDATE";
  return null;
}

/**
 * Returns true if the session user belongs to the ADMIN group.
 */
export function isAdmin(user: AuthUser | null): boolean {
  return user?.groups.includes("ADMIN") ?? false;
}

/**
 * Returns true if the session user belongs to the COMPANY_ADMIN group.
 */
export function isCompanyAdmin(user: AuthUser | null): boolean {
  return user?.groups.includes("COMPANY_ADMIN") ?? false;
}

/**
 * Returns true if the session user belongs to the CANDIDATE group.
 */
export function isCandidate(user: AuthUser | null): boolean {
  return user?.groups.includes("CANDIDATE") ?? false;
}

/**
 * Extracts the companyId from the user's JWT custom claims.
 * Returns null if the user has no associated company.
 */
export function getCompanyId(user: AuthUser | null): string | null {
  return user?.companyId ?? null;
}

/**
 * Signs the current user out globally (invalidates all sessions).
 */
export async function signOutUser(): Promise<void> {
  await signOut({ global: true });
}
