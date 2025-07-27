import { timeout } from "src/timeout";
import { TimeoutError } from "src/errors/timeoutError";
import * as waitModule from "src/wait";

import { expectTimeoutError } from "src/errors/__testutils__/utils";

describe(timeout.name, () => {
  let waitSpy: jest.SpiedFunction<typeof waitModule.wait>;

  beforeAll(() => {
    jest.useFakeTimers({ now: 1_000_000 });
  });

  beforeEach(() => {
    waitSpy = jest.spyOn(waitModule, "wait");
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe("delay", () => {
    it("works if delay is undefined", async () => {
      waitSpy.mockImplementationOnce(() => Promise.resolve());
      const error = await timeout(undefined).catch((error) => error);
      expectTimeoutError(error);
      expect(waitSpy).toHaveBeenCalledWith(undefined, undefined);
    });

    it("works if delay is null", async () => {
      waitSpy.mockImplementationOnce(() => Promise.resolve());
      const error = await timeout(null).catch((error) => error);
      expectTimeoutError(error);
      expect(waitSpy).toHaveBeenCalledWith(null, undefined);
    });

    it("works if delay is 0", async () => {
      waitSpy.mockImplementationOnce(() => Promise.resolve());
      const error = await timeout(0).catch((error) => error);
      expectTimeoutError(error);
      expect(waitSpy).toHaveBeenCalledWith(0, undefined);
    });

    it("works if delay is negative", async () => {
      waitSpy.mockImplementationOnce(() => Promise.resolve());
      const error = await timeout(-10).catch((error) => error);
      expectTimeoutError(error);
      expect(waitSpy).toHaveBeenCalledWith(-10, undefined);
    });

    it("works if delay is NaN", async () => {
      waitSpy.mockImplementationOnce(() => Promise.resolve());
      const error = await timeout(NaN).catch((error) => error);
      expectTimeoutError(error);
      expect(waitSpy).toHaveBeenCalledWith(NaN, undefined);
    });

    it("works after delay", async () => {
      waitSpy.mockImplementationOnce(() => Promise.resolve());
      const error = await timeout(500).catch((error) => error);
      expect(waitSpy).toHaveBeenCalledWith(500, undefined);
      expectTimeoutError(error);
    });
  });

  describe("signal", () => {
    it("resolves if signal is already aborted", async () => {
      const controller = new AbortController();
      const reason = new Error("aborted");
      const signal = controller.signal;

      waitSpy.mockRejectedValueOnce(reason);
      controller.abort(reason);

      await expect(timeout(1000, signal)).resolves.toBeUndefined();
      expect(waitSpy).toHaveBeenCalledWith(1000, signal);
    });

    it("resolves if signal is aborted during the wait", async () => {
      const controller = new AbortController();
      const reason = new Error("aborted");
      const signal = controller.signal;

      waitSpy.mockRestore();
      const promise = timeout(1000, signal);
      jest.advanceTimersByTime(500);
      await Promise.resolve(); // Flush microtasks before abort triggers
      controller.abort(reason);
      await expect(promise).resolves.toBeUndefined();
      expect(waitSpy).not.toHaveBeenCalled();
    });

    it("rejects with TimeoutError if signal does not abort", async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      waitSpy.mockImplementationOnce(() => Promise.resolve());
      const promise = timeout(1000, signal);

      jest.runOnlyPendingTimers();
      await expect(promise).rejects.toBeInstanceOf(TimeoutError);
      expect(waitSpy).toHaveBeenCalledWith(1000, signal);
    });

    it("rejects with TimeoutError if signal aborts after delay", async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      waitSpy.mockImplementationOnce(() => Promise.resolve());
      const promise = timeout(1000, signal);
      controller.abort(new Error("aborted"));

      await expect(promise).rejects.toBeInstanceOf(TimeoutError);
      expect(waitSpy).toHaveBeenCalledWith(1000, signal);
    });

    it("rethrows if an unexpected error occurs", async () => {
      const controller = new AbortController();
      const reason = new Error("aborted");
      const signal = controller.signal;
      const unexpectedError = new Error("unexpected error");

      waitSpy.mockRejectedValueOnce(unexpectedError);
      controller.abort(reason);
      await expect(timeout(1000, signal)).rejects.toThrow(unexpectedError);
      expect(waitSpy).toHaveBeenCalledWith(1000, signal);
    });
  });
});
