import { RetryError } from "src/errors/retryError";
import { TimeoutError } from "src/errors/timeoutError";

export function expectNativeAbortError(value: unknown) {
  expect(value).toBeInstanceOf(DOMException);
  expect((value as DOMException).name).toBe("AbortError");
  expect((value as DOMException).message).toBe("This operation was aborted");
}

export function expectRetryError(value: unknown) {
  expect(value).toBeInstanceOf(RetryError);
  expect(value).toHaveProperty("name", "RetryError");
}

export function expectTimeoutError(value: unknown) {
  expect(value).toBeInstanceOf(TimeoutError);
  expect(value).toHaveProperty("name", "TimeoutError");
}
