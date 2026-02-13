"use client";

import { useState, useEffect, useCallback } from "react";
import { client } from "@/lib/client";
import { useAuth } from "@/hooks/use-auth";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  onboardingComplete?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetches and manages the UserProfile for the currently authenticated user.
 * If no profile exists on first login, it creates one automatically.
 */
export function useUserProfile(): UseUserProfileReturn {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Try to get the existing profile
      const { data, errors } = await client.models.UserProfile.get({
        id: user.id,
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      if (data) {
        setProfile(data as unknown as UserProfile);
      } else {
        // First login: create a new profile
        const { data: newProfile, errors: createErrors } =
          await client.models.UserProfile.create({
            id: user.id,
            email: user.email,
            role: user.role ?? "CANDIDATE",
          });

        if (createErrors && createErrors.length > 0) {
          throw new Error(createErrors[0].message);
        }

        setProfile(newProfile as unknown as UserProfile);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load user profile.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.email, user?.role]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchProfile();
    } else if (!authLoading && !isAuthenticated) {
      setProfile(null);
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, fetchProfile]);

  return {
    profile,
    isLoading: authLoading || isLoading,
    error,
    refetch: fetchProfile,
  };
}
