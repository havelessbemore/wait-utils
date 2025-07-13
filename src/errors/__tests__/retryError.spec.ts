import { RetryError } from "src/errors/retryError";

describe(RetryError.name, () => {
  test("is an instance of Error", () => {
    const err = new RetryError();
    expect(err).toBeInstanceOf(Error);
  });

  test("has correct name", () => {
    const err = new RetryError();
    expect(err.name).toBe("RetryError");
  });

  test("prototype is correctly set", () => {
    const err = new RetryError();
    expect(Object.getPrototypeOf(err)).toBe(RetryError.prototype);
  });

  test("sets the default message if none provided", () => {
    const err = new RetryError();
    expect(err.message).toBe("");
  });

  test("sets the provided message", () => {
    const msg = "test";
    const err = new RetryError(msg);
    expect(err.message).toBe(msg);
  });
});
