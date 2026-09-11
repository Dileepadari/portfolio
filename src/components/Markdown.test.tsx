/**
 * What the markdown renderer lets through, and what it does not.
 *
 * The project `readme` field carries text copied out of other people's
 * repositories, and `rehype-raw` parses the HTML in it. These assertions pin
 * both halves of that trade: the hand-written HTML a README header is made of
 * still renders, and a script tag in the same document does not.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Markdown } from "./Markdown";

describe("Markdown", () => {
  it("renders the HTML a README header is built from", () => {
    const { container } = render(
      <Markdown>{`<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/logo-light.png">
    <img src="/logo-dark.png" width="120" alt="ADK DEV" loading="lazy">
  </picture>
  <h1>ProjectName</h1>
</div>`}</Markdown>
    );

    expect(container.querySelector("picture")).not.toBeNull();
    expect(container.querySelector("source")).not.toBeNull();
    expect(screen.getByAltText("ADK DEV")).toHaveAttribute("src", "/logo-dark.png");
    // Not `querySelector("div")`: the renderer wraps everything in a
    // `.markdown-content` div, which is the one that would match first.
    expect(container.querySelector("div[align]")?.getAttribute("align")).toBe("center");
    expect(screen.getByRole("heading", { name: "ProjectName" })).toBeInTheDocument();
  });

  it("renders GitHub flavoured markdown tables", () => {
    const { container } = render(
      <Markdown>{["| Name | Role |", "| --- | --- |", "| Asha | Author |"].join("\n")}</Markdown>
    );

    expect(container.querySelector("table")).not.toBeNull();
    expect(screen.getByText("Asha")).toBeInTheDocument();
  });

  it("drops script tags and inline event handlers", () => {
    const { container } = render(
      <Markdown>{`<p onclick="steal()">text</p><script>window.pwned = true;</script>`}</Markdown>
    );

    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("p")?.getAttribute("onclick")).toBeNull();
    expect(screen.getByText("text")).toBeInTheDocument();
  });

  it("drops javascript: hrefs while keeping ordinary links", () => {
    const { container } = render(
      <Markdown>{`[bad](javascript:alert(1)) and [good](https://example.com)`}</Markdown>
    );

    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).not.toContain("javascript:alert(1)");
    expect(hrefs).toContain("https://example.com");
  });

  it("keeps the highlighter's classes, which run after sanitising", () => {
    const { container } = render(
      <Markdown>{"```python\nprint('hi')\n```"}</Markdown>
    );

    expect(container.querySelector("code.hljs, code[class*='language-']")).not.toBeNull();
    expect(container.querySelector(".hljs-string")).not.toBeNull();
  });
});
