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

  test("sets the message if provided", () => {
    const msg = "test";
    const err = new AbortError(msg);
    expect(err.message).toBe(msg);
  });

  test("default used if message not provided", () => {
    const err = new AbortError();
    expect(err.message).toBe("This operation was aborted");
  });

  test("prototype is correctly set", () => {
    const err = new AbortError();
    expect(Object.getPrototypeOf(err)).toBe(AbortError.prototype);
  });
});
