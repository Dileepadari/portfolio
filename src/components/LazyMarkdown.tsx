/**
 * `Markdown`, loaded on demand.
 *
 * The markdown stack (react-markdown, remark-gfm, rehype-highlight and
 * highlight.js's language definitions) is around 500 kB, larger than the rest
 * of a page put together. A project showcase with no README, no overview and
 * no architecture notes has no markdown on it at all, and should not pay for
 * the parser to find that out.
 *
 * Importing this instead of `Markdown` keeps the chunk behind whatever
 * condition already guards the content.
 */

import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Markdown = lazy(() =>
  import("@/components/Markdown").then((m) => ({ default: m.Markdown }))
);

export function LazyMarkdown({ children, className }: { children: string; className?: string }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-2" aria-hidden>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      }
    >
      <Markdown className={className}>{children}</Markdown>
    </Suspense>
  );
}
