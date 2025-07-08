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
export async function wait(delay: number, signal?: AbortSignal): Promise<void> {
  throwIfAborted(signal);

  if (delay <= 0) {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onReject);
    };

    const onReject = () => {
      cleanup();
      reject(signal?.reason);
    };

    const onResolve = () => {
      cleanup();
      resolve();
    };

    signal?.addEventListener("abort", onReject, { once: true });
    const timeoutId = setTimeout(onResolve, delay);
  });
}
