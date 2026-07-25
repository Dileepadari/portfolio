import { Navigation } from "@/components/Navigation";
import { useSiteSettings } from "@/hooks/usePortfolioData";

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
            &copy; {new Date().getFullYear()} {settings.footer_text}. All rights reserved. Check out the source code on{" "}
            <a href={settings.footer_github_url} target="_blank" rel="noopener noreferrer" className="text-primary">
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}