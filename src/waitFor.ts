import { RetryError } from "./errors/retryError";
import { timeout as timeoutFn } from "./timeout";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type TimeoutError } from "./errors/timeoutError";
import { or } from "./utils/or";
import { isFunction } from "./utils/isFunction";
import { throwIfAborted } from "./utils/throwIfAborted";
import { wait } from "./wait";

/**
 * Optional settings that control the behavior of a {@link waitFor} operation.
 */
export interface WaitForOptions {
  /**
   * An `AbortSignal` that allows the wait to be cancelled early.
   *
   * If the signal is already aborted or is aborted before the wait completes,
   * an `AbortError` is thrown.
   */
  signal?: AbortSignal;

  /**
   * A callback invoked before each retry.
   *
   * Receives the time to wait before the operation will be retried,
   * in milliseconds. If the callback returns `false`, the wait will be
   * aborted and a {@link RetryError} will be thrown.
   *
   * @param ms The time to wait for the next retry attempt, in milliseconds.
   * @returns `false` to cancel the retry. Any other value continues retrying.
   */
  onRetry?: (ms: number) => boolean | void | Promise<boolean | void>;

  /**
   * Maximum total duration to wait before timing out, in milliseconds.
   *
   * If the wait does not complete within this duration,
   * a {@link TimeoutError} is thrown.
   */
  timeout?: number;
}

/**
 * Waits repeatedly using a delay function to control retry logic.
 *
 * The callback is invoked before each retry to determine how long to wait
 * (in milliseconds). When it returns a value ≤ 0, the wait ends and
 * the function resolves.
 *
 * Supports cancellation via `AbortSignal`, timeouts, and custom retry behavior.
 *
 * @param callbackfn A function that returns the time to wait (in ms).
 *                     Return a value ≤ 0 to stop waiting and resolve.
 *
 * @param options Optional controls:
 *   - `signal`: aborts the wait early and throws `AbortError`.
 *   - `timeout`: maximum total time to wait before throwing {@link TimeoutError}.
 *   - `onRetry`: called before each retry; returning `false` throws {@link RetryError}.
 *
 * @returns A promise that resolves after waiting completes, or rejects if cancelled.
 *
 * @throws `AbortError` If the operation is aborted via `AbortSignal`.
 * @throws {@link RetryError} If the `onRetry` callback returns `false`.
 * @throws {@link TimeoutError} If the wait exceeds the given timeout.
 */
export function waitFor(
  callbackfn: () => number | Promise<number>,
  options?: WaitForOptions,
): Promise<void>;
/**
 * Waits repeatedly using a fixed delay until a stop condition is
 * met via options.
 *
 * When used with a static delay, this behaves like `setTimeout` with
 * optional cancellation and timeout support. If paired with `onRetry`,
 * it behaves like a fixed-interval poller.
 *
 * @param delay - A fixed delay in milliseconds to wait between retries.
 *
 * @param options - Optional controls:
 *   - `signal`: aborts the wait early and throws `AbortError`.
 *   - `timeout`: maximum total time to wait before throwing {@link TimeoutError}.
 *   - `onRetry`: called before each retry; returning `false` throws {@link RetryError}.
 *
 * @returns A promise that resolves after the wait completes, or rejects if cancelled.
 *
 * @throws `AbortError` If the operation is aborted via the provided `AbortSignal`.
 * @throws {@link RetryError} If the `onRetry` callback returns `false`.
 * @throws {@link TimeoutError} If the wait exceeds the given timeout.
 */
export function waitFor(delay: number, options?: WaitForOptions): Promise<void>;
export async function waitFor(
  delayOrFn: number | (() => number | Promise<number>),
  { signal, onRetry, timeout }: WaitForOptions = {},
): Promise<void> {
  throwIfAborted(signal);

  const callbackfn = isFunction(delayOrFn) ? delayOrFn : () => delayOrFn;
  let combinedSignal = signal;
  let timeoutController: AbortController | undefined = undefined;

  const mainLoop = async () => {
    try {
      throwIfAborted(combinedSignal);
      let ms = await callbackfn();
      while (ms > 0) {
        throwIfAborted(combinedSignal);
        if ((await onRetry?.(ms)) === false) {
          throw new RetryError();
        }
        await wait(ms, combinedSignal);
        ms = await callbackfn();
      }
    } finally {
      timeoutController?.abort();
    }
  };

  if (timeout == null) {
    return mainLoop();
  }

  timeoutController = new AbortController();
  combinedSignal = or(signal, timeoutController.signal);
  return Promise.race([timeoutFn(timeout, combinedSignal), mainLoop()]);
}
