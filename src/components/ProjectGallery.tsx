/**
 * The project detail page's screenshot gallery.
 *
 * Pairs `images` with `images_light` by index, so entry n of each array is the
 * same screenshot in the two themes. A light array that is shorter than the
 * dark one is not an error: the missing entries fall back to their dark twin.
 *
 * Thumbnails are lazy and the full-size view only mounts once something is
 * opened, so a visitor who never opens the lightbox downloads thumbnails and
 * nothing else.
 */

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemedImage } from "@/components/ThemedImage";
import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
  images?: string[];
  imagesLight?: string[];
  title: string;
}

export function ProjectGallery({ images, imagesLight, title }: ProjectGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const pairs = (images ?? []).map((dark, index) => ({
    dark,
    light: imagesLight?.[index],
  }));

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + pairs.length) % pairs.length
      ),
    [pairs.length]
  );

  // Arrow keys and Escape while the lightbox is open. Bound only while it is
  // open so the gallery does not swallow keys the rest of the page wants.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // The page behind must not scroll while the overlay is up.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  if (pairs.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((pair, index) => (
          <button
            key={pair.dark}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open screenshot ${index + 1} of ${pairs.length}`}
            className={cn(
              "group relative aspect-video w-full overflow-hidden rounded-lg border border-border",
              "bg-muted/40 transition-colors hover:border-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <ThemedImage
              dark={pair.dark}
              light={pair.light}
              alt={`${title} screenshot ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all group-hover:bg-background/40 group-hover:opacity-100">
              <ZoomIn className="h-6 w-6 text-foreground" />
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshot ${openIndex + 1}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4"
          >
            <X className="h-5 w-5" />
          </Button>

          {pairs.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous screenshot"
                className="absolute left-2 sm:left-6"
                // Stop the click reaching the backdrop, which closes.
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Next screenshot"
                className="absolute right-2 sm:right-6"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <figure className="max-h-full w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <ThemedImage
              dark={pairs[openIndex].dark}
              light={pairs[openIndex].light}
              alt={`${title} screenshot ${openIndex + 1}`}
              eager
              // The border and ring are not decoration. Most screenshots here
              // are of dark UIs, the backdrop is the dark theme's background,
              // and without an explicit edge the image has no visible boundary
              // at all: it renders correctly and looks like nothing loaded.
              className="mx-auto max-h-[80vh] w-auto rounded-lg border border-border object-contain shadow-2xl ring-1 ring-foreground/10"
            />
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {openIndex + 1} of {pairs.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
