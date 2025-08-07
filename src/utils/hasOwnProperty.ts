/**
 * Determines whether an object has a property with the specified name.
 *
 * @param obj - The object to query.
 * @param key - The property key.
 *
 * @returns `true` if the object has the property, otherwise `false`.
 */
export function hasOwnProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K,
): key is K & keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
