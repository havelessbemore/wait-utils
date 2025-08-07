import { setTimeoutAsync } from "./setTimeoutAsync";

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
  signal?.throwIfAborted();

  if (delay == null) {
    return;
  }

  delay = Number(delay);
  if (!Number.isNaN(delay) && delay > 0) {
    return setTimeoutAsync(delay, signal);
  }
}
