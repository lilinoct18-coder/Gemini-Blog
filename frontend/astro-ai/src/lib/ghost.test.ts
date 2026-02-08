import { describe, expect, it } from "vitest";
import { isValidGhostKey } from "./ghost";

describe("isValidGhostKey", () => {
  it("accepts a 26-char hex key", () => {
    expect(isValidGhostKey("0123456789abcdef0123456789")).toBe(true);
  });

  it("rejects non-hex characters", () => {
    expect(isValidGhostKey("zzzzzzzzzzzzzzzzzzzzzzzzzz")).toBe(false);
  });

  it("rejects incorrect length", () => {
    expect(isValidGhostKey("123456")).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(isValidGhostKey(123456)).toBe(false);
  });
});
