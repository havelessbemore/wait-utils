import { AbortError } from "src/abortError";

describe(AbortError.name, () => {
  test("is an instance of DOMException", () => {
    const err = new AbortError();
    expect(err).toBeInstanceOf(DOMException);
  });

  test("has correct name", () => {
    const err = new AbortError();
    expect(err.name).toBe("AbortError");
  });

  test("prototype is correctly set", () => {
    const err = new AbortError();
    expect(Object.getPrototypeOf(err)).toBe(AbortError.prototype);
  });

  test("sets the default message if none provided", () => {
    const err = new AbortError();
    expect(err.message).toBe("This operation was aborted");
  });

  test("sets the provided message", () => {
    const msg = "test";
    const err = new AbortError(msg);
    expect(err.message).toBe(msg);
  });
});
