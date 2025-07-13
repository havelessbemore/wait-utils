import { throwIfAborted } from "./utils/throwIfAborted";

/**
 * Waits for the specified number of milliseconds.
 *
 * Supports cancellation via an `AbortSignal`.
 *
 * @param delay - The number of milliseconds to wait.
 * @param signal - Optional `AbortSignal` to cancel the wait early.
 *
 * @returns A promise that:
 * - resolves after the delay
 * - rejects with the `AbortSignal.reason` if cancelled before the delay
 */
export async function wait(
  delay?: number | null,
  signal?: AbortSignal,
): Promise<void> {
  throwIfAborted(signal);

  if (delay == null || delay <= 0) {
    return;
  }

  if (signal == null) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(signal.reason);
    };

    const onResolve = () => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    };

    const timeoutId = setTimeout(onResolve, delay);

    if (signal.aborted) {
      onAbort();
    } else {
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}
