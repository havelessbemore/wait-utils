import { hasOwnProperty } from "src/utils/hasOwnProperty";

describe(hasOwnProperty.name, () => {
  it("returns true for an own property that exists", () => {
    const obj = { foo: 42 };
    expect(hasOwnProperty(obj, "foo")).toBe(true);
  });

  it("returns false for a missing property", () => {
    const obj = { foo: 42 };
    expect(hasOwnProperty(obj, "bar" as keyof typeof obj)).toBe(false);
  });

  it("returns false for an inherited property", () => {
    const parent = { foo: 1 };
    const child = Object.create(parent);
    expect(hasOwnProperty(child, "foo" as keyof typeof child)).toBe(false);
  });

  it("returns true for an explicitly undefined property", () => {
    const obj = { foo: undefined };
    expect(hasOwnProperty(obj, "foo")).toBe(true);
  });

  it("works on objects without prototypes", () => {
    const obj = Object.create(null);
    obj.foo = 123;
    expect(hasOwnProperty(obj, "foo" as keyof typeof obj)).toBe(true);
  });

  it("returns false when checking for non-existing keys on prototype-less objects", () => {
    const obj = Object.create(null);
    expect(hasOwnProperty(obj, "toString" as keyof typeof obj)).toBe(false);
  });

  it("returns true for symbol keys that are own properties", () => {
    const sym = Symbol("key");
    const obj = { [sym]: 123 };
    expect(hasOwnProperty(obj, sym)).toBe(true);
  });

  it("returns false for missing symbol keys", () => {
    const sym = Symbol("key");
    const obj = {};
    expect(hasOwnProperty(obj, sym as keyof typeof obj)).toBe(false);
  });

  it("handles objects that override their own hasOwnProperty", () => {
    const obj = {
      foo: 1,
      hasOwnProperty: () => false,
    };
    expect(hasOwnProperty(obj, "foo")).toBe(true);
  });
});
