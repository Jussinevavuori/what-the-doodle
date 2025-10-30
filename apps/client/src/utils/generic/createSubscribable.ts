/**
 * Create a pub-sub channel of type T
 */
export function createSubscribable<T>() {
  const subscribers = new Set<(value: T) => void>();
  let latest: T | undefined;

  return {
    /**
     * Access the latest value.
     */
    getLatest() {
      return latest;
    },

    /**
     * Access and map the latest value.
     */
    mapLatest<TOutput>(map: (t: T) => TOutput): TOutput | undefined {
      if (!latest) return undefined;
      return map(latest);
    },

    /**
     * Subscribe to published value events with a listener.
     */
    subscribe(callback: (value: T) => void, options: { abortSignal?: AbortSignal } = {}) {
      // Subscribe
      subscribers.add(callback);

      // Abort handler
      function handleAbort() {
        subscribers.delete(callback);
      }

      // Respect the abort signal for unsubscribing
      if (options.abortSignal) {
        if (options.abortSignal.aborted) {
          handleAbort();
          return () => void 0;
        }
        options.abortSignal.addEventListener("abort", handleAbort);
      }

      // Unsubscribe when the callback is removed
      return () => {
        subscribers.delete(callback);
        if (options.abortSignal) {
          options.abortSignal.removeEventListener("abort", handleAbort);
        }
      };
    },

    /**
     * Publish a new value.
     */
    publish(value: T) {
      latest = value;
      subscribers.forEach((callback) => {
        try {
          callback(value);
        } catch (error) {
          console.error("Error in subscriber callback:", error);
        }
      });
    },
  };
}

export type Subscribable<T> = ReturnType<typeof createSubscribable<T>>;
