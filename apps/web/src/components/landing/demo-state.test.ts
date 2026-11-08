import { describe, expect, it } from "vitest";
import { creditScore, initialState, lendEarnings, spend, touch } from "./demo-state";

describe("website demo state", () => {
  it("spends demo money, earns points and refuses to overdraw", () => {
    const s = spend(initialState(), "bills", 8_420, "Paid Toronto Hydro")!;
    expect(s.balance).toBe(250_000 - 8_420);
    expect(s.points).toBe(30);
    expect(s.tried.bills).toBe(true);
    expect(spend(s, "send", 10_000_000, "too much")).toBeNull();
  });
  it("gives toggle points only the first time", () => {
    const once = touch(initialState(), "credit");
    expect(touch(once, "credit").points).toBe(once.points);
  });
  it("keeps the credit score on the 300 to 900 scale and works out lending interest", () => {
    expect(creditScore({ onTime: true, lowUse: true, builder: true })).toBe(760);
    expect(creditScore({ onTime: false, lowUse: false, builder: false })).toBe(600);
    expect(lendEarnings(10_000, 12)).toBe(720);
  });
});
