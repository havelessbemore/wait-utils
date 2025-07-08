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

  test("sets the message if provided", () => {
    const msg = "test";
    const err = new TimeoutError(msg);
    expect(err.message).toBe(msg);
  });

  test("default used if message not provided", () => {
    const err = new TimeoutError();
    expect(err.message).toBe("This operation was timed out");
  });

  test("prototype is correctly set", () => {
    const err = new TimeoutError();
    expect(Object.getPrototypeOf(err)).toBe(TimeoutError.prototype);
  });
});
