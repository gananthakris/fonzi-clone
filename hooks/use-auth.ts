"use client";

import { useState, useEffect, useCallback } from "react";
import { Hub } from "aws-amplify/utils";
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  confirmSignUp as amplifyConfirmSignUp,
  type SignInInput,
  type SignUpInput,
} from "aws-amplify/auth";
import { getCurrentUser } from "@/lib/auth-utils";
import type { AuthUser } from "@/lib/types";

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: AuthUser["role"];
  groups: string[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    attributes?: Record<string, string>
  ) => Promise<{ isSignUpComplete: boolean; nextStep: unknown }>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

/**
 * Central auth hook that provides the current user state, role information,
 * and auth action helpers. Listens for Amplify Hub auth events to keep the
 * state in sync across tabs and token refreshes.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current user on mount
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Listen for Hub auth events (sign-in, sign-out, token refresh)
  useEffect(() => {
    const unsubscribe = Hub.listen("auth", async ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          await fetchUser();
          break;
        case "signedOut":
          setUser(null);
          break;
        case "tokenRefresh":
          await fetchUser();
          break;
        case "tokenRefresh_failure":
          setUser(null);
          break;
      }
    });

    return () => unsubscribe();
  }, [fetchUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const input: SignInInput = { username: email, password };
      await amplifySignIn(input);
      // Hub event will trigger fetchUser
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign in failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      attributes?: Record<string, string>
    ) => {
      try {
        setError(null);
        setIsLoading(true);
        const input: SignUpInput = {
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              ...attributes,
            },
          },
        };
        const result = await amplifySignUp(input);
        return {
          isSignUpComplete: result.isSignUpComplete,
          nextStep: result.nextStep,
        };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Sign up failed. Please try again.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const confirmSignUp = useCallback(async (email: string, code: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await amplifyConfirmSignUp({ username: email, confirmationCode: code });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Confirmation failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await amplifySignOut({ global: true });
      // Hub event will clear the user
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign out failed. Please try again.";
      setError(message);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    role: user?.role ?? null,
    groups: user?.groups ?? [],
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    error,
    clearError,
  };
}
