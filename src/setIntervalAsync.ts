/**
 * Context object provided to the {@link setIntervalAsync} callback.
 */
export interface IntervalContext {
  /**
   * The delay in milliseconds before the next tick.
   * Defaults to the initial delay provided to {@link setIntervalAsync}.
   * The callback can modify this property to change intervals dynamically.
   */
  delay?: number;

  /**
   * When set to `true`, the inverval is stopped.
   */
  stop?: boolean;

  /**
   * The tick counter, starting at `1` and incremented automatically.
   * @readonly
   * @remarks This property cannot be modified by the callback.
   */
  readonly tickCount: number;
}

/**
 * Asynchronously calls a callback repeatedly at a given interval.
 *
 * Internally uses `setTimeout`, so interval drift may occur.
 *
 * @param callback - Invoked on each tick. Receives a mutable {@link IntervalContext} object,
 *                   allowing the callback to change delay dynamically or stop the interval.
 * @param delay - The delay in milliseconds between invocations.
 *                Can be changed dynamically via `context.delay`.
 * @param signal - An `AbortSignal` which can cancel the interval.
 *
 * @returns A promise that:
 * - resolves when `context.stop` is set to `true` inside the callback (graceful termination),
 * - rejects with `signal.reason` if the signal aborts,
 * - rejects if the callback throws or rejects.
 *
 * @example
 * ```ts
 * let count = 0;
 * setIntervalAsync(ctx => {
 *   console.log("tick", ++count);
 *   ctx.stop = count >= 5;
 * }, 1000).then(() => {
 *    console.log("Completed after 5 ticks");
 * });
 * ```
 */
export function setIntervalAsync(
  callback: (context: IntervalContext) => unknown | Promise<unknown>,
  delay?: number,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    let isRunning = true;
    let tickCount = 0;
    const context: IntervalContext = { tickCount: 0, delay };
    Object.defineProperty(context, "tickCount", {
      configurable: false,
      enumerable: true,
      get: () => tickCount,
    });

    const onAbort = () => {
      if (isRunning) {
        isRunning = false;
        clearTimeout(timeoutId);
        reject(signal?.reason);
      }
    };

    const onError = (error: unknown) => {
      if (isRunning) {
        isRunning = false;
        signal?.removeEventListener("abort", onAbort);
        reject(error);
      }
    };

    const onResolve = () => {
      if (isRunning) {
        isRunning = false;
        signal?.removeEventListener("abort", onAbort);
        resolve();
      }
    };

    const onTimeout = async () => {
      if (!isRunning) {
        return;
      }
      try {
        ++tickCount;
        await callback(context);
        if (context.stop === true) {
          onResolve();
        } else if (isRunning) {
          timeoutId = setTimeout(onTimeout, context.delay);
        }
      } catch (error) {
        onError(error);
      }
    };

    let timeoutId = setTimeout(onTimeout, context.delay);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
