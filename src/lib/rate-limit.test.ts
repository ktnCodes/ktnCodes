import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, resetRateLimiter } from "./rate-limit";

const WINDOW_MS = 5 * 60 * 1000;

describe("rateLimit", () => {
  beforeEach(() => resetRateLimiter());

  it("allows up to 20 requests per window, then blocks", () => {
    for (let i = 0; i < 20; i++) {
      expect(rateLimit("ip1", 1000 + i)).toBe(true);
    }
    expect(rateLimit("ip1", 1100)).toBe(false);
  });

  it("frees the key after the window passes", () => {
    for (let i = 0; i < 20; i++) rateLimit("ip1", 1000);
    expect(rateLimit("ip1", 1001)).toBe(false);
    expect(rateLimit("ip1", 1000 + WINDOW_MS + 1)).toBe(true);
  });

  it("tracks keys independently", () => {
    for (let i = 0; i < 20; i++) rateLimit("ip1", 1000);
    expect(rateLimit("ip1", 1001)).toBe(false);
    expect(rateLimit("ip2", 1001)).toBe(true);
  });

  it("slides the window instead of resetting it", () => {
    // 10 requests at t=0, 10 at t=4min: full. At t=5min+1 the first 10
    // expire, so 10 slots free up.
    for (let i = 0; i < 10; i++) rateLimit("ip1", 0);
    for (let i = 0; i < 10; i++) rateLimit("ip1", 4 * 60 * 1000);
    expect(rateLimit("ip1", 4 * 60 * 1000 + 1)).toBe(false);
    expect(rateLimit("ip1", WINDOW_MS + 1)).toBe(true);
  });
});
