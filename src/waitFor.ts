import { RetryError } from "./errors/retryError";
import { timeout } from "./timeout";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type TimeoutError } from "./errors/timeoutError";
import { or } from "./utils/or";
import { isFunction } from "./utils/isFunction";
import { setTimeoutAsync } from "./utils/setTimeoutAsync";
import { throwIfAborted } from "./utils/throwIfAborted";

/**
 * A callback invoked before each retry attempt in {@link waitFor}. Can be asynchronous.
 *
 * If the callback returns `false`, the wait will be aborted and a
 * {@link RetryError} will be thrown. Returning any other value
 * will continue the wait.
 *
 * @typeParam T - Type of optional context passed in {@link WaitForOptions}.
 *
 * @param delay - The time to wait before the next retry attempt, in milliseconds.
 * @param attempt - The current attempt number, starting at `1`.
 * @param context - The context value passed in {@link WaitForOptions}.
 *
 * @returns `false` to cancel the retry and throw a {@link RetryError}, otherwise continue.
 */
export type OnRetryCallback<T = undefined> = (
  delay: number,
  attempt: number,
  context: T,
) => boolean | void | Promise<boolean | void>;

/**
 * A callback to determine the delay (in milliseconds)
 * before the next retry attempt. Can be asynchronous.
 *
 * @template T - Type of optional context passed in {@link WaitForOptions}.
 *
 * @param prevDelay - The previous delay, or `undefined` for the first call.
 * @param attempt - The current attempt number, starting at `1`.
 * @param context - The context value passed in {@link WaitForOptions}.
 *
 * @returns A delay in milliseconds to wait. A value ≤ `0` will resolve the wait immediately.
 */
export type WaitForCallback<T = undefined> = (
  prevDelay: number | undefined,
  attempt: number,
  context: T,
) => number | Promise<number>;

/**
 * Optional settings that control the behavior of a {@link waitFor} operation.
 */
export interface WaitForOptions<T = undefined> {
  /**
   * Shared context passed to both `callbackfn` and `onRetry`.
   * Useful for providing additional data or state.
   */
  context?: T;

  /**
   * A callback invoked before each retry attempt. Can be asynchronous.
   *
   * Use this to log, track, or control retry behavior dynamically.
   * The callback receives the `delay` before the next attempt,
   * the current `attempt` number (starting at 1), and `context` (if provided).
   * If `false` is returned, a {@link RetryError} is thrown.
   */
  onRetry?: OnRetryCallback<T>;

  /**
   * An `AbortSignal` to cancel waiting and throw an `AbortError`.
   */
  signal?: AbortSignal;

  /**
   * Maximum total duration to wait before timing out, in milliseconds.
   *
   * If the wait does not complete within this duration,
   * a {@link TimeoutError} is thrown.
   */
  timeout?: number;
}

/**
 * Waits in a loop using fixed or dynamic backoff.
 *
 * The loops repeats until the wait is cancelled or the callback (if provided) returns a value ≤ 0.
 *
 * @template T - Type of optional context passed in {@link WaitForOptions}.
 *
 * @param delayOrCallback - Fixed delay in ms or a function returning the dynamic delay.
 *
 * @param options - Optional settings. See {@link WaitForOptions}.
 *
 * @returns A promise that:
 * - resolves when callaback returns ≤ 0,
 *  - rejects with `AbortError`, {@link RetryError}, or {@link TimeoutError} depending on the cancel condition.
 *
 * @throws A {@link RetryError} if `onRetry` returns `false`.
 * @throws A {@link TimeoutError} if the total wait exceeds the given timeout.
 * @throws An {@link AbortError} if `signal` is aborted before completion.
 *
 * @example
 * ```ts
 * await waitFor(
 *   (prevDelay, attempt, ctx) => {
 *     if (attempt > 5) return 0; // stop after 5 retries
 *     return prevDelay ? prevDelay * 2 : 100; // initial delay 100 ms, then exponential
 *   },
 *   {
 *     context: { task: "my-task" },
 *     onRetry: (delay, attempt, ctx) => {
 *       console.log(`Retry ${attempt}: waiting ${delay}ms for ${ctx.task}`);
 *     },
 *     timeout: 10000
 *   }
 * );
 * ```
 */
export async function waitFor(
  delayOrCallback: number | WaitForCallback,
  options: WaitForOptions = {},
): Promise<void> {
  throwIfAborted(options.signal);

  const { context, onRetry, timeout: timeoutMs } = options;
  const callback = isFunction(delayOrCallback)
    ? delayOrCallback
    : () => delayOrCallback;
  let signal = options.signal;

  const main = async () => {
    throwIfAborted(signal);

    let ms: number | undefined = undefined;
    // eslint-disable-next-line no-constant-condition
    for (let attempt = 1; true; ++attempt) {
      ms = await callback(ms, attempt, context);

      throwIfAborted(signal);
      if (!(ms > 0)) {
        break;
      }

      const response = await onRetry?.(ms, attempt, context);
      if (response === false) {
        throw new RetryError();
      }

      await setTimeoutAsync(ms, signal);
    }
  };

  let promise = main();
  if (timeoutMs != null) {
    const timeoutController = new AbortController();
    signal = or(signal, timeoutController.signal);
    const timeoutPromise = timeout(timeoutMs, signal);
    promise = Promise.race([promise, timeoutPromise]).finally(() =>
      timeoutController.abort(),
    );
  }

  await promise;
}
