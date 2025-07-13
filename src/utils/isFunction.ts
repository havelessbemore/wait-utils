/**
 * Determines whether a given value is a function.
 *
 * @param value - The value to test
 *
 * @returns `true` if the value is a function, otherwise `false`
 *
 * @example
 * ```ts
 * isFunction(() => {}); // true
 * isFunction(null);     // false
 * isFunction(42);       // false
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}
