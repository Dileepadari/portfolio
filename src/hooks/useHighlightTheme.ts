/**
 * Keeps the highlight.js stylesheet in step with the site theme.
 *
 * The two highlight.js themes both define plain `.hljs` selectors, so they
 * cannot coexist as static imports: whichever loaded last would win globally
 * and code blocks would be legible in one theme only. Swapping the href on a
 * single `<link>` avoids that.
 *
 * It watches the class on `<html>` rather than reading the theme context, so
 * it stays correct no matter which provider or inline script set the class.
 */

import { useEffect } from "react";
import hljsLightThemeUrl from "highlight.js/styles/github.css?url";
import hljsDarkThemeUrl from "highlight.js/styles/github-dark.css?url";

const HLJS_THEME_LINK_ID = "hljs-theme-stylesheet";

export function useHighlightTheme() {
  useEffect(() => {
    const applyThemeLink = () => {
      const isDark = document.documentElement.classList.contains("dark");
      let link = document.getElementById(HLJS_THEME_LINK_ID) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.id = HLJS_THEME_LINK_ID;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = isDark ? hljsDarkThemeUrl : hljsLightThemeUrl;
    };

    applyThemeLink();
    const observer = new MutationObserver(applyThemeLink);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
}
