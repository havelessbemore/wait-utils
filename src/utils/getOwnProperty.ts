import { hasOwnProperty } from "./hasOwnProperty";

/**
 * Retrieves an own property from an object, with an optional fallback value.
 *
 * @param obj - The object to query.
 * @param key - The property key.
 * @param fallback - Optional fallback value if the property is not found.
 *
 * @returns The property value if present, otherwise the fallback or `undefined`.
 */
export function getOwnProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): T[K] | undefined;
export function getOwnProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  fallback: T[K],
): T[K];
export function getOwnProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  fallback?: T[K],
): T[K] | undefined {
  return hasOwnProperty(obj, key) ? obj[key] : fallback;
}
