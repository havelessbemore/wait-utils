import { wait } from "src/wait";

describe("wait", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("resolves after the specified delay", async () => {
    const promise = wait(1000);
    jest.advanceTimersByTime(999);
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    await Promise.resolve(); // allow any microtasks to run
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(1);
    await expect(promise).resolves.toBeUndefined();
  });

  it("resolves immediately if delay is 0", async () => {
    await expect(wait(0)).resolves.toBeUndefined();
  });

  it("resolves immediately if delay is negative", async () => {
    await expect(wait(-100)).resolves.toBeUndefined();
  });

  it("rejects immediately if the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    try {
      await wait(1000, controller.signal);
      throw new Error("Expected wait to reject");
    } catch (err) {
      expect(err).toBeInstanceOf(DOMException);
      expect((err as DOMException).name).toBe("AbortError");
    }
  });

  it("rejects immediately with signal.reason if provided", async () => {
    const controller = new AbortController();
    const customReason = new Error("custom reason");
    controller.abort(customReason);

    await expect(wait(1000, controller.signal)).rejects.toBe(customReason);
  });

  it("rejects if aborted during the wait", async () => {
    const controller = new AbortController();
    const promise = wait(1000, controller.signal);

    jest.advanceTimersByTime(500);
    controller.abort();

    try {
      await promise;
      throw new Error("Expected wait to reject");
    } catch (err) {
      expect(err).toBeInstanceOf(DOMException);
      expect((err as DOMException).name).toBe("AbortError");
    }
  });

  it("rejects with custom reason if aborted during the wait", async () => {
    const controller = new AbortController();
    const reason = new Error("aborted with reason");
    const promise = wait(1000, controller.signal);

    controller.abort(reason);
    await expect(promise).rejects.toBe(reason);
  });

  it("removes abort listener and clears timeout on resolve", async () => {
    const controller = new AbortController();
    const removeEventListenerSpy = jest.spyOn(
      controller.signal,
      "removeEventListener",
    );

    const promise = wait(1000, controller.signal);
    jest.advanceTimersByTime(1000);
    await promise;

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "abort",
      expect.any(Function),
    );
  });

  it("removes abort listener and clears timeout on reject", async () => {
    const controller = new AbortController();
    const removeEventListenerSpy = jest.spyOn(
      controller.signal,
      "removeEventListener",
    );

    const promise = wait(1000, controller.signal);
    controller.abort();

    try {
      await promise;
      throw new Error("Expected wait to reject");
    } catch (err) {
      expect(err).toBeInstanceOf(DOMException);
      expect((err as DOMException).name).toBe("AbortError");
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "abort",
        expect.any(Function),
      );
    }
  });

  it("does not add an abort listener if signal is not provided", async () => {
    const signal: AbortSignal | undefined = undefined;
    const promise = wait(500, signal);

    jest.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
  });

  it("does not reject or resolve twice if abort and timeout race", async () => {
    const controller = new AbortController();
    const spy = jest.fn();

    const promise = wait(1000, controller.signal)
      .then(() => spy("resolved"))
      .catch(() => spy("rejected"));

    controller.abort();
    jest.advanceTimersByTime(1000);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await promise.catch(() => {});
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
