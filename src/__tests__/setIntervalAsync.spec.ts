import { setIntervalAsync } from "src/setIntervalAsync";

describe(setIntervalAsync.name, () => {
  beforeAll(() => {
    jest.useFakeTimers({ now: 1_000_000 });
    jest.spyOn(global, "setTimeout");
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

  describe("delay", () => {
    it("invokes callback repeatedly with undefined delay", async () => {
      const callback = jest.fn();
      const controller = new AbortController();

      const promise = setIntervalAsync(callback, undefined, controller.signal);
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

      const promise = setIntervalAsync(callback, 0, controller.signal);
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

      const promise = setIntervalAsync(callback, -10, controller.signal);
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

      const promise = setIntervalAsync(callback, 100, controller.signal);

      for (let i = 1; i <= 10; ++i) {
        await jest.advanceTimersByTimeAsync(100);
        expect(callback).toHaveBeenCalledTimes(i);
      }

      controller.abort("done");
      await expect(promise).rejects.toBe("done");
    });
  });

  describe("signal", () => {
    it("immediately rejects if signal is already aborted", async () => {
      const controller = new AbortController();
      controller.abort("early-abort");

      const spy = jest.spyOn(controller.signal, "addEventListener");
      await expect(
        setIntervalAsync(() => 1, 500, controller.signal),
      ).rejects.toBe("early-abort");
      expect(setTimeout).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("rejects if signal aborts during execution", async () => {
      const controller = new AbortController();
      const promise = setIntervalAsync(() => 1, 1000, controller.signal);

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

      controller.abort(new Error("aborted during wait"));
      jest.runOnlyPendingTimers();
      await expect(promise).rejects.toThrow("aborted during wait");
    });

    it("stops after controller.abort() is called from inside sync callback", async () => {
      const error = new Error("stopped internally");
      const controller = new AbortController();
      const callback = jest.fn(() => {
        controller.abort(error);
      });

      const promise = setIntervalAsync(callback, 100, controller.signal);
      jest.advanceTimersByTime(100);

      await expect(promise).rejects.toBe(error);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("stops after controller.abort() is called from inside async callback", async () => {
      const error = new Error("stopped internally");
      const controller = new AbortController();
      const callback = jest.fn(async () => {
        controller.abort(error);
      });

      const promise = setIntervalAsync(callback, 100, controller.signal);
      jest.advanceTimersByTime(100);

      await expect(promise).rejects.toBe(error);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("doesn’t call callback again after stop before scheduling next timeout", async () => {
      const spy = jest.fn();
      const promise = setIntervalAsync((ctx) => {
        spy(ctx);
        ctx.stop = true;
      }, 100);

      await jest.advanceTimersByTimeAsync(1000);
      await expect(promise).resolves.toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("callback", () => {
    it("rejects if callback throws synchronously", async () => {
      const error = new Error("sync error");
      const promise = setIntervalAsync(() => {
        throw error;
      }, 50);

      jest.advanceTimersByTime(50);
      await expect(promise).rejects.toBe(error);
    });

    it("rejects if callback throws asynchronously", async () => {
      const error = new Error("async error");
      const promise = setIntervalAsync(async () => {
        throw error;
      }, 50);

      jest.advanceTimersByTime(50);
      await expect(promise).rejects.toBe(error);
    });

    it("handles multiple concurrent intervals independently", async () => {
      const ac1 = new AbortController();
      const ac2 = new AbortController();
      const ac3 = new AbortController();

      let count = 0;
      const cb = () => ++count;
      const inter1 = setIntervalAsync(cb, 200, ac1.signal);
      const inter2 = setIntervalAsync(cb, 400, ac2.signal);
      const inter3 = setIntervalAsync(cb, 1000, ac3.signal);

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
  });

  describe("context", () => {
    it("should be the same across callback invocations", async () => {
      const callback = jest.fn(async (ctx) => {
        if (ctx.tickCount == 1) {
          ctx.__test__ = "foo";
        } else if (ctx.__test__ !== "foo") {
          throw new Error("Expected same context");
        }
        ctx.stop = ctx.tickCount >= 10;
      });
      const promise = setIntervalAsync(callback, 10);
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe("context.delay", () => {
    it("should initialize context.delay to undefined options.delay", async () => {
      const delay = undefined;
      const callback = jest.fn(async (ctx) => {
        expect(ctx.delay).toBe(delay);
        ctx.stop = true;
      });
      const promise = setIntervalAsync(callback, delay);
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should initialize context.delay to options.delay", async () => {
      const delay = 100;
      const callback = jest.fn(async (ctx) => {
        expect(ctx.delay).toBe(delay);
        ctx.stop = true;
      });
      const promise = setIntervalAsync(callback, delay);
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should be able to change context.delay from the callback", async () => {
      let delay = 10;
      const callback = jest.fn(async (ctx) => {
        expect(ctx.delay).toBe(delay);
        delay += 10;
        ctx.delay = delay;
        ctx.stop = ctx.delay > 100;
      });
      const promise = setIntervalAsync(callback, delay);
      await jest.advanceTimersByTimeAsync(550);
      await expect(promise).resolves.toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe("context.stop", () => {
    it("should invoke the callback repeatedly until context.stop = true", async () => {
      const callback = jest.fn(async (ctx) => {
        ctx.stop = ctx.tickCount >= 10;
      });
      const promise = setIntervalAsync(callback, 10);
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  describe("context.tickCount", () => {
    it("should start context.tickCount at 1", async () => {
      const callback = jest.fn(async (ctx) => {
        expect(ctx.tickCount).toBe(1);
        ctx.stop = true;
      });
      const promise = setIntervalAsync(callback, 10);
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should increment context.tickCount", async () => {
      let tickCount = 0;
      const callback = jest.fn(async (ctx) => {
        ++tickCount;
        expect(ctx.tickCount).toBe(tickCount);
        ctx.stop = ctx.tickCount >= 10;
      });
      const promise = setIntervalAsync(callback, 10);
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(10);
    });

    it("should set context.tickCount to read-only", async () => {
      let tickCount = 0;
      const callback = jest.fn(async (ctx) => {
        ++tickCount;
        try {
          ctx.tickCount = "foo";
        } catch (_error) {
          // Will throw in strict mode.
        }
        expect(ctx.tickCount).toBe(tickCount);
        ctx.stop = ctx.tickCount >= 10;
      });
      const promise = setIntervalAsync(callback, 10);
      await jest.advanceTimersByTimeAsync(200);
      await expect(promise).resolves.not.toThrow();
      expect(callback).toHaveBeenCalledTimes(10);
    });
  });

  it("registers abort listener when signal provided", async () => {
    const cb = jest.fn();
    const controller = new AbortController();
    const spy = jest.spyOn(controller.signal, "addEventListener");
    const promise = setIntervalAsync(cb, 10, controller.signal);

    await jest.advanceTimersByTimeAsync(0);
    expect(spy).toHaveBeenCalledTimes(1);
    await jest.advanceTimersByTimeAsync(11);
    expect(spy).toHaveBeenCalledTimes(1);

    const [eventName, listener, opts] = spy.mock.calls[0];
    expect(eventName).toBe("abort");
    expect(typeof listener).toBe("function");
    expect(opts).toEqual({ once: true });

    // cleanup
    controller.abort("cleanup");
    await promise.catch(() => undefined);
    spy.mockRestore();
  });

  it("removes abort listener after rejection", async () => {
    const controller = new AbortController();
    const spy = jest.spyOn(controller.signal, "removeEventListener");

    const error = new Error("failure");
    const promise = setIntervalAsync(
      () => {
        throw error;
      },
      100,
      controller.signal,
    );

    jest.advanceTimersByTime(100);
    await expect(promise).rejects.toBe(error);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("abort", expect.any(Function));
    spy.mockRestore();
  });
});
