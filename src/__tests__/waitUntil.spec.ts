import * as waitModule from "src/wait";
import { waitUntil } from "src/waitUntil";
import { throwIfAborted } from "src/utils/throwIfAborted";

jest.mock("src/utils/throwIfAborted");

describe("waitUntil", () => {
  const mockThrowIfAborted = throwIfAborted as jest.MockedFunction<
    typeof throwIfAborted
  >;
  let nowSpy: jest.SpiedFunction<typeof performance.now>;
  let waitSpy: jest.SpiedFunction<typeof waitModule.wait>;

  beforeAll(() => {
    jest.useFakeTimers({ now: 1_000_000 });
    nowSpy = jest
      .spyOn(performance, "now")
      .mockImplementation(() => jest.now());
    waitSpy = jest.spyOn(waitModule, "wait");
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

  // Timestamp

  it("resolves immediately if timestamp is undefined", async () => {
    await expect(waitUntil(undefined)).resolves.toBeUndefined();
    expect(waitSpy).not.toHaveBeenCalled();
  });

  it("resolves immediately if timestamp is null", async () => {
    await expect(waitUntil(null)).resolves.toBeUndefined();
    expect(waitSpy).not.toHaveBeenCalled();
  });

  it("resolves immediately if timestamp is NaN", async () => {
    await expect(waitUntil(NaN)).resolves.toBeUndefined();
    expect(waitSpy).not.toHaveBeenCalled();
  });

  it("resolves immediately if timestamp casts to NaN", async () => {
    let value = "not a number" as unknown as number;
    await expect(waitUntil(value)).resolves.toBeUndefined();
    value = (() => 100) as unknown as number;
    await expect(waitUntil(value)).resolves.toBeUndefined();
    expect(waitSpy).not.toHaveBeenCalled();
  });

  it("resolves immediately if timestamp is < performance.now()", async () => {
    const promise = waitUntil(jest.now() - 1);
    await expect(promise).resolves.toBeUndefined();
    expect(waitSpy).not.toHaveBeenCalled();
  });

  it("resolves immediately if timestamp is == performance.now()", async () => {
    const promise = waitUntil(jest.now());
    await expect(promise).resolves.toBeUndefined();
    expect(waitSpy).not.toHaveBeenCalled();
  });

  // Signal

  it("rejects immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort(new Error("aborted"));
    mockThrowIfAborted.mockImplementationOnce(() => {
      throw controller.signal.reason;
    });
    const promise = waitUntil(jest.now() + 100, controller.signal);
    await expect(promise).rejects.toThrow("aborted");
    expect(mockThrowIfAborted).toHaveBeenCalledWith(controller.signal);
    expect(waitSpy).not.toHaveBeenCalled();
  });

  it("rejects if signal is aborted during wait", async () => {
    const controller = new AbortController();
    const promise = waitUntil(jest.now() + 100, controller.signal);
    await jest.advanceTimersByTimeAsync(20);
    controller.abort("mid-wait abort");
    await expect(promise).rejects.toBe("mid-wait abort");
  });

  it("resolves if signal is not aborted", async () => {
    const controller = new AbortController();
    const delay = 50;
    const target = jest.now() + delay;

    const promise = waitUntil(target, controller.signal);
    await jest.advanceTimersByTimeAsync(delay);
    await expect(promise).resolves.toBeUndefined();
  });

  // Logic

  it("uses performance.now() to get delay", async () => {
    const delay = 10;
    const target = jest.now() + delay;

    const promise = waitUntil(target);
    await jest.advanceTimersByTimeAsync(delay);
    await expect(promise).resolves.toBeUndefined();
    expect(nowSpy).toHaveBeenCalled();
    expect(waitSpy).toHaveBeenCalledWith(delay, undefined);
  });

  it("resolves correctly with short delay", async () => {
    const delay = 10;
    const target = jest.now() + delay;

    const promise = waitUntil(target);
    await jest.advanceTimersByTimeAsync(delay);
    await expect(promise).resolves.toBeUndefined();
  });

  it("waits until the timestamp is reached", async () => {
    const delay = 200;
    const target = jest.now() + delay;

    const promise = waitUntil(target);
    await jest.advanceTimersByTimeAsync(delay - 10);

    // Should not resolve yet
    const pending = jest.getTimerCount();
    expect(pending).toBeGreaterThan(0);

    await jest.advanceTimersByTimeAsync(10);
    await expect(promise).resolves.toBeUndefined();
    expect(waitSpy).toHaveBeenCalled();
  });
});
