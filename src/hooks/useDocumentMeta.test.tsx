/**
 * Per-page title, description, canonical link and social tags.
 *
 * The failure this guards against is not a crash: it is a project link
 * previewing in a chat app as the site's generic title, which is what every
 * route did before, and which nothing would ever have surfaced as a bug. The
 * canonical assertions guard the worse version of the same thing - /projects
 * and /blog each telling a crawler they were the homepage.
 */

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useDocumentMeta } from "./useDocumentMeta";

function Page({ title, description }: { title?: string; description?: string }) {
  useDocumentMeta(title, description);
  return <div>page</div>;
}

function currentDescription() {
  return document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content;
}

function meta(key: string, attr: "name" | "property" = "name") {
  return document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.content;
}

function canonical() {
  return document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
}

beforeEach(() => {
  document.title = "Site default";
  document.head.querySelectorAll('meta[name], meta[property], link[rel="canonical"]').forEach((el) => el.remove());
  window.history.replaceState({}, "", "/");
});

describe("useDocumentMeta", () => {
  it("sets the title", () => {
    render(<Page title="NFSDrive | Dileep Adari" />);
    expect(document.title).toBe("NFSDrive | Dileep Adari");
  });

  it("creates the description meta tag when the page has none", () => {
    render(<Page title="A" description="A distributed file system" />);
    expect(currentDescription()).toBe("A distributed file system");
  });

  it("restores the previous title on unmount", () => {
    // Navigating away from a project must not leave its title on the next page.
    const { unmount } = render(<Page title="NFSDrive" />);
    unmount();
    expect(document.title).toBe("Site default");
  });

  it("leaves the document alone when there is no title yet", () => {
    // The project is still loading; overwriting with "undefined" would be worse
    // than leaving the site title in place.
    render(<Page />);
    expect(document.title).toBe("Site default");
  });

  it("strips markup out of a title", () => {
    // personal_info.title is rich text edited in the admin UI, so a real value
    // can carry tags. They would otherwise show up literally in the tab.
    render(<Page title="Engineer @ Chubb<br />GSoC Mentor" />);
    expect(document.title).toBe("Engineer @ Chubb GSoC Mentor");
  });

  it("strips markup out of the description too", () => {
    render(<Page title="A" description="<p>Builds <b>things</b>.</p>" />);
    expect(currentDescription()).toBe("Builds things.");
  });

  it("points the canonical link at the route being viewed", () => {
    // index.html hard-codes the homepage here. Leaving it alone is what told a
    // crawler that /projects was a duplicate of /.
    window.history.replaceState({}, "", "/projects");
    render(<Page title="Projects | Dileep Adari" />);
    expect(canonical()).toBe("https://www.dileepadari.dev/projects");
    expect(meta("og:url", "property")).toBe("https://www.dileepadari.dev/projects");
  });

  it("drops the query string and the trailing slash from the canonical", () => {
    // /projects?tab=web is the same page as /projects, and a canonical that
    // keeps the query invites a crawler to index every filter separately.
    window.history.replaceState({}, "", "/projects/?tab=web#top");
    render(<Page title="Projects" />);
    expect(canonical()).toBe("https://www.dileepadari.dev/projects");
  });

  it("keeps the slash on the root", () => {
    window.history.replaceState({}, "", "/");
    render(<Page title="Home" />);
    expect(canonical()).toBe("https://www.dileepadari.dev/");
  });

  it("sets the canonical even before the title has loaded", () => {
    // ProjectDetail calls this with undefined until the fetch resolves. The
    // canonical does not depend on the title, so it must not wait for it.
    window.history.replaceState({}, "", "/projects/nfsdrive");
    render(<Page />);
    expect(canonical()).toBe("https://www.dileepadari.dev/projects/nfsdrive");
  });

  it("mirrors the title and description into the og and twitter tags", () => {
    // A scraper reads og:title, not <title>, so updating only the document
    // title left every link preview on the index.html fallback.
    render(<Page title="NFSDrive | Dileep Adari" description="A distributed file system" />);
    expect(meta("og:title", "property")).toBe("NFSDrive | Dileep Adari");
    expect(meta("twitter:title")).toBe("NFSDrive | Dileep Adari");
    expect(meta("og:description", "property")).toBe("A distributed file system");
    expect(meta("twitter:description")).toBe("A distributed file system");
  });

  it("uses property, not name, for the og tags", () => {
    // meta name="og:title" is ignored by every scraper that reads Open Graph.
    render(<Page title="NFSDrive" description="x" />);
    expect(meta("og:title")).toBeUndefined();
    expect(meta("og:description")).toBeUndefined();
  });

  it("restores the canonical and the social tags on unmount", () => {
    // index.html's own values, which is what the page should fall back to.
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = "https://www.dileepadari.dev/";
    document.head.appendChild(link);
    const og = document.createElement("meta");
    og.setAttribute("property", "og:title");
    og.content = "Site default";
    document.head.appendChild(og);

    window.history.replaceState({}, "", "/projects/nfsdrive");
    const { unmount } = render(<Page title="NFSDrive" description="A file system" />);
    expect(canonical()).toBe("https://www.dileepadari.dev/projects/nfsdrive");
    unmount();
    expect(canonical()).toBe("https://www.dileepadari.dev/");
    expect(meta("og:title", "property")).toBe("Site default");
  });
});
