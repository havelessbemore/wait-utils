// Node 17.3 (Release date: 2021-12-17)
export const HAS_THROW_IF_ABORTED = "throwIfAborted" in AbortSignal.prototype;

/**
 * Throws `AbortSignal.reason` if the signal
 * has been aborted; otherwise it does nothing.
 */
export const throwIfAborted = HAS_THROW_IF_ABORTED ? nativeFn : polyfillFn;

export function nativeFn(signal?: AbortSignal): void {
  signal?.throwIfAborted();
}

export function polyfillFn(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw signal.reason;
  }
}
