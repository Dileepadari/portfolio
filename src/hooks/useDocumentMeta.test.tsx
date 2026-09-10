/**
 * Per-page title and description.
 *
 * The failure this guards against is not a crash: it is a project link
 * previewing in a chat app as the site's generic title, which is what every
 * route did before, and which nothing would ever have surfaced as a bug.
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

beforeEach(() => {
  document.title = "Site default";
  document.querySelector('meta[name="description"]')?.remove();
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
});
