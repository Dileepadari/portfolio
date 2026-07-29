import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Spread onto a <DialogContent> that holds a form worth not losing - blocks
 * the two accidental-dismiss paths (stray click on the backdrop, stray
 * Escape press) that otherwise silently discard whatever was typed. The
 * dialog still closes via its own Cancel/X/submit handlers.
 */
export const preventAccidentalDialogClose = {
  onPointerDownOutside: (e: Event) => e.preventDefault(),
  onEscapeKeyDown: (e: Event) => e.preventDefault(),
};
