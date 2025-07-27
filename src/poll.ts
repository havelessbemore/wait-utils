import { IntervalContext, setIntervalAsync } from "./setIntervalAsync";
import { timeout } from "./timeout";
import { hasOwnProperty } from "./utils/hasOwnProperty";
import { or } from "./utils/or";
import { throwIfAborted } from "./utils/throwIfAborted";

/**
 * A hook invoked after each successful callback execution in {@link poll}.
 *
 * Can be used for logging, adjusting the next delay, or stopping the wait loop.
 *
 * This is skipped if the callback stops the wait or throws.
 *
 * @param context - The current {@link PollContext}.
 */
export type AfterPollCallback<T = unknown> = (
  context: PollContext<T>,
) => unknown | Promise<unknown>;

/**
 * The main function invoked at each iteration in {@link poll}.
 *
 * This function performs the primary asynchronous operation.
 * To stop further attempts, set `context.stop = true`.
 *
 * @param context - The current {@link PollContext}.
 *
 * @returns A result value, or a Promise that resolves to one.
 */
export type PollCallback<T = unknown, R = unknown> = (
  context: PollContext<T>,
) => R | Promise<R>;

/**
 * Context object in {@link poll}.
 */
export interface PollContext<T = unknown> {
  /**
   * The current attempt number, starting from `1` and incremented automatically.
   * @readonly
   */
  readonly attempt: number;

  /**
   * The delay (in milliseconds) before the next attempt.
   *
   * Can be updated dynamically to implement backoff, jitter, etc.
   */
  delay?: number | null;

  /**
   * Set to `true` to stop further attempts.
   */
  stop?: boolean;

  /**
   * User-provided data.
   *
   * Useful for sharing state or configuration across attempts.
   */
  userData?: T;
}

/**
 * Configuration options for {@link poll}.
 */
export interface PollOptions<T = unknown> {
  /**
   * A function to run after each poll attempt.
   *
   * Can be used to log results, inspect attempt state, or modify future behavior.
   */
  afterPoll?: AfterPollCallback<T>;

  /**
   * The delay (in milliseconds) between subsequent attempts.
   *
   * Can be changed dynamically via {@link PollContext.delay | context.delay}.
   */
  delay?: number | null;

  /**
   * The delay (in milliseconds) before the first attempt.
   * If not specified, falls back to {@link delay}.
   */
  initialDelay?: number | null;

  /**
   * An {@link AbortSignal} to cancel the wait loop.
   *
   * If triggered, the function throws an `AbortError`.
   */
  signal?: AbortSignal;

  /**
   * The maximum total duration (in milliseconds) to wait before timing out.
   *
   * If exceeded, the function throws a `TimeoutError`.
   */
  timeout?: number;

  /**
   * User-provided data.
   *
   * Useful for sharing state or configuration across attempts.
   */
  userData?: T;
}

/**
 * Repeatedly invokes a callback function until it succeeds, is stopped, aborted, or times out.
 *
 * After each successful callback execution, an optional {@link PollOptions.afterPoll}
 * hook is invoked. You can control retry timing by updating `context.delay` or exit
 * early by setting `context.stop = true`.
 *
 * @typeParam T - The shape of the user data passed through the context.
 * @typeParam R - The return type of the callback function.
 *
 * @param callback - The function to invoke on each attempt.
 * @param options - Optional configuration to control timing, retries, and cancellation.
 *
 * @returns The last value returned by the callback.
 *
 * @throws `AbortError` if the operation is cancelled using `signal`.
 * @throws `TimeoutError` if the total wait duration exceeds `timeout`.
 */
export async function poll<T, R>(
  callback: PollCallback<T, R>,
  options: PollOptions<T> = {},
): Promise<R> {
  throwIfAborted(options.signal);
  const { delay, afterPoll, userData } = options;

  let attempt = 0;
  const context: PollContext<T> = { attempt: 0, delay, userData };
  Object.defineProperty(context, "attempt", {
    configurable: false,
    enumerable: true,
    get: () => attempt,
  });

  let signal = options.signal;
  let response!: R;
  const main = async (ctx: IntervalContext) => {
    ++attempt;
    response = await callback(context);
    if (signal?.aborted) {
      return;
    }
    ctx.stop = context.stop;
    if (ctx.stop === true) {
      return;
    }
    await afterPoll?.(context);
    ctx.delay = context.delay ?? 0;
    ctx.stop = context.stop;
  };

  const initialDelay = hasOwnProperty(options, "initialDelay")
    ? options.initialDelay
    : delay;

  if (options.timeout == null) {
    await setIntervalAsync(main, initialDelay ?? 0, signal);
    return response;
  }

  const timeoutController = new AbortController();
  signal = or(options.signal, timeoutController.signal);

  try {
    await Promise.race([
      timeout(options.timeout, signal),
      setIntervalAsync(main, initialDelay ?? 0, signal),
    ]);
    return response;
  } finally {
    timeoutController.abort();
  }
}
