import { RetryError } from "src/retryError";
import { TimeoutError } from "src/timeoutError";
import { wait } from "src/wait";
import { waitFor } from "src/waitFor";

jest.mock("src/wait", () => ({
  wait: jest.fn(() => Promise.resolve()),
}));

describe("waitFor", () => {
  const waitMock = wait as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("resolves immediately if callback returns 0", async () => {
    await expect(waitFor(() => 0)).resolves.toBeUndefined();
    expect(waitMock).not.toHaveBeenCalled();
  });

  it("resolves immediately if static delay is 0", async () => {
    await expect(waitFor(0)).resolves.toBeUndefined();
    expect(waitMock).not.toHaveBeenCalled();
  });

  it("waits once and then stops if callback returns > 0 then ≤ 0", async () => {
    let count = 0;
    const delays = [500, 0];
    await waitFor(() => delays[count++]);

    expect(waitMock).toHaveBeenCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(500, undefined);
  });

  it("waits multiple times until callback returns ≤ 0", async () => {
    let call = 0;
    const delays = [300, 200, 0];
    await waitFor(() => delays[call++]);

    expect(waitMock).toHaveBeenCalledTimes(2);
    expect(waitMock).toHaveBeenNthCalledWith(1, 300, undefined);
    expect(waitMock).toHaveBeenNthCalledWith(2, 200, undefined);
  });

  it("rejects with AbortError if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      waitFor(1000, { signal: controller.signal }),
    ).rejects.toBeInstanceOf(DOMException);
    expect(waitMock).not.toHaveBeenCalled();
  });

  it("rejects with signal.reason if already aborted with reason", async () => {
    const controller = new AbortController();
    const reason = new Error("custom reason");
    controller.abort(reason);

    await expect(waitFor(1000, { signal: controller.signal })).rejects.toBe(
      reason,
    );
  });

  it("rejects with AbortError if signal is aborted during wait", async () => {
    const controller = new AbortController();
    waitMock.mockImplementationOnce(async () => {
      controller.abort();
      throw controller.signal.reason;
    });
    try {
      await waitFor(1000, { signal: controller.signal });
    } catch (err) {
      expect(err).toBeInstanceOf(DOMException);
    }
  });

  it("calls onRetry before each retry", async () => {
    const onRetry = jest.fn().mockReturnValue(true);
    let count = 0;
    const delays = [200, 100, 0];

    await waitFor(() => delays[count++], { onRetry });

    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(1, 200);
    expect(onRetry).toHaveBeenNthCalledWith(2, 100);
  });

  it("rejects with RetryError if onRetry returns false", async () => {
    const onRetry = jest.fn().mockReturnValueOnce(false);
    await expect(waitFor(() => 100, { onRetry })).rejects.toBeInstanceOf(
      RetryError,
    );
    expect(waitMock).not.toHaveBeenCalled();
  });

  it("rejects with RetryError if async onRetry resolves false", async () => {
    const onRetry = jest.fn().mockResolvedValue(false);
    await expect(waitFor(() => 100, { onRetry })).rejects.toBeInstanceOf(
      RetryError,
    );
  });

  it("rejects with TimeoutError if duration exceeds timeout", async () => {
    jest.useFakeTimers();
    const promise = waitFor(() => 1000, { timeout: 500 });
    jest.advanceTimersByTime(750);
    await Promise.resolve(); // allow timers/microtasks
    await expect(promise).rejects.toBeInstanceOf(TimeoutError);
  });

  it("clears timeout after success", async () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    await waitFor(() => 0, { timeout: 1000 });
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("clears timeout after success with signal and timeout", async () => {
    const controller = new AbortController();
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    await waitFor(() => 0, {
      signal: controller.signal,
      timeout: 1000,
    });
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("clears timeout after failure", async () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    const onRetry = jest.fn().mockReturnValueOnce(false);
    await expect(
      waitFor(() => 100, { timeout: 1000, onRetry }),
    ).rejects.toBeInstanceOf(RetryError);

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("supports async delay function", async () => {
    let i = 0;
    await waitFor(async () => {
      return [300, 0][i++];
    });

    expect(waitMock).toHaveBeenCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(300, undefined);
  });

  it("propagates errors thrown in delay function", async () => {
    const err = new Error("delay fn failed");
    await expect(
      waitFor(() => {
        throw err;
      }),
    ).rejects.toBe(err);
  });

  it("propagates promise rejections from delay function", async () => {
    const err = new Error("async error");
    await expect(
      waitFor(async () => {
        throw err;
      }),
    ).rejects.toBe(err);
  });

  it("aborts early with AbortError if signal is aborted before timeout", async () => {
    const controller = new AbortController();
    const promise = waitFor(1000, {
      signal: controller.signal,
      timeout: 5000,
    });

    try {
      controller.abort(); // abort before timeout fires
      await promise;
    } catch (err) {
      expect(err).toBeInstanceOf(DOMException);
      expect((err as DOMException).name).toBe("AbortError");
    }
  });

  it("aborts with TimeoutError if timeout expires before signal is aborted", async () => {
    const controller = new AbortController();
    const promise = waitFor(1000, {
      signal: controller.signal,
      timeout: 500,
    });

    jest.advanceTimersByTime(501);
    try {
      controller.abort(); // abort before timeout fires
      await promise;
    } catch (err) {
      expect(err).toBeInstanceOf(DOMException);
      expect((err as DOMException).name).toBe("TimeoutError");
    }
  });

  it("aborts only once even if both signal and timeout fire", async () => {
    const controller = new AbortController();
    const onAbort = jest.fn();
    controller.signal.addEventListener("abort", onAbort);

    const promise = waitFor(1000, {
      signal: controller.signal,
      timeout: 500,
    });

    // Trigger both in same tick
    jest.advanceTimersByTime(499);
    controller.abort(); // fire signal first
    jest.advanceTimersByTime(1); // timeout now fires

    await expect(promise).rejects.toBeInstanceOf(DOMException);
    expect(onAbort).toHaveBeenCalledTimes(1); // ensure listener only triggered once
  });
});
