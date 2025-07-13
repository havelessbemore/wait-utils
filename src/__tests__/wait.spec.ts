import { wait } from "src/wait";
import { throwIfAborted } from "src/utils/throwIfAborted";

jest.mock("src/utils/throwIfAborted");

describe(wait.name, () => {
  const mockThrowIfAborted = throwIfAborted as jest.MockedFunction<
    typeof throwIfAborted
  >;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setTimeout");
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // Delay

  it("resolves immediately if delay is undefined", async () => {
    await expect(wait(undefined)).resolves.toBeUndefined();
    expect(setTimeout).not.toHaveBeenCalled();
  });

  it("resolves immediately if delay is null", async () => {
    await expect(wait(null)).resolves.toBeUndefined();
    expect(setTimeout).not.toHaveBeenCalled();
  });

  it("resolves immediately if delay is 0", async () => {
    await expect(wait(0)).resolves.toBeUndefined();
    expect(setTimeout).not.toHaveBeenCalled();
  });

  it("resolves immediately if delay is negative", async () => {
    await expect(wait(-10)).resolves.toBeUndefined();
    expect(setTimeout).not.toHaveBeenCalled();
  });

  it("resolves if delay is NaN", async () => {
    const promise = wait(NaN);
    jest.runOnlyPendingTimers();
    expect(setTimeout).toHaveBeenCalled();
    await expect(promise).resolves.toBeUndefined();
  });

  it("resolves after delay", async () => {
    const promise = wait(100);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 100);
    jest.advanceTimersByTime(100);
    await Promise.resolve(); // Flush microtasks before abort triggers
    await expect(promise).resolves.toBeUndefined();
  });

  // Signal

  it("rejects immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort(new Error("aborted"));
    await expect(wait(100, controller.signal)).rejects.toThrow("aborted");
    expect(mockThrowIfAborted).toHaveBeenCalledWith(controller.signal);
  });

  it("rejects if signal aborts during the wait", async () => {
    const controller = new AbortController();
    const promise = wait(1000, controller.signal);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    controller.abort(new Error("aborted during wait"));
    jest.runOnlyPendingTimers();
    await expect(promise).rejects.toThrow("aborted during wait");
  });

  it("resolves after delay if signal does not abort", async () => {
    const controller = new AbortController();
    const promise = wait(100, controller.signal);
    jest.advanceTimersByTime(100);
    await Promise.resolve(); // Flush microtasks before abort triggers
    await expect(promise).resolves.toBeUndefined();
  });

  // Cleanup

  it("cleans up event listener on resolve", async () => {
    const controller = new AbortController();
    const spyRemoveListener = jest.spyOn(
      controller.signal,
      "removeEventListener",
    );
    const promise = wait(100, controller.signal);

    jest.advanceTimersByTime(100);
    await Promise.resolve(); // Flush microtasks before abort triggers
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

    const promise = wait(100, controller.signal);

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

  it("does not reject AND resolve if aborted and timed out", async () => {
    const controller = new AbortController();
    const spy = jest.fn();

    const promise = wait(1000, controller.signal)
      .then(() => spy("resolved"))
      .catch(() => spy("rejected"));

    controller.abort();
    jest.advanceTimersByTime(1000);
    await Promise.resolve(); // Flush microtasks before abort triggers

    try {
      await promise;
    } catch (_) {
      // pass
    }

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not resolve AND reject if timed out and aborted", async () => {
    const controller = new AbortController();
    const spy = jest.fn();

    const promise = wait(1000, controller.signal)
      .then(() => spy("resolved"))
      .catch(() => spy("rejected"));

    jest.advanceTimersByTime(1000);
    await Promise.resolve(); // Flush microtasks before abort triggers
    controller.abort();

    try {
      await promise;
    } catch (_) {
      // pass
    }

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
