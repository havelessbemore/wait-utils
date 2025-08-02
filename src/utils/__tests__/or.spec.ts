import { HAS_ANY, nativeFn, or, polyfillFn } from "src/utils/or";

describe("HAS_ANY", () => {
  it("reflects presence of AbortSignal.any instance method", () => {
    expect(HAS_ANY).toBe(typeof AbortSignal.any === "function");
  });
});

describe("or", () => {
  let controller1: AbortController;
  let controller2: AbortController;

  const methods = [
    {
      name: `Actual (native = ${HAS_ANY})`,
      method: or,
    },
    {
      name: "polyfill",
      method: polyfillFn,
    },
  ];

  beforeEach(() => {
    controller1 = new AbortController();
    controller2 = new AbortController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  for (const { name, method } of methods) {
    describe(name, () => {
      it("returns second signal if first is undefined", () => {
        const result = method(undefined, controller2.signal);
        expect(result).toBe(controller2.signal);
      });

      it("returns first signal if second is undefined", () => {
        const result = method(controller1.signal, undefined);
        expect(result).toBe(controller1.signal);
      });

      it("aborts immediately if signal1 is already aborted", async () => {
        const spy1 = jest.spyOn(controller1.signal, "addEventListener");
        const spy2 = jest.spyOn(controller2.signal, "addEventListener");
        controller1.abort("pre1");

        const combined = method(controller1.signal, controller2.signal);
        expect(combined.aborted).toBe(true);
        expect(combined.reason).toBe("pre1");
        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
      });

      it("aborts immediately if signal2 is already aborted", async () => {
        const spy1 = jest.spyOn(controller1.signal, "addEventListener");
        const spy2 = jest.spyOn(controller2.signal, "addEventListener");
        controller2.abort("pre2");

        const combined = method(controller1.signal, controller2.signal);
        expect(combined.aborted).toBe(true);
        expect(combined.reason).toBe("pre2");
        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
      });

      it("aborts with signal1.reason if signal1 aborts", async () => {
        const combined = method(controller1.signal, controller2.signal);
        expect(combined.aborted).toBe(false);

        const onAbort = jest.fn();
        combined.addEventListener("abort", onAbort);
        controller1.abort("one");

        expect(combined.aborted).toBe(true);
        expect(combined.reason).toBe("one");
        expect(onAbort).toHaveBeenCalledTimes(1);
      });

      it("aborts with signal2.reason if signal2 aborts", async () => {
        const combined = method(controller1.signal, controller2.signal);
        expect(combined.aborted).toBe(false);

        const onAbort = jest.fn();
        combined.addEventListener("abort", onAbort);
        controller2.abort("two");

        expect(combined.aborted).toBe(true);
        expect(combined.reason).toBe("two");
        expect(onAbort).toHaveBeenCalledTimes(1);
      });

      it("does not abort with signal2 if already aborted", async () => {
        const combined = or(controller1.signal, controller2.signal);
        controller1.abort("foo");
        controller2.abort("bar");

        expect(combined.aborted).toBe(true);
        expect(combined.reason).toBe("foo");
      });

      it("does not abort with signal1 if already aborted", async () => {
        const combined = or(controller1.signal, controller2.signal);
        controller2.abort("bar");
        controller1.abort("foo");

        expect(combined.aborted).toBe(true);
        expect(combined.reason).toBe("bar");
      });

      it("does not abort by signal1 twice", async () => {
        const combined = or(controller1.signal, controller2.signal);
        controller1.abort("foo");
        controller1.abort("bar");

        expect(combined.aborted).toBe(true);
        expect(combined.reason).toBe("foo");
      });

      it("does not abort by signal2 twice", async () => {
        const combined = or(controller1.signal, controller2.signal);
        controller2.abort("foo");
        controller2.abort("bar");

        expect(combined.aborted).toBe(true);
        expect(combined.reason).toBe("foo");
      });
    });
  }

  describe("native", () => {
    const method = nativeFn;
    const originalAny = AbortSignal.any;

    beforeAll(() => {
      AbortSignal.any = jest.fn();
    });

    afterAll(() => {
      AbortSignal.any = originalAny;
    });

    it("calls AbortSignal.any", () => {
      const c1 = new AbortController();
      const c2 = new AbortController();
      method(c1.signal, c2.signal);
      expect(AbortSignal.any).toHaveBeenCalledWith([c1.signal, c2.signal]);
    });
  });

  describe("polyfill", () => {
    const method = polyfillFn;
    const originalAny = AbortSignal.any;

    beforeAll(() => {
      AbortSignal.any = jest.fn();
    });

    afterAll(() => {
      AbortSignal.any = originalAny;
    });

    it("does not call AbortSignal.any", () => {
      const c1 = new AbortController();
      const c2 = new AbortController();
      const result = method(c1.signal, c2.signal);
      expect(AbortSignal.any).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(AbortSignal);
    });

    it("cleans up event listener after signal1 aborts", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      method(controller1.signal, controller2.signal);
      controller1.abort("bye");

      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith("abort", expect.any(Function));
    });

    it("cleans up event listener after signal2 aborts", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      method(controller1.signal, controller2.signal);
      controller2.abort("bye");

      expect(spy1).toHaveBeenCalledWith("abort", expect.any(Function));
      expect(spy2).not.toHaveBeenCalled();
    });

    it("does not abort by signal1 twice", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      const signal = method(controller1.signal, controller2.signal);
      controller1.abort("foo");
      controller1.abort("bar");

      expect(signal.reason).toBe("foo");
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(1);
    });

    it("does not abort by signal2 twice", async () => {
      const spy1 = jest.spyOn(controller1.signal, "removeEventListener");
      const spy2 = jest.spyOn(controller2.signal, "removeEventListener");

      const signal = method(controller1.signal, controller2.signal);
      controller2.abort("foo");
      controller2.abort("bar");

      expect(signal.reason).toBe("foo");
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(0);
    });
  });
});
