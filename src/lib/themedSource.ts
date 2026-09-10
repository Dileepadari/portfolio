/**
 * Which half of a dark/light image pair a viewer should get.
 *
 * Split out of ThemedImage so it can be unit tested and reused without
 * mounting a component: the fallback ordering here is the part that is easy to
 * get subtly wrong.
 */

export type ResolvedTheme = "dark" | "light";

/**
 * A light viewer prefers `light` and settles for `dark`; a dark viewer does the
 * reverse. `fallback` is only reached when neither variant is set, so a
 * one-sided pair renders that side in both themes rather than falling through
 * to a placeholder.
 */
export function pickThemedSource(
  resolvedTheme: ResolvedTheme,
  dark?: string,
  light?: string,
  fallback?: string
): string | undefined {
  const preferred = resolvedTheme === "light" ? light || dark : dark || light;
  return preferred || fallback;
}
