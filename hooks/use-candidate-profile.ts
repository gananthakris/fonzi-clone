"use client";

import { useState, useEffect, useCallback } from "react";
import { client } from "@/lib/client";
import { useAuth } from "@/hooks/use-auth";

interface CandidateProfile {
  id: string;
  userId: string;
  status: string;
  firstName?: string | null;
  lastName?: string | null;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  resumeUrl?: string | null;
  roleFocus?: string | null;
  experienceLevel?: string | null;
  workPreference?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  availableFrom?: string | null;
  skills?: string[] | null;
  onboardingStep?: string | null;
  onboardingComplete?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

interface UseCandidateProfileReturn {
  profile: CandidateProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (
    fields: Partial<CandidateProfile>
  ) => Promise<CandidateProfile | null>;
  refetch: () => Promise<void>;
}

/**
 * Fetches and manages the CandidateProfile for the currently authenticated user.
 * Provides an updateProfile helper for partial updates.
 */
export function useCandidateProfile(): UseCandidateProfileReturn {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
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

      // List candidate profiles filtered by the current user's ID
      const { data, errors } = await client.models.CandidateProfile.list({
        filter: { userId: { eq: user.id } },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      if (data && data.length > 0) {
        setProfile(data[0] as unknown as CandidateProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load candidate profile.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchProfile();
    } else if (!authLoading && !isAuthenticated) {
      setProfile(null);
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, fetchProfile]);

  const updateProfile = useCallback(
    async (
      fields: Partial<CandidateProfile>
    ): Promise<CandidateProfile | null> => {
      if (!profile?.id) {
        setError("No profile to update.");
        return null;
      }

      try {
        setError(null);

        const { data, errors } = await client.models.CandidateProfile.update({
          id: profile.id,
          ...fields,
        });

        if (errors && errors.length > 0) {
          throw new Error(errors[0].message);
        }

        const updated = data as unknown as CandidateProfile;
        setProfile(updated);
        return updated;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to update candidate profile.";
        setError(message);
        return null;
      }
    },
    [profile?.id]
  );

  return {
    profile,
    isLoading: authLoading || isLoading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
