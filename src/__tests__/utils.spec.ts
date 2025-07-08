import { throwIfAborted } from "src/utils";

describe(throwIfAborted.name, () => {
  it("does nothing if no signal is provided", () => {
    expect(() => throwIfAborted(undefined)).not.toThrow();
  });

  it("does nothing if signal is not aborted", () => {
    const controller = new AbortController();
    expect(() => throwIfAborted(controller.signal)).not.toThrow();
  });

  it("throws AbortError if signal is aborted without reason", () => {
    const controller = new AbortController();
    controller.abort();
    expect(() => throwIfAborted(controller.signal)).toThrow(DOMException);
    expect(() => throwIfAborted(controller.signal)).toThrow(
      "This operation was aborted",
    );
  });

  it("throws custom reason if signal is aborted with reason (Error)", () => {
    const msg = "custom reason";
    const controller = new AbortController();
    const customError = new Error(msg);
    controller.abort(customError);
    expect(() => throwIfAborted(controller.signal)).toThrow(customError);
    expect(() => throwIfAborted(controller.signal)).toThrow(msg);
  });

  it("throws custom reason if signal is aborted with reason (string)", () => {
    const controller = new AbortController();
    controller.abort("string reason");
    try {
      throwIfAborted(controller.signal);
    } catch (e) {
      expect(e).toBe("string reason");
    }
  });

  it("throws custom reason if signal is aborted with reason (number)", () => {
    const controller = new AbortController();
    controller.abort(404);
    try {
      throwIfAborted(controller.signal);
    } catch (e) {
      expect(e).toBe(404);
    }
  });
});
