import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, Search, Bell, Plus, Menu, LogIn, LogOut, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import profileAvatar from "@/assets/profile-avatar.jpg";

export function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };
  
  const navItems = [
    { path: "/", label: "Overview" },
    { path: "/repositories", label: "Repositories" },
    { path: "/projects", label: "Projects" },
    { path: "/blog", label: "Blog" },
    { path: "/timeline", label: "Timeline" },
    { path: "/schedule", label: "Schedule" },
    { path: "/resume", label: "Resume" },
  ];

  return (
    <nav className="border-b border-[#30363d]" style={{backgroundColor: '#0d1117'}}>
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
                  className="w-64 pl-10 pr-4 py-1.5 text-sm bg-[#21262d] border border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-[#e6edf3] placeholder-[#8b949e]"
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
            
            {/* Auth Section for Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <div className="text-right">
                    <p className="text-xs text-[#8b949e]">Signed in as</p>
                    <p className="text-sm font-medium text-[#e6edf3] flex items-center">
                      {user.email?.split('@')[0]}
                      {isAdmin && (
                        <Shield className="w-3 h-3 ml-1 text-yellow-400" />
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
            
            {/* User avatar */}
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src={profileAvatar} alt="Profile" />
              <AvatarFallback>DA</AvatarFallback>
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
              
              {/* Auth Section in Mobile */}
              <div className="border-t border-[#30363d] pt-2 mt-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <p className="text-xs text-[#8b949e]">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-[#e6edf3] flex items-center">
                        {user.email}
                        {isAdmin && (
                          <Shield className="w-3 h-3 ml-1 text-yellow-400" />
                        )}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 text-sm font-medium text-left text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--github-canvas-subtle))] rounded flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--github-canvas-subtle))] rounded"
                  >
                    <LogIn className="w-4 h-4 mr-3 inline" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}