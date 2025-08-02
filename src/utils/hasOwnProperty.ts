/**
 * Determines whether an object has a property with the specified name.
 *
 * @param obj
 * @param key
 *
 * @returns `true` if the object has the property, otherwise `false`.
 */
export function hasOwnProperty<T>(obj: T, key: keyof T): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
