import { Navigation } from "@/components/Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      {children}
      <footer className="border-t border-t-muted py-4">
        <div className="container mx-auto">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dileepadari. All rights reserved. Check out the source code on{" "}
            <a href="https://github.com/dileepadari/portfolio" target="_blank" rel="noopener noreferrer" className="text-primary">
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}