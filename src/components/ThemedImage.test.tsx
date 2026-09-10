/**
 * Theme resolution and the broken-URL fallback.
 *
 * The important assertion is the "system" one. The project cards previously
 * compared `theme` against "dark"/"light" directly, and `theme` can be the
 * literal string "system", so every visitor who had never touched the toggle
 * matched neither branch and got the wrong image.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemedImage } from "./ThemedImage";

const DARK = "https://example.com/dark.png";
const LIGHT = "https://example.com/light.png";

function renderWithTheme(ui: React.ReactNode, theme: "dark" | "light" | "system") {
  // A fresh storage key per render, so one test's stored choice cannot leak
  // into the next.
  const key = `test-theme-${Math.random()}`;
  localStorage.setItem(key, theme);
  return render(
    <ThemeProvider defaultTheme={theme} storageKey={key}>
      {ui}
    </ThemeProvider>
  );
}

describe("ThemedImage", () => {
  it("renders the dark source in dark mode", () => {
    renderWithTheme(<ThemedImage dark={DARK} light={LIGHT} alt="shot" />, "dark");
    expect(screen.getByAltText("shot")).toHaveAttribute("src", DARK);
  });

  it("renders the light source in light mode", () => {
    renderWithTheme(<ThemedImage dark={DARK} light={LIGHT} alt="shot" />, "light");
    expect(screen.getByAltText("shot")).toHaveAttribute("src", LIGHT);
  });

  it('resolves "system" rather than matching neither branch', () => {
    // The setup stubs matchMedia to report no dark preference, so system is
    // light here. The point is that it resolves to one of the two at all.
    renderWithTheme(<ThemedImage dark={DARK} light={LIGHT} alt="shot" />, "system");
    expect(screen.getByAltText("shot")).toHaveAttribute("src", LIGHT);
  });

  it("uses the only variant it has, in either theme", () => {
    renderWithTheme(<ThemedImage dark={DARK} alt="only-dark" />, "light");
    expect(screen.getByAltText("only-dark")).toHaveAttribute("src", DARK);
  });

  it("renders nothing rather than an empty img when it has no source", () => {
    // An <img> with no src makes the browser re-request the current page.
    const { container } = renderWithTheme(<ThemedImage alt="nothing" />, "dark");
    expect(container.querySelector("img")).toBeNull();
  });

  it("lazy-loads by default and eagerly when asked", () => {
    renderWithTheme(<ThemedImage dark={DARK} alt="lazy" />, "dark");
    expect(screen.getByAltText("lazy")).toHaveAttribute("loading", "lazy");

    renderWithTheme(<ThemedImage dark={DARK} alt="eager" eager />, "dark");
    expect(screen.getByAltText("eager")).toHaveAttribute("loading", "eager");
  });

  it("falls back once when the chosen source fails to load", () => {
    renderWithTheme(
      <ThemedImage dark="https://example.com/gone.png" fallback="/logo.png" alt="broken" />,
      "dark"
    );
    fireEvent.error(screen.getByAltText("broken"));
    expect(screen.getByAltText("broken")).toHaveAttribute("src", "/logo.png");
  });

  it("does not loop when the fallback is itself broken", () => {
    renderWithTheme(
      <ThemedImage dark="https://example.com/gone.png" fallback="/also-gone.png" alt="both" />,
      "dark"
    );
    fireEvent.error(screen.getByAltText("both"));
    fireEvent.error(screen.getByAltText("both"));
    // Settles on the fallback rather than flipping back and forth forever.
    expect(screen.getByAltText("both")).toHaveAttribute("src", "/also-gone.png");
  });
});
