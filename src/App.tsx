/**
 * Providers and the router.
 *
 * Only the landing page is in the entry bundle. Everything else is loaded on
 * demand: a visitor reading the profile should not download the blog editor,
 * the project manager and the admin settings screen to do it.
 */

import { Suspense, lazy, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Assistant } from "@completeos/ui";
import { session, GATEWAY_URL } from "@/lib/session";
import { useAdmin } from "@/hooks/useAdmin";
import { Layout } from "./layouts/Layout";
import { Profile } from "./pages/Profile";
import {
  BlogPostViewSkeleton,
  BlogSkeleton,
  ProjectDetailSkeleton,
  ProjectsSkeleton,
  SettingsSkeleton,
} from "./components/skeletons/pages";

const Projects = lazy(() =>
  import("./pages/Projects").then((m) => ({ default: m.Projects }))
);
const ProjectDetail = lazy(() =>
  import("./pages/ProjectDetail").then((m) => ({ default: m.ProjectDetail }))
);
const Blog = lazy(() => import("./pages/Blog").then((m) => ({ default: m.Blog })));
const BlogPostView = lazy(() =>
  import("./pages/BlogPostView").then((m) => ({ default: m.BlogPostView }))
);
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth").then((m) => ({ default: m.Auth })));
const Settings = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.Settings }))
);
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours in memory
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

function lazyRoute(element: ReactNode, fallback: ReactNode) {
  return <Suspense fallback={fallback}>{element}</Suspense>;
}

/**
 * Cherry, for the signed-in owner only. The gateway enforces sign-in and the
 * registry's required fields on every call, so this gate is just so the public
 * site does not show a launcher a visitor cannot use. She answers "info about
 * me" from portfolio's own content and can add records, always confirming first.
 */
function AdminAssistant() {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;
  return (
    <Assistant
      app="portfolio"
      baseUrl={GATEWAY_URL}
      getAccessToken={() => session.getAccessToken()}
      placeholder='Ask about the portfolio, or add to it - like "add a project called Aurora".'
    />
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* The landing page is not lazy: it is what most visits are for,
                  and a chunk request in front of it is a wasted round trip. */}
              <Route path="/" element={<Profile />} />

              {/* Each route falls back to its own skeleton rather than a shared
                  spinner, so the layout does not jump when the chunk lands. */}
              <Route path="/projects" element={lazyRoute(<Projects />, <ProjectsSkeleton />)} />
              <Route path="/projects/:slug" element={lazyRoute(<ProjectDetail />, <ProjectDetailSkeleton />)} />
              <Route path="/blog" element={lazyRoute(<Blog />, <BlogSkeleton />)} />
              <Route path="/blog/:slug" element={lazyRoute(<BlogPostView />, <BlogPostViewSkeleton />)} />
              <Route path="/settings" element={lazyRoute(<Settings />, <SettingsSkeleton />)} />
              <Route path="/contact" element={lazyRoute(<Contact />, <BlogSkeleton />)} />
              <Route path="/auth" element={lazyRoute(<Auth />, <SettingsSkeleton />)} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={lazyRoute(<NotFound />, <ProjectsSkeleton />)} />
            </Routes>
            <AdminAssistant />
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
