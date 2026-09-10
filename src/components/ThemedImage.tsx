/**
 * An image that has a dark variant and a light variant.
 *
 * Every themed image in this app is a pair where the light half is optional:
 * a screenshot of a dark UI needs its light twin, a logo needs both, and a
 * photograph needs neither. When `light` is absent the dark source is used for
 * both themes, so adding a theme-neutral image stays a one-field job.
 *
 * Resolution goes through `useTheme().resolvedTheme`, not `theme`, because
 * `theme` can be the literal string "system" and comparing it against "dark"
 * silently sends every system-preference visitor down the wrong branch. That
 * was the existing bug on the project cards.
 */

import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { pickThemedSource } from "@/lib/themedSource";

export interface ThemedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** Shown in dark mode, and in light mode when `light` is not set. */
  dark?: string;
  /** Shown in light mode. Optional. */
  light?: string;
  /** Used when neither source is set, or when the chosen source fails to load. */
  fallback?: string;
  alt: string;
  /** Skip lazy loading. Only for an image already in the first viewport. */
  eager?: boolean;
}

export function ThemedImage({
  dark,
  light,
  fallback,
  alt,
  eager = false,
  className,
  ...props
}: ThemedImageProps) {
  const { resolvedTheme } = useTheme();
  const [failed, setFailed] = useState(false);

  const chosen = pickThemedSource(resolvedTheme, dark, light, fallback);
  const src = failed && fallback ? fallback : chosen;

  if (!src) return null;

  return (
    <img
      // Keyed on the source so switching theme swaps the bitmap instead of
      // leaving the previous one in place until the new one decodes.
      key={src}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      // A broken URL falls back once. Without the guard a fallback that is
      // itself broken would loop onError forever.
      onError={() => setFailed(true)}
      className={cn("transition-opacity duration-200", className)}
      {...props}
    />
  );
}
