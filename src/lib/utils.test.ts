/**
 * Tests for the inline-HTML sanitiser used by every `dangerouslySetInnerHTML`
 * call in the app.
 *
 * The content it guards is not all first-party: project titles and
 * descriptions are scraped out of other people's READMEs by
 * `scripts/apply-showcase.mjs`, so "only an admin can set this" is not the
 * threat model.
 */

import { describe, expect, it } from "vitest";
import { dialHref, isOwnSite, sanitizeHtml } from "./utils";

describe("sanitizeHtml", () => {
  it("keeps the formatting tags it exists to allow", () => {
    expect(sanitizeHtml("<b>Place</b><br /><span>Track</span>")).toBe(
      "<b>Place</b><br><span>Track</span>",
    );
  });

  it("unwraps an unknown element but keeps its text", () => {
    expect(sanitizeHtml("<section>hello</section>")).toBe("hello");
  });

  it("strips an event handler on a top-level element", () => {
    expect(sanitizeHtml('<img src=x onerror="alert(1)">')).toBe("");
  });

  // The regression this suite was written for: a disallowed element used to be
  // unwrapped without its subtree ever being visited, so anything nested one
  // level down came through untouched.
  it("strips an event handler nested inside a disallowed element", () => {
    const out = sanitizeHtml('<section><img src=x onerror="alert(1)"></section>');
    expect(out).not.toContain("onerror");
    expect(out).not.toContain("<img");
  });

  it("drops an iframe nested inside a disallowed element", () => {
    const out = sanitizeHtml('<section><iframe src="javascript:alert(1)"></iframe></section>');
    expect(out).not.toContain("iframe");
    expect(out).not.toContain("javascript:");
  });

  it("strips a javascript: href nested inside a disallowed element", () => {
    const out = sanitizeHtml('<article><a href="javascript:alert(1)">x</a></article>');
    expect(out).toContain(">x<");
    expect(out).not.toContain("javascript:");
  });

  it("cleans a subtree that is disallowed more than one level down", () => {
    const out = sanitizeHtml('<div><section><img src=x onerror="alert(1)"></section></div>');
    expect(out).not.toContain("onerror");
  });

  it("drops a script rather than hoisting its body into the document", () => {
    expect(sanitizeHtml("<section><script>alert(1)</script></section>")).toBe("");
  });

  it("removes comments", () => {
    expect(sanitizeHtml("a<!-- secret -->b")).toBe("ab");
  });

  it("returns an empty string for empty input", () => {
    expect(sanitizeHtml("")).toBe("");
  });
});

describe("dialHref", () => {
  it("strips the spaces a readable number is written with", () => {
    // The stored value is "+91 7330701217", and interpolating it straight into
    // an href gave `tel:+91 7330701217`. A space is not valid in a tel: URI.
    expect(dialHref("+91 7330701217")).toBe("tel:+917330701217");
  });

  it("keeps the leading plus so the country code survives", () => {
    expect(dialHref("+917330701217")).toBe("tel:+917330701217");
  });

  it("strips brackets, dashes and dots", () => {
    expect(dialHref("+1 (555) 010-9999")).toBe("tel:+15550109999");
  });

  it("drops a plus that is not the country prefix", () => {
    expect(dialHref("+91 733+070 1217")).toBe("tel:+917330701217");
  });

  it("returns an empty string when there is no number to dial", () => {
    // So the caller can leave the link out rather than render `tel:`.
    expect(dialHref("")).toBe("");
    expect(dialHref(null)).toBe("");
    expect(dialHref(undefined)).toBe("");
    expect(dialHref("not a phone")).toBe("");
  });
});

describe("isOwnSite", () => {
  // jsdom serves the tests from localhost.
  it("matches the host the page is served from", () => {
    expect(isOwnSite(`https://${window.location.hostname}/`)).toBe(true);
  });

  it("ignores a www prefix on either side", () => {
    expect(isOwnSite(`https://www.${window.location.hostname}`)).toBe(true);
  });

  it("does not match another host", () => {
    expect(isOwnSite("https://github.com/Dileepadari")).toBe(false);
  });

  it("treats a missing or unparseable value as not this site", () => {
    // So a malformed URL still renders as an ordinary external link rather
    // than silently disappearing.
    expect(isOwnSite(null)).toBe(false);
    expect(isOwnSite(undefined)).toBe(false);
    expect(isOwnSite("")).toBe(false);
    expect(isOwnSite("dileepadari.dev")).toBe(false);
  });
});
