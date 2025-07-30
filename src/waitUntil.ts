import { setTimeoutAsync } from "./setTimeoutAsync";
import { throwIfAborted } from "./utils/throwIfAborted";

/**
 * Waits until the specified time is reached.
 *
 * @param timestamp - Target time:
 *   - If a {@link Date}, relative to {@link Date.now}.
 *   - If a `number`, relative to {@link performance.now}.
 *
 * @param signal - Optional `AbortSignal` to cancel the wait early.
 *
 * @returns A promise that:
 * - resolves when the current time is at or past the target time
 * - rejects with the signal’s reason if cancelled before the target
 */
export async function waitUntil(
  timestamp?: Date | number | null,
  signal?: AbortSignal,
): Promise<void> {
  throwIfAborted(signal);

  if (timestamp == null) {
    return;
  }

  const delay =
    timestamp instanceof Date
      ? timestamp.getTime() - Date.now()
      : Number(timestamp) - performance.now();

  if (!Number.isNaN(delay) && delay > 0) {
    await setTimeoutAsync(delay, signal);
  }
}
