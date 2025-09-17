import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, Search, Bell, Plus, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profileAvatar from "@/assets/profile-avatar.jpg";

export function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Overview" },
    { path: "/repositories", label: "Repositories" },
    { path: "/projects", label: "Projects" },
    { path: "/packages", label: "Packages" },
    { path: "/stars", label: "Stars" },
  ];

  return (
    <nav className="border-b border-[hsl(var(--github-border-default))] bg-[hsl(var(--github-canvas-default))] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Github className="w-8 h-8 text-foreground" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    isActive(item.path)
                      ? "border-[hsl(var(--github-accent-emphasis))] text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side - Search and user menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search or jump to..."
                  className="w-64 pl-10 pr-4 py-1.5 text-sm bg-[hsl(var(--github-canvas-inset))] border border-[hsl(var(--github-border-default))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--github-accent-emphasis))] focus:border-transparent text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>
            
            {/* Action buttons */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-4 h-4" />
            </Button>
            
            {/* User avatar */}
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src={profileAvatar} alt="Profile" />
              <AvatarFallback>YN</AvatarFallback>
            </Avatar>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[hsl(var(--github-border-default))] py-2">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded ${
                    isActive(item.path)
                      ? "bg-[hsl(var(--github-canvas-inset))] text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--github-canvas-subtle))]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}