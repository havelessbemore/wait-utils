import { RetryError } from "src/retryError";

describe(RetryError.name, () => {
  test("is an instance of Error", () => {
    const err = new RetryError();
    expect(err).toBeInstanceOf(Error);
  });

  test("has correct name", () => {
    const err = new RetryError();
    expect(err.name).toBe(RetryError.name);
  });

  test("sets the message if provided", () => {
    const msg = "This operation was aborted";
    const err = new RetryError(msg);
    expect(err.message).toBe(msg);
  });

  test("message defaults to empty string if not provided", () => {
    const err = new RetryError();
    expect(err.message).toBe("");
  });

  test("prototype is correctly set", () => {
    const err = new RetryError();
    expect(Object.getPrototypeOf(err)).toBe(RetryError.prototype);
  });
});
