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
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

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
/**
 * What raw HTML inside markdown is allowed to be.
 *
 * `rehype-raw` is here because README headers are hand-written HTML: a centred
 * `<div>`, a `<picture>` that swaps the logo per GitHub theme, badge `<img>`s.
 * Parsing that raw HTML also means parsing whatever else is in the document,
 * and the project `readme` field holds text copied out of other people's
 * repositories, so it is not first-party content just because an admin pasted
 * it. This is GitHub's own markdown allow-list plus the few elements and
 * attributes those headers need, which keeps `<script>`, event handlers and
 * `javascript:` URLs out by construction.
 */
const HTML_SCHEMA = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "picture", "source", "details", "summary"],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "align", "className"],
    img: [...(defaultSchema.attributes?.img ?? []), "loading", "decoding", "width", "height"],
    source: ["srcSet", "media", "type"],
    td: [...(defaultSchema.attributes?.td ?? []), "width", "valign", "align"],
    th: [...(defaultSchema.attributes?.th ?? []), "width", "valign", "align"],
    details: ["open"],
  },
};

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
        // Order is load bearing: raw HTML has to be parsed before it can be
        // filtered, and highlighting has to run after the filter or the
        // sanitiser strips the `hljs-*` classes it just added.
        rehypePlugins={[rehypeRaw, [rehypeSanitize, HTML_SCHEMA], [rehypeHighlight, { subset: DETECTABLE_LANGUAGES }]]}
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
