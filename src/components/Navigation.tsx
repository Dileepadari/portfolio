import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Github, 
  User, 
  FolderGit2, 
  BookOpen, 
  Calendar,
  FileText,
  LogOut,
  LogIn,
  Clock,
  Settings,
  ChevronDown,
  Menu,
  X,
  UserCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const navItems = [
    { path: "/", label: "Overview", icon: User },
    { path: "/projects", label: "Projects", icon: Github },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/contact", label: "Contact", icon: UserCircle },
  ];

  const adminItems = [
    { path: "/timeline", label: "Timeline", icon: Clock },
    { path: "/schedule", label: "Schedule", icon: Calendar },
  ];

  const isAdminPath = (path: string) => {
    return adminItems.some(item => item.path === path);
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`} />
                  {item.label}
                  {/* Animated underline */}
                  <span className={`absolute bottom-0 left-1/2 h-0.5 bg-primary transition-all duration-300 ease-out ${
                    isActive 
                      ? "w-3/4 -translate-x-1/2" 
                      : "w-0 -translate-x-1/2 group-hover:w-1/2"
                  }`} />
                </Link>
              );
            })}
            
            {/* Desktop Admin Dropdown Menu */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`group relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                      isAdminPath(location.pathname)
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <Settings className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                      isAdminPath(location.pathname) ? "scale-110 rotate-90" : "group-hover:scale-105 group-hover:rotate-45"
                    }`} />
                    Admin
                    <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-300 ${
                      isAdminPath(location.pathname) ? "rotate-180" : "group-hover:rotate-180"
                    }`} />
                    {/* Animated underline */}
                    <span className={`absolute bottom-0 left-1/2 h-0.5 bg-primary transition-all duration-300 ease-out ${
                      isAdminPath(location.pathname) 
                        ? "w-3/4 -translate-x-1/2" 
                        : "w-0 -translate-x-1/2 group-hover:w-1/2"
                    }`} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 animate-in slide-in-from-top-2 duration-300">
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className={`group flex items-center w-full px-3 py-2 rounded-md transition-all duration-200 ${
                            isActive 
                              ? "bg-primary text-primary-foreground shadow-sm" 
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <Icon className={`w-4 h-4 mr-2 transition-transform duration-200 ${
                            isActive ? "scale-110" : "group-hover:scale-105"
                          }`} />
                          <span className="transition-transform duration-200 group-hover:translate-x-1">
                            {item.label}
                          </span>
                          {isActive && (
                            <span className="ml-auto w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300" />
              )}
            </Button>
          </div>
          
          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 hover:bg-accent transition-colors duration-200"
                  >
                    <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary/20 transition-colors duration-200">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {getUserInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    {isAdmin && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                        A
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {getUserInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      {isAdmin && (
                        <p className="text-xs text-primary font-medium">Administrator</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link 
                  to="/auth" 
                  className="group inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-green-500/10 hover:text-green-600 border border-transparent hover:border-green-200 rounded-lg"
                >
                  <LogIn className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Right side - Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 hover:bg-accent transition-colors duration-200"
                  >
                    <Avatar className="h-8 w-8 border-2 border-transparent hover:border-primary/20 transition-colors duration-200">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {getUserInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    {isAdmin && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                        A
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {getUserInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">{user.email}</p>
                      {isAdmin && (
                        <p className="text-xs text-primary font-medium">Administrator</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link 
                  to="/auth"
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-green-500/10 hover:text-green-600"
                >
                  <LogIn className="w-5 h-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen 
            ? "max-h-screen opacity-100 pb-4" 
            : "max-h-0 opacity-0"
        }`}>
          <nav className="flex flex-col space-y-2 pt-4 border-t border-border">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`group flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-sm border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-l-4 hover:border-accent"
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`} />
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}

            {/* Mobile Admin Section */}
            {isAdmin && (
              <div className="pt-2 border-t border-border">
                <div className="px-4 py-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Admin Panel
                  </span>
                </div>
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`group flex items-center px-6 py-3 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                        isActive
                          ? "text-primary bg-primary/10 shadow-sm border-l-4 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-l-4 hover:border-accent"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${
                        isActive ? "scale-110" : "group-hover:scale-105"
                      }`} />
                      {item.label}
                      {isActive && (
                        <span className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}