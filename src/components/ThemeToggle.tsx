/**
 * The header control that cycles light, dark and system.
 *
 * Three states rather than two, because "system" is a real choice: it is the
 * default, and a visitor who has never touched this should keep following
 * their OS when it changes at sunset.
 *
 * @module theming
 */

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";

const NEXT_THEME = { light: "dark", dark: "system", system: "light" } as const;
const THEME_LABEL = { light: "Light", dark: "Dark", system: "System" } as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(NEXT_THEME[theme])}
      className="w-9 px-0"
      title={`Theme: ${THEME_LABEL[theme]} (click to change)`}
    >
      {theme === "system" ? (
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      )}
      <span className="sr-only">Toggle theme (currently {THEME_LABEL[theme]})</span>
    </Button>
  );
}
