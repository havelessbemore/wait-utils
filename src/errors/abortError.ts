/**
 * Error thrown when an operation is aborted via an `AbortSignal`.
 *
 * This error is used in asynchronous operations
 * to indicate that the caller explicitly cancelled
 * the request by invoking `AbortController.abort()`.
 */
export class AbortError extends DOMException {
  constructor(message = "This operation was aborted") {
    super(message, "AbortError");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
