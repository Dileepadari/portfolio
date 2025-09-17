import { useState } from "react";
import { RepositoryCard } from "@/components/RepositoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FolderOpen, Book } from "lucide-react";

const repositories = [
  {
    name: "portfolio-website",
    description: "A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features GitHub-inspired design and smooth animations.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 24,
    forks: 8,
    isPrivate: false,
    updatedAt: "2 hours ago",
    tags: ["react", "typescript", "tailwind", "portfolio"]
  },
  {
    name: "task-manager-app",
    description: "A full-stack task management application with real-time updates, user authentication, and collaborative features.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 15,
    forks: 3,
    isPrivate: false,
    updatedAt: "1 day ago",
    tags: ["react", "node", "mongodb", "socket.io"]
  },
  {
    name: "design-system",
    description: "A comprehensive design system with reusable components, built with Storybook and following atomic design principles.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 42,
    forks: 12,
    isPrivate: false,
    updatedAt: "3 days ago",
    tags: ["design-system", "storybook", "components"]
  },
  {
    name: "ai-chat-bot",
    description: "An intelligent chatbot powered by machine learning, capable of natural language processing and contextual responses.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 67,
    forks: 23,
    isPrivate: false,
    updatedAt: "5 days ago",
    tags: ["ai", "nlp", "chatbot", "machine-learning"]
  },
  {
    name: "mobile-expense-tracker",
    description: "Cross-platform mobile app for tracking expenses with budget planning, analytics, and cloud synchronization.",
    language: "Dart",
    languageColor: "#00B4AB",
    stars: 31,
    forks: 9,
    isPrivate: false,
    updatedAt: "1 week ago",
    tags: ["flutter", "mobile", "finance", "analytics"]
  },
  {
    name: "private-notes-app",
    description: "A secure note-taking application with end-to-end encryption and markdown support.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 0,
    forks: 0,
    isPrivate: true,
    updatedAt: "2 weeks ago",
    tags: ["notes", "encryption", "privacy"]
  }
];

export function Repositories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || 
                       (typeFilter === "public" && !repo.isPrivate) ||
                       (typeFilter === "private" && repo.isPrivate);
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="github-heading text-2xl font-bold mb-2">Repositories</h1>
            <p className="github-text">Explore my projects and open source contributions</p>
          </div>
          <Button className="github-btn github-btn-primary mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            New repository
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Find a repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[hsl(var(--github-canvas-inset))] border-[hsl(var(--github-border-default))]"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-[hsl(var(--github-canvas-inset))] border-[hsl(var(--github-border-default))]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40 bg-[hsl(var(--github-canvas-inset))] border-[hsl(var(--github-border-default))]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="stars">Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRepositories.map((repo, index) => (
            <div key={repo.name} className="scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <RepositoryCard {...repo} />
            </div>
          ))}
        </div>

        {filteredRepositories.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="github-heading text-lg font-semibold mb-2">No repositories found</h3>
            <p className="github-text">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}