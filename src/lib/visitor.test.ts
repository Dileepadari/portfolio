/**
 * Tests for per-browser engagement identity.
 *
 * The property worth pinning is that ownership is answered locally: the public
 * comment read no longer returns anyone's `visitor_id`, so a regression that
 * went back to comparing server-supplied ids would fail here.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { forgetOwnComment, getVisitorId, ownsComment, rememberOwnComment } from "./visitor";

describe("visitor identity", () => {
  beforeEach(() => localStorage.clear());

  it("mints one id and then reuses it", () => {
    const first = getVisitorId();
    expect(first).toMatch(/^[0-9a-f-]{36}$/);
    expect(getVisitorId()).toBe(first);
  });
});

describe("comment ownership", () => {
  beforeEach(() => localStorage.clear());

  it("owns nothing before anything is posted", () => {
    expect(ownsComment("c1")).toBe(false);
  });

  it("remembers a posted comment", () => {
    rememberOwnComment("c1");
    expect(ownsComment("c1")).toBe(true);
    expect(ownsComment("c2")).toBe(false);
  });

  it("does not store the same comment twice", () => {
    rememberOwnComment("c1");
    rememberOwnComment("c1");
    expect(JSON.parse(localStorage.getItem("portfolio_own_comments") ?? "[]")).toEqual(["c1"]);
  });

  it("forgets a deleted comment and leaves the others", () => {
    rememberOwnComment("c1");
    rememberOwnComment("c2");
    forgetOwnComment("c1");
    expect(ownsComment("c1")).toBe(false);
    expect(ownsComment("c2")).toBe(true);
  });

  it("treats a corrupted entry as owning nothing rather than throwing", () => {
    localStorage.setItem("portfolio_own_comments", "{not json");
    expect(ownsComment("c1")).toBe(false);
    rememberOwnComment("c1");
    expect(ownsComment("c1")).toBe(true);
  });

  it("ignores non-string entries left in the list", () => {
    localStorage.setItem("portfolio_own_comments", JSON.stringify(["c1", 7, null]));
    expect(ownsComment("c1")).toBe(true);
    expect(ownsComment("7")).toBe(false);
  });
});
