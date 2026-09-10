/**
 * Gallery pairing and the lightbox.
 *
 * The pairing rule is the one worth pinning: entry n of `images` and entry n of
 * `images_light` are the same screenshot, and a shorter light list is a valid
 * state rather than a mistake.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ProjectGallery } from "./ProjectGallery";

const DARK = ["d1.png", "d2.png", "d3.png"];
const LIGHT = ["l1.png", "l2.png", "l3.png"];

function renderGallery(
  props: Partial<React.ComponentProps<typeof ProjectGallery>>,
  theme: "dark" | "light" = "dark"
) {
  const key = `gallery-theme-${Math.random()}`;
  return render(
    <ThemeProvider defaultTheme={theme} storageKey={key}>
      <ProjectGallery title="Demo" images={DARK} imagesLight={LIGHT} {...props} />
    </ThemeProvider>
  );
}

describe("ProjectGallery", () => {
  it("renders nothing when there are no images", () => {
    const { container } = renderGallery({ images: [], imagesLight: [] });
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when images is undefined", () => {
    const { container } = renderGallery({ images: undefined, imagesLight: undefined });
    expect(container).toBeEmptyDOMElement();
  });

  it("shows one thumbnail per dark image", () => {
    renderGallery({});
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("pairs light images to dark ones by position", () => {
    renderGallery({}, "light");
    const sources = screen.getAllByRole("img").map((img) => img.getAttribute("src"));
    expect(sources).toEqual(LIGHT);
  });

  it("falls back to the dark twin where the light list runs out", () => {
    // Two light images for three dark ones. The third tile is not blank.
    renderGallery({ imagesLight: ["l1.png", "l2.png"] }, "light");
    const sources = screen.getAllByRole("img").map((img) => img.getAttribute("src"));
    expect(sources).toEqual(["l1.png", "l2.png", "d3.png"]);
  });

  it("works with no light images at all", () => {
    renderGallery({ imagesLight: undefined }, "light");
    const sources = screen.getAllByRole("img").map((img) => img.getAttribute("src"));
    expect(sources).toEqual(DARK);
  });

  it("does not mount the lightbox until a thumbnail is opened", () => {
    renderGallery({});
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens the lightbox on the image that was clicked", async () => {
    const user = userEvent.setup();
    renderGallery({});
    await user.click(screen.getByLabelText("Open screenshot 2 of 3"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("2 of 3")).toBeInTheDocument();
  });

  it("steps forward and wraps at the end", async () => {
    const user = userEvent.setup();
    renderGallery({});
    await user.click(screen.getByLabelText("Open screenshot 3 of 3"));
    await user.click(screen.getByLabelText("Next screenshot"));
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("steps back and wraps at the start", async () => {
    const user = userEvent.setup();
    renderGallery({});
    await user.click(screen.getByLabelText("Open screenshot 1 of 3"));
    await user.click(screen.getByLabelText("Previous screenshot"));
    expect(screen.getByText("3 of 3")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderGallery({});
    await user.click(screen.getByLabelText("Open screenshot 1 of 3"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("moves with the arrow keys", async () => {
    const user = userEvent.setup();
    renderGallery({});
    await user.click(screen.getByLabelText("Open screenshot 1 of 3"));
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("2 of 3")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("restores page scrolling when it closes", async () => {
    const user = userEvent.setup();
    renderGallery({});
    await user.click(screen.getByLabelText("Open screenshot 1 of 3"));
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("hides the arrows when there is only one image", async () => {
    const user = userEvent.setup();
    renderGallery({ images: ["only.png"], imagesLight: undefined });
    await user.click(screen.getByLabelText("Open screenshot 1 of 1"));
    expect(screen.queryByLabelText("Next screenshot")).toBeNull();
  });
});
