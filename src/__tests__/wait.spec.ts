import { wait } from "src/wait";
import { setTimeoutAsync } from "src/utils/setTimeoutAsync";
import { throwIfAborted } from "src/utils/throwIfAborted";

jest.mock("src/utils/setTimeoutAsync");
jest.mock("src/utils/throwIfAborted");

describe(wait.name, () => {
  const mockSetTimeoutAsync = setTimeoutAsync as jest.MockedFunction<
    typeof setTimeoutAsync
  >;
  const mockThrowIfAborted = throwIfAborted as jest.MockedFunction<
    typeof throwIfAborted
  >;

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // Delay

  it("returns immediately when delay is undefined", async () => {
    await expect(wait(undefined)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if delay is null", async () => {
    await expect(wait(null)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if delay is NaN", async () => {
    await expect(wait(NaN)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if delay is negative", async () => {
    await expect(wait(-1)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
  });

  it("resolves immediately if delay is 0", async () => {
    await expect(wait(0)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledTimes(1);
  });

  it("calls setTimeoutAsync for positive delay", async () => {
    mockSetTimeoutAsync.mockResolvedValueOnce(undefined);
    await expect(wait(1)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).toHaveBeenCalledWith(1, undefined);
  });

  // Signal

  it("rejects immediately if signal is already aborted", async () => {
    const reason = new Error("aborted");
    const controller = new AbortController();
    controller.abort(reason);
    mockThrowIfAborted.mockImplementationOnce(() => {
      throw reason;
    });
    await expect(wait(100, controller.signal)).rejects.toThrow(reason.message);
    expect(mockSetTimeoutAsync).not.toHaveBeenCalled();
    expect(mockThrowIfAborted).toHaveBeenCalledWith(controller.signal);
  });

  it("propagates signal to setTimeoutAsync", async () => {
    const signal = new AbortController().signal;
    mockSetTimeoutAsync.mockResolvedValue(undefined);
    await expect(wait(200, signal)).resolves.toBeUndefined();
    expect(mockSetTimeoutAsync).toHaveBeenCalledWith(200, signal);
  });

  it("bubbles rejection from setTimeoutAsync", async () => {
    const reason = "timeout aborted";
    const signal = new AbortController().signal;
    mockSetTimeoutAsync.mockRejectedValue(reason);
    await expect(wait(300, signal)).rejects.toBe(reason);
  });
});
