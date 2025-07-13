import { TimeoutError } from "./errors/timeoutError";
import { wait } from "./wait";

/**
 * Rejects with a `TimeoutError` after the specified delay,
 * unless cancelled by an `AbortSignal`.
 *
 * @param delay - The number of milliseconds to wait before timing out.
 * @param signal - Optional `AbortSignal` to cancel the timeout.
 *
 * @returns A promise that:
 * - resolves if the signal is aborted before the delay
 * - rejects with a `TimeoutError` if the delay completes
 * - rethrows an error if an unexpected rejection occurs
 */
export function timeout(
  delay?: number | null,
  signal?: AbortSignal,
): Promise<void> {
  return wait(delay, signal).then(
    () => {
      throw new TimeoutError();
    },
    (error) => {
      if (signal?.reason !== error) {
        throw error;
      }
    },
  );
}
