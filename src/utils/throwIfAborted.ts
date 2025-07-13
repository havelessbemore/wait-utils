// Node 17.3 (Release date: 2021-12-17)
export const HAS_THROW_IF_ABORTED = "throwIfAborted" in AbortSignal.prototype;

export function throwIfAborted(signal?: AbortSignal): void {
  if (signal == null) {
    return;
  }
  if (HAS_THROW_IF_ABORTED) {
    signal.throwIfAborted();
  } else if (signal.aborted) {
    throw signal.reason;
  }
}
