import { setTimeoutAsync } from "./setTimeoutAsync";
import { throwIfAborted } from "./utils/throwIfAborted";

/**
 * Waits until the specified high-resolution timestamp is reached.
 *
 * @param timestamp - Target time (in milliseconds) relative to `performance.now()`.
 * @param signal - Optional `AbortSignal` to cancel the wait early.
 *
 * @returns A promise that:
 * - resolves when the current time is at or past the target timestamp
 * - rejects with the signal’s reason if cancelled before the target
 */
export async function waitUntil(
  timestamp?: number | null,
  signal?: AbortSignal,
): Promise<void> {
  throwIfAborted(signal);

  if (timestamp == null) {
    return;
  }

  const delay = Number(timestamp) - performance.now();
  if (!Number.isNaN(delay) && delay > 0) {
    return setTimeoutAsync(delay, signal);
  }
}
