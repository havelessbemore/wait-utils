import { expectNativeAbortError } from "src/errors/__testutils__/utils";
import { HAS_THROW_IF_ABORTED, throwIfAborted } from "src/utils/throwIfAborted";

describe("HAS_THROW_IF_ABORTED", () => {
  it("reflects presence of AbortSignal.any", () => {
    expect(HAS_THROW_IF_ABORTED).toBe(
      typeof AbortSignal.prototype.throwIfAborted === "function",
    );
  });
});

describe(throwIfAborted.name, () => {
  jest.mock("src/utils/throwIfAborted", () => ({
    ...jest.requireActual("src/utils/throwIfAborted"),
    HAS_THROW_IF_ABORTED: false,
  }));

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("with native (HAS_THROW_IF_ABORTED = true)", () => {
    beforeEach(() => {
      (HAS_THROW_IF_ABORTED as boolean) = true;
    });

    it("does nothing if signal is undefined", () => {
      expect(() => throwIfAborted(undefined)).not.toThrow();
    });

    it("does nothing if signal is not aborted", () => {
      const signal = {
        throwIfAborted: jest.fn(),
      } as unknown as AbortSignal;
      expect(() => throwIfAborted(signal)).not.toThrow();
      expect(signal.throwIfAborted).toHaveBeenCalled();
    });

    it("throws with native AbortError if no reason given", () => {
      const controller = new AbortController();
      controller.abort();
      const throwIfAbortedSpy = jest.spyOn(controller.signal, "throwIfAborted");
      try {
        throwIfAborted(controller.signal);
        fail("Expected throw");
      } catch (error) {
        expectNativeAbortError(error);
      }
      expect(throwIfAbortedSpy).toHaveBeenCalled();
    });

    it("throws with native AbortError if reason is undefined", () => {
      const controller = new AbortController();
      controller.abort(undefined);
      const throwIfAbortedSpy = jest.spyOn(controller.signal, "throwIfAborted");
      try {
        throwIfAborted(controller.signal);
        fail("Expected throw");
      } catch (error) {
        expectNativeAbortError(error);
      }
      expect(throwIfAbortedSpy).toHaveBeenCalled();
    });

    it("throws null if reason is null", () => {
      const controller = new AbortController();
      controller.abort(null);
      const throwIfAbortedSpy = jest.spyOn(controller.signal, "throwIfAborted");
      try {
        throwIfAborted(controller.signal);
        fail("Expected throw");
      } catch (error) {
        expect(error).toBe(null);
      }
      expect(throwIfAbortedSpy).toHaveBeenCalled();
    });

    it("throws with provided reason", () => {
      const error = new Error("Abort thrown");
      const controller = new AbortController();
      controller.abort(error);
      const throwIfAbortedSpy = jest.spyOn(controller.signal, "throwIfAborted");
      expect(() => throwIfAborted(controller.signal)).toThrow(error);
      expect(throwIfAbortedSpy).toHaveBeenCalled();
    });
  });

  describe("with custom (HAS_THROW_IF_ABORTED = false)", () => {
    beforeEach(() => {
      (HAS_THROW_IF_ABORTED as boolean) = false;
    });

    it("does nothing if signal is undefined", () => {
      expect(() => throwIfAborted(undefined)).not.toThrow();
    });

    it("does nothing if signal is not aborted", () => {
      const signal = {
        throwIfAborted: jest.fn(),
      } as unknown as AbortSignal;
      expect(() => throwIfAborted(signal)).not.toThrow();
      expect(signal.throwIfAborted).not.toHaveBeenCalled();
    });

    it("throws with AbortError if no reason given", () => {
      const controller = new AbortController();
      controller.abort();
      const throwIfAbortedSpy = jest.spyOn(controller.signal, "throwIfAborted");
      try {
        throwIfAborted(controller.signal);
        fail("Expected throw");
      } catch (error) {
        expectNativeAbortError(error);
      }
      expect(throwIfAbortedSpy).not.toHaveBeenCalled();
    });

    it("throws with native AbortError if reason is undefined", () => {
      const controller = new AbortController();
      controller.abort(undefined);
      const throwIfAbortedSpy = jest.spyOn(controller.signal, "throwIfAborted");
      try {
        throwIfAborted(controller.signal);
        fail("Expected throw");
      } catch (error) {
        expectNativeAbortError(error);
      }
      expect(throwIfAbortedSpy).not.toHaveBeenCalled();
    });

    it("throws null if reason is null", () => {
      const controller = new AbortController();
      controller.abort(null);
      const throwIfAbortedSpy = jest.spyOn(controller.signal, "throwIfAborted");
      try {
        throwIfAborted(controller.signal);
        fail("Expected throw");
      } catch (error) {
        expect(error).toBe(null);
      }
      expect(throwIfAbortedSpy).not.toHaveBeenCalled();
    });

    it("throws with provided reason", () => {
      const error = new Error("Abort thrown");
      const controller = new AbortController();
      controller.abort(error);
      const throwIfAbortedSpy = jest.spyOn(controller.signal, "throwIfAborted");
      expect(() => throwIfAborted(controller.signal)).toThrow(error);
      expect(throwIfAbortedSpy).not.toHaveBeenCalled();
    });

    it("does not call signal.throwIfAborted()", () => {
      const signal = {
        throwIfAborted: jest.fn(),
      } as unknown as AbortSignal;
      expect(() => throwIfAborted(signal)).not.toThrow();
      expect(signal.throwIfAborted).not.toHaveBeenCalled();
    });

    it("throws signal.reason if signal.aborted", () => {
      const reason = new Error("Manual abort");
      const signal = {
        aborted: true,
        reason,
      } as unknown as AbortSignal;
      expect(() => throwIfAborted(signal)).toThrow(reason);
    });
  });
});
