"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { client } from "@/lib/client";
import { useAuth } from "@/hooks/use-auth";
import { useRealtime } from "@/hooks/use-realtime";
import type { CountdownTime } from "@/lib/types";

interface MatchDayCohort {
  id: string;
  name: string;
  status: string;
  scheduledAt: string;
  offersLiveAt?: string | null;
  offersDeadlineAt?: string | null;
  completedAt?: string | null;
  maxCandidates?: number | null;
  maxCompanies?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

interface Offer {
  id: string;
  candidateId: string;
  companyId: string;
  roleName?: string | null;
  status: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  message?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

interface Match {
  id: string;
  cohortId: string;
  candidateId: string;
  companyId: string;
  score?: number | null;
  status: string;
  createdAt?: string | null;
  [key: string]: unknown;
}

interface UseMatchDayReturn {
  /** The currently active or next upcoming cohort */
  activeCohort: MatchDayCohort | null;
  /** Countdown to the offer deadline */
  countdown: CountdownTime;
  /** Whether offers are currently live */
  isOffersLive: boolean;
  /** Offers for the current candidate (only populated for CANDIDATE role) */
  offers: Offer[];
  /** Matches for the current company (only populated for COMPANY_ADMIN role) */
  matches: Match[];
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Any error that occurred */
  error: string | null;
  /** Re-fetch all match day data */
  refetch: () => Promise<void>;
}

/**
 * Calculates the countdown time from now until a target date.
 */
function calculateCountdown(targetDate: string | null): CountdownTime {
  if (!targetDate) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const now = Date.now();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isExpired: false };
}

/**
 * Manages the active Match Day lifecycle including cohort data, countdown
 * timers, real-time offer/match updates, and role-specific data fetching.
 */
export function useMatchDay(): UseMatchDayReturn {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeCohort, setActiveCohort] = useState<MatchDayCohort | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [countdown, setCountdown] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Derive whether offers are live from cohort status
  const isOffersLive = activeCohort?.status === "OFFERS_LIVE";

  // Build the cohort filter for real-time subscriptions
  const cohortFilter = useMemo(
    () =>
      activeCohort?.id
        ? { id: { eq: activeCohort.id } }
        : undefined,
    [activeCohort?.id]
  );

  // Real-time subscription on the active cohort
  useRealtime<MatchDayCohort>({
    modelName: "MatchDayCohort",
    filter: cohortFilter,
    enabled: !!activeCohort?.id,
    onUpdate: (updatedCohort) => {
      setActiveCohort(updatedCohort);
    },
  });

  // Real-time subscription on offers (for candidates)
  const offerFilter = useMemo(
    () =>
      user?.id && user.role === "CANDIDATE"
        ? { candidateId: { eq: user.id } }
        : undefined,
    [user?.id, user?.role]
  );

  useRealtime<Offer>({
    modelName: "Offer",
    filter: offerFilter,
    enabled: !!user?.id && user?.role === "CANDIDATE" && isOffersLive,
    onCreate: (newOffer) => {
      setOffers((prev) => {
        // Prevent duplicates
        if (prev.some((o) => o.id === newOffer.id)) return prev;
        return [...prev, newOffer];
      });
    },
    onUpdate: (updatedOffer) => {
      setOffers((prev) =>
        prev.map((o) => (o.id === updatedOffer.id ? updatedOffer : o))
      );
    },
  });

  // Real-time subscription on matches (for companies)
  const matchFilter = useMemo(
    () =>
      user?.companyId && user.role === "COMPANY_ADMIN"
        ? { companyId: { eq: user.companyId } }
        : undefined,
    [user?.companyId, user?.role]
  );

  useRealtime<Match>({
    modelName: "Match",
    filter: matchFilter,
    enabled:
      !!user?.companyId &&
      user?.role === "COMPANY_ADMIN" &&
      !!activeCohort?.id,
    onCreate: (newMatch) => {
      setMatches((prev) => {
        if (prev.some((m) => m.id === newMatch.id)) return prev;
        return [...prev, newMatch];
      });
    },
    onUpdate: (updatedMatch) => {
      setMatches((prev) =>
        prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
      );
    },
  });

  // Fetch the active/upcoming cohort and role-specific data
  const fetchMatchDayData = useCallback(async () => {
    if (!user?.id) {
      setActiveCohort(null);
      setOffers([]);
      setMatches([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Find the active or next upcoming cohort
      // Priority: OFFERS_LIVE > MATCHING > INTERVIEWS_SCHEDULED > SCHEDULED
      const activeStatuses = [
        "OFFERS_LIVE",
        "MATCHING",
        "INTERVIEWS_SCHEDULED",
        "SCHEDULED",
      ];

      let foundCohort: MatchDayCohort | null = null;

      for (const status of activeStatuses) {
        const { data, errors } = await client.models.MatchDayCohort.list({
          filter: { status: { eq: status } },
          limit: 1,
        });

        if (errors && errors.length > 0) {
          throw new Error(errors[0].message);
        }

        if (data && data.length > 0) {
          foundCohort = data[0] as unknown as MatchDayCohort;
          break;
        }
      }

      setActiveCohort(foundCohort);

      // Fetch offers for candidates
      if (foundCohort && user.role === "CANDIDATE") {
        const { data: offerData } = await client.models.Offer.list({
          filter: {
            candidateId: { eq: user.id },
          },
        });
        setOffers((offerData ?? []) as unknown as Offer[]);
      }

      // Fetch matches for companies
      if (foundCohort && user.role === "COMPANY_ADMIN" && user.companyId) {
        const { data: matchData } = await client.models.Match.list({
          filter: {
            companyId: { eq: user.companyId },
            cohortId: { eq: foundCohort.id },
          },
        });
        setMatches((matchData ?? []) as unknown as Match[]);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load Match Day data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.role, user?.companyId]);

  // Fetch data when auth is ready
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchMatchDayData();
    } else if (!authLoading && !isAuthenticated) {
      setActiveCohort(null);
      setOffers([]);
      setMatches([]);
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, fetchMatchDayData]);

  // Countdown timer: ticks every second while offers are live
  useEffect(() => {
    const deadlineAt = activeCohort?.offersDeadlineAt ?? null;

    // Initial calculation
    setCountdown(calculateCountdown(deadlineAt));

    if (!deadlineAt) return;

    countdownIntervalRef.current = setInterval(() => {
      const next = calculateCountdown(deadlineAt);
      setCountdown(next);

      // Stop ticking when expired
      if (next.isExpired && countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [activeCohort?.offersDeadlineAt]);

  return {
    activeCohort,
    countdown,
    isOffersLive,
    offers,
    matches,
    isLoading: authLoading || isLoading,
    error,
    refetch: fetchMatchDayData,
  };
}
