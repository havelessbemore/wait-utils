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
    let isCompleted = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

    const cleanup = () => {
      clearTimeout(timeoutId);
      signal.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      if (!isCompleted) {
        isCompleted = true;
        cleanup();
        reject(signal.reason);
      }
    };

    const onResolve = () => {
      if (!isCompleted) {
        isCompleted = true;
        cleanup();
        resolve();
      }
    };

    if (signal.aborted) {
      onAbort();
      return;
    }

    timeoutId = setTimeout(onResolve, delay);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
