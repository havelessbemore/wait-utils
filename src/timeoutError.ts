/**
 * Error thrown when an operation exceeds its allowed time limit.
 *
 * This error is used in asynchronous operations to indicate
 * that the operation took too long to complete and was
 * terminated based on a timeout setting.
 */
export class TimeoutError extends DOMException {
  constructor(message = "This operation was timed out") {
    super(message, "TimeoutError");
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
