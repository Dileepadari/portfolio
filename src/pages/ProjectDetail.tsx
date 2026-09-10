/**
 * The project showcase page: /projects/:slug
 *
 * Two halves, deliberately separated.
 *
 * The upper half is for someone deciding whether this project is interesting:
 * what it is, why it exists, what it does, what it looks like. The lower half
 * is for someone who has decided it is, and now wants to build or read it.
 * A visitor should be able to stop at the divider and have lost nothing.
 *
 * **Every section is conditional on its own content.** A project with only a
 * title and a description renders a title and a description, not a page of
 * empty headings. That is why there is no placeholder copy anywhere below.
 */

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  ExternalLink,
  Github,
  GitFork,
  Images,
  Layers,
  Lightbulb,
  PlayCircle,
  Rocket,
  Star,
  Terminal,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LazyMarkdown } from "@/components/LazyMarkdown";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ThemedImage } from "@/components/ThemedImage";
import { ProjectDetailSkeleton } from "@/components/skeletons/pages";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useProject, type Project } from "@/hooks/usePortfolioData";
import { sanitizeHtml } from "@/lib/utils";

/** A heading plus its content, rendered only when `children` is worth showing. */
function Section({
  id,
  title,
  icon: Icon,
  description,
  children,
}: {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** True when a list actually has entries. Guards every list-backed section. */
function hasItems<T>(value: T[] | undefined | null): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

/** True when a text column has something other than whitespace in it. */
function hasText(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function LinkButtons({ project }: { project: Project }) {
  const links = [
    { href: project.live_url, label: "Live site", icon: ExternalLink, primary: true },
    { href: project.demo_url, label: "Demo", icon: PlayCircle },
    { href: project.github_url, label: "Source", icon: Github },
    { href: project.docs_url, label: "Docs", icon: BookOpen },
  ].filter((link) => hasText(link.href));

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ href, label, icon: Icon, primary }) => (
        <Button
          key={label}
          asChild
          size="sm"
          variant={primary ? "default" : "outline"}
        >
          <a href={href} target="_blank" rel="noreferrer noopener">
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </a>
        </Button>
      ))}
    </div>
  );
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, loading, notFound } = useProject(slug);

  // A link to a project should preview as that project, not as the site.
  useDocumentMeta(
    project ? `${project.title} | Dileep Adari` : undefined,
    project?.tagline || project?.description
  );

  // Computed once so the render below stays a straight list of conditionals.
  const shown = useMemo(() => {
    if (!project) return null;
    return {
      metrics: hasItems(project.metrics),
      overview: hasText(project.overview),
      problem: hasText(project.problem),
      features: hasItems(project.features),
      gallery: hasItems(project.images),
      techStack: hasItems(project.tech_stack),
      architecture: hasText(project.architecture),
      gettingStarted: hasText(project.getting_started),
      readme: hasText(project.readme),
      repoStats:
        typeof project.stars === "number" ||
        typeof project.forks === "number" ||
        hasText(project.language),
    };
  }, [project]);

  if (loading) return <ProjectDetailSkeleton />;

  if (notFound || !project || !shown) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold">That project does not exist</h1>
        <p className="mt-2 text-muted-foreground">
          It may have been renamed. The full list is one click away.
        </p>
        <Button asChild className="mt-6">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All projects
          </Link>
        </Button>
      </div>
    );
  }

  const hasDeveloperHalf =
    shown.techStack || shown.architecture || shown.gettingStarted || shown.readme;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ---------------------------------------------------------------- */}
      {/* Hero.                                                             */}
      {/*                                                                   */}
      {/* The banner is whatever the admin uploaded, which will not always  */}
      {/* be banner-shaped: a square logo and a tall screenshot are both     */}
      {/* likely. `object-cover` alone turns either into an arbitrary        */}
      {/* zoomed slice. So the image is *contained* and a blurred, scaled    */}
      {/* copy of itself fills the space behind it. Any aspect ratio reads   */}
      {/* as a deliberate banner, and nothing is cropped away.               */}
      {/*                                                                   */}
      {/* Eager, not lazy: it is the one image above the fold, and deferring */}
      {/* it leaves a hole exactly where the eye lands.                      */}
      {/* ---------------------------------------------------------------- */}
      {(hasText(project.hero_url) || hasText(project.hero_url_light)) && (
        <div className="relative h-48 w-full overflow-hidden border-b border-border bg-muted/30 sm:h-64 lg:h-80">
          <ThemedImage
            dark={project.hero_url}
            light={project.hero_url_light}
            alt=""
            aria-hidden="true"
            eager
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl saturate-125"
          />
          <ThemedImage
            dark={project.hero_url}
            light={project.hero_url_light}
            alt={`${project.title} banner`}
            eager
            className="relative mx-auto h-full w-auto max-w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All projects
          </Link>
        </Button>

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {hasText(project.status) && <Badge>{project.status}</Badge>}
            {hasText(project.category) && (
              <Badge variant="secondary">{project.category}</Badge>
            )}
            {project.featured && (
              <Badge variant="outline" className="border-yellow-400/40 text-yellow-500">
                <Star className="mr-1 h-3 w-3 fill-current" />
                Featured
              </Badge>
            )}
            {project.is_contributed && <Badge variant="outline">Contribution</Badge>}
          </div>

          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.title) }}
          />

          {hasText(project.tagline) && (
            <p className="text-lg text-muted-foreground sm:text-xl">{project.tagline}</p>
          )}

          <p className="max-w-3xl text-muted-foreground">{project.description}</p>

          <LinkButtons project={project} />

          {(hasText(project.project_role) || hasText(project.timeline)) && (
            <dl className="flex flex-wrap gap-x-8 gap-y-2 pt-2 text-sm">
              {hasText(project.project_role) && (
                <div>
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="font-medium">{project.project_role}</dd>
                </div>
              )}
              {hasText(project.timeline) && (
                <div>
                  <dt className="text-muted-foreground">Timeline</dt>
                  <dd className="font-medium">{project.timeline}</dd>
                </div>
              )}
            </dl>
          )}
        </header>

        {shown.metrics && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {project.metrics!.map((metric) => (
              <Card key={metric.label} className="border-border">
                <CardContent className="p-4">
                  <div className="text-2xl font-semibold tabular-nums">{metric.value}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {metric.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {shown.overview && (
          <Section id="overview" title="Overview" icon={Layers}>
            <LazyMarkdown>{project.overview!}</LazyMarkdown>
          </Section>
        )}

        {shown.problem && (
          <Section
            id="problem"
            title="The problem"
            icon={Lightbulb}
            description="Why this exists"
          >
            <LazyMarkdown>{project.problem!}</LazyMarkdown>
          </Section>
        )}

        {shown.features && (
          <Section id="features" title="What it does" icon={Rocket}>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.features!.map((feature) => (
                <Card key={feature.title} className="border-border">
                  <CardContent className="space-y-1.5 p-5">
                    <h3 className="font-medium">{feature.title}</h3>
                    {hasText(feature.description) && (
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {shown.gallery && (
          <Section
            id="gallery"
            title="Screenshots"
            icon={Images}
            description="Click any image to open it full size"
          >
            <ProjectGallery
              images={project.images}
              imagesLight={project.images_light}
              title={project.title}
            />
          </Section>
        )}

        {hasItems(project.tags) && (
          <div className="flex flex-wrap gap-2">
            {project.tags!.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* Everything below is for building or reading the thing, not for  */}
        {/* deciding whether to care about it. The divider is the point at  */}
        {/* which a non-technical reader can stop.                          */}
        {/* -------------------------------------------------------------- */}
        {hasDeveloperHalf && (
          <>
            <div className="space-y-3 pt-4">
              <Separator />
              <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                <Wrench className="h-4 w-4" />
                For developers
              </div>
            </div>

            {shown.repoStats && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {typeof project.stars === "number" && (
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4" />
                    {project.stars} stars
                  </span>
                )}
                {typeof project.forks === "number" && (
                  <span className="flex items-center gap-1.5">
                    <GitFork className="h-4 w-4" />
                    {project.forks} forks
                  </span>
                )}
                {hasText(project.language) && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: project.language_color || "currentColor" }}
                    />
                    {project.language}
                  </span>
                )}
              </div>
            )}

            {shown.techStack && (
              <Section id="stack" title="Tech stack" icon={Boxes}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {project.tech_stack!.map((tech) => (
                    <div
                      key={tech.name}
                      className="rounded-lg border border-border px-4 py-3"
                    >
                      <div className="font-medium">{tech.name}</div>
                      {hasText(tech.role) && (
                        <div className="text-sm text-muted-foreground">{tech.role}</div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {shown.architecture && (
              <Section id="architecture" title="Architecture" icon={Layers}>
                <LazyMarkdown>{project.architecture!}</LazyMarkdown>
              </Section>
            )}

            {shown.gettingStarted && (
              <Section id="getting-started" title="Getting started" icon={Terminal}>
                <LazyMarkdown>{project.getting_started!}</LazyMarkdown>
              </Section>
            )}

            {shown.readme && (
              <Section
                id="readme"
                title="README"
                icon={BookOpen}
                description="The project's own documentation, in full"
              >
                <Card className="border-border">
                  {/* `content-visibility: auto` lets the browser skip layout and
                      paint for this subtree until it is near the viewport. The
                      README is the longest thing on the page and is always at
                      the bottom, so on most visits it is never rendered at all.
                      `contain-intrinsic-size` gives the scrollbar a plausible
                      height in the meantime, so it does not jump on scroll. */}
                  <CardContent
                    className="p-5 sm:p-7"
                    style={{ contentVisibility: "auto", containIntrinsicSize: "auto 1200px" }}
                  >
                    <LazyMarkdown>{project.readme!}</LazyMarkdown>
                  </CardContent>
                </Card>
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
