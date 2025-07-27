import {
  expectNativeAbortError,
  expectTimeoutError,
} from "src/errors/__testutils__/utils";
import * as setIntervalAsyncModule from "src/setIntervalAsync";
import * as timeoutModule from "src/timeout";
import { waitFor } from "src/waitFor";

describe(waitFor.name, () => {
  let setIntervalAsyncSpy: jest.SpiedFunction<
    typeof setIntervalAsyncModule.setIntervalAsync
  >;
  let timeoutSpy: jest.SpiedFunction<typeof timeoutModule.timeout>;

  beforeEach(() => {
    jest.useFakeTimers({ now: 1_000_000 });
    setIntervalAsyncSpy = jest.spyOn(
      setIntervalAsyncModule,
      "setIntervalAsync",
    );
    timeoutSpy = jest.spyOn(timeoutModule, "timeout");
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe("callback", () => {
    it("should invoke the callback repeatedly", async () => {
      const callback = jest.fn(async (ctx) => {
        ctx.stop = ctx.attempt >= 10;
      });
      const promise = waitFor(callback, { delay: 10 });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(10);
    });

    it("rejects if callback throws synchronously", async () => {
      const error = new Error("sync error");
      const promise = waitFor(
        () => {
          throw error;
        },
        { delay: 50 },
      );

      jest.advanceTimersByTime(50);
      await expect(promise).rejects.toBe(error);
    });

    it("rejects if callback throws asynchronously", async () => {
      const error = new Error("async error");
      const promise = waitFor(
        async () => {
          throw error;
        },
        { delay: 50 },
      );

      jest.advanceTimersByTime(50);
      await expect(promise).rejects.toBe(error);
    });

    it("handles multiple concurrent intervals independently", async () => {
      const ac1 = new AbortController();
      const ac2 = new AbortController();
      const ac3 = new AbortController();

      let count = 0;
      const cb = () => ++count;
      const inter1 = waitFor(cb, { delay: 200, signal: ac1.signal });
      const inter2 = waitFor(cb, { delay: 400, signal: ac2.signal });
      const inter3 = waitFor(cb, { delay: 1000, signal: ac3.signal });

      await jest.advanceTimersByTimeAsync(199);
      expect(count).toBe(0);
      await jest.advanceTimersByTimeAsync(2);
      expect(count).toBe(1);
      await jest.advanceTimersByTimeAsync(200);
      expect(count).toBe(3);
      await jest.advanceTimersByTimeAsync(600);
      expect(count).toBe(8);

      ac1.abort("1");
      await expect(inter1).rejects.toBe("1");
      await jest.advanceTimersByTimeAsync(1000);
      expect(count).toBe(12);

      ac2.abort("2");
      await expect(inter2).rejects.toBe("2");
      await jest.advanceTimersByTimeAsync(500);
      expect(count).toBe(12);

      ac3.abort("3");
      await expect(inter3).rejects.toBe("3");
    });

    it("should return the last callback result", async () => {
      const callback = jest.fn(async (ctx) => {
        ctx.stop = ctx.attempt >= 10;
        return ctx.attempt;
      });
      const promise = waitFor(callback, { delay: 10 });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBe(10);
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe("context", () => {
    it("should be the same across callback invocations", async () => {
      const callback = jest.fn(async (ctx) => {
        if (ctx.attempt == 1) {
          ctx.__test__ = "foo";
        } else if (ctx.__test__ !== "foo") {
          throw new Error("Expected same context");
        }
        ctx.stop = ctx.attempt >= 10;
      });
      const promise = waitFor(callback, { delay: 10 });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe("context.attempt", () => {
    it("should start context.attempt at 1", async () => {
      const callback = jest.fn(async (ctx) => {
        ctx.stop = true;
        return ctx.attempt;
      });
      const promise = waitFor(callback, { delay: 10 });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBe(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should increment context.attempt", async () => {
      let attempt = 0;
      const callback = jest.fn(async (ctx) => {
        ++attempt;
        expect(ctx.attempt).toBe(attempt);
        ctx.stop = ctx.attempt >= 10;
      });
      const promise = waitFor(callback, { delay: 10 });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(10);
    });

    it("should set context.attempt to read-only", async () => {
      let attempt = 0;
      const callback = jest.fn(async (ctx) => {
        ++attempt;
        try {
          ctx.attempt = "foo";
        } catch (_error) {
          // Will throw in strict mode.
        }
        expect(ctx.attempt).toBe(attempt);
        ctx.stop = ctx.attempt >= 10;
      });
      const promise = waitFor(callback, { delay: 10 });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe("context.delay", () => {
    it("should initialize context.delay to undefined", async () => {
      const callback = jest.fn(async (ctx) => {
        expect(ctx.delay).toBeUndefined();
      });
      const onAttempt = jest.fn(async (ctx) => {
        expect(ctx.delay).toBeUndefined();
        ctx.stop = true;
      });
      const promise = waitFor(callback, { onAttempt });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(onAttempt).toHaveBeenCalledTimes(1);
    });

    it("should initialize context.delay to options.delay", async () => {
      const delay = 100;
      const callback = jest.fn(async (ctx) => {
        expect(ctx.delay).toBe(delay);
      });
      const onAttempt = jest.fn(async (ctx) => {
        expect(ctx.delay).toBe(delay);
        ctx.stop = true;
      });
      const promise = waitFor(callback, { delay, onAttempt });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(onAttempt).toHaveBeenCalledTimes(1);
    });

    it("should be able to change context.delay from the callback", async () => {
      let delay = 10;
      const callback = jest.fn(async (ctx) => {
        expect(ctx.delay).toBe(delay);
        delay += 10;
        ctx.delay = delay;
      });
      const onAttempt = jest.fn(async (ctx) => {
        expect(ctx.delay).toBe(delay);
        ctx.stop = ctx.delay > 100;
      });
      const promise = waitFor(callback, { delay, onAttempt });
      await jest.advanceTimersByTimeAsync(550);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(10);
    });

    it("should be able to change context.delay from onAttempt", async () => {
      let delay = 10;
      const callback = jest.fn(async (ctx) => {
        expect(ctx.delay).toBe(delay);
      });
      const onAttempt = jest.fn(async (ctx) => {
        expect(ctx.delay).toBe(delay);
        delay += 10;
        ctx.delay = delay;
        ctx.stop = ctx.delay > 100;
      });
      const promise = waitFor(callback, { delay, onAttempt });
      await jest.advanceTimersByTimeAsync(550);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe("context.stop", () => {
    it("stops when context.stop is set to `true` in callback", async () => {
      const callback = jest.fn(async (ctx) => {
        ctx.stop = ctx.attempt >= 10;
        return "try-2";
      });
      const promise = waitFor(callback, { delay: 10 });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toEqual("try-2");
      expect(callback).toHaveBeenCalledTimes(10);
    });

    it("stops when context.stop is set to `true` in onAttempt", async () => {
      const callback = jest.fn(async () => {
        return "try-2";
      });
      const onAttempt = jest.fn(async (ctx) => {
        ctx.stop = ctx.attempt >= 10;
      });
      const promise = waitFor(callback, { delay: 10, onAttempt });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toEqual("try-2");
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe("context.userData", () => {
    it("should initialize context.userData to undefined", async () => {
      const callback = jest.fn(async (ctx) => {
        expect(ctx.userData).toBeUndefined();
      });
      const onAttempt = jest.fn(async (ctx) => {
        expect(ctx.userData).toBeUndefined();
        ctx.stop = true;
      });
      const promise = waitFor(callback, { onAttempt });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(onAttempt).toHaveBeenCalledTimes(1);
    });

    it("should initialize context.userData to options.userData", async () => {
      const userData = { foo: "bar" };
      const callback = jest.fn(async (ctx) => {
        expect(ctx.userData).toBe(userData);
      });
      const onAttempt = jest.fn(async (ctx) => {
        expect(ctx.userData).toBe(userData);
        ctx.stop = true;
      });
      const promise = waitFor(callback, { onAttempt, userData });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(onAttempt).toHaveBeenCalledTimes(1);
    });

    it("should be able to change context.userData from the callback", async () => {
      const userDatas = ["", "a", "b", "c", ""];
      const callback = jest.fn(async (ctx) => {
        expect(ctx.userData).toBe(userDatas[ctx.attempt]);
        ctx.userData = userDatas[ctx.attempt + 1];
      });
      const onAttempt = jest.fn(async (ctx) => {
        expect(ctx.userData).toBe(userDatas[ctx.attempt + 1]);
        ctx.stop = ctx.attempt >= 3;
      });
      const promise = waitFor(callback, { onAttempt, userData: userDatas[1] });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(onAttempt).toHaveBeenCalledTimes(3);
    });

    it("should be able to change context.userData from onAttempt", async () => {
      const userDatas = ["", "a", "b", "c", ""];
      const callback = jest.fn(async (ctx) => {
        expect(ctx.userData).toBe(userDatas[ctx.attempt]);
      });
      const onAttempt = jest.fn(async (ctx) => {
        expect(ctx.userData).toBe(userDatas[ctx.attempt]);
        ctx.userData = userDatas[ctx.attempt + 1];
        ctx.stop = ctx.attempt >= 3;
      });
      const promise = waitFor(callback, { onAttempt, userData: userDatas[1] });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(onAttempt).toHaveBeenCalledTimes(3);
    });
  });

  describe("options.delay", () => {
    it("invokes callback repeatedly with undefined delay", async () => {
      const callback = jest.fn();
      const controller = new AbortController();

      const promise = waitFor(callback, {
        delay: undefined,
        signal: controller.signal,
      });
      await jest.advanceTimersByTimeAsync(0);

      for (let i = 1; i <= 10; ++i) {
        expect(callback).toHaveBeenCalledTimes(i);
        await jest.advanceTimersByTimeAsync(1);
      }

      controller.abort("done");
      await expect(promise).rejects.toBe("done");
    });

    it("invokes callback repeatedly with null delay", async () => {
      const callback = jest.fn();
      const controller = new AbortController();

      const promise = waitFor(callback, {
        delay: null,
        signal: controller.signal,
      });
      await jest.advanceTimersByTimeAsync(0);

      for (let i = 1; i <= 10; ++i) {
        expect(callback).toHaveBeenCalledTimes(i);
        await jest.advanceTimersByTimeAsync(1);
      }

      controller.abort("done");
      await expect(promise).rejects.toBe("done");
    });

    it("invokes callback repeatedly with zero delay", async () => {
      const callback = jest.fn();
      const controller = new AbortController();

      const promise = waitFor(callback, {
        delay: 0,
        signal: controller.signal,
      });
      await jest.advanceTimersByTimeAsync(0);

      for (let i = 1; i <= 10; ++i) {
        expect(callback).toHaveBeenCalledTimes(i);
        await jest.advanceTimersByTimeAsync(1);
      }

      controller.abort("done");
      await expect(promise).rejects.toBe("done");
    });

    it("invokes callback repeatedly with negative delay", async () => {
      const callback = jest.fn();
      const controller = new AbortController();

      const promise = waitFor(callback, {
        delay: -10,
        signal: controller.signal,
      });
      await jest.advanceTimersByTimeAsync(0);

      for (let i = 1; i <= 10; ++i) {
        expect(callback).toHaveBeenCalledTimes(i);
        await jest.advanceTimersByTimeAsync(1);
      }

      controller.abort("done");
      await expect(promise).rejects.toBe("done");
    });

    it("invokes callback repeatedly with given delay", async () => {
      const callback = jest.fn();
      const controller = new AbortController();

      const promise = waitFor(callback, {
        delay: 100,
        signal: controller.signal,
      });
      for (let i = 1; i <= 10; ++i) {
        await jest.advanceTimersByTimeAsync(100);
        expect(callback).toHaveBeenCalledTimes(i);
      }

      controller.abort("done");
      await expect(promise).rejects.toBe("done");
    });
  });

  describe("options.onAttempt", () => {
    it("should invoke onAttempt repeatedly", async () => {
      const callback = jest.fn();
      const onAttempt = jest.fn(async (ctx) => {
        ctx.stop = ctx.attempt >= 10;
      });
      const promise = waitFor(callback, { delay: 10, onAttempt });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(10);
      expect(onAttempt).toHaveBeenCalledTimes(10);
    });

    it("should invoke onAttempt after callback", async () => {
      const order: string[] = [];
      const callback = jest.fn((ctx) => {
        order.push("c");
        ctx.stop = ctx.attempt >= 3;
      });
      const onAttempt = jest.fn(async () => {
        order.push("b");
      });
      const promise = waitFor(callback, { delay: 10, onAttempt });
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(3);
      expect(onAttempt).toHaveBeenCalledTimes(2);
      expect(order).toEqual(["c", "b", "c", "b", "c"]);
    });

    it("rejects if onAttempt throws synchronously", async () => {
      const callback = jest.fn();
      const error = new Error("sync error");
      const onAttempt = jest.fn(() => {
        throw error;
      });
      const promise = waitFor(callback, { delay: 50, onAttempt });

      jest.advanceTimersByTime(50);
      await expect(promise).rejects.toBe(error);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(onAttempt).toHaveBeenCalledTimes(1);
    });

    it("rejects if onAttempt throws asynchronously", async () => {
      const callback = jest.fn();
      const error = new Error("sync error");
      const onAttempt = jest.fn(async () => {
        throw error;
      });
      const promise = waitFor(callback, { delay: 50, onAttempt });

      jest.advanceTimersByTime(50);
      await expect(promise).rejects.toBe(error);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(onAttempt).toHaveBeenCalledTimes(1);
    });

    it("does not call onAttempt if callback throws", async () => {
      const error = new Error("fail");
      const callback = jest.fn(() => {
        throw error;
      });
      const onAttempt = jest.fn();
      const promise = waitFor(callback, { delay: 50, onAttempt });

      jest.advanceTimersByTime(50);
      await expect(promise).rejects.toThrow("fail");
      expect(callback).toHaveBeenCalledTimes(1);
      expect(onAttempt).toHaveBeenCalledTimes(0);
    });

    it("does not call onAttempt if callback stops", async () => {
      const callback = jest.fn((ctx) => {
        ctx.stop = true;
      });
      const onAttempt = jest.fn();
      const promise = waitFor(callback, { delay: 50, onAttempt });

      jest.advanceTimersByTime(50);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(onAttempt).toHaveBeenCalledTimes(0);
    });

    it("does not call onAttempt if callback aborts", async () => {
      const controller = new AbortController();
      const signal = controller.signal;
      const callback = jest.fn(() => {
        controller.abort("aborted");
      });
      const onAttempt = jest.fn();
      const promise = waitFor(callback, { delay: 50, onAttempt, signal });

      jest.advanceTimersByTime(50);
      await expect(promise).rejects.toBe("aborted");
      expect(callback).toHaveBeenCalledTimes(1);
      expect(onAttempt).toHaveBeenCalledTimes(0);
    });
  });

  describe("options.signal", () => {
    it("immediately rejects if signal is already aborted", async () => {
      const callback = jest.fn();
      const onAttempt = jest.fn();
      const controller = new AbortController();
      controller.abort("early-abort");

      const spy = jest.spyOn(controller.signal, "addEventListener");
      const promise = waitFor(callback, { signal: controller.signal });
      await expect(promise).rejects.toBe("early-abort");
      expect(callback).toHaveBeenCalledTimes(0);
      expect(onAttempt).toHaveBeenCalledTimes(0);
      expect(setIntervalAsyncSpy).not.toHaveBeenCalled();
      expect(timeoutSpy).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("rejects if signal is aborted in callback", async () => {
      jest.useRealTimers();
      const error = new Error("aborted");
      const controller = new AbortController();
      const signal = controller.signal;
      const callback = jest.fn((ctx) => {
        if (ctx.attempt >= 5) {
          controller.abort(error);
        }
      });
      const onAttempt = jest.fn();
      const promise = waitFor(callback, { delay: 10, onAttempt, signal });
      await expect(promise).rejects.toThrow("aborted");
      expect(callback).toHaveBeenCalledTimes(5);
      expect(onAttempt).toHaveBeenCalledTimes(4);
    });

    it("rejects if signal is aborted in onAttempt", async () => {
      jest.useRealTimers();
      const error = new Error("aborted");
      const controller = new AbortController();
      const signal = controller.signal;
      const callback = jest.fn();
      const onAttempt = jest.fn((ctx) => {
        if (ctx.attempt >= 5) {
          controller.abort(error);
        }
      });
      const promise = waitFor(callback, { delay: 10, onAttempt, signal });
      await expect(promise).rejects.toThrow("aborted");
      expect(callback).toHaveBeenCalledTimes(5);
      expect(onAttempt).toHaveBeenCalledTimes(5);
    });

    it("rejects if signal is aborted during execution", async () => {
      const callback = jest.fn();
      const controller = new AbortController();
      const onAttempt = jest.fn();
      const promise = waitFor(callback, {
        delay: 10,
        onAttempt,
        signal: controller.signal,
      });
      await jest.advanceTimersByTimeAsync(50);
      controller.abort("abort");
      await expect(promise).rejects.toBe("abort");
      expect(callback).toHaveBeenCalledTimes(5);
      expect(onAttempt).toHaveBeenCalledTimes(5);
    });
  });

  describe("options.timeout", () => {
    it("throws TimeoutError if timeout is exceeded", async () => {
      const callback = jest.fn();
      const promise = waitFor(callback, { delay: 100, timeout: 150 });
      try {
        jest.advanceTimersByTime(200);
        await promise;
      } catch (error) {
        expectTimeoutError(error);
      }
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("throws TimeoutError if timeout is exceeded before stop", async () => {
      const callback = jest.fn((ctx) => {
        ctx.stop = true;
      });
      const promise = waitFor(callback, { delay: 101, timeout: 100 });
      try {
        jest.advanceTimersByTime(150);
        await promise;
      } catch (error) {
        expectTimeoutError(error);
      }
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("does not throw if stopped before timeout", async () => {
      const callback = jest.fn((ctx) => {
        ctx.stop = true;
      });
      const promise = waitFor(callback, { delay: 100, timeout: 101 });
      jest.advanceTimersByTime(150);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("throws TimeoutError if timeout is exceeded before abort", async () => {
      jest.useRealTimers();
      const controller = new AbortController();
      const signal = controller.signal;
      const callback = jest.fn(() => {
        controller.abort();
      });
      try {
        await waitFor(callback, { delay: 101, signal, timeout: 100 });
      } catch (error) {
        expectTimeoutError(error);
      }
      expect(callback).toHaveBeenCalledTimes(0);
    });

    it("aborts if aborted before timeout", async () => {
      const controller = new AbortController();
      const signal = controller.signal;
      const callback = jest.fn();
      const promise = waitFor(callback, { delay: 100, signal, timeout: 150 });
      try {
        jest.advanceTimersByTime(125);
        controller.abort();
        jest.advanceTimersByTime(125);
        await promise;
      } catch (error) {
        expectNativeAbortError(error);
      }
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
