/**
 * The frame every page renders inside: navigation, then the page, then the
 * footer text an admin can edit.
 *
 * @module app
 */

import { Navigation } from "@/components/Navigation";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import { sanitizeHtml } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      {children}
      <footer className="border-t border-t-muted py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.footer_text || 'Dileepadari') }} />. All rights reserved. Check out the source code on{" "}
            <a href={settings.footer_github_url} target="_blank" rel="noopener noreferrer" className="text-primary">
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}