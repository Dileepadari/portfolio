/**
 * Filename normalisation for uploads.
 *
 * `x-file-name` is an HTTP header, so a value outside ISO-8859-1 makes `fetch`
 * throw before the request is sent, and the gateway rejects anything that could
 * act as a path separator. Both failures are invisible to the person who picked
 * the file, so the rules are pinned here.
 */

import { describe, expect, it } from "vitest";
import { safeFileName } from "./adminApi";

describe("safeFileName", () => {
  it("keeps an ordinary name, lowercased", () => {
    expect(safeFileName("Dashboard.PNG")).toBe("dashboard.png");
  });

  it("folds accents to ASCII rather than failing the header", () => {
    expect(safeFileName("résumé.pdf")).toBe("resume.pdf");
  });

  it("collapses spaces and punctuation to single hyphens", () => {
    expect(safeFileName("Screenshot from 2026-09-11 09:13:29.png"))
      .toBe("screenshot-from-2026-09-11-09-13-29.png");
  });

  it("strips path separators", () => {
    expect(safeFileName("../../etc/passwd")).not.toContain("/");
    expect(safeFileName("a\\b.png")).toBe("a-b.png");
  });

  it("never returns a leading dot or an empty string", () => {
    expect(safeFileName(".htaccess")).toBe("htaccess");
    expect(safeFileName("???")).toBe("file");
  });

  it("bounds the length", () => {
    expect(safeFileName(`${"a".repeat(400)}.png`).length).toBeLessThanOrEqual(120);
  });
});
