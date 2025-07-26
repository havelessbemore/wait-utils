import { setTimeoutAsync } from "src/utils/setTimeoutAsync";

describe(setTimeoutAsync.name, () => {
  beforeAll(() => {
    jest.useFakeTimers({ now: 1_000_000 });
    jest.spyOn(global, "setTimeout");
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("immediately rejects if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort("early-abort");

    const spy = jest.spyOn(controller.signal, "addEventListener");
    await expect(setTimeoutAsync(500, controller.signal)).rejects.toBe(
      "early-abort",
    );
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("rejects if signal aborts during the wait", async () => {
    const controller = new AbortController();
    const promise = setTimeoutAsync(1000, controller.signal);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    controller.abort(new Error("aborted during wait"));
    jest.runOnlyPendingTimers();
    await expect(promise).rejects.toThrow("aborted during wait");
  });

  it("resolves after the specified delay", async () => {
    const spy = jest.fn();
    const promise = setTimeoutAsync(1000);
    promise.then(spy);

    await jest.advanceTimersByTimeAsync(1000);
    await expect(promise).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
  });

  it("resolves after delay if signal does not abort", async () => {
    const controller = new AbortController();
    const promise = setTimeoutAsync(100, controller.signal);
    await jest.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBeUndefined();
  });

  it("registers abort listener when signal provided", async () => {
    const controller = new AbortController();
    const spy = jest.spyOn(controller.signal, "addEventListener");
    const promise = setTimeoutAsync(1000, controller.signal);

    expect(spy).toHaveBeenCalledTimes(1);
    const [eventName, listener, opts] = spy.mock.calls[0];
    expect(eventName).toBe("abort");
    expect(typeof listener).toBe("function");
    expect(opts).toEqual({ once: true });

    // cleanup
    controller.abort("cleanup");
    await promise.catch(() => undefined);
    spy.mockRestore();
  });

  it("rejects if aborted before timeout", async () => {
    const controller = new AbortController();
    const promise = setTimeoutAsync(1000, controller.signal);

    await jest.advanceTimersByTimeAsync(500);
    controller.abort("mid-wait abort");

    await expect(promise).rejects.toBe("mid-wait abort");
  });

  it("resolves immediately for undefined delay", async () => {
    const promise = setTimeoutAsync(undefined);
    await jest.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it("resolves immediately for zero delay", async () => {
    const promise = setTimeoutAsync(0);
    await jest.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it("resolves immediately for negative delay", async () => {
    const promise = setTimeoutAsync(-100);
    await jest.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it("handles multiple concurrent timeouts independently", async () => {
    let count = 0;
    const c1 = setTimeoutAsync(200).then(() => {
      ++count;
    });
    const c2 = setTimeoutAsync(400).then(() => {
      ++count;
    });
    const c3 = setTimeoutAsync(1000).then(() => {
      ++count;
    });
    await jest.advanceTimersByTimeAsync(199);
    expect(count).toBe(0);
    await jest.advanceTimersByTimeAsync(2);
    await expect(c1).resolves.toBeUndefined();
    expect(count).toBe(1);
    await jest.advanceTimersByTimeAsync(200);
    await expect(c2).resolves.toBeUndefined();
    expect(count).toBe(2);
    await jest.advanceTimersByTimeAsync(600);
    await expect(c3).resolves.toBeUndefined();
    expect(count).toBe(3);
  });

  // Cleanup

  it("cleans up event listener on resolve", async () => {
    const controller = new AbortController();
    const spyRemoveListener = jest.spyOn(
      controller.signal,
      "removeEventListener",
    );
    const promise = setTimeoutAsync(100, controller.signal);

    await jest.advanceTimersByTimeAsync(100);
    await promise;

    expect(spyRemoveListener).toHaveBeenCalledTimes(1);
    expect(spyRemoveListener).toHaveBeenCalledWith(
      "abort",
      expect.any(Function),
    );
    spyRemoveListener.mockRestore();
  });

  test("cleans up event listener on abort", async () => {
    const controller = new AbortController();
    const addListenerSpy = jest.spyOn(controller.signal, "addEventListener");

    const promise = setTimeoutAsync(100, controller.signal);

    expect(addListenerSpy).toHaveBeenCalledWith(
      "abort",
      expect.any(Function),
      expect.objectContaining({ once: true }),
    );

    controller.abort(new Error("aborted"));
    jest.runOnlyPendingTimers();
    await expect(promise).rejects.toThrow("aborted");
    addListenerSpy.mockRestore();
  });
});
