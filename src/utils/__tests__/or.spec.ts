import { HAS_ANY, or } from "src/utils/or";

describe("HAS_ANY", () => {
  it("reflects presence of AbortSignal.any", () => {
    expect(HAS_ANY).toBe(typeof AbortSignal.any === "function");
  });
});

describe(or.name, () => {
  jest.mock("src/utils/or", () => ({
    ...jest.requireActual("src/utils/or"),
    HAS_ANY: false,
  }));
  describe("HAS_ANY = true", () => {
    const originalAny = AbortSignal.any;

    beforeEach(() => {
      (HAS_ANY as boolean) = true;
      AbortSignal.any = jest.fn(() => new AbortController().signal);
    });

    afterEach(() => {
      AbortSignal.any = originalAny;
    });

    it("returns second signal if first is undefined", () => {
      const c = new AbortController();
      const result = or(undefined, c.signal);
      expect(result).toBe(c.signal);
    });

    it("returns first signal if second is undefined", () => {
      const c = new AbortController();
      const result = or(c.signal, undefined);
      expect(result).toBe(c.signal);
    });

    it("calls AbortSignal.any if both defined", () => {
      const c1 = new AbortController();
      const c2 = new AbortController();
      const result = or(c1.signal, c2.signal);
      expect(AbortSignal.any).toHaveBeenCalledWith([c1.signal, c2.signal]);
      expect(result).toBeInstanceOf(AbortSignal);
    });
  });

  describe("HAS_ANY = false (fallback)", () => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    let controller1: AbortController;
    let controller2: AbortController;

    beforeAll(() => {
      // Simulate no native support
      Object.defineProperty(global, "AbortSignal", {
        configurable: true,
        value: { ...AbortSignal, any: undefined },
      });
    });

    beforeEach(() => {
      (HAS_ANY as boolean) = false;
      controller1 = new AbortController();
      controller2 = new AbortController();
    });

    afterAll(() => {
      Object.defineProperty(global, "AbortSignal", {
        configurable: true,
        value: global.AbortSignal,
      });
    });

    it("returns second signal if first is undefined", () => {
      const result = or(undefined, controller2.signal);
      expect(result).toBe(controller2.signal);
    });

    it("returns first signal if second is undefined", () => {
      const result = or(controller1.signal, undefined);
      expect(result).toBe(controller1.signal);
    });

    it("aborts with signal1.reason if signal1 aborts first", async () => {
      const combined = or(controller1.signal, controller2.signal);
      expect(combined.aborted).toBe(false);

      const onAbort = jest.fn();
      combined.addEventListener("abort", onAbort);

      controller1.abort("one");
      await delay(0); // flush microtasks

      expect(combined.aborted).toBe(true);
      expect(combined.reason).toBe("one");
      expect(onAbort).toHaveBeenCalledTimes(1);
    });

    it("aborts with signal2.reason if signal2 aborts first", async () => {
      const combined = or(controller1.signal, controller2.signal);

      const onAbort = jest.fn();
      combined.addEventListener("abort", onAbort);

      controller2.abort("two");
      await delay(0);

      expect(combined.aborted).toBe(true);
      expect(combined.reason).toBe("two");
      expect(onAbort).toHaveBeenCalledTimes(1);
    });

    it("aborts immediately if signal1 is already aborted", () => {
      const spy1 = jest.spyOn(controller1.signal, "addEventListener");
      const spy2 = jest.spyOn(controller2.signal, "addEventListener");
      controller1.abort("pre1");
      const combined = or(controller1.signal, controller2.signal);
      expect(combined.aborted).toBe(true);
      expect(combined.reason).toBe("pre1");
      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });

    it("aborts immediately if signal2 is already aborted", () => {
      const spy1 = jest.spyOn(controller1.signal, "addEventListener");
      const spy2 = jest.spyOn(controller2.signal, "addEventListener");
      controller2.abort("pre2");
      const combined = or(controller1.signal, controller2.signal);
      expect(combined.aborted).toBe(true);
      expect(combined.reason).toBe("pre2");
      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });

    it("cleans up event listener after signal1 aborts", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      or(controller1.signal, controller2.signal);
      controller1.abort("bye");
      await delay(0);

      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith("abort", expect.any(Function));
    });

    it("cleans up event listener after signal2 aborts", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      or(controller1.signal, controller2.signal);
      controller2.abort("bye");
      await delay(0);

      expect(spy1).toHaveBeenCalledWith("abort", expect.any(Function));
      expect(spy2).not.toHaveBeenCalled();
    });

    it("does not abort with signal2 if already aborted", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      const signal = or(controller1.signal, controller2.signal);
      controller1.abort("foo");
      controller2.abort("bar");
      await delay(0);

      expect(signal.reason).toBe("foo");
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(1);
    });

    it("does not abort with signal1 if already aborted", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      const signal = or(controller1.signal, controller2.signal);
      controller2.abort("bar");
      controller1.abort("foo");
      await delay(0);

      expect(signal.reason).toBe("bar");
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
    });

    it("does not abort by signal1 twice", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      const signal = or(controller1.signal, controller2.signal);
      controller1.abort("foo");
      controller1.abort("bar");
      await delay(0);

      expect(signal.reason).toBe("foo");
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(1);
    });

    it("does not abort by signal2 twice", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      const signal = or(controller1.signal, controller2.signal);
      controller2.abort("foo");
      controller2.abort("bar");
      await delay(0);

      expect(signal.reason).toBe("foo");
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
    });
  });
});
