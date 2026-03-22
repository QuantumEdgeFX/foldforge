import { lazy, ComponentType } from "react";

/**
 * A wrapper around React.lazy that retries the import if it fails.
 * This is useful for handling "Failed to fetch dynamically imported module" errors
 * which typically happen when a new version of the app is deployed and old chunks are removed.
 */
export function lazyRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  name: string
) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error(`Failed to load chunk for ${name}:`, error);
      
      // Check if we've already retried (to avoid infinite loops)
      const hasRetried = window.sessionStorage.getItem(`retry-${name}`);
      
      if (!hasRetried) {
        window.sessionStorage.setItem(`retry-${name}`, "true");
        window.location.reload();
        return { default: (() => null) as unknown as T };
      }

      // If we already retried and it still fails, throw the error
      throw error;
    }
  });
}
