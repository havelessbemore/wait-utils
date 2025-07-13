import { throwIfAborted } from "./utils/throwIfAborted";
import { wait } from "./wait";

/**
 * Waits until the specified high-resolution timestamp is reached.
 *
 * This function uses repeated calls to `wait()` and `performance.now()`
 * to align execution with the given target time.
 *
 * @param timestamp - Target timestamp (in milliseconds) relative to `performance.now()`.
 * @param signal - Optional abort signal to cancel the wait.
 *
 * @returns A promise that resolves when the current time is at or beyond `ts`,
 *          or rejects with `AbortError` if cancelled.
 */
export async function waitUntil(
  timestamp: number,
  signal?: AbortSignal,
): Promise<void> {
  throwIfAborted(signal);

  // Wait until given timestamp
  let now = performance.now();
  while (now < timestamp) {
    await wait(timestamp - now, signal);
    now = performance.now();
  }
}
