import { throwIfAborted } from "./utils";

/**
 * Waits for the specified number of milliseconds.
 *
 * Supports cancellation via `AbortSignal`.
 *
 * @param delay - The number of milliseconds to wait.
 * @param signal - Optional abort signal to cancel the wait early.
 *
 * @returns A promise that resolves after the delay, or rejects with
 *          `AbortError` if cancelled.
 */
export async function wait(
  delay?: number,
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
