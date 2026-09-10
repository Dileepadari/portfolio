/**
 * Section omission on the showcase page.
 *
 * The requirement is that a section appears only when it has content, so a
 * half-filled project reads as a shorter page rather than a page of empty
 * headings. That is entirely a matter of which fields are null, which makes it
 * exactly the kind of thing that rots silently: nothing crashes when a heading
 * renders above nothing.
 */

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/hooks/usePortfolioData";

const useProject = vi.fn();
vi.mock("@/hooks/usePortfolioData", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/hooks/usePortfolioData")>()),
  useProject: (slug: string | undefined) => useProject(slug),
}));

// The markdown stack is lazy and ~500kB; the assertions here are about which
// headings exist, not about markdown rendering, which has its own coverage.
vi.mock("@/components/LazyMarkdown", () => ({
  LazyMarkdown: ({ children }: { children: string }) => <div>{children}</div>,
}));

import { ProjectDetail } from "./ProjectDetail";

const MINIMAL: Project = {
  id: "1",
  title: "MiniShell",
  slug: "minishell",
  description: "A POSIX-ish shell in C.",
  featured: false,
  order_index: 0,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function renderDetail(project: Project | null, state: Partial<{ loading: boolean; notFound: boolean }> = {}) {
  useProject.mockReturnValue({
    data: project,
    loading: false,
    error: null,
    notFound: false,
    refetch: vi.fn(),
    ...state,
  });
  return render(
    <MemoryRouter initialEntries={[`/projects/${project?.slug ?? "missing"}`]}>
      <Routes>
        <Route path="/projects/:slug" element={<ProjectDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  useProject.mockReset();
});

describe("ProjectDetail section omission", () => {
  it("renders the title and description for the most minimal project", () => {
    renderDetail(MINIMAL);
    expect(screen.getByRole("heading", { level: 1, name: "MiniShell" })).toBeInTheDocument();
    expect(screen.getByText("A POSIX-ish shell in C.")).toBeInTheDocument();
  });

  it("shows no section headings at all when nothing is filled in", () => {
    renderDetail(MINIMAL);
    expect(screen.queryByRole("heading", { name: /overview/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /the problem/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /what it does/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /screenshots/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /tech stack/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /readme/i })).toBeNull();
  });

  it("omits the whole developer half when no developer field is filled", () => {
    renderDetail(MINIMAL);
    expect(screen.queryByText(/for developers/i)).toBeNull();
  });

  it("shows the developer half as soon as one developer field exists", () => {
    renderDetail({ ...MINIMAL, tech_stack: [{ name: "C11", role: "Everything" }] });
    expect(screen.getByText(/for developers/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /tech stack/i })).toBeInTheDocument();
    // ...and still omits the sections that have nothing.
    expect(screen.queryByRole("heading", { name: /architecture/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /readme/i })).toBeNull();
  });

  it("treats whitespace as empty, not as content", () => {
    // A textarea the admin cleared can arrive as "   " rather than null.
    renderDetail({ ...MINIMAL, overview: "   \n  ", readme: "" });
    expect(screen.queryByRole("heading", { name: /overview/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /readme/i })).toBeNull();
  });

  it("treats an empty list as empty", () => {
    renderDetail({ ...MINIMAL, features: [], metrics: [], images: [], tech_stack: [] });
    expect(screen.queryByRole("heading", { name: /what it does/i })).toBeNull();
    expect(screen.queryByRole("heading", { name: /screenshots/i })).toBeNull();
    expect(screen.queryByText(/for developers/i)).toBeNull();
  });

  it("renders every section when everything is filled", () => {
    renderDetail({
      ...MINIMAL,
      tagline: "A shell",
      overview: "Overview text",
      problem: "Problem text",
      features: [{ title: "Pipelines", description: "Yes" }],
      metrics: [{ label: "Builtins", value: "9" }],
      images: ["a.png"],
      tech_stack: [{ name: "C11" }],
      architecture: "Architecture text",
      getting_started: "make",
      readme: "# MiniShell",
      status: "Shipped",
      project_role: "Sole author",
      timeline: "2023",
    });
    for (const name of [/overview/i, /the problem/i, /what it does/i, /screenshots/i, /tech stack/i, /architecture/i, /getting started/i, /readme/i]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(screen.getByText("A shell")).toBeInTheDocument();
    expect(screen.getByText("Sole author")).toBeInTheDocument();
  });

  it("only renders the links that exist", () => {
    renderDetail({ ...MINIMAL, github_url: "https://github.com/x/y" });
    expect(screen.getByRole("link", { name: /source/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^live site$/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /^demo$/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /^docs$/i })).toBeNull();
  });

  it("shows a 404 rather than a blank page for an unknown slug", () => {
    renderDetail(null, { notFound: true });
    expect(screen.getByText(/does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /all projects/i })).toBeInTheDocument();
  });

  it("shows the skeleton while loading, not an empty page", () => {
    const { container } = renderDetail(null, { loading: true });
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });
});
