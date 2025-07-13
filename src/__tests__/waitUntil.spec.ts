import { AbortError } from "src/errors/abortError";
import { wait } from "src/wait";
import { waitUntil } from "src/waitUntil";

// Mock wait function
jest.mock("src/wait", () => ({
  wait: jest.fn(() => Promise.resolve()),
}));

// Use fake timers and mock performance.now()
describe(waitUntil.name, () => {
  let nowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    nowSpy = jest.spyOn(performance, "now");
  });

  afterEach(() => {
    nowSpy.mockRestore();
    jest.useRealTimers();
  });

  it("resolves immediately if delay is undefined", async () => {
    nowSpy.mockReturnValue(2000);
    await expect(waitUntil(undefined)).resolves.toBeUndefined();
    expect(nowSpy).not.toHaveBeenCalled();
    expect(wait).not.toHaveBeenCalled();
  });

  it("resolves immediately if delay is null", async () => {
    nowSpy.mockReturnValue(2000);
    await expect(waitUntil(null)).resolves.toBeUndefined();
    expect(nowSpy).not.toHaveBeenCalled();
    expect(wait).not.toHaveBeenCalled();
  });

  it("resolves immediately if current time is already past the timestamp", async () => {
    nowSpy.mockReturnValue(2000);
    await expect(waitUntil(1000)).resolves.toBeUndefined();
    expect(wait).not.toHaveBeenCalled();
  });

  it("resolves immediately if current time is equal to the timestamp", async () => {
    nowSpy.mockReturnValue(1000);
    await expect(waitUntil(1000)).resolves.toBeUndefined();
    expect(wait).not.toHaveBeenCalled();
  });

  it("calls wait repeatedly until timestamp is reached", async () => {
    const timestamps = [0, 400, 700, 1001];
    let i = 0;
    nowSpy.mockImplementation(() => timestamps[i++]);

    await waitUntil(1000);

    expect(wait).toHaveBeenCalledTimes(3);
    expect(wait).toHaveBeenNthCalledWith(1, 1000 - 0, undefined);
    expect(wait).toHaveBeenNthCalledWith(2, 1000 - 400, undefined);
    expect(wait).toHaveBeenNthCalledWith(3, 1000 - 700, undefined);
  });

  it("passes the signal to wait()", async () => {
    const controller = new AbortController();
    nowSpy.mockImplementationOnce(() => 0).mockImplementationOnce(() => 1001);

    await waitUntil(1000, controller.signal);

    expect(wait).toHaveBeenCalledWith(1000, controller.signal);
  });

  it("throws immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(waitUntil(1000, controller.signal)).rejects.toBeInstanceOf(
      DOMException,
    );
    expect(wait).not.toHaveBeenCalled();
  });

  it("throws the custom reason if signal.reason is set", async () => {
    const controller = new AbortController();
    const customError = new Error("custom abort reason");
    controller.abort(customError);

    await expect(waitUntil(1000, controller.signal)).rejects.toBe(customError);
    expect(wait).not.toHaveBeenCalled();
  });

  it("throws AbortError if aborted during wait", async () => {
    const controller = new AbortController();
    const timestamps = [0, 400];
    let i = 0;
    nowSpy.mockImplementation(() => timestamps[i++]);

    // Simulate abort during wait
    (wait as jest.Mock).mockImplementationOnce(() => {
      controller.abort(); // trigger during wait
      return Promise.reject(new AbortError());
    });

    await expect(waitUntil(1000, controller.signal)).rejects.toBeInstanceOf(
      DOMException,
    );
    expect(wait).toHaveBeenCalledTimes(1);
  });

  it("does not call wait again after reaching timestamp", async () => {
    nowSpy
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 900)
      .mockImplementationOnce(() => 1000)
      .mockImplementationOnce(() => 1100); // safeguard

    await waitUntil(1000);

    expect(wait).toHaveBeenCalledTimes(2);
  });

  it("wait handles negative durations gracefully", async () => {
    nowSpy.mockImplementationOnce(() => 999).mockImplementationOnce(() => 1001);

    await waitUntil(1000);
    expect(wait).toHaveBeenCalledWith(1, undefined);
  });

  it("propagates errors thrown by wait()", async () => {
    nowSpy.mockReturnValue(0);
    const error = new Error("some wait error");
    (wait as jest.Mock).mockRejectedValue(error);

    await expect(waitUntil(1000)).rejects.toBe(error);
  });
});
