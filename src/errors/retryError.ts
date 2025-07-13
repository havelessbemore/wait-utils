/**
 * Error thrown when a retry loop is explicitly cancelled.
 *
 * This error is used to indicate that a retry was cancelled
 * from an `onRetry` callback returning `false`.
 */
export class RetryError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "RetryError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
