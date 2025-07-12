import { TimeoutError } from "src/timeoutError";

describe(TimeoutError.name, () => {
  test("is an instance of DOMException", () => {
    const err = new TimeoutError();
    expect(err).toBeInstanceOf(DOMException);
  });

  test("has correct name", () => {
    const err = new TimeoutError();
    expect(err.name).toBe("TimeoutError");
  });

  test("prototype is correctly set", () => {
    const err = new TimeoutError();
    expect(Object.getPrototypeOf(err)).toBe(TimeoutError.prototype);
  });

  test("sets the default message if none provided", () => {
    const err = new TimeoutError();
    expect(err.message).toBe("This operation was timed out");
  });

  test("sets the provided message", () => {
    const msg = "test";
    const err = new TimeoutError(msg);
    expect(err.message).toBe(msg);
  });
});
