import { isFunction } from "src/utils/isFunction";

describe(isFunction.name, () => {
  it("returns true for standard functions", () => {
    function foo() {
      return undefined;
    }
    expect(isFunction(foo)).toBe(true);
  });

  it("returns true for arrow functions", () => {
    const fn = () => undefined;
    expect(isFunction(fn)).toBe(true);
  });

  it("returns true for async functions", () => {
    const asyncFn = async () => undefined;
    expect(isFunction(asyncFn)).toBe(true);
  });

  it("returns true for generator functions", () => {
    function* gen() {
      yield 1;
    }
    expect(isFunction(gen)).toBe(true);
  });

  it("returns true for functions created with the Function constructor", () => {
    const fn = new Function("return 1;");
    expect(isFunction(fn)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isFunction(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isFunction(undefined)).toBe(false);
  });

  it("returns false for strings", () => {
    expect(isFunction("function")).toBe(false);
  });

  it("returns false for numbers", () => {
    expect(isFunction(123)).toBe(false);
  });

  it("returns false for booleans", () => {
    expect(isFunction(true)).toBe(false);
    expect(isFunction(false)).toBe(false);
  });

  it("returns false for objects", () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction({ call: () => undefined })).toBe(false); // not a real function
  });

  it("returns false for arrays", () => {
    expect(isFunction([])).toBe(false);
  });

  it("returns false for symbols", () => {
    expect(isFunction(Symbol("fn"))).toBe(false);
  });

  it("returns false for BigInts", () => {
    expect(isFunction(BigInt(10))).toBe(false);
  });
});
