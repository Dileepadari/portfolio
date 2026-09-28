/**
 * The category vocabulary, shared by the projects filter and the editor.
 *
 * One list, so a category can never be selectable in the editor but missing
 * from the filter that is supposed to find it.
 *
 * It also has to cover what is already stored. Seven projects carried
 * categories this list did not know - backend, systems programming, developer
 * tools, creative coding, ai/ml - and a value that is absent here has no tab on
 * the projects page and no option in the editor, so those projects were
 * reachable only under "All" and their category could not be re-picked once
 * changed. Add the value here before storing a new one.
 */
export const projectCategories = [
  "all",
  "web development",
  "backend",
  "mobile development",
  "extension development",
  "distributed systems",
  "systems programming",
  "developer tools",
  "hardware",
  "iot",
  "ai/ml",
  "machine learning",
  "creative coding",
  "game development"
];
