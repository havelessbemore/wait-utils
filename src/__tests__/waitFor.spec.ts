// import { timeout as timeoutFn } from "src/timeout";
import { TimeoutError } from "src/errors/timeoutError";
import * as timeoutModule from "src/timeout";
import * as utilsModule from "src/utils/or";
import * as waitModule from "src/wait";
import { waitFor } from "src/waitFor";

import {
  expectNativeAbortError,
  expectRetryError,
  expectTimeoutError,
} from "src/errors/__testutils__/utils";

describe(waitFor.name, () => {
  let orSpy: jest.SpiedFunction<typeof utilsModule.or>;
  let timeoutSpy: jest.SpiedFunction<typeof timeoutModule.timeout>;
  let waitSpy: jest.SpiedFunction<typeof waitModule.wait>;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    orSpy = jest.spyOn(utilsModule, "or");
    timeoutSpy = jest.spyOn(timeoutModule, "timeout");
    waitSpy = jest.spyOn(waitModule, "wait");
  });

  afterEach(() => {
    timeoutSpy.mockRestore();
    waitSpy.mockRestore();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("with delay only", () => {
    it("resolves immediately if callback returns 0 or less", async () => {
      await expect(waitFor(0)).resolves.toBeUndefined();
      await expect(waitFor(() => 0)).resolves.toBeUndefined();
      await expect(waitFor(-1)).resolves.toBeUndefined();
      await expect(waitFor(() => -1)).resolves.toBeUndefined();
      expect(waitSpy).not.toHaveBeenCalled();
    });

    it("waits once with fixed delay and then resolves", async () => {
      waitSpy.mockResolvedValue(undefined);

      const callback = jest.fn();
      callback.mockReturnValueOnce(100);
      callback.mockReturnValueOnce(0); // resolve on second loop

      await waitFor(callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(waitSpy).toHaveBeenCalledWith(100, undefined);
      expect(waitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("with onRetry", () => {
    it("calls onRetry before waiting, respects false return", async () => {
      waitSpy.mockResolvedValueOnce();
      const onRetry = jest.fn().mockReturnValue(false);

      const error = await waitFor(() => 100, { onRetry }).catch(
        (error) => error,
      );
      expectRetryError(error);

      expect(onRetry).toHaveBeenCalledWith(100);
      expect(waitSpy).not.toHaveBeenCalled(); // Should abort before wait
    });

    it("supports async onRetry that returns false", async () => {
      waitSpy.mockResolvedValueOnce();
      const onRetry = jest.fn().mockResolvedValue(false);

      const error = await waitFor(() => 100, { onRetry }).catch(
        (error) => error,
      );
      expectRetryError(error);

      expect(onRetry).toHaveBeenCalledWith(100);
      expect(waitSpy).not.toHaveBeenCalled();
    });

    it("retries multiple times with dynamic delays from callback", async () => {
      const delays = [100, 200, 300, 0];
      const callback = jest.fn();
      for (const delay of delays) {
        callback.mockResolvedValueOnce(delay);
      }

      waitSpy.mockResolvedValue();
      await waitFor(callback);

      expect(callback).toHaveBeenCalledTimes(4);
      for (let i = 1; i < delays.length; ++i) {
        expect(waitSpy).toHaveBeenNthCalledWith(i, delays[i - 1], undefined);
      }
    });
  });

  describe("with timeout", () => {
    it("throws TimeoutError if timeoutFn rejects", async () => {
      const callback = jest.fn();
      callback.mockReturnValueOnce(1000);
      callback.mockReturnValue(0);

      timeoutSpy.mockRejectedValue(new TimeoutError());

      const promise = waitFor(callback, { timeout: 100 });
      jest.advanceTimersByTime(100);
      await Promise.resolve(); // Flush microtasks before abort triggers
      const error = await promise.catch((e) => e);

      expectTimeoutError(error);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(timeoutSpy).toHaveBeenCalledTimes(1);
      expect(waitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("with signal", () => {
    it("throws AbortError if signal is aborted before start", async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      controller.abort();

      const error = await waitFor(0, { signal }).catch((error) => error);
      expectNativeAbortError(error);
    });

    it("throws AbortError if signal aborts during waiting", async () => {
      const callback = jest.fn();
      callback.mockReturnValueOnce(500);
      callback.mockReturnValue(0);

      const controller = new AbortController();
      const promise = waitFor(callback, { signal: controller.signal });
      jest.advanceTimersByTime(100);
      await Promise.resolve(); // Flush microtasks before abort triggers
      controller.abort();
      jest.advanceTimersByTime(100);
      await Promise.resolve(); // Flush microtasks before abort triggers
      const error = await promise.catch((e) => e);

      expectNativeAbortError(error);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(waitSpy).toHaveBeenCalledTimes(1);
    });

    it("combines abort signals with timeout signal using or()", async () => {
      const userSignal = new AbortController().signal;
      const timeoutSignal = new AbortController().signal;
      orSpy.mockReturnValue(timeoutSignal);

      timeoutSpy.mockImplementation(() => Promise.resolve());
      waitSpy.mockResolvedValue();

      const callback = jest.fn().mockResolvedValue(0);
      await waitFor(callback, { signal: userSignal, timeout: 1000 });

      expect(orSpy).toHaveBeenCalledWith(userSignal, expect.anything());
    });
  });

  it("aborts timeoutController after mainLoop finishes", async () => {
    const controller = new AbortController();
    controller.abort();

    const originalAbortController = global.AbortController;
    global.AbortController = jest.fn(() => controller);

    waitSpy.mockResolvedValue();
    await waitFor(() => 0);

    expect(controller.signal.aborted).toBe(true);
    global.AbortController = originalAbortController;
  });
});
