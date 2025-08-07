import { setTimeoutAsync } from "src/setTimeoutAsync";
import { waitUntil } from "src/waitUntil";

jest.mock("src/setTimeoutAsync");

describe(waitUntil.name, () => {
  let controller: AbortController;
  let dateNowSpy: jest.SpiedFunction<typeof Date.now>;
  const mockSetTimeoutAsync = setTimeoutAsync as jest.MockedFunction<
    typeof setTimeoutAsync
  >;
  let perfNowSpy: jest.SpiedFunction<typeof performance.now>;
  let throwIfAbortedSpy: jest.SpiedFunction<
    typeof AbortSignal.prototype.throwIfAborted
  >;

  beforeAll(() => {
    jest.useFakeTimers({ now: 1_000_000 });
    dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => jest.now());
    perfNowSpy = jest
      .spyOn(performance, "now")
      .mockImplementation(() => jest.now());
  });

  beforeEach(() => {
    controller = new AbortController();
    throwIfAbortedSpy = jest.spyOn(controller.signal, "throwIfAborted");
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
  });

  it("resolves immediately if timestamp is null", async () => {
    await expect(waitUntil(null)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
  });

  it("resolves immediately if timestamp is NaN", async () => {
    await expect(waitUntil(NaN)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
  });

  it("resolves immediately if timestamp is < performance.now()", async () => {
    await expect(waitUntil(jest.now() - 1)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(perfNowSpy).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if timestamp is == performance.now()", async () => {
    await expect(waitUntil(jest.now())).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(perfNowSpy).toHaveBeenCalledTimes(1);
  });

  it("calls setTimeoutAsync if timestamp > performance.now()", async () => {
    mockSetTimeoutAsync.mockResolvedValueOnce(undefined);
    await expect(waitUntil(jest.now() + 1)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).toHaveBeenCalledWith(1, undefined);
    expect(perfNowSpy).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if timestamp date is < Date.now()", async () => {
    await expect(waitUntil(new Date(jest.now() - 1))).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(dateNowSpy).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if timestamp is == Date.now()", async () => {
    await expect(waitUntil(new Date(jest.now()))).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(dateNowSpy).toHaveBeenCalledTimes(1);
  });

  it("calls setTimeoutAsync if timestamp > Date.now()", async () => {
    mockSetTimeoutAsync.mockResolvedValueOnce(undefined);
    await expect(waitUntil(new Date(jest.now() + 1))).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).toHaveBeenCalledWith(1, undefined);
    expect(dateNowSpy).toHaveBeenCalledTimes(1);
  });

  // Signal

  it("rejects immediately if signal is already aborted", async () => {
    const now = jest.now() + 100;
    const reason = new Error("aborted");
    controller.abort(reason);
    await expect(waitUntil(now, controller.signal)).rejects.toThrow(
      reason.message,
    );
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(throwIfAbortedSpy).toHaveBeenCalled();
  });

  it("propagates signal to setTimeoutAsync", async () => {
    const now = jest.now() + 100;
    const signal = controller.signal;
    mockSetTimeoutAsync.mockResolvedValue(undefined);
    await expect(waitUntil(now, signal)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).toHaveBeenCalledWith(100, signal);
  });

  it("bubbles rejection from setTimeoutAsync", async () => {
    const now = jest.now() + 100;
    const reason = "timeout aborted";
    mockSetTimeoutAsync.mockRejectedValue(reason);
    await expect(waitUntil(now, controller.signal)).rejects.toBe(reason);
  });
});
