/**
 * The one markdown renderer in the app.
 *
 * Blog posts and project READMEs are both long-form markdown and were both
 * going to need GFM tables, raw HTML and syntax highlighting, so the stack and
 * the highlight-theme handling live here rather than being configured twice
 * and drifting apart.
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

/**
 * Languages the highlighter is allowed to guess between.
 *
 * `rehype-highlight` defaults to auto-detecting the language of every code
 * block that has no ``` tag, and auto-detection means running *every*
 * registered grammar over the text and scoring the results. lowlight registers
 * around 190. A README with a handful of untagged blocks was enough to lock the
 * renderer hard enough that a screenshot capture timed out.
 *
 * Restricting the subset keeps detection useful for the languages that actually
 * appear here and turns an unbounded cost into a bounded one. A block that is
 * explicitly tagged is unaffected: its grammar is used directly, no guessing.
 */
const DETECTABLE_LANGUAGES = [
  "bash", "c", "cpp", "css", "diff", "dockerfile", "go", "html", "ini",
  "java", "javascript", "json", "makefile", "markdown", "python", "rust",
  "shell", "sql", "typescript", "xml", "yaml",
];
import { cn } from "@/lib/utils";
import { useHighlightTheme } from "@/hooks/useHighlightTheme";

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  useHighlightTheme();

  return (
    <div
      // `.markdown-content` is the app's own markdown stylesheet in index.css,
      // written against the theme tokens. There is no typography plugin here,
      // so `prose-*` classes would silently do nothing.
      className={cn("markdown-content", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { subset: DETECTABLE_LANGUAGES }], rehypeRaw]}
        components={{
          // READMEs routinely link to relative repo paths and to raw badge
          // hosts. Opening them in a new tab keeps the showcase page in place.
          a: ({ href, children: content, ...rest }) => (
            <a
              href={href}
              target={href?.startsWith("#") ? undefined : "_blank"}
              rel={href?.startsWith("#") ? undefined : "noreferrer noopener"}
              {...rest}
            >
              {content}
            </a>
          ),
          img: ({ src, alt, ...rest }) => (
            <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" {...rest} />
          ),
          // Wide markdown tables scroll inside their own box rather than
          // widening the page.
          table: ({ children: content, ...rest }) => (
            <div className="w-full overflow-x-auto">
              <table {...rest}>{content}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
