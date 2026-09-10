/**
 * The dark/light fallback ordering.
 *
 * This is four lines of code and the single most-repeated decision in the
 * theme-aware imagery: every card, banner and gallery tile calls it. The cases
 * that matter are the one-sided pairs, where the wrong answer is a blank image
 * rather than a visibly wrong one.
 */

import { describe, expect, it } from "vitest";
import { pickThemedSource } from "./themedSource";

const DARK = "dark.png";
const LIGHT = "light.png";
const FALLBACK = "logo.png";

describe("pickThemedSource", () => {
  it("gives each theme its own variant when both exist", () => {
    expect(pickThemedSource("dark", DARK, LIGHT)).toBe(DARK);
    expect(pickThemedSource("light", DARK, LIGHT)).toBe(LIGHT);
  });

  it("uses the dark variant in light mode when there is no light one", () => {
    // The common case: a theme-neutral screenshot uploaded once.
    expect(pickThemedSource("light", DARK, undefined)).toBe(DARK);
  });

  it("uses the light variant in dark mode when there is no dark one", () => {
    expect(pickThemedSource("dark", undefined, LIGHT)).toBe(LIGHT);
  });

  it("only reaches the fallback when neither variant is set", () => {
    expect(pickThemedSource("dark", undefined, undefined, FALLBACK)).toBe(FALLBACK);
    expect(pickThemedSource("light", undefined, undefined, FALLBACK)).toBe(FALLBACK);
    // A one-sided pair must not fall through to the placeholder.
    expect(pickThemedSource("light", DARK, undefined, FALLBACK)).toBe(DARK);
    expect(pickThemedSource("dark", undefined, LIGHT, FALLBACK)).toBe(LIGHT);
  });

  it("returns undefined when there is nothing at all", () => {
    expect(pickThemedSource("dark")).toBeUndefined();
  });

  it("treats an empty string as absent, not as a source", () => {
    // The admin form writes "" for a cleared field before it is normalised to
    // null; an empty src attribute makes the browser re-request the page.
    expect(pickThemedSource("light", DARK, "")).toBe(DARK);
    expect(pickThemedSource("dark", "", LIGHT)).toBe(LIGHT);
    expect(pickThemedSource("dark", "", "", FALLBACK)).toBe(FALLBACK);
  });
});
