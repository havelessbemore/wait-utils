/**
 * Asynchronously delays execution for the specified duration.
 *
 * @param delay - The number of milliseconds to wait.
 * @param signal - An `AbortSignal` that can cancel the wait early.
 *
 * @returns A promise that resolves after the delay, or rejects with
 *          the `signal.reason` if `signal` is aborted before timeout.
 *
 * @example
 * ```ts
 * // Basic usage
 * await setTimeoutAsync(1000);
 *
 * // Abortable usage
 * const controller = new AbortController();
 * setTimeoutAsync(2000, controller.signal)
 *   .catch(reason => console.log('Aborted due to', reason));
 * controller.abort('Timeout canceled');
 * ```
 */
export function setTimeoutAsync(
  delay?: number,
  signal?: AbortSignal,
): Promise<void> {
  if (signal == null) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(signal.reason);
    };

    const onResolve = () => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    };

    const timeoutId = setTimeout(onResolve, delay);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
