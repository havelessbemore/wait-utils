import { getOwnProperty } from "src/utils/getOwnProperty";

describe(getOwnProperty.name, () => {
  it("returns the value for an own property that exists", () => {
    const obj = { foo: 42 };
    expect(getOwnProperty(obj, "foo")).toBe(42);
  });

  it("returns undefined for a missing property", () => {
    const obj = { foo: 42 };
    expect(getOwnProperty(obj, "bar" as keyof typeof obj)).toBeUndefined();
  });

  it("returns undefined for an inherited property", () => {
    const parent = { foo: 1 };
    const child = Object.create(parent);
    expect(getOwnProperty(child, "foo" as keyof typeof child)).toBeUndefined();
  });

  it("returns null for an explicitly null property", () => {
    const obj = { foo: null };
    expect(getOwnProperty(obj, "foo")).toBeNull();
  });

  it("works on objects without prototypes", () => {
    const obj = Object.create(null);
    obj.foo = 123;
    expect(getOwnProperty(obj, "foo")).toBe(123);
  });

  it("returns undefined when checking for non-existing keys on prototype-less objects", () => {
    const obj = Object.create(null);
    expect(getOwnProperty(obj, "toString")).toBeUndefined();
  });

  it("returns the value for symbol keys that are own properties", () => {
    const sym = Symbol("key");
    const obj = { [sym]: 123 };
    expect(getOwnProperty(obj, sym)).toBe(123);
  });

  it("returns undefined for missing symbol keys", () => {
    const sym = Symbol("key");
    const obj = {};
    expect(getOwnProperty(obj, sym as keyof typeof obj)).toBeUndefined();
  });

  it("handles objects that override their own getOwnProperty", () => {
    const obj = {
      foo: 1,
      getOwnProperty: () => false,
    };
    expect(getOwnProperty(obj, "foo")).toBe(1);
  });

  describe("fallback", () => {
    it("returns the value for an own property that exists", () => {
      const obj = { foo: 42 };
      expect(getOwnProperty(obj, "foo", 50)).toBe(42);
    });

    it("returns the fallback for a missing property", () => {
      const obj = { foo: 42 };
      expect(getOwnProperty(obj, "bar" as keyof typeof obj, 12)).toBe(12);
    });

    it("returns the fallback for an inherited property", () => {
      const parent = { foo: 1 };
      const child = Object.create(parent);
      expect(getOwnProperty(child, "foo" as keyof typeof child, 12)).toBe(12);
    });

    it("returns undefined for an explicitly undefined property", () => {
      const obj = { foo: undefined } as { foo?: string };
      expect(getOwnProperty(obj, "foo", "foo")).toBeUndefined();
    });

    it("returns null for an explicitly null property", () => {
      const obj = { foo: null } as { foo?: string | null };
      expect(getOwnProperty(obj, "foo", "foo")).toBeNull();
    });

    it("works on objects without prototypes", () => {
      const obj = Object.create(null);
      obj.foo = 123;
      expect(getOwnProperty(obj, "foo", 1)).toBe(123);
    });

    it("returns the fallback when checking for non-existing keys on prototype-less objects", () => {
      const obj = Object.create(null);
      expect(getOwnProperty(obj, "toString", "test")).toBe("test");
    });

    it("returns the value for symbol keys that are own properties", () => {
      const sym = Symbol("key");
      const obj = { [sym]: 123 };
      expect(getOwnProperty(obj, sym, 456)).toBe(123);
    });

    it("returns the fallback for missing symbol keys", () => {
      const sym = Symbol("key");
      const obj = {} as Record<symbol, string>;
      expect(getOwnProperty(obj, sym, "D")).toBe("D");
    });

    it("handles objects that override their own getOwnProperty", () => {
      const obj = {
        foo: 1,
        getOwnProperty: () => false,
      };
      expect(getOwnProperty(obj, "foo", 12)).toBe(1);
    });
  });
});
