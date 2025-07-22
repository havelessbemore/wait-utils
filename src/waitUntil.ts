import { throwIfAborted } from "./utils/throwIfAborted";
import { wait } from "./wait";

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

  const ts = Number(timestamp);
  if (Number.isNaN(ts)) {
    return;
  }

  const ms = ts - performance.now();
  if (ms <= 0) {
    return;
  }

  await wait(ms, signal);
}
