import { expectNativeAbortError } from "src/errors/__testutils__/utils";
import {
  getThrowIfAborted,
  HAS_THROW_IF_ABORTED,
  throwIfAborted,
} from "src/utils/throwIfAborted";

describe("HAS_THROW_IF_ABORTED", () => {
  it("reflects presence of AbortSignal.throwIfAborted instance method", () => {
    expect(HAS_THROW_IF_ABORTED).toBe(
      typeof AbortSignal.prototype.throwIfAborted === "function",
    );
  });
});

describe(throwIfAborted.name, () => {
  const methods = [
    {
      name: `Actual (native = ${HAS_THROW_IF_ABORTED})`,
      method: throwIfAborted,
    },
    {
      name: "polyfill",
      method: getThrowIfAborted(false),
    },
  ];

  for (const { name, method } of methods) {
    describe(name, () => {
      if (name == "polyfill") {
        it("does not call signal.throwIfAborted", () => {
          const signal = {
            throwIfAborted: jest.fn(),
          } as unknown as AbortSignal;
          expect(() => method(signal)).not.toThrow();
          expect(signal.throwIfAborted).not.toHaveBeenCalled();
        });
      }

      it("does nothing if signal is undefined", () => {
        expect(() => method(undefined)).not.toThrow();
      });

      it("does nothing if signal is not aborted", () => {
        const controller = new AbortController();
        expect(() => method(controller.signal)).not.toThrow();
      });

      it("throws native AbortError if aborted with no reason", () => {
        const controller = new AbortController();
        controller.abort();
        try {
          throwIfAborted(controller.signal);
          fail("Expected throw");
        } catch (error) {
          expectNativeAbortError(error);
        }
      });

      it("throws native AbortError if aborted with undefined reason", () => {
        const controller = new AbortController();
        controller.abort(undefined);
        try {
          throwIfAborted(controller.signal);
          fail("Expected throw");
        } catch (error) {
          expectNativeAbortError(error);
        }
      });

      it("throws null if aborted with null reason", () => {
        const controller = new AbortController();
        controller.abort(null);
        try {
          throwIfAborted(controller.signal);
          fail("Expected throw");
        } catch (error) {
          expect(error).toBe(null);
        }
      });

      it("throws if aborted with given reason", () => {
        const controller = new AbortController();
        controller.abort("CustomReason");
        expect(() => method(controller.signal)).toThrow("CustomReason");
      });
    });
  }
});
