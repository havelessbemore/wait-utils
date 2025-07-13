// Node 20.3 (Release date: 2023-06-08)
export const HAS_ANY = "any" in AbortSignal;

export function or(signal1: AbortSignal, signal2?: AbortSignal): AbortSignal;
export function or(
  signal1: AbortSignal | undefined,
  signal2: AbortSignal,
): AbortSignal;
export function or(
  signal1?: AbortSignal,
  signal2?: AbortSignal,
): AbortSignal | undefined;
export function or(
  signal1?: AbortSignal,
  signal2?: AbortSignal,
): AbortSignal | undefined {
  if (signal1 == null) {
    return signal2;
  }

  if (signal2 == null) {
    return signal1;
  }

  if (HAS_ANY) {
    return AbortSignal.any([signal1, signal2]);
  }

  const controller = new AbortController();

  const onAbort1 = () => {
    if (!controller.signal.aborted) {
      controller.abort(signal1.reason);
      signal2.removeEventListener("abort", onAbort2);
    }
  };

  const onAbort2 = () => {
    if (!controller.signal.aborted) {
      controller.abort(signal2.reason);
      signal1.removeEventListener("abort", onAbort1);
    }
  };

  if (signal1.aborted) {
    controller.abort(signal1.reason);
  } else if (signal2.aborted) {
    controller.abort(signal2.reason);
  } else {
    signal1.addEventListener("abort", onAbort1, { once: true });
    signal2.addEventListener("abort", onAbort2, { once: true });
  }

  return controller.signal;
}
