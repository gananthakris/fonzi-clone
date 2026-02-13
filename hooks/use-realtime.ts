"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { client } from "@/lib/client";

type SubscriptionFilter = Record<string, Record<string, unknown>>;

interface UseRealtimeOptions<T> {
  /** The Amplify data model name (e.g. "MatchDayCohort", "Offer") */
  modelName: string;
  /** Optional subscription filter (e.g. { id: { eq: "abc" } }) */
  filter?: SubscriptionFilter;
  /** Whether the subscription is active. Defaults to true. */
  enabled?: boolean;
  /** Callback fired when a new item is created */
  onCreate?: (item: T) => void;
  /** Callback fired when an item is updated */
  onUpdate?: (item: T) => void;
  /** Callback fired when an item is deleted */
  onDelete?: (item: T) => void;
}

interface UseRealtimeReturn<T> {
  /** Most recently received item from any subscription event */
  lastEvent: T | null;
  /** Accumulated list of items received via onCreate events */
  createdItems: T[];
  /** Accumulated list of items received via onUpdate events */
  updatedItems: T[];
  /** Any subscription error */
  error: string | null;
  /** Whether the subscription is currently connected */
  isConnected: boolean;
}

/**
 * Generic real-time subscription hook for Amplify Gen 2 data models.
 * Subscribes to onCreate, onUpdate, and onDelete events for the specified
 * model, with optional filters. Cleans up subscriptions on unmount.
 *
 * Usage:
 * ```ts
 * const { lastEvent, isConnected } = useRealtime<Offer>({
 *   modelName: "Offer",
 *   filter: { candidateId: { eq: userId } },
 *   onUpdate: (offer) => console.log("Offer updated:", offer),
 * });
 * ```
 */
export function useRealtime<T = unknown>(
  options: UseRealtimeOptions<T>
): UseRealtimeReturn<T> {
  const { modelName, filter, enabled = true, onCreate, onUpdate, onDelete } = options;

  const [lastEvent, setLastEvent] = useState<T | null>(null);
  const [createdItems, setCreatedItems] = useState<T[]>([]);
  const [updatedItems, setUpdatedItems] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Store callbacks in refs to avoid re-subscribing when they change
  const onCreateRef = useRef(onCreate);
  const onUpdateRef = useRef(onUpdate);
  const onDeleteRef = useRef(onDelete);

  useEffect(() => {
    onCreateRef.current = onCreate;
  }, [onCreate]);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    onDeleteRef.current = onDelete;
  }, [onDelete]);

  // Reset state when model or filter changes
  const resetState = useCallback(() => {
    setLastEvent(null);
    setCreatedItems([]);
    setUpdatedItems([]);
    setError(null);
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      resetState();
      return;
    }

    // Access the model dynamically from the client
    const model = (client.models as Record<string, unknown>)[modelName] as
      | {
          onCreate: (opts?: { filter?: SubscriptionFilter }) => {
            subscribe: (handlers: {
              next: (event: { data: T }) => void;
              error: (err: Error) => void;
            }) => { unsubscribe: () => void };
          };
          onUpdate: (opts?: { filter?: SubscriptionFilter }) => {
            subscribe: (handlers: {
              next: (event: { data: T }) => void;
              error: (err: Error) => void;
            }) => { unsubscribe: () => void };
          };
          onDelete: (opts?: { filter?: SubscriptionFilter }) => {
            subscribe: (handlers: {
              next: (event: { data: T }) => void;
              error: (err: Error) => void;
            }) => { unsubscribe: () => void };
          };
        }
      | undefined;

    if (!model) {
      setError(`Model "${modelName}" not found on the Amplify data client.`);
      return;
    }

    const subscriptionOpts = filter ? { filter } : undefined;

    const subs: Array<{ unsubscribe: () => void }> = [];

    try {
      // onCreate subscription
      const createSub = model.onCreate(subscriptionOpts).subscribe({
        next: (event) => {
          const item = event.data;
          setLastEvent(item);
          setCreatedItems((prev) => [...prev, item]);
          setIsConnected(true);
          onCreateRef.current?.(item);
        },
        error: (err) => setError(err.message),
      });
      subs.push(createSub);

      // onUpdate subscription
      const updateSub = model.onUpdate(subscriptionOpts).subscribe({
        next: (event) => {
          const item = event.data;
          setLastEvent(item);
          setUpdatedItems((prev) => [...prev, item]);
          setIsConnected(true);
          onUpdateRef.current?.(item);
        },
        error: (err) => setError(err.message),
      });
      subs.push(updateSub);

      // onDelete subscription
      const deleteSub = model.onDelete(subscriptionOpts).subscribe({
        next: (event) => {
          const item = event.data;
          setLastEvent(item);
          setIsConnected(true);
          onDeleteRef.current?.(item);
        },
        error: (err) => setError(err.message),
      });
      subs.push(deleteSub);

      setIsConnected(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Subscription setup failed.";
      setError(message);
    }

    return () => {
      subs.forEach((sub) => sub.unsubscribe());
      setIsConnected(false);
    };
  }, [modelName, filter, enabled, resetState]);

  return {
    lastEvent,
    createdItems,
    updatedItems,
    error,
    isConnected,
  };
}
