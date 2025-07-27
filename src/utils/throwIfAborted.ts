// Node 17.3 (Release date: 2021-12-17)
export const HAS_THROW_IF_ABORTED = "throwIfAborted" in AbortSignal.prototype;

export function getThrowIfAborted(hasNative: boolean) {
  if (hasNative) {
    return function throwIfAborted(signal?: AbortSignal): void {
      signal?.throwIfAborted();
    };
  }
  return function throwIfAborted(signal?: AbortSignal): void {
    if (signal?.aborted) {
      throw signal.reason;
    }
  };
}

export const throwIfAborted = getThrowIfAborted(HAS_THROW_IF_ABORTED);
