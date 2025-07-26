import { setTimeoutAsync } from "src/setTimeoutAsync";
import { throwIfAborted } from "src/utils/throwIfAborted";
import { waitUntil } from "src/waitUntil";

jest.mock("src/setTimeoutAsync");
jest.mock("src/utils/throwIfAborted");

describe(waitUntil.name, () => {
  const mockSetTimeoutAsync = setTimeoutAsync as jest.MockedFunction<
    typeof setTimeoutAsync
  >;
  const mockThrowIfAborted = throwIfAborted as jest.MockedFunction<
    typeof throwIfAborted
  >;
  let nowSpy: jest.SpiedFunction<typeof performance.now>;

  beforeAll(() => {
    jest.useFakeTimers({ now: 1_000_000 });
    nowSpy = jest
      .spyOn(performance, "now")
      .mockImplementation(() => jest.now());
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

  it("returns immediately when timestamp is undefined", async () => {
    await expect(waitUntil(undefined)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if timestamp is null", async () => {
    await expect(waitUntil(null)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if timestamp is NaN", async () => {
    await expect(waitUntil(NaN)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if timestamp is < performance.now()", async () => {
    await expect(waitUntil(jest.now() - 1)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
    expect(nowSpy).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if timestamp is == performance.now()", async () => {
    await expect(waitUntil(jest.now())).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
    expect(nowSpy).toHaveBeenCalledTimes(1);
  });

  it("calls setTimeoutAsync if timestamp > performance.now()", async () => {
    mockSetTimeoutAsync.mockResolvedValueOnce(undefined);
    await expect(waitUntil(jest.now() + 1)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).toHaveBeenCalledWith(1, undefined);
    expect(nowSpy).toHaveBeenCalledTimes(1);
  });

  // Signal

  it("rejects immediately if signal is already aborted", async () => {
    const now = jest.now() + 100;
    const reason = new Error("aborted");
    const controller = new AbortController();
    controller.abort(reason);
    mockThrowIfAborted.mockImplementationOnce(() => {
      throw reason;
    });
    await expect(waitUntil(now, controller.signal)).rejects.toThrow(
      reason.message,
    );
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledWith(controller.signal);
  });

  it("propagates signal to setTimeoutAsync", async () => {
    const now = jest.now() + 100;
    const signal = new AbortController().signal;
    mockSetTimeoutAsync.mockResolvedValue(undefined);
    await expect(waitUntil(now, signal)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).toHaveBeenCalledWith(100, signal);
  });

  it("bubbles rejection from setTimeoutAsync", async () => {
    const now = jest.now() + 100;
    const reason = "timeout aborted";
    const signal = new AbortController().signal;
    mockSetTimeoutAsync.mockRejectedValue(reason);
    await expect(waitUntil(now, signal)).rejects.toBe(reason);
  });
});
