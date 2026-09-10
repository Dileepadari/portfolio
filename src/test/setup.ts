/**
 * Test setup.
 *
 * jsdom implements enough of a browser to render React, but not the two APIs
 * this app reads on mount: `matchMedia`, which ThemeProvider uses to resolve
 * the "system" theme, and `IntersectionObserver`, which the Projects page uses
 * for infinite scroll. Both are stubbed rather than mocked per test, because a
 * component that crashes on mount fails every test for the same uninformative
 * reason.
 */

import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class StubIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}
vi.stubGlobal("IntersectionObserver", StubIntersectionObserver);
